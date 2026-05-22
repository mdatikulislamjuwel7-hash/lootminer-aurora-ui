import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/common/PageHeader";
import { mockUser, mockActivities } from "@/data/mock";
import { Calendar, MapPin, Mail, ShieldCheck, Trophy } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/_app/profile")({
  head: () => ({ meta: [{ title: "Profile — LootMiner" }] }),
  component: Profile,
});

function Profile() {
  const [priv, setPriv] = useState(mockUser.accountPrivate);
  return (
    <div className="space-y-8">
      <PageHeader eyebrow="Account" title="Your profile" />

      <section className="relative overflow-hidden rounded-3xl glass p-6 md:p-8 shadow-card">
        <div className="absolute -top-20 right-0 h-64 w-64 rounded-full bg-gradient-accent opacity-25 blur-3xl" />
        <div className="relative flex flex-col md:flex-row md:items-center gap-6">
          <div className="relative">
            <div className="absolute -inset-1 rounded-full bg-gradient-primary blur-md opacity-70" />
            <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-card border border-border font-display text-3xl font-bold">{mockUser.avatar}</div>
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="font-display text-3xl font-bold">{mockUser.username}</h2>
            <div className="mt-3 flex flex-wrap gap-2 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-card/60 px-3 py-1 border border-border"><Mail className="h-3 w-3" /> {mockUser.email} {mockUser.emailVerified && <ShieldCheck className="h-3 w-3 text-success" />}</span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-card/60 px-3 py-1 border border-border"><Calendar className="h-3 w-3" /> Joined {mockUser.joinDate}</span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-card/60 px-3 py-1 border border-border"><MapPin className="h-3 w-3" /> {mockUser.country}</span>
            </div>
            <div className="mt-4 flex items-center gap-3">
              <span className="text-sm">Private account</span>
              <button onClick={() => setPriv(!priv)} className={`relative h-6 w-11 rounded-full transition ${priv ? "bg-gradient-primary shadow-glow-primary" : "bg-card border border-border"}`}>
                <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-background shadow transition ${priv ? "left-[22px]" : "left-0.5"}`} />
              </button>
            </div>
          </div>
          <div className="rounded-2xl bg-gradient-primary p-5 text-primary-foreground shadow-glow-primary">
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest opacity-80"><Trophy className="h-3 w-3" /> Level</div>
            <div className="mt-1 font-display text-4xl font-bold">{mockUser.level}</div>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        {[
          { label: "Total Earned", value: mockUser.totalEarned },
          { label: "Cashouts", value: 23 },
          { label: "Referrals", value: 8 },
          { label: "Streak", value: `${mockUser.streak} days` },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl glass p-4 shadow-card">
            <div className="text-xs text-muted-foreground">{s.label}</div>
            <div className="mt-2 font-display text-2xl font-bold tabular-nums">{typeof s.value === "number" ? s.value.toLocaleString() : s.value}</div>
          </div>
        ))}
      </section>

      <div className="grid md:grid-cols-2 gap-4">
        <section className="rounded-3xl glass p-6 shadow-card space-y-4">
          <h2 className="font-display text-xl font-bold">Edit Profile</h2>
          {[
            { label: "Username", value: mockUser.username },
            { label: "Email", value: mockUser.email },
          ].map((f) => (
            <label key={f.label} className="block">
              <span className="text-xs uppercase tracking-widest text-muted-foreground">{f.label}</span>
              <input defaultValue={f.value} className="mt-1.5 w-full rounded-xl bg-card/60 border border-border px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary" />
            </label>
          ))}
        </section>

        <section className="rounded-3xl glass p-6 shadow-card space-y-4">
          <h2 className="font-display text-xl font-bold">Change Password</h2>
          {["Current password", "New password", "Confirm password"].map((l) => (
            <label key={l} className="block">
              <span className="text-xs uppercase tracking-widest text-muted-foreground">{l}</span>
              <input type="password" className="mt-1.5 w-full rounded-xl bg-card/60 border border-border px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary" />
            </label>
          ))}
        </section>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {([
          { title: "Earning Summary", icon: "sparkles" as const, rows: [
            { l: "Paid",    v: 28900, tone: "success" as const },
            { l: "Pending", v: 320,   tone: "warning" as const },
            { l: "Hold",    v: 0,     tone: "muted"   as const },
          ] },
          { title: "Withdraw Summary", icon: "wallet" as const, rows: [
            { l: "Paid",    v: 22500, tone: "success" as const },
            { l: "Pending", v: 1200,  tone: "warning" as const },
            { l: "Hold",    v: 0,     tone: "muted"   as const },
          ] },
        ]).map((s) => (
          <section key={s.title} className="relative overflow-hidden rounded-3xl glass p-6 shadow-card">
            <div className="absolute -top-16 -right-16 h-44 w-44 rounded-full bg-gradient-primary opacity-15 blur-3xl" />
            <h2 className="relative font-display text-xl font-bold">{s.title}</h2>
            <div className="relative mt-4 grid grid-cols-3 gap-3">
              {s.rows.map((r) => {
                const styles =
                  r.tone === "success"
                    ? "bg-success/10 ring-success/30 text-success"
                    : r.tone === "warning"
                    ? "bg-xp/10 ring-xp/30 text-xp"
                    : "bg-muted/30 ring-border text-muted-foreground";
                const dot =
                  r.tone === "success"
                    ? "bg-success shadow-[0_0_10px_oklch(0.78_0.18_165/0.7)]"
                    : r.tone === "warning"
                    ? "bg-xp shadow-glow-xp"
                    : "bg-muted-foreground/50";
                return (
                  <div
                    key={r.l}
                    className={`group relative overflow-hidden rounded-2xl ring-1 ${styles} p-3 transition hover:-translate-y-0.5`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase tracking-widest font-bold">{r.l}</span>
                      <span className={`h-1.5 w-1.5 rounded-full ${dot} ${r.tone !== "muted" ? "animate-pulse" : ""}`} />
                    </div>
                    <div className="mt-2 font-display text-xl font-bold tabular-nums text-foreground">
                      {r.v.toLocaleString()}
                    </div>
                    <div className="mt-0.5 text-[10px] text-muted-foreground">XP</div>
                  </div>
                );
              })}
            </div>
          </section>
        ))}
      </div>


      <section className="rounded-3xl glass shadow-card overflow-hidden">
        <div className="p-5 font-display text-xl font-bold">Activity History</div>
        <div className="divide-y divide-border">
          {mockActivities.map((a) => (
            <div key={a.id} className="flex items-center gap-3 px-5 py-3 text-sm">
              <div className="min-w-0 flex-1">
                <div className="truncate font-medium">{a.offer}</div>
                <div className="text-xs text-muted-foreground">{a.provider} · {a.time}</div>
              </div>
              <div className={`font-semibold tabular-nums ${a.xp > 0 ? "text-gradient-xp" : "text-warning"}`}>{a.xp > 0 ? "+" : ""}{a.xp.toLocaleString()}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
