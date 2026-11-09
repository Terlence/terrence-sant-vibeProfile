import type { ReactNode } from "react";
import { Reveal } from "./interactive";

export default function SectionHeader({
  index,
  label,
  title,
  intro,
}: {
  index: string;
  label: string;
  title: ReactNode;
  intro?: ReactNode;
}) {
  return (
    <div className="grid gap-8 md:grid-cols-12 md:gap-6">
      <Reveal className="md:col-span-3">
        <div className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.2em] text-faint">
          <span className="text-accent">{index}</span>
          <span className="h-px w-8 bg-line-strong" />
          <span>{label}</span>
        </div>
      </Reveal>
      <div className="md:col-span-9">
        <Reveal delay={0.05}>
          <h2 className="text-balance text-4xl font-medium leading-[1.02] tracking-[-0.035em] sm:text-5xl lg:text-6xl">
            {title}
          </h2>
        </Reveal>
        {intro && (
          <Reveal delay={0.12}>
            <p className="mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-dim">{intro}</p>
          </Reveal>
        )}
      </div>
    </div>
  );
}

export function Serif({ children }: { children: ReactNode }) {
  return <em className="font-serif font-normal italic tracking-[-0.01em]">{children}</em>;
}
