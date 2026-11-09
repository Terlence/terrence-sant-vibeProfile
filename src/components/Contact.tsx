import { profile } from "@/content/profile";
import { CurrentYear, Reveal, SydneyClock } from "./interactive";
import CopyEmail from "./CopyEmail";

export default function Contact() {
  return (
    <section id="contact" className="relative isolate overflow-hidden border-t border-line pt-28 sm:pt-36">
      <div className="grid-bg absolute inset-0 -z-10 opacity-60" aria-hidden />
      <div
        className="absolute left-1/2 top-1/3 -z-10 h-[34rem] w-[34rem] -translate-x-1/2 rounded-full bg-accent/10 blur-[140px]"
        aria-hidden
      />
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal>
          <div className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.2em] text-faint">
            <span className="text-accent">05</span>
            <span className="h-px w-8 bg-line-strong" />
            <span>Contact</span>
          </div>
        </Reveal>

        <Reveal delay={0.05}>
          <h2 className="mt-10 text-[clamp(3rem,10vw,9rem)] font-semibold leading-[0.88] tracking-[-0.055em]">
            Let&apos;s build
            <br />
            something <em className="font-serif font-normal italic text-accent">real‑time.</em>
          </h2>
        </Reveal>

        <Reveal delay={0.12}>
          <p className="mt-8 max-w-xl text-lg leading-relaxed text-dim">
            Open to conversations about data products, AI in financial services, and teams building
            things that need to happen <em className="font-serif italic text-fg">now</em>.
          </p>
        </Reveal>

        <Reveal delay={0.18}>
          <div className="mt-12 flex flex-col gap-3 sm:flex-row">
            <a
              href={`mailto:${profile.email}`}
              className="group inline-flex items-center justify-between gap-6 rounded-full bg-accent py-4 pl-7 pr-4 text-base font-medium text-accent-ink transition hover:shadow-[0_0_60px_-10px_var(--accent)] sm:text-lg"
            >
              {profile.email}
              <span className="grid h-9 w-9 place-items-center rounded-full bg-accent-ink text-accent transition-transform duration-300 group-hover:rotate-[-45deg]">
                →
              </span>
            </a>
            <CopyEmail email={profile.email} />
            <a
              href={profile.linkedin}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-line-strong px-7 py-4 text-base font-medium transition hover:border-fg sm:text-lg"
            >
              LinkedIn <span aria-hidden>↗</span>
            </a>
          </div>
        </Reveal>
      </div>

      <footer className="mt-28 border-t border-line">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-8 font-mono text-[11px] uppercase tracking-[0.16em] text-faint sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <span>
            © <CurrentYear /> {profile.name}
          </span>
          <span>
            Sydney <SydneyClock /> · AEST/AEDT
          </span>
          <a href="#top" className="transition-colors hover:text-accent">
            Back to top ↑
          </a>
        </div>
      </footer>

      {/* Oversized wordmark */}
      <div
        className="pointer-events-none select-none overflow-hidden px-2 leading-[0.75]"
        aria-hidden
      >
        <p className="text-outline whitespace-nowrap text-center text-[15.5vw] font-semibold tracking-[-0.07em]">
          Terrence Sant
        </p>
      </div>
    </section>
  );
}
