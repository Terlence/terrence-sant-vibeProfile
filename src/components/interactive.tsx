"use client";

import {
  animate,
  motion,
  useInView,
  useReducedMotion,
  useScroll,
  useSpring,
  type HTMLMotionProps,
} from "motion/react";
import {
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type PointerEvent,
  type ReactNode,
} from "react";

const EASE = [0.22, 1, 0.36, 1] as const;

/** Fade/slide content in once it scrolls into view. */
export function Reveal({
  children,
  delay = 0,
  y = 24,
  className,
  ...rest
}: { children: ReactNode; delay?: number; y?: number } & HTMLMotionProps<"div">) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 0.8, ease: EASE, delay }}
      className={className}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

/** Headline that reveals word-by-word with a mask. */
export function SplitWords({
  text,
  className,
  delay = 0,
}: {
  text: string;
  className?: string;
  delay?: number;
}) {
  const reduce = useReducedMotion();
  const words = text.split(" ");
  return (
    <span className={className} aria-label={text}>
      {words.map((word, i) => (
        <span key={i} className="inline-block overflow-hidden pb-[0.08em] align-bottom" aria-hidden>
          <motion.span
            className="inline-block"
            initial={reduce ? false : { y: "105%" }}
            animate={{ y: 0 }}
            transition={{ duration: 0.9, ease: EASE, delay: delay + i * 0.06 }}
          >
            {word}
            {i < words.length - 1 ? " " : ""}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

/** Animated number that counts up when it enters the viewport. */
export function CountUp({
  value,
  decimals = 0,
  prefix = "",
  suffix = "",
}: {
  value: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const reduce = useReducedMotion();

  useEffect(() => {
    const node = ref.current;
    if (!node || !inView) return;
    const fmt = (v: number) => `${prefix}${v.toFixed(decimals)}${suffix}`;
    if (reduce) {
      node.textContent = fmt(value);
      return;
    }
    const controls = animate(0, value, {
      duration: 1.8,
      ease: EASE,
      onUpdate: (v) => (node.textContent = fmt(v)),
    });
    return () => controls.stop();
  }, [inView, value, decimals, prefix, suffix, reduce]);

  return (
    <span ref={ref} className="tabular-nums">
      {prefix}
      {(0).toFixed(decimals)}
      {suffix}
    </span>
  );
}

/**
 * Ticks at ~51 events/sec — 4.4M transactions/day spread across 86,400 seconds.
 */
export function LiveCounter() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const start = performance.now();
    const rate = 4_400_000 / 86_400;
    const id = setInterval(() => {
      setCount(Math.floor(((performance.now() - start) / 1000) * rate));
    }, 90);
    return () => clearInterval(id);
  }, []);
  return <span className="tabular-nums">{count.toLocaleString("en-AU")}</span>;
}

/** Thin accent progress bar pinned to the top of the viewport. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.3 });
  return (
    <motion.div
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-[70] h-px origin-left bg-accent"
      aria-hidden
    />
  );
}

/** Card wrapper with a cursor-following glow. */
export function Spotlight({
  children,
  className = "",
  as = "div",
  href,
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "a";
  href?: string;
}) {
  const onMove = (e: PointerEvent<HTMLElement>) => {
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - r.left}px`);
    el.style.setProperty("--my", `${e.clientY - r.top}px`);
  };
  if (as === "a" && href) {
    const external = href.startsWith("http");
    return (
      <a
        href={href}
        onPointerMove={onMove}
        className={`spotlight ${className}`}
        {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
      >
        {children}
      </a>
    );
  }
  return (
    <div onPointerMove={onMove} className={`spotlight ${className}`}>
      {children}
    </div>
  );
}

/** Local Sydney time, ticking every 30s. Renders a placeholder on the server. */
const sydneyFmt = new Intl.DateTimeFormat("en-AU", {
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
  timeZone: "Australia/Sydney",
});
function subscribeClock(cb: () => void) {
  const id = setInterval(cb, 30_000);
  return () => clearInterval(id);
}
export function SydneyClock() {
  const time = useSyncExternalStore(
    subscribeClock,
    () => sydneyFmt.format(new Date()),
    () => "--:--",
  );
  return <span className="tabular-nums">{time}</span>;
}

const noopSubscribe = () => () => {};
export function CurrentYear() {
  const year = useSyncExternalStore(
    noopSubscribe,
    () => new Date().getFullYear(),
    () => null,
  );
  return <>{year ?? ""}</>;
}
