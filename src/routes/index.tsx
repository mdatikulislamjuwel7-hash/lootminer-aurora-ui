import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { AuroraBackground } from "@/components/background/AuroraBackground";
import { Logo } from "@/components/common/Logo";
import { LiveLeadsTicker } from "@/components/landing/LiveLeadsTicker";
import { AuthModal } from "@/components/auth/AuthModal";
import { mockStats, mockFAQs } from "@/data/mock";
import {
  ArrowRight, ChevronDown, Sparkles, ShieldCheck, Zap, Diamond,
  Users, Coins, Trophy, Wallet, Compass, CheckCircle2,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "LootMiner — Mine XP from offers, surveys & tasks" },
      { name: "description", content: "The premium GPT/CPA rewards platform. Earn XP, level up, and cash out instantly." },
      { property: "og:title", content: "LootMiner — Earn XP. Cash out. Repeat." },
      { property: "og:description", content: "Premium rewards platform for gamers." },
    ],
  }),
  component: Landing,
});

function Landing() {
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signup");
  const open = (m: "signin" | "signup") => { setAuthMode(m); setAuthOpen(true); };

  return (
    <div className="relative min-h-screen">
      <AuroraBackground />

      {/* Topbar */}
      <header className="sticky top-0 z-40">
        <div className="px-3 md:px-6 pt-3 md:pt-4">
          <div className="mx-auto flex max-w-7xl items-center gap-3 rounded-2xl glass px-3 md:px-5 py-2.5 shadow-card">
            <Logo to="/" />
            <div className="ml-auto flex items-center gap-2">
              <button onClick={() => open("signin")} className="hidden sm:inline-flex rounded-xl px-3 md:px-4 py-2 text-sm font-medium text-foreground/80 hover:text-foreground hover:bg-card/60 transition">
                Sign In
              </button>
              <button onClick={() => open("signup")} className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-primary px-3 md:px-4 py-2 text-sm font-semibold text-primary-foreground shadow-glow-primary hover:opacity-95 transition">
                Start Earning <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="mt-3"><LiveLeadsTicker /></div>

      {/* Hero */}
      <section className="px-4 md:px-6">
        <div className="mx-auto max-w-7xl py-12 md:py-20 grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full glass px-3 py-1 text-xs font-medium text-muted-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-primary shadow-glow-primary" />
              #1 Rewards Platform of 2026
            </span>
            <h1 className="mt-5 font-display text-4xl md:text-6xl font-bold leading-[1.05] tracking-tight">
              Mine <span className="text-gradient-xp">XP</span><br className="hidden sm:block" /> from every offer<br className="hidden sm:block" /> & survey you take.
            </h1>
            <p className="mt-5 max-w-xl text-base md:text-lg text-muted-foreground">
              Complete GPT/CPA offers from elite partners. Earn warm-gold XP. Cash out to PayPal, crypto, or gift cards — instantly.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <button onClick={() => open("signup")} className="inline-flex items-center gap-2 rounded-xl bg-gradient-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-glow-primary hover:opacity-95 transition">
                Start Mining Free <Sparkles className="h-4 w-4" />
              </button>
              <a href="#how" className="inline-flex items-center gap-2 rounded-xl glass px-5 py-3 text-sm font-semibold hover:bg-card transition">
                How It Works
              </a>
            </div>
            <div className="mt-7 flex flex-wrap gap-3">
              {[
                { icon: CheckCircle2, label: "100% Free" },
                { icon: Zap, label: "Instant XP" },
                { icon: ShieldCheck, label: "Secure & Trusted" },
              ].map((t) => (
                <span key={t.label} className="inline-flex items-center gap-1.5 rounded-full bg-card/60 backdrop-blur border border-border px-3 py-1.5 text-xs text-muted-foreground">
                  <t.icon className="h-3.5 w-3.5 text-success" /> {t.label}
                </span>
              ))}
            </div>
          </div>

          {/* Right visual */}
          <div className="relative h-[440px] hidden lg:block">
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                animate={{ y: [0, -12, 0] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="relative"
              >
                <div className="absolute -inset-10 rounded-full bg-gradient-primary opacity-40 blur-3xl animate-glow-pulse" />
                <div className="relative h-56 w-56 rounded-[2.5rem] bg-gradient-primary p-[2px] shadow-glow-primary">
                  <div className="h-full w-full rounded-[2.4rem] bg-background/40 backdrop-blur-xl flex items-center justify-center">
                    <Diamond className="h-24 w-24 text-primary-foreground drop-shadow-[0_0_30px_oklch(0.82_0.15_200/0.8)]" />
                  </div>
                </div>
              </motion.div>
            </div>

            {[
              { x: -40, y: -60, delay: 0, label: "+2,500 XP", sub: "Survey Complete", color: "from-cyan-500 to-blue-500" },
              { x: 60, y: 30, delay: 0.4, label: "+850 XP", sub: "Offer Complete", color: "from-violet-500 to-fuchsia-500" },
              { x: -30, y: 130, delay: 0.8, label: "Level Up!", sub: "You reached Lv 8", color: "from-amber-500 to-orange-500" },
            ].map((c, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: c.y }}
                transition={{ delay: c.delay, duration: 0.6, repeat: Infinity, repeatType: "reverse", repeatDelay: 3 }}
                style={{ left: `calc(50% + ${c.x}px)`, top: `calc(50% + ${c.y}px)` }}
                className="absolute z-10"
              >
                <div className="rounded-2xl glass-strong px-4 py-2.5 shadow-card flex items-center gap-2.5 min-w-[180px]">
                  <div className={`flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br ${c.color}`}>
                    <Sparkles className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <div className="text-sm font-display font-bold text-gradient-xp">{c.label}</div>
                    <div className="text-[10px] text-muted-foreground">{c.sub}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="px-4 md:px-6">
        <div className="mx-auto max-w-7xl grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {[
            { icon: Users, label: "Active Members", value: mockStats.members },
            { icon: Coins, label: "XP Paid Out", value: mockStats.xpPaid },
            { icon: Trophy, label: "Offers Completed", value: mockStats.offers },
            { icon: Wallet, label: "Secure Payouts", value: mockStats.payouts },
          ].map((s) => (
            <div key={s.label} className="rounded-2xl glass p-5 shadow-card">
              <s.icon className="h-5 w-5 text-primary" />
              <div className="mt-3 font-display text-2xl md:text-3xl font-bold tabular-nums">{s.value}</div>
              <div className="mt-1 text-xs text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="px-4 md:px-6 py-16 md:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <h2 className="font-display text-3xl md:text-5xl font-bold">How it works</h2>
            <p className="mt-3 text-muted-foreground">Three steps from sign-up to cashout.</p>
          </div>
          <div className="mt-10 grid md:grid-cols-3 gap-4">
            {[
              { n: "01", icon: Compass, title: "Discover Offers", desc: "Browse top GPT/CPA offers, surveys, and tasks from elite partners." },
              { n: "02", icon: Sparkles, title: "Complete Tasks", desc: "Finish offers in-app or via partner platforms. Track instantly." },
              { n: "03", icon: Wallet, title: "Earn XP & Cash Out", desc: "Watch your XP grow. Withdraw to PayPal, crypto, or gift cards." },
            ].map((s) => (
              <div key={s.n} className="relative overflow-hidden rounded-3xl glass p-6 shadow-card">
                <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-gradient-primary opacity-15 blur-3xl" />
                <div className="font-display text-5xl font-bold text-gradient-primary opacity-30">{s.n}</div>
                <s.icon className="mt-4 h-7 w-7 text-primary" />
                <h3 className="mt-3 font-display text-xl font-bold">{s.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-4 md:px-6 pb-16 md:pb-24">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-center font-display text-3xl md:text-5xl font-bold">Questions, answered</h2>
          <div className="mt-8 space-y-3">
            {mockFAQs.map((f) => (
              <details key={f.q} className="group rounded-2xl glass p-5 shadow-card">
                <summary className="flex cursor-pointer items-center justify-between font-display font-semibold">
                  {f.q}
                  <ChevronDown className="h-4 w-4 transition group-open:rotate-180" />
                </summary>
                <p className="mt-3 text-sm text-muted-foreground">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-background/40 backdrop-blur">
        <div className="mx-auto max-w-7xl px-4 md:px-6 py-10 grid md:grid-cols-4 gap-8">
          <div>
            <Logo to="/" />
            <p className="mt-3 text-xs text-muted-foreground max-w-xs">Premium GPT/CPA rewards platform. Earn XP. Cash out. Repeat.</p>
          </div>
          <FooterCol title="Product" links={["Earn", "Top Offers", "Rewards", "Cashout"]} />
          <FooterCol title="Support" links={["Help Center", "Contact", "Status", "Bug Bounty"]} />
          <FooterCol title="Legal" links={["Terms", "Privacy", "Cookies", "DMCA"]} />
        </div>
        <div className="border-t border-border py-5 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} LootMiner. All rights reserved.
        </div>
      </footer>

      <AuthModal open={authOpen} mode={authMode} onOpenChange={setAuthOpen} />
    </div>
  );
}

function FooterCol({ title, links }: { title: string; links: string[] }) {
  return (
    <div>
      <div className="font-display text-sm font-semibold">{title}</div>
      <ul className="mt-3 space-y-2">
        {links.map((l) => (
          <li key={l}><Link to="/" className="text-xs text-muted-foreground hover:text-foreground transition">{l}</Link></li>
        ))}
      </ul>
    </div>
  );
}
