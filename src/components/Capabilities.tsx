import { capabilities, certifications, stack } from "@/content/profile";
import SectionHeader, { Serif } from "./SectionHeader";
import { Reveal, Spotlight } from "./interactive";

export default function Capabilities() {
  return (
    <section id="capabilities" className="relative border-t border-line py-28 sm:py-36">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeader
          index="03"
          label="Capabilities"
          title={
            <>
              Fluent in the <Serif>P&amp;L</Serif> and the <Serif>pipeline.</Serif>
            </>
          }
          intro="An actuarial foundation, an engineer's toolkit and a product owner's remit — the overlap is where the interesting work happens."
        />

        <div className="mt-16 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2">
          {capabilities.map((c, i) => (
            <Reveal key={c.title} delay={i * 0.05} className="h-full">
              <Spotlight className="flex h-full flex-col bg-bg p-7 sm:p-10">
                <div className="flex items-start justify-between">
                  <span className="font-mono text-xs text-faint">0{i + 1}</span>
                  <CapIcon i={i} />
                </div>
                <h3 className="mt-10 text-2xl font-medium tracking-[-0.03em] sm:text-3xl">{c.title}</h3>
                <p className="mt-3 max-w-md leading-relaxed text-dim">{c.blurb}</p>
                <ul className="mt-auto flex flex-wrap gap-2 pt-8">
                  {c.items.map((it) => (
                    <li
                      key={it}
                      className="rounded-full border border-line bg-white/[0.02] px-3 py-1 font-mono text-[11px] text-dim"
                    >
                      {it}
                    </li>
                  ))}
                </ul>
              </Spotlight>
            </Reveal>
          ))}
        </div>

        {/* Certifications */}
        <div className="mt-20 grid gap-8 md:grid-cols-12 md:gap-6">
          <Reveal className="md:col-span-3">
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-faint">Certifications</p>
          </Reveal>
          <ul className="grid gap-3 sm:grid-cols-2 md:col-span-9">
            {certifications.map((c, i) => (
              <Reveal key={c.name} delay={i * 0.04}>
                <li className="flex h-full items-center gap-4 rounded-xl border border-line p-4 transition-colors hover:border-line-strong">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-line bg-raised font-mono text-[10px] text-accent">
                    {c.code}
                  </span>
                  <span>
                    <span className="block text-sm font-medium leading-snug">{c.name}</span>
                    <span className="block text-xs text-faint">{c.issuer}</span>
                  </span>
                </li>
              </Reveal>
            ))}
          </ul>
        </div>
      </div>

      {/* Stack marquee */}
      <div className="marquee relative mt-24 overflow-hidden border-y border-line py-6 [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]">
        <div className="marquee-track flex w-max gap-12 whitespace-nowrap">
          {[...stack, ...stack].map((s, i) => (
            <span
              key={i}
              className="flex items-center gap-12 text-3xl font-medium tracking-[-0.04em] text-faint transition-colors hover:text-fg sm:text-5xl"
              aria-hidden={i >= stack.length}
            >
              {s}
              <span className="text-lg text-accent">✦</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

function CapIcon({ i }: { i: number }) {
  const common = {
    width: 28,
    height: 28,
    viewBox: "0 0 28 28",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.25,
    className: "text-accent",
    "aria-hidden": true,
  } as const;
  switch (i) {
    case 0:
      return (
        <svg {...common}>
          <path d="M4 22 L11 14 L16 18 L24 7" />
          <path d="M18 7 H24 V13" />
        </svg>
      );
    case 1:
      return (
        <svg {...common}>
          <path d="M2 8 H26 M2 14 H26 M2 20 H26" strokeDasharray="3 3" />
          <path d="M18 3 V25" />
        </svg>
      );
    case 2:
      return (
        <svg {...common}>
          <circle cx="14" cy="14" r="4" />
          <circle cx="14" cy="14" r="10" strokeDasharray="2 3" />
          <path d="M14 0 V4 M14 24 V28 M0 14 H4 M24 14 H28" />
        </svg>
      );
    default:
      return (
        <svg {...common}>
          <path d="M14 3 L24 7 V14 C24 20 19 24 14 25 C9 24 4 20 4 14 V7 Z" />
          <path d="M10 14 L13 17 L18 11" />
        </svg>
      );
  }
}
