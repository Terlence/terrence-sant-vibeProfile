import { heroStats, profile } from "@/content/profile";
import StreamCanvas from "./StreamCanvas";
import { CountUp, LiveCounter, Reveal, SplitWords, SydneyClock } from "./interactive";

export default function Hero() {
  return (
    <section id="top" className="relative isolate flex min-h-[100svh] flex-col overflow-hidden pt-16">
      {/* backdrop */}
      <div className="grid-bg absolute inset-0 -z-20" aria-hidden />
      <StreamCanvas className="absolute inset-0 -z-10 h-full w-full [mask-image:linear-gradient(to_right,transparent_0%,black_35%,black_85%,transparent_100%),linear-gradient(to_bottom,transparent_0%,transparent_8%,black_26%,black_100%)] [mask-composite:intersect] opacity-90" />
      <div
        className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_60%_60%_at_15%_55%,var(--bg)_20%,transparent_70%)]"
        aria-hidden
      />
      <div
        className="absolute inset-x-0 bottom-0 -z-10 h-48 bg-gradient-to-b from-transparent to-bg"
        aria-hidden
      />

      <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-5 sm:px-8">
        {/* HUD row */}
        <Reveal
          y={0}
          className="mt-8 flex flex-wrap items-center justify-between gap-3 font-mono text-[11px] uppercase tracking-[0.18em] text-faint"
        >
          <div className="flex items-center gap-2.5">
            <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-accent" />
            <span className="text-dim">Open to conversations</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden sm:inline">33.87°S 151.21°E</span>
            <span className="hidden sm:inline">
              SYD <SydneyClock />
            </span>
          </div>
        </Reveal>

        <div className="flex flex-1 flex-col justify-center py-16">
          <Reveal delay={0.1} y={12}>
            <p className="mb-6 font-mono text-xs uppercase tracking-[0.22em] text-dim">
              <span className="text-accent">/</span> {profile.role} — {profile.company}
            </p>
          </Reveal>

          <h1 className="text-[clamp(4rem,21vw,12.5rem)] font-semibold leading-[0.84] tracking-[-0.06em]">
            <SplitWords text={profile.firstName} />
            <br />
            <SplitWords text={`${profile.lastName}.`} delay={0.12} className="text-outline-hero" />
          </h1>

          <Reveal delay={0.45} className="mt-10 grid gap-8 lg:grid-cols-12">
            <p className="text-balance text-xl leading-snug text-dim sm:text-2xl lg:col-span-6">
              I build{" "}
              <em className="font-serif text-[1.15em] italic text-fg">real-time data products</em>{" "}
              that act in seconds, not hours — for millions of customers, inside Australia&apos;s
              biggest banks.
            </p>
            <div className="flex flex-wrap items-end gap-3 lg:col-span-6 lg:justify-end">
              <a
                href="#journey"
                className="group inline-flex items-center gap-3 rounded-full bg-accent px-6 py-3.5 text-sm font-medium text-accent-ink transition hover:shadow-[0_0_40px_-6px_var(--accent)]"
              >
                Explore the journey
                <span className="transition-transform duration-300 group-hover:translate-y-0.5">↓</span>
              </a>
              <a
                href={profile.linkedin}
                target="_blank"
                rel="noreferrer"
                className="group inline-flex items-center gap-2 rounded-full border border-line-strong px-6 py-3.5 text-sm font-medium transition hover:border-fg"
              >
                LinkedIn
                <span className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5">
                  ↗
                </span>
              </a>
            </div>
          </Reveal>
        </div>

        {/* Live readout */}
        <Reveal delay={0.7} y={0} className="pointer-events-none absolute right-5 top-[38%] hidden sm:right-8 lg:block">
          <div className="rounded-lg border border-line bg-bg/60 p-4 font-mono text-[11px] uppercase tracking-[0.14em] backdrop-blur-md">
            <div className="flex items-center gap-2 text-faint">
              <span className="h-1.5 w-1.5 rounded-full bg-signal" />
              Scan engine · simulated
            </div>
            <div className="mt-3 text-2xl font-medium normal-case tracking-tight text-fg">
              <LiveCounter />
            </div>
            <div className="mt-1 text-faint">tx screened since you arrived</div>
            <div className="mt-3 flex gap-4 border-t border-line pt-3 text-faint">
              <span>
                <span className="text-accent">≈51</span>/sec
              </span>
              <span>
                latency <span className="text-accent">&lt;1s</span>
              </span>
            </div>
          </div>
        </Reveal>
      </div>

      {/* Stat bar */}
      <div className="border-y border-line bg-bg/70 backdrop-blur-md">
        <dl className="mx-auto grid max-w-7xl grid-cols-2 px-5 sm:px-8 lg:grid-cols-4">
          {heroStats.map((s, i) => (
            <div
              key={s.label}
              className={`py-6 sm:py-8 ${i % 2 === 1 ? "pl-5 sm:pl-8" : ""} ${
                i > 0 ? "lg:border-l lg:border-line lg:pl-8" : ""
              } ${i % 2 === 1 ? "border-l border-line" : ""} ${i > 1 ? "border-t border-line lg:border-t-0" : ""}`}
            >
              <dt className="sr-only">{s.label}</dt>
              <dd className="text-3xl font-medium tracking-[-0.04em] sm:text-5xl">
                <CountUp value={s.value} decimals={s.decimals} prefix={s.prefix} suffix={s.suffix} />
              </dd>
              <dd className="mt-2 max-w-[16rem] text-xs leading-relaxed text-faint sm:text-sm">{s.label}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
