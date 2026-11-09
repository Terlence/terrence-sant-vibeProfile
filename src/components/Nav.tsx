"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { nav, profile } from "@/content/profile";

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<string>("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    const sections = nav
      .map((n) => document.querySelector(n.href))
      .filter((el): el is Element => !!el);
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActive(`#${e.target.id}`);
        }
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    sections.forEach((s) => io.observe(s));

    return () => {
      window.removeEventListener("scroll", onScroll);
      io.disconnect();
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled
          ? "border-b border-line bg-bg/70 backdrop-blur-xl backdrop-saturate-150"
          : "border-b border-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
        <a href="#top" className="group flex items-center gap-3" aria-label="Back to top">
          <span className="grid h-8 w-8 place-items-center rounded-[6px] bg-accent font-mono text-[11px] font-semibold tracking-tight text-accent-ink transition-transform duration-500 group-hover:rotate-[-8deg]">
            TS
          </span>
          <span className="hidden text-sm font-medium tracking-tight sm:block">
            {profile.name}
          </span>
        </a>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
          {nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={`relative rounded-full px-3.5 py-1.5 text-[13px] transition-colors ${
                active === item.href ? "text-fg" : "text-dim hover:text-fg"
              }`}
            >
              {active === item.href && (
                <motion.span
                  layoutId="nav-pill"
                  className="absolute inset-0 -z-10 rounded-full border border-line-strong bg-white/[0.04]"
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                />
              )}
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <a
            href={`mailto:${profile.email}`}
            className="hidden items-center gap-2 rounded-full bg-fg px-4 py-2 text-[13px] font-medium text-bg transition hover:bg-accent sm:inline-flex"
          >
            Let&apos;s talk
            <span aria-hidden>→</span>
          </a>
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            className="grid h-9 w-9 place-items-center rounded-full border border-line-strong md:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
          >
            <span className="relative block h-2.5 w-4">
              <span
                className={`absolute left-0 h-px w-4 bg-fg transition-all duration-300 ${
                  open ? "top-1/2 rotate-45" : "top-0"
                }`}
              />
              <span
                className={`absolute left-0 h-px w-4 bg-fg transition-all duration-300 ${
                  open ? "top-1/2 -rotate-45" : "top-full"
                }`}
              />
            </span>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-x-0 top-16 bottom-0 z-40 h-[calc(100dvh-4rem)] bg-bg/95 backdrop-blur-xl md:hidden"
          >
            <nav className="flex flex-col gap-1 px-5 pt-8" aria-label="Mobile">
              {nav.map((item, i) => (
                <motion.a
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.04 * i }}
                  className="flex items-baseline justify-between border-b border-line py-5 text-3xl font-medium tracking-tight"
                >
                  {item.label}
                  <span className="font-mono text-xs text-faint">0{i + 1}</span>
                </motion.a>
              ))}
              <a
                href={`mailto:${profile.email}`}
                className="mt-8 inline-flex items-center justify-center gap-2 rounded-full bg-accent px-5 py-4 font-medium text-accent-ink"
              >
                Let&apos;s talk →
              </a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
