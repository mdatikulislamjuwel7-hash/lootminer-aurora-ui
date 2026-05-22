import { Link } from "@tanstack/react-router";
import logoImg from "@/assets/lootminer-logo.png";

type LogoProps = {
  withText?: boolean;
  to?: string;
  src?: string;
  size?: "sm" | "md" | "lg";
};

const sizeMap = {
  sm: { box: "h-8 w-8", img: "h-7 w-7", text: "text-base" },
  md: { box: "h-10 w-10", img: "h-9 w-9", text: "text-lg" },
  lg: { box: "h-14 w-14", img: "h-[3.25rem] w-[3.25rem]", text: "text-2xl" },
};

export function Logo({ withText = true, to = "/", src, size = "md" }: LogoProps) {
  const s = sizeMap[size];
  const source = src ?? logoImg;
  return (
    <Link to={to} className="group inline-flex items-center gap-2.5 select-none">
      <div className="relative shrink-0">
        {/* Soft pulsing glow */}
        <div className="pointer-events-none absolute -inset-1.5 rounded-2xl bg-gradient-primary blur-xl opacity-50 group-hover:opacity-90 animate-glow-pulse transition-opacity" />
        {/* Container */}
        <div className={`relative ${s.box} flex items-center justify-center`}>
          <img
            src={source}
            alt="LootMiner"
            width={128}
            height={128}
            className={`relative ${s.img} object-contain drop-shadow-[0_0_12px_oklch(0.82_0.15_200/0.55)] transition-transform duration-500 group-hover:scale-[1.06]`}
          />
        </div>
      </div>

      {withText && (
        <span className={`font-display ${s.text} font-bold tracking-tight leading-none`}>
          <span className="text-foreground">Loot</span>
          <span
            className="bg-[linear-gradient(90deg,oklch(0.82_0.15_200),oklch(0.7_0.18_180),oklch(0.92_0.16_200),oklch(0.82_0.15_200))] bg-clip-text text-transparent bg-[length:200%_100%] animate-shimmer"
          >
            Miner
          </span>
        </span>
      )}
    </Link>
  );
}
