import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/common/PageHeader";
import { user } from "@/data/mock";

export const Route = createFileRoute("/settings")({
  head: () => ({ meta: [{ title: "Settings — LootMiner" }] }),
  component: Settings,
});

function Settings() {
  return (
    <div className="space-y-8">
      <PageHeader eyebrow="Preferences" title="Settings" />

      <section className="rounded-2xl glass p-6 shadow-card space-y-5">
        <h2 className="font-display text-xl font-bold">Account</h2>
        {[
          { label: "Display name", value: user.name },
          { label: "Username", value: user.username },
          { label: "Email", value: user.email },
        ].map(f => (
          <div key={f.label}>
            <label className="text-xs uppercase tracking-widest text-muted-foreground">{f.label}</label>
            <input
              defaultValue={f.value}
              className="mt-1.5 w-full rounded-xl bg-card/60 border border-border px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        ))}
      </section>

      <section className="rounded-2xl glass p-6 shadow-card space-y-4">
        <h2 className="font-display text-xl font-bold">Preferences</h2>
        {[
          { label: "Email notifications", desc: "Get notified when offers credit." },
          { label: "Push notifications", desc: "Alerts for daily bonuses." },
          { label: "Two-factor auth", desc: "Extra security on withdrawals." },
        ].map((p, i) => (
          <div key={p.label} className="flex items-center justify-between gap-4 py-2">
            <div>
              <div className="font-medium">{p.label}</div>
              <div className="text-xs text-muted-foreground">{p.desc}</div>
            </div>
            <button
              className={`relative h-6 w-11 rounded-full transition ${i !== 1 ? "bg-gradient-primary shadow-glow-primary" : "bg-card border border-border"}`}
            >
              <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-background shadow transition ${i !== 1 ? "left-[22px]" : "left-0.5"}`} />
            </button>
          </div>
        ))}
      </section>
    </div>
  );
}
