import { about, interests, profile } from "@/content/profile";
import SectionHeader, { Serif } from "./SectionHeader";
import { Reveal } from "./interactive";

export default function About() {
  return (
    <section id="about" className="relative py-28 sm:py-36">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeader
          index="01"
          label="About"
          title={
            <>
              I sit at the seam between <Serif>strategy</Serif> and <Serif>systems.</Serif>
            </>
          }
        />

        <div className="mt-16 grid gap-12 md:grid-cols-12 md:gap-6">
          <div className="md:col-span-3">
            <Reveal>
              <div className="sticky top-28">
                <p className="font-mono text-sm text-dim">
                  สวัสดีครับ <span className="text-faint">/</span> G&apos;day.
                </p>
                <p className="mt-2 text-sm leading-relaxed text-faint">{profile.headline}</p>
              </div>
            </Reveal>
          </div>

          <div className="md:col-span-9 lg:col-span-7">
            <div className="space-y-6 text-pretty text-lg leading-relaxed text-dim sm:text-xl">
              {about.paragraphs.map((p, i) => (
                <Reveal key={i} delay={i * 0.05}>
                  <p className={i === 0 ? "text-fg" : ""}>{p}</p>
                </Reveal>
              ))}
            </div>

            <Reveal delay={0.1}>
              <dl className="mt-14 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-4">
                {about.facts.map((f) => (
                  <div key={f.k} className="bg-bg p-5">
                    <dt className="font-mono text-[10px] uppercase tracking-[0.18em] text-faint">{f.k}</dt>
                    <dd className="mt-2 text-sm leading-snug text-fg">{f.v}</dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          </div>
        </div>

        {/* Beyond the desk */}
        <div className="mt-28 grid gap-10 md:grid-cols-12 md:gap-6">
          <Reveal className="md:col-span-3">
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-faint">Off the clock</p>
          </Reveal>
          <ul className="md:col-span-9">
            {interests.map((it, i) => (
              <Reveal key={it.name} delay={i * 0.04}>
                <li className="group flex flex-col gap-1 border-t border-line py-5 transition-colors last:border-b hover:bg-white/[0.015] sm:flex-row sm:items-baseline sm:justify-between">
                  <span className="flex items-baseline gap-4 text-2xl font-medium tracking-[-0.03em] sm:text-3xl">
                    <span className="font-mono text-xs text-faint transition-colors group-hover:text-accent">
                      0{i + 1}
                    </span>
                    <span className="transition-transform duration-500 group-hover:translate-x-2">{it.name}</span>
                  </span>
                  <span className="pl-9 text-sm text-dim sm:pl-0 sm:text-right">{it.note}</span>
                </li>
              </Reveal>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
