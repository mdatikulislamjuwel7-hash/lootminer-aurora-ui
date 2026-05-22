import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/common/PageHeader";
import { user } from "@/data/mock";
import { Calendar, Mail, MapPin, Shield, Trophy } from "lucide-react";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Profile — LootMiner" },
      { name: "description", content: "Your LootMiner profile, stats, and badges." },
    ],
  }),
  component: Profile,
});

function Profile() {
  return (
    <div className="space-y-8">
      <PageHeader eyebrow="Account" title="Your profile" />

      <section className="relative overflow-hidden rounded-3xl glass p-6 md:p-8 shadow-card">
        <div className="absolute -top-24 right-0 h-64 w-64 rounded-full bg-gradient-accent opacity-25 blur-3xl" />
        <div className="relative flex flex-col md:flex-row md:items-center gap-6">
          <div className="relative">
            <div className="absolute -inset-1 rounded-full bg-gradient-primary blur-md opacity-70" />
            <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-card border border-border font-display text-3xl font-bold">
              {user.name.split(" ").map(n => n[0]).join("")}
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="font-display text-3xl font-bold">{user.name}</h2>
            <p className="text-sm text-muted-foreground">{user.username}</p>
            <div className="mt-4 flex flex-wrap gap-2 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-card/60 px-3 py-1 border border-border"><Mail className="h-3 w-3" /> {user.email}</span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-card/60 px-3 py-1 border border-border"><Calendar className="h-3 w-3" /> Joined {user.joined}</span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-card/60 px-3 py-1 border border-border"><MapPin className="h-3 w-3" /> United States</span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-success/15 text-success px-3 py-1 border border-success/30"><Shield className="h-3 w-3" /> Verified</span>
            </div>
          </div>
          <div className="rounded-2xl bg-gradient-primary p-5 text-primary-foreground shadow-glow-primary">
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest opacity-80"><Trophy className="h-3 w-3" /> Level</div>
            <div className="mt-1 font-display text-4xl font-bold">{user.level}</div>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        {[
          { label: "Lifetime earned", value: "184,920" },
          { label: "Offers done", value: "412" },
          { label: "Cashouts", value: "23" },
          { label: "Referrals", value: "8" },
        ].map(s => (
          <div key={s.label} className="rounded-2xl glass p-4 shadow-card">
            <div className="text-xs text-muted-foreground">{s.label}</div>
            <div className="mt-2 font-display text-2xl font-bold tabular-nums">{s.value}</div>
          </div>
        ))}
      </section>
    </div>
  );
}
