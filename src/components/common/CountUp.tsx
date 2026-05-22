import { useEffect, useRef, useState } from "react";

type Props = {
  value: number;
  duration?: number;
  className?: string;
  format?: (n: number) => string;
  suffix?: string;
  prefix?: string;
};

/**
 * Animated count-up that starts when scrolled into view. Pure number input.
 * For pre-formatted strings (e.g. "248,310" or "412M"), pass `display` via
 * <CountUpString />.
 */
export function CountUp({ value, duration = 1600, className, format, suffix = "", prefix = "" }: Props) {
  const [n, setN] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting && !started.current) {
            started.current = true;
            const start = performance.now();
            const tick = (now: number) => {
              const p = Math.min(1, (now - start) / duration);
              const eased = 1 - Math.pow(1 - p, 3);
              setN(Math.round(value * eased));
              if (p < 1) requestAnimationFrame(tick);
            };
            requestAnimationFrame(tick);
          }
        });
      },
      { threshold: 0.3 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [value, duration]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {format ? format(n) : n.toLocaleString()}
      {suffix}
    </span>
  );
}

/**
 * For string values like "248,310" or "$2.4M" or "1.8M", animates the numeric
 * portion while preserving the formatting.
 */
export function CountUpString({ value, duration = 1600, className }: { value: string; duration?: number; className?: string }) {
  const match = value.match(/^([^\d]*)([\d.,]+)([^\d]*)$/);
  if (!match) return <span className={className}>{value}</span>;
  const [, prefix, num, suffix] = match;
  const numeric = parseFloat(num.replace(/,/g, ""));
  const hasDecimal = num.includes(".");
  const decimals = hasDecimal ? num.split(".")[1].length : 0;
  return (
    <CountUp
      value={numeric}
      duration={duration}
      className={className}
      prefix={prefix}
      suffix={suffix}
      format={(n) =>
        hasDecimal
          ? n.toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals })
          : n.toLocaleString()
      }
    />
  );
}
