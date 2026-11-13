/**
 * POST /api/chat — the Digital Twin's backend.
 *
 * The browser sends the conversation here as JSON. This code (which only ever
 * runs on the server) adds the system prompt and the secret API key, calls
 * OpenRouter, and streams the reply back as plain text.
 */
import { MODELS, buildSystemPrompt, type TwinModel } from "@/lib/twin-prompt";

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
const MAX_BODY_CHARS = 50_000;
const MAX_MESSAGES = 12;
const MAX_MESSAGE_CHARS = 1_000;
const RATE_LIMIT = 10; // requests...
const RATE_WINDOW_MS = 60_000; // ...per minute, per visitor
const FIRST_TEXT_TIMEOUT_MS = 20_000; // per model, until its first words arrive

type ChatMessage = { role: "user" | "assistant"; content: string };

function jsonError(message: string, status: number) {
  return Response.json({ error: message }, { status });
}

/**
 * Best-effort rate limit held in memory. It resets when the server restarts
 * and is not shared between servers, so treat it as a speed bump, not a wall.
 */
const hits = new Map<string, number[]>();

function isRateLimited(visitor: string): boolean {
  const now = Date.now();
  if (hits.size > 5_000) hits.clear();
  const recent = (hits.get(visitor) ?? []).filter((t) => now - t < RATE_WINDOW_MS);
  const limited = recent.length >= RATE_LIMIT;
  if (!limited) recent.push(now);
  hits.set(visitor, recent);
  return limited;
}

/** Checks the visitor's input. Returns a clean message list, or null if invalid. */
function parseMessages(body: unknown): ChatMessage[] | null {
  if (typeof body !== "object" || body === null) return null;
  const raw = (body as { messages?: unknown }).messages;
  if (!Array.isArray(raw) || raw.length === 0) return null;

  const clean: ChatMessage[] = [];
  for (const item of raw) {
    if (typeof item !== "object" || item === null) return null;
    const { role, content } = item as { role?: unknown; content?: unknown };
    if (role !== "user" && role !== "assistant") return null;
    if (typeof content !== "string") return null;
    const text = content.trim();
    if (!text || text.length > MAX_MESSAGE_CHARS) return null;

    // Models expect turns to alternate, so merge two in a row from the same side.
    const previous = clean[clean.length - 1];
    if (previous && previous.role === role) previous.content += `\n\n${text}`;
    else clean.push({ role, content: text });
  }

  if (clean[clean.length - 1].role !== "user") return null;

  // Keep the most recent turns, starting from a visitor message.
  const recent = clean.slice(-MAX_MESSAGES);
  while (recent[0].role !== "user") recent.shift();
  return recent;
}

/**
 * OpenRouter streams "server-sent events": lines like
 *   data: {"choices":[{"delta":{"content":"Hel"}}]}
 * This pulls out just the text pieces and passes them on as plain text.
 */
function toTextStream(upstream: ReadableStream<Uint8Array>): ReadableStream<Uint8Array> {
  const reader = upstream.getReader();
  const decoder = new TextDecoder();
  const encoder = new TextEncoder();

  return new ReadableStream<Uint8Array>({
    async start(controller) {
      let buffer = "";
      try {
        while (true) {
          const { value, done } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });

          // A chunk can end mid-line, so keep the unfinished tail for next time.
          const lines = buffer.split("\n");
          buffer = lines.pop() ?? "";

          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed.startsWith("data:")) continue; // keep-alive comments
            const data = trimmed.slice(5).trim();
            if (data === "[DONE]") continue;

            let event: {
              error?: { message?: string };
              choices?: { delta?: { content?: unknown } }[];
            };
            try {
              event = JSON.parse(data);
            } catch {
              continue;
            }
            if (event.error) {
              console.error("[twin] OpenRouter error mid-stream:", event.error.message);
              continue;
            }
            const text = event.choices?.[0]?.delta?.content;
            if (typeof text === "string" && text) controller.enqueue(encoder.encode(text));
          }
        }
      } catch (err) {
        console.error("[twin] stream interrupted:", err instanceof Error ? err.message : err);
      } finally {
        try {
          controller.close();
        } catch {
          // already closed because the visitor left
        }
      }
    },
    cancel() {
      return reader.cancel();
    },
  });
}

/**
 * Asks one model. Resolves with a reader positioned after the first piece of
 * text (plus that piece), or null if the model was busy, errored, timed out
 * or finished without saying anything. `status` is the HTTP status it gave.
 */
async function tryModel(
  model: TwinModel,
  messages: ChatMessage[],
  apiKey: string,
  visitorLeft: AbortSignal,
): Promise<{
  status: number;
  answer: { first: Uint8Array; reader: ReadableStreamDefaultReader<Uint8Array> } | null;
}> {
  // Give up on this model if no text has arrived in time, and stop the
  // upstream call if the visitor closes the chat.
  const abort = new AbortController();
  const timer = setTimeout(() => abort.abort(), FIRST_TEXT_TIMEOUT_MS);
  const onLeave = () => abort.abort();
  visitorLeft.addEventListener("abort", onLeave);

  try {
    const upstream = await fetch(OPENROUTER_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: model.id,
        messages: [{ role: "system", content: buildSystemPrompt() }, ...messages],
        stream: true,
        max_tokens: model.maxTokens,
        temperature: 0.4,
        ...(model.reasoning ? { reasoning: model.reasoning } : {}),
      }),
      signal: abort.signal,
    });

    if (!upstream.ok || !upstream.body) {
      const detail = await upstream.text().catch(() => "");
      console.error(`[twin] ${model.id} replied ${upstream.status}:`, detail.slice(0, 300));
      return { status: upstream.status, answer: null };
    }

    const reader = toTextStream(upstream.body).getReader();
    const { value, done } = await reader.read();
    if (done || !value) {
      console.error(`[twin] ${model.id} finished without any text`);
      return { status: 200, answer: null };
    }
    return { status: 200, answer: { first: value, reader } };
  } catch (err) {
    console.error(`[twin] ${model.id} failed:`, err instanceof Error ? err.message : err);
    return { status: 504, answer: null };
  } finally {
    clearTimeout(timer);
    // Keep listening for the visitor leaving only while we're still streaming.
    if (abort.signal.aborted) visitorLeft.removeEventListener("abort", onLeave);
  }
}

export async function POST(request: Request) {
  // 1. Read and check the request body.
  const rawBody = await request.text();
  if (rawBody.length > MAX_BODY_CHARS) return jsonError("That conversation is too long.", 413);

  let body: unknown;
  try {
    body = JSON.parse(rawBody);
  } catch {
    return jsonError("Request body must be JSON.", 400);
  }

  const messages = parseMessages(body);
  if (!messages) {
    return jsonError(
      `Send { messages: [{ role, content }] } ending with a user message of at most ${MAX_MESSAGE_CHARS} characters.`,
      400,
    );
  }

  // 2. Slow down anyone hammering the endpoint.
  const visitor = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  if (isRateLimited(visitor)) {
    return jsonError("Too many questions in a short time. Please wait a minute.", 429);
  }

  // 3. The secret key. process.env is only readable on the server.
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    console.error("[twin] OPENROUTER_API_KEY is not set");
    return jsonError("The twin isn't configured yet.", 500);
  }

  // 4. Try each model in order until one starts answering.
  let allBusy = true;
  for (const model of MODELS) {
    if (request.signal.aborted) break;
    const { status, answer } = await tryModel(model, messages, apiKey, request.signal);
    if (status !== 429) allBusy = false;
    if (!answer) continue;

    // 5. Stream the reply back to the browser as plain text.
    console.log(`[twin] answered by ${model.id}`);
    const { first, reader } = answer;
    const stream = new ReadableStream<Uint8Array>({
      start(controller) {
        controller.enqueue(first);
      },
      async pull(controller) {
        const { value, done } = await reader.read();
        if (done) controller.close();
        else controller.enqueue(value);
      },
      cancel() {
        return reader.cancel();
      },
    });
    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "X-Content-Type-Options": "nosniff",
        "Cache-Control": "no-store",
      },
    });
  }

  return allBusy
    ? jsonError("The twin is busy right now. Please try again in a minute.", 429)
    : jsonError("The twin couldn't answer just now. Please try again.", 502);
}
