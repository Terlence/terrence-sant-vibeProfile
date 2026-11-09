import { education, journey } from "@/content/profile";
import SectionHeader, { Serif } from "./SectionHeader";
import { Reveal } from "./interactive";
import JourneyRail from "./JourneyRail";

export default function Journey() {
  return (
    <section id="journey" className="relative border-t border-line bg-raised py-28 sm:py-36">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeader
          index="02"
          label="Career journey"
          title={
            <>
              From feature tables to <Serif>real‑time</Serif> decision engines.
            </>
          }
          intro="Six years across Commonwealth Bank and Macquarie — each chapter a step closer to the moment data becomes action."
        />

        <JourneyRail>
          {journey.map((c, ci) => (
            <article key={c.id} className="relative grid gap-6 py-14 md:grid-cols-12 md:gap-6 md:py-20">
              {/* node on rail */}
              <span
                className="absolute left-0 top-[4.1rem] hidden h-2.5 w-2.5 -translate-x-[calc(50%-0.5px)] rounded-full border border-accent bg-bg md:top-[5.6rem] md:block"
                aria-hidden
              />

              <div className="md:col-span-4 md:pl-10 lg:col-span-3">
                <div className="md:sticky md:top-28">
                  <Reveal>
                    <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-faint">
                      Chapter {String(journey.length - ci).padStart(2, "0")}
                    </p>
                    <p className="mt-3 text-6xl font-medium leading-none tracking-[-0.05em] tabular-nums">
                      {c.start}
                    </p>
                    <p className="mt-3 flex items-center gap-2 font-mono text-xs uppercase tracking-[0.18em] text-dim">
                      <span className="h-px w-6 bg-line-strong" />
                      {c.end === "Now" ? (
                        <span className="inline-flex items-center gap-2 text-accent">
                          <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-accent" />
                          Present
                        </span>
                      ) : (
                        c.end
                      )}
                    </p>
                  </Reveal>
                </div>
              </div>

              <div className="md:col-span-8 lg:col-span-9">
                <Reveal delay={0.05}>
                  <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
                    <h3 className="text-3xl font-medium tracking-[-0.035em] sm:text-4xl">{c.company}</h3>
                    <span className="font-mono text-xs text-faint">{c.location}</span>
                  </div>
                  <p className="mt-2 max-w-2xl text-sm leading-relaxed text-faint">{c.companyNote}</p>
                </Reveal>

                <Reveal delay={0.1}>
                  <ol className="mt-8 divide-y divide-line overflow-hidden rounded-xl border border-line bg-bg/60">
                    {c.roles.map((r, ri) => (
                      <li
                        key={r.title}
                        className="flex flex-col gap-1 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
                      >
                        <span className="flex items-center gap-3 font-medium">
                          {ri === 0 && c.roles.length > 1 && c.end === "Now" ? (
                            <span className="rounded-sm bg-accent px-1.5 py-0.5 font-mono text-[9px] font-semibold uppercase tracking-[0.12em] text-accent-ink">
                              Promoted
                            </span>
                          ) : null}
                          {r.title}
                        </span>
                        <span className="font-mono text-xs text-faint">{r.period}</span>
                      </li>
                    ))}
                  </ol>
                </Reveal>

                <ul className="mt-8 space-y-4">
                  {c.highlights.map((h, hi) => (
                    <Reveal key={hi} delay={0.04 * hi}>
                      <li className="grid grid-cols-[auto_1fr] gap-4 text-pretty leading-relaxed text-dim">
                        <span className="mt-[0.6em] h-px w-4 bg-accent" aria-hidden />
                        <Highlight text={h} />
                      </li>
                    </Reveal>
                  ))}
                </ul>

                <Reveal delay={0.1}>
                  <ul className="mt-8 flex flex-wrap gap-2">
                    {c.tags.map((t) => (
                      <li
                        key={t}
                        className="rounded-full border border-line px-3 py-1 font-mono text-[11px] text-dim"
                      >
                        {t}
                      </li>
                    ))}
                  </ul>
                </Reveal>
              </div>
            </article>
          ))}
        </JourneyRail>

        {/* Education */}
        <Reveal>
          <div className="mt-10 grid gap-6 rounded-2xl border border-line bg-bg p-6 sm:p-10 md:grid-cols-12">
            <div className="md:col-span-3">
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-faint">Education</p>
              <p className="mt-3 font-mono text-sm text-dim">{education.period}</p>
            </div>
            <div className="md:col-span-9">
              <h3 className="text-2xl font-medium tracking-[-0.03em] sm:text-3xl">{education.school}</h3>
              <ul className="mt-4 space-y-1.5 text-dim">
                {education.degrees.map((d) => (
                  <li key={d}>{d}</li>
                ))}
              </ul>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/** Highlights numbers and figures in the accent colour for scanability. */
function Highlight({ text }: { text: string }) {
  const parts = text.split(/((?<![A-Za-z\d])[$~]*\d[\d.,]*(?:[MBK]\+?|%)?(?![A-Za-z\d]))/g);
  return (
    <span>
      {parts.map((p, i) =>
        i % 2 === 1 ? (
          <span key={i} className="font-medium text-fg">
            {p}
          </span>
        ) : (
          <span key={i}>{p}</span>
        ),
      )}
    </span>
  );
}
