import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { mockSettings } from "@/data/mock";

export const Route = createFileRoute("/_admin/admin/settings")({
  head: () => ({ meta: [{ title: "Admin · Settings" }] }),
  component: () => {
    const [s, setS] = useState(mockSettings);
    const toggle = (k: keyof typeof s) => setS({ ...s, [k]: !s[k] });
    return (
      <div className="space-y-6">
        <PageHeader eyebrow="Admin" title="Settings" />

        <section className="rounded-3xl glass p-6 shadow-card space-y-4">
          <h2 className="font-display text-xl font-bold">Economy</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <Field label="XP per USD" value={s.xpPerUsd} onChange={(v) => setS({ ...s, xpPerUsd: +v })} />
            <Field label="Signup bonus XP" value={s.signupBonusXp} onChange={(v) => setS({ ...s, signupBonusXp: +v })} />
          </div>
        </section>

        <section className="rounded-3xl glass p-6 shadow-card space-y-1">
          <h2 className="font-display text-xl font-bold mb-3">Flags</h2>
          {([
            ["maintenanceMode", "Maintenance mode"],
            ["liveLeadsEnabled", "Live leads ticker"],
            ["vpnBlocking", "VPN / proxy blocking"],
            ["fraudlogix", "Fraudlogix enabled"],
            ["ipqs", "IPQualityScore enabled"],
            ["signupOpen", "Signups open"],
            ["proxyChangeDetect", "Live proxy change detection"],
          ] as const).map(([key, label]) => (
            <Toggle key={key} label={label} value={s[key] as boolean} onChange={() => toggle(key)} />
          ))}
        </section>

        <section className="rounded-3xl glass p-6 shadow-card space-y-3">
          <h2 className="font-display text-xl font-bold">API Keys</h2>
          {[
            { l: "Fraudlogix API Key" },
            { l: "IPQualityScore API Key" },
          ].map(k => (
            <label key={k.l} className="block">
              <span className="text-xs uppercase tracking-widest text-muted-foreground">{k.l}</span>
              <input type="password" placeholder="Stored securely in backend .env later." className="mt-1.5 w-full rounded-xl bg-card/60 border border-border px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary placeholder:text-muted-foreground/60" />
            </label>
          ))}
        </section>

        <div className="flex justify-end">
          <button className="rounded-xl bg-gradient-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-glow-primary">Save Settings</button>
        </div>
      </div>
    );
  },
});

function Field({ label, value, onChange }: { label: string; value: number; onChange: (v: string) => void }) {
  return (
    <label className="block">
      <span className="text-xs uppercase tracking-widest text-muted-foreground">{label}</span>
      <input type="number" value={value} onChange={(e) => onChange(e.target.value)} className="mt-1.5 w-full rounded-xl bg-card/60 border border-border px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary" />
    </label>
  );
}

function Toggle({ label, value, onChange }: { label: string; value: boolean; onChange: () => void }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-border last:border-0">
      <span className="text-sm">{label}</span>
      <button onClick={onChange} className={`relative h-6 w-11 rounded-full transition ${value ? "bg-gradient-primary shadow-glow-primary" : "bg-card border border-border"}`}>
        <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-background shadow transition ${value ? "left-[22px]" : "left-0.5"}`} />
      </button>
    </div>
  );
}
