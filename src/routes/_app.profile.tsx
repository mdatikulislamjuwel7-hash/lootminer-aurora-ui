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
        {["Earning", "Withdraw"].map((t) => (
          <section key={t} className="rounded-3xl glass p-6 shadow-card">
            <h2 className="font-display text-xl font-bold">{t} Summary</h2>
            <div className="mt-3 grid grid-cols-3 gap-2 text-center">
              {[
                { l: "Paid", v: t === "Earning" ? 28900 : 22500 },
                { l: "Pending", v: t === "Earning" ? 320 : 1200 },
                { l: "Hold", v: 0 },
              ].map((s) => (
                <div key={s.l} className="rounded-xl bg-card/60 border border-border p-3">
                  <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{s.l}</div>
                  <div className="mt-1 font-display text-lg font-bold tabular-nums">{s.v.toLocaleString()}</div>
                </div>
              ))}
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
