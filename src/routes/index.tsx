import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { AuroraBackground } from "@/components/background/AuroraBackground";
import { Logo } from "@/components/common/Logo";
import { LiveLeadsTicker } from "@/components/landing/LiveLeadsTicker";
import { AuthModal } from "@/components/auth/AuthModal";
import { mockStats, mockFAQs, mockOfferwalls, mockSurveys } from "@/data/mock";
import {
  ArrowRight, ChevronDown, Sparkles, ShieldCheck, Zap, Diamond,
  Users, Coins, Trophy, Wallet, Compass, CheckCircle2, Star,
  Gauge, Layers, Lock, Banknote, Bitcoin, Gift, Building2,
  UserPlus, MousePointerClick, Rocket, BadgeCheck, Eye, Headset, ScrollText,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "LootMiner — Earn XP from offers, surveys & tasks" },
      { name: "description", content: "Earn premium XP rewards from offers, surveys, and tasks. Complete offers, earn XP, cash out to PayPal, crypto, or gift cards." },
      { property: "og:title", content: "LootMiner — Earn XP. Cash out. Repeat." },
      { property: "og:description", content: "The premium GPT/CPA rewards platform. Earn XP from elite partners and cash out instantly." },
    ],
  }),
  component: Landing,
});

function Landing() {
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signup");
  const open = (m: "signin" | "signup") => { setAuthMode(m); setAuthOpen(true); };

  // 8 featured partner cards
  const featured = [
    mockOfferwalls.find(p => p.id === "adgem")!,
    mockOfferwalls.find(p => p.id === "lootably")!,
    mockSurveys.find(p => p.id === "bitlabs")!,
    mockSurveys.find(p => p.id === "cpx")!,
    mockOfferwalls.find(p => p.id === "monlix")!,
    mockSurveys.find(p => p.id === "pollmine")!,
    mockOfferwalls.find(p => p.id === "notik")!,
    mockOfferwalls.find(p => p.id === "offery")!,
  ].filter(Boolean);

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <AuroraBackground />

      {/* Topbar */}
      <header className="sticky top-0 z-40">
        <div className="px-3 md:px-6 pt-3 md:pt-4">
          <div className="mx-auto flex max-w-7xl items-center gap-3 rounded-2xl glass-strong px-3 md:px-5 py-2.5 shadow-card">
            <Logo to="/" />
            <nav className="ml-6 hidden md:flex items-center gap-1">
              {[
                { label: "Partners", href: "#partners" },
                { label: "How it works", href: "#how" },
                { label: "Cashout", href: "#cashout" },
                { label: "FAQ", href: "#faq" },
              ].map((l) => (
                <a key={l.href} href={l.href} className="rounded-lg px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground hover:bg-card/60 transition">
                  {l.label}
                </a>
              ))}
            </nav>
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
              Earn premium <span className="text-gradient-xp">XP rewards</span> from offers, surveys, and tasks.
            </h1>
            <p className="mt-5 max-w-xl text-base md:text-lg text-muted-foreground">
              Complete offers. Earn XP. Cash out. Join 240k+ members turning their time into PayPal cash, crypto, and gift cards on the premium GPT/CPA rewards platform.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <button onClick={() => open("signup")} className="inline-flex items-center gap-2 rounded-xl bg-gradient-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-glow-primary hover:opacity-95 transition">
                Start Earning Free <Sparkles className="h-4 w-4" />
              </button>
              <a href="#how" className="inline-flex items-center gap-2 rounded-xl glass px-5 py-3 text-sm font-semibold hover:bg-card transition">
                How It Works
              </a>
            </div>
            <div className="mt-7 flex flex-wrap gap-2">
              {[
                { icon: CheckCircle2, label: "100% Free" },
                { icon: Zap, label: "Instant XP" },
                { icon: ShieldCheck, label: "Secure & Trusted" },
                { icon: Star, label: "4.8 / 5 rating" },
              ].map((t) => (
                <span key={t.label} className="inline-flex items-center gap-1.5 rounded-full bg-card/60 backdrop-blur border border-border px-3 py-1.5 text-xs text-muted-foreground">
                  <t.icon className="h-3.5 w-3.5 text-success" /> {t.label}
                </span>
              ))}
            </div>
          </div>

          {/* Right visual */}
          <div className="relative h-[480px] hidden lg:block">
            <div className="absolute inset-0 flex items-center justify-center">
              {/* Orbiting glow rings */}
              <div className="absolute h-[420px] w-[420px] rounded-full border border-white/5" />
              <div className="absolute h-[320px] w-[320px] rounded-full border border-white/10" />
              <motion.div
                animate={{ y: [0, -14, 0], rotate: [0, 3, 0] }}
                transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
                className="relative"
              >
                <div className="absolute -inset-12 rounded-full bg-gradient-primary opacity-50 blur-3xl animate-glow-pulse" />
                <div className="relative h-60 w-60 rounded-[2.5rem] bg-gradient-primary p-[2px] shadow-glow-primary">
                  <div className="relative h-full w-full rounded-[2.4rem] bg-background/40 backdrop-blur-xl flex items-center justify-center overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-mesh opacity-60" />
                    <Diamond className="relative h-28 w-28 text-primary-foreground drop-shadow-[0_0_36px_oklch(0.82_0.15_200/0.85)]" />
                    {/* Sparkles */}
                    <Sparkles className="absolute top-6 right-8 h-4 w-4 text-xp opacity-80 animate-float" />
                    <Sparkles className="absolute bottom-8 left-6 h-3 w-3 text-primary opacity-80 animate-float" style={{ animationDelay: "1.2s" }} />
                  </div>
                </div>
              </motion.div>
            </div>

            {[
              { x: -180, y: -120, delay: 0, label: "+2,500 XP", sub: "Survey Complete", icon: Trophy, color: "from-cyan-500 to-blue-500" },
              { x: 120, y: -40, delay: 0.4, label: "+850 XP", sub: "Offer Complete", icon: Sparkles, color: "from-violet-500 to-fuchsia-500" },
              { x: -150, y: 130, delay: 0.8, label: "Level Up!", sub: "You reached Lv 8", icon: Rocket, color: "from-amber-500 to-orange-500" },
            ].map((c, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1, y: [0, -8, 0] }}
                transition={{ delay: c.delay, duration: 4, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
                style={{ left: `calc(50% + ${c.x}px)`, top: `calc(50% + ${c.y}px)` }}
                className="absolute z-10"
              >
                <div className="rounded-2xl glass-strong px-4 py-3 shadow-card flex items-center gap-3 min-w-[200px] ring-1 ring-white/10">
                  <div className={`flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br ${c.color} shadow-glow-primary`}>
                    <c.icon className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <div className="text-sm font-display font-bold text-gradient-xp leading-tight">{c.label}</div>
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
            <div key={s.label} className="relative overflow-hidden rounded-2xl glass p-5 shadow-card">
              <div className="absolute -top-8 -right-8 h-24 w-24 rounded-full bg-gradient-primary opacity-20 blur-2xl" />
              <s.icon className="h-5 w-5 text-primary" />
              <div className="mt-3 font-display text-2xl md:text-3xl font-bold tabular-nums text-gradient-primary">{s.value}</div>
              <div className="mt-1 text-xs text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* A. Featured Partners */}
      <section id="partners" className="px-4 md:px-6 pt-16 md:pt-24">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="Trusted Network"
            title="Earn XP with trusted partners"
            subtitle="A curated network of premium offerwall and survey providers."
          />
          <div className="mt-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
            {featured.map((p) => (
              <div
                key={p.id}
                className="group relative overflow-hidden rounded-2xl glass p-4 shadow-card transition hover:-translate-y-1 hover:shadow-glow-primary cursor-pointer"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${p.gradient} opacity-40 group-hover:opacity-70 transition`} />
                <div className="relative flex flex-col items-start gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-background/60 backdrop-blur ring-1 ring-white/10">
                    <p.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <div className="font-display text-sm font-bold truncate">{p.name}</div>
                    <div className="mt-0.5 flex items-center gap-1 text-[10px] text-muted-foreground">
                      <Star className="h-2.5 w-2.5 fill-xp text-xp" />
                      <span className="tabular-nums">{p.rating.toFixed(1)}</span>
                    </div>
                  </div>
                  <span className={`mt-1 inline-flex items-center rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${
                    p.type === "survey"
                      ? "bg-gradient-accent text-accent-foreground shadow-glow-accent"
                      : "bg-gradient-primary text-primary-foreground shadow-glow-primary"
                  }`}>
                    {p.type === "survey" ? "Survey" : "Offerwall"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* B. Why users choose LootMiner */}
      <section className="px-4 md:px-6 pt-16 md:pt-24">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="Why LootMiner"
            title="Built for serious earners"
            subtitle="Premium experience, zero fluff."
          />
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
            {[
              { icon: Gauge, title: "Fast XP Tracking", desc: "Real-time postbacks credit your XP within seconds of completion." },
              { icon: Layers, title: "Multiple Offerwalls", desc: "18+ premium partners side by side — always pick the best paying offer." },
              { icon: Lock, title: "Secure Account", desc: "Anti-fraud monitoring, encrypted sessions, and optional 2FA on every account." },
              { icon: Wallet, title: "Easy Cashout", desc: "Withdraw to PayPal, crypto, or gift cards from as little as $1." },
            ].map((f) => (
              <div key={f.title} className="group relative overflow-hidden rounded-3xl glass p-6 shadow-card hover:shadow-glow-primary transition">
                <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-gradient-primary opacity-15 blur-3xl group-hover:opacity-30 transition" />
                <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-primary shadow-glow-primary">
                  <f.icon className="h-5 w-5 text-primary-foreground" />
                </div>
                <h3 className="relative mt-4 font-display text-lg font-bold">{f.title}</h3>
                <p className="relative mt-2 text-sm text-muted-foreground">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* C. Cashout preview */}
      <section id="cashout" className="px-4 md:px-6 pt-16 md:pt-24">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="Cash Out"
            title="Turn your XP into real rewards"
            subtitle="Fast, flexible payouts to the methods you actually use."
          />
          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {[
              { icon: Banknote, name: "PayPal", min: "from $1.00", color: "from-blue-500/40 to-sky-600/30" },
              { icon: Bitcoin, name: "Bitcoin", min: "from $5.00", color: "from-amber-500/40 to-orange-600/30" },
              { icon: Gift, name: "Amazon", min: "from $5.00", color: "from-yellow-500/40 to-amber-600/30" },
              { icon: Building2, name: "Bank Transfer", min: "from $10.00", color: "from-emerald-500/40 to-teal-600/30" },
            ].map((c) => (
              <div key={c.name} className="group relative overflow-hidden rounded-2xl glass p-5 shadow-card hover:-translate-y-1 transition">
                <div className={`absolute inset-0 bg-gradient-to-br ${c.color} opacity-40 group-hover:opacity-70 transition`} />
                <div className="relative">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-background/60 backdrop-blur ring-1 ring-white/10">
                    <c.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div className="mt-4 font-display font-bold">{c.name}</div>
                  <div className="mt-0.5 text-xs text-muted-foreground">{c.min}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* D. Rewards Journey */}
      <section id="how" className="px-4 md:px-6 pt-16 md:pt-24">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="Journey"
            title="From sign-up to cashout"
            subtitle="Five effortless steps. Designed for speed."
          />
          <div className="mt-10 relative">
            {/* Connection line (desktop) */}
            <div className="hidden lg:block absolute left-0 right-0 top-12 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
              {[
                { n: 1, icon: UserPlus, title: "Sign Up Free", desc: "Takes 20 seconds." },
                { n: 2, icon: Compass, title: "Choose an Offer", desc: "Browse 18+ partners." },
                { n: 3, icon: MousePointerClick, title: "Complete Task", desc: "Surveys, offers, tasks." },
                { n: 4, icon: Sparkles, title: "Earn XP", desc: "Credited in seconds." },
                { n: 5, icon: Wallet, title: "Cash Out", desc: "PayPal, crypto, cards." },
              ].map((s) => (
                <div key={s.n} className="relative">
                  <div className="relative z-10 flex flex-col items-center text-center rounded-3xl glass p-5 shadow-card">
                    <div className="relative">
                      <div className="absolute inset-0 rounded-2xl bg-gradient-primary blur-lg opacity-60" />
                      <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-primary shadow-glow-primary">
                        <s.icon className="h-6 w-6 text-primary-foreground" />
                      </div>
                    </div>
                    <div className="mt-3 font-display text-[10px] font-bold tracking-widest uppercase text-primary">
                      Step {String(s.n).padStart(2, "0")}
                    </div>
                    <div className="mt-1 font-display text-base font-bold">{s.title}</div>
                    <div className="mt-1 text-xs text-muted-foreground">{s.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* E. Trust & Security */}
      <section className="px-4 md:px-6 pt-16 md:pt-24">
        <div className="mx-auto max-w-7xl">
          <div className="relative overflow-hidden rounded-3xl glass-strong p-6 md:p-10 shadow-card">
            <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-gradient-accent opacity-25 blur-3xl" />
            <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-gradient-primary opacity-25 blur-3xl" />
            <div className="relative grid lg:grid-cols-2 gap-8 items-center">
              <div>
                <div className="inline-flex items-center gap-1.5 rounded-full bg-success/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-success ring-1 ring-success/30">
                  <ShieldCheck className="h-3 w-3" /> Trust & Security
                </div>
                <h2 className="mt-3 font-display text-3xl md:text-4xl font-bold">Your XP is safe with us.</h2>
                <p className="mt-3 text-muted-foreground max-w-md">
                  Built with security-first principles. We monitor every lead and protect every account so you can focus on earning.
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { icon: BadgeCheck, title: "Secure Tracking", desc: "Encrypted postbacks on every lead." },
                  { icon: ShieldCheck, title: "Anti-Fraud Protection", desc: "Active monitoring stops bad actors." },
                  { icon: Eye, title: "Transparent XP History", desc: "Every credit, fully auditable." },
                  { icon: Headset, title: "Support Available", desc: "Real humans, fast replies." },
                ].map((t) => (
                  <div key={t.title} className="rounded-2xl bg-background/40 backdrop-blur p-4 ring-1 ring-border">
                    <t.icon className="h-5 w-5 text-success" />
                    <div className="mt-2 font-display font-bold text-sm">{t.title}</div>
                    <div className="mt-0.5 text-xs text-muted-foreground">{t.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="px-4 md:px-6 pt-16 md:pt-24 pb-12">
        <div className="mx-auto max-w-3xl">
          <SectionHeading eyebrow="FAQ" title="Questions, answered" centered />
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

      {/* CTA */}
      <section className="px-4 md:px-6 pb-16 md:pb-24">
        <div className="mx-auto max-w-5xl">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-primary p-8 md:p-12 text-center shadow-glow-primary">
            <div className="absolute inset-0 bg-gradient-mesh opacity-50" />
            <div className="relative">
              <ScrollText className="mx-auto h-8 w-8 text-primary-foreground" />
              <h2 className="mt-3 font-display text-3xl md:text-4xl font-bold text-primary-foreground">
                Earn XP instantly. Cash out faster.
              </h2>
              <p className="mt-2 text-primary-foreground/80">Join 240,000+ members earning every day.</p>
              <button
                onClick={() => open("signup")}
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-background px-6 py-3 text-sm font-bold text-foreground shadow-card hover:scale-[1.02] transition"
              >
                Start Earning Free <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-background/50 backdrop-blur">
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

function SectionHeading({
  eyebrow, title, subtitle, centered = false,
}: { eyebrow: string; title: string; subtitle?: string; centered?: boolean }) {
  return (
    <div className={centered ? "text-center" : ""}>
      <div className="inline-flex items-center gap-1.5 rounded-full glass px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-primary">
        <Sparkles className="h-3 w-3" /> {eyebrow}
      </div>
      <h2 className="mt-3 font-display text-3xl md:text-4xl font-bold tracking-tight">{title}</h2>
      {subtitle && <p className="mt-2 text-sm md:text-base text-muted-foreground max-w-2xl">{subtitle}</p>}
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
