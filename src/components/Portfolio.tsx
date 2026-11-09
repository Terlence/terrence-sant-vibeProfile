import { portfolio, type PortfolioItem } from "@/content/profile";
import SectionHeader, { Serif } from "./SectionHeader";
import { Reveal, Spotlight } from "./interactive";

const statusLabel: Record<PortfolioItem["status"], string> = {
  live: "Live",
  "in-progress": "In progress",
  planned: "Coming soon",
};

export default function Portfolio() {
  return (
    <section id="portfolio" className="relative border-t border-line bg-raised py-28 sm:py-36">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeader
          index="04"
          label="Portfolio"
          title={
            <>
              Work in <Serif>public</Serif> — loading.
            </>
          }
          intro="Case studies, side projects and writing are on the way. This space will grow as each piece ships."
        />

        <div className="mt-16 grid gap-4 md:grid-cols-2">
          {portfolio.map((p, i) => (
            <Reveal key={p.index} delay={i * 0.06} className="h-full">
              <PortfolioCard item={p} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function PortfolioCard({ item }: { item: PortfolioItem }) {
  const isLink = Boolean(item.href);
  const body = (
    <>
      <div className="relative h-44 overflow-hidden border-b border-line sm:h-52">
        <CardArt seed={Number(item.index)} />
        <div className="absolute left-5 top-5 flex items-center gap-2 rounded-full border border-line-strong bg-bg/70 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.16em] backdrop-blur">
          <span
            className={`h-1.5 w-1.5 rounded-full ${
              item.status === "live"
                ? "bg-accent"
                : item.status === "in-progress"
                  ? "pulse-dot bg-accent"
                  : "bg-faint"
            }`}
          />
          {statusLabel[item.status]}
        </div>
        <span className="text-outline absolute -bottom-6 right-4 text-[7rem] font-semibold leading-none tracking-[-0.06em] sm:text-[9rem]">
          {item.index}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-6 sm:p-8">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-faint">{item.kind}</p>
        <h3 className="mt-3 flex items-start justify-between gap-4 text-2xl font-medium tracking-[-0.03em]">
          {item.title}
          <span
            className={`mt-1 text-lg transition-transform duration-300 ${
              isLink ? "text-accent group-hover:-translate-y-1 group-hover:translate-x-1" : "text-faint"
            }`}
            aria-hidden
          >
            ↗
          </span>
        </h3>
        <p className="mt-3 leading-relaxed text-dim">{item.description}</p>
      </div>
    </>
  );

  const cls =
    "group flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-bg transition-colors duration-300 hover:border-line-strong";

  return isLink ? (
    <Spotlight as="a" href={item.href} className={cls}>
      {body}
    </Spotlight>
  ) : (
    <Spotlight className={`${cls} cursor-default`}>{body}</Spotlight>
  );
}

/** Generative placeholder art — deterministic per card so it doesn't jitter between renders. */
function CardArt({ seed }: { seed: number }) {
  const rand = mulberry32(seed * 9973);
  const bars = Array.from({ length: 28 }, (_, i) => ({
    x: i * 22 + 8,
    h: 20 + rand() * 120,
    hot: rand() < 0.12,
  }));
  const variant = seed % 2;
  return (
    <svg
      className="absolute inset-0 h-full w-full"
      viewBox="0 0 620 210"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden
    >
      <defs>
        <pattern id={`dots-${seed}`} width="14" height="14" patternUnits="userSpaceOnUse">
          <circle cx="1" cy="1" r="1" fill="rgba(255,255,255,0.07)" />
        </pattern>
      </defs>
      <rect width="620" height="210" fill={`url(#dots-${seed})`} />
      {variant === 0
        ? bars.map((b, i) => (
            <rect
              key={i}
              x={b.x}
              y={210 - b.h}
              width="10"
              height={b.h}
              fill={b.hot ? "var(--accent)" : "rgba(255,255,255,0.06)"}
              className="transition-all duration-700 group-hover:opacity-80"
            />
          ))
        : bars.map((b, i) => (
            <line
              key={i}
              x1={b.x}
              x2={b.x + 120 + b.h}
              y1={30 + ((i * 6) % 170)}
              y2={30 + ((i * 6) % 170)}
              stroke={b.hot ? "var(--accent)" : "rgba(255,255,255,0.08)"}
              strokeWidth={b.hot ? 2 : 1}
            />
          ))}
    </svg>
  );
}

function mulberry32(a: number) {
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
