import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/common/PageHeader";
import { mockFAQs } from "@/data/faqs";
import { ChevronDown, Mail, MessageCircle, Search, Rocket, Sparkles, Wallet, User } from "lucide-react";

export const Route = createFileRoute("/_app/support")({
  head: () => ({ meta: [{ title: "Support — LootMiner" }] }),
  component: Support,
});

const cats = [
  { icon: Rocket, title: "Getting Started", desc: "New here? Begin with the basics." },
  { icon: Sparkles, title: "Earning", desc: "Offers, surveys, top offers." },
  { icon: Wallet, title: "Cashout", desc: "Withdrawals, methods, limits." },
  { icon: User, title: "Account", desc: "Login, security, profile." },
];

function Support() {
  return (
    <div className="space-y-8">
      <PageHeader eyebrow="Help" title="How can we help?" />

      <div className="relative">
        <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
        <input placeholder="Search the help center…" className="w-full rounded-2xl glass pl-12 pr-4 py-4 text-base outline-none focus:ring-2 focus:ring-primary shadow-card" />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {cats.map((c) => (
          <div key={c.title} className="rounded-2xl glass p-5 shadow-card hover:bg-card transition cursor-pointer">
            <c.icon className="h-5 w-5 text-primary" />
            <div className="mt-3 font-display font-bold">{c.title}</div>
            <div className="mt-1 text-xs text-muted-foreground">{c.desc}</div>
          </div>
        ))}
      </div>

      <div className="space-y-3">
        {mockFAQs.map((f) => (
          <details key={f.q} className="group rounded-2xl glass p-5 shadow-card">
            <summary className="flex cursor-pointer items-center justify-between font-display font-semibold">
              {f.q} <ChevronDown className="h-4 w-4 transition group-open:rotate-180" />
            </summary>
            <p className="mt-3 text-sm text-muted-foreground">{f.a}</p>
          </details>
        ))}
      </div>

      <div className="rounded-3xl glass p-6 shadow-card flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="font-display text-xl font-bold">Still stuck?</div>
          <div className="text-sm text-muted-foreground">Our team replies within minutes.</div>
        </div>
        <div className="flex gap-2">
          <button className="inline-flex items-center gap-2 rounded-xl bg-gradient-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-glow-primary"><MessageCircle className="h-4 w-4" /> Live Chat</button>
          <button className="inline-flex items-center gap-2 rounded-xl glass px-5 py-3 text-sm font-semibold"><Mail className="h-4 w-4" /> Email</button>
        </div>
      </div>
    </div>
  );
}
