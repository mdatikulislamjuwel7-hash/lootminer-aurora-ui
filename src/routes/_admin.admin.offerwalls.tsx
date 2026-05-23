import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { Toggle } from "@/components/admin/StatusBadge";
import { mockOfferwalls, mockSurveys, type Provider } from "@/data/mock";
import { Pencil, Trash2, Plus, X, Flame } from "lucide-react";

export const Route = createFileRoute("/_admin/admin/offerwalls")({
  head: () => ({ meta: [{ title: "Admin · Offerwalls" }] }),
  component: OfferwallsPage,
});

type Draft = {
  name: string;
  slug: string;
  type: "offerwall" | "survey";
  logoUrl: string;
  logoBg: string;
  logoSize: number;
  iframeUrl: string;
  gradFrom: string;
  gradTo: string;
  isTopOffer: boolean;
  enabled: boolean;
  sortOrder: number;
  cardPosition: number;
  badgeText: string;
  badgeColor: string;
};

const emptyDraft: Draft = {
  name: "",
  slug: "",
  type: "offerwall",
  logoUrl: "",
  logoBg: "#0ea5e9",
  logoSize: 40,
  iframeUrl: "",
  gradFrom: "#22d3ee",
  gradTo: "#6366f1",
  isTopOffer: false,
  enabled: true,
  sortOrder: 0,
  cardPosition: 1,
  badgeText: "",
  badgeColor: "#f59e0b",
};

function OfferwallsPage() {
  const [modal, setModal] = useState<Draft | null>(null);
  const all: Provider[] = [...mockOfferwalls, ...mockSurveys];

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Admin"
        title="Offerwalls & Surveys"
        action={
          <button onClick={() => setModal({ ...emptyDraft })} className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-glow-primary">
            <Plus className="h-4 w-4" /> Add Provider
          </button>
        }
      />

      <div className="rounded-3xl glass shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-xs uppercase tracking-wider text-muted-foreground border-b border-border">
              <tr>
                {["Logo", "Name", "Type", "Enabled", "Top Offer", "Sort", "Actions"].map(c => (
                  <th key={c} className="text-left p-3 px-4 whitespace-nowrap">{c}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {all.map((p, i) => {
                const Icon = p.icon;
                return (
                  <tr key={p.id} className="hover:bg-card/40">
                    <td className="p-3 px-4">
                      <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${p.gradient} border border-border shadow-card`}>
                        <Icon className="h-5 w-5 text-foreground" />
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="font-medium">{p.name}</div>
                      <div className="font-mono text-[10px] text-muted-foreground">{p.slug}</div>
                    </td>
                    <td className="p-3">
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${p.type === "survey" ? "bg-violet-500/15 text-violet-300 ring-1 ring-violet-400/30" : "bg-cyan-500/15 text-cyan-300 ring-1 ring-cyan-400/30"}`}>{p.type}</span>
                    </td>
                    <td className="p-3"><Toggle checked={p.enabled} /></td>
                    <td className="p-3"><Toggle checked={!!p.isTopOffer} /></td>
                    <td className="p-3 tabular-nums text-muted-foreground">{i + 1}</td>
                    <td className="p-3 px-4">
                      <div className="inline-flex gap-1">
                        <button onClick={() => setModal({ ...emptyDraft, name: p.name, slug: p.slug, type: p.type, iframeUrl: p.iframeUrl, isTopOffer: !!p.isTopOffer, enabled: p.enabled })} className="rounded-lg bg-card/60 hover:bg-card p-1.5"><Pencil className="h-3.5 w-3.5" /></button>
                        <button className="rounded-lg bg-destructive/15 text-destructive hover:bg-destructive/25 p-1.5"><Trash2 className="h-3.5 w-3.5" /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {modal && <ProviderModal draft={modal} onChange={setModal} onClose={() => setModal(null)} />}
    </div>
  );
}

function ProviderModal({ draft, onChange, onClose }: { draft: Draft; onChange: (d: Draft) => void; onClose: () => void }) {
  const upd = <K extends keyof Draft>(k: K, v: Draft[K]) => onChange({ ...draft, [k]: v });
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button onClick={onClose} className="absolute inset-0 bg-background/70 backdrop-blur-md" />
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl glass shadow-card animate-page-in">
        <div className="flex items-center justify-between p-5 border-b border-border sticky top-0 bg-card/80 backdrop-blur-xl">
          <h3 className="font-display text-lg font-bold">{draft.name ? "Edit Provider" : "Add Provider"}</h3>
          <button onClick={onClose} className="rounded-lg bg-card/60 hover:bg-card p-1.5"><X className="h-4 w-4" /></button>
        </div>

        <div className="p-5 grid md:grid-cols-2 gap-4">
          <FormField label="Name">
            <input value={draft.name} onChange={(e) => { const v = e.target.value; onChange({ ...draft, name: v, slug: v.toLowerCase().replace(/\s+/g, "-") }); }} className="w-full rounded-xl bg-card/60 border border-border px-3 py-2 text-sm" />
          </FormField>
          <FormField label="Slug">
            <input value={draft.slug} onChange={(e) => upd("slug", e.target.value)} className="w-full rounded-xl bg-card/60 border border-border px-3 py-2 text-sm font-mono" />
          </FormField>
          <FormField label="Type">
            <select value={draft.type} onChange={(e) => upd("type", e.target.value as Draft["type"])} className="w-full rounded-xl bg-card/60 border border-border px-3 py-2 text-sm">
              <option value="offerwall">Offerwall</option>
              <option value="survey">Survey</option>
            </select>
          </FormField>
          <FormField label="Sort Order">
            <input type="number" value={draft.sortOrder} onChange={(e) => upd("sortOrder", +e.target.value)} className="w-full rounded-xl bg-card/60 border border-border px-3 py-2 text-sm" />
          </FormField>

          <FormField label="Logo URL" full>
            <div className="flex gap-2">
              <input value={draft.logoUrl} onChange={(e) => upd("logoUrl", e.target.value)} placeholder="https://…/logo.png" className="flex-1 rounded-xl bg-card/60 border border-border px-3 py-2 text-sm" />
              <div className="h-10 w-10 rounded-full border border-border shrink-0 flex items-center justify-center overflow-hidden" style={{ background: draft.logoBg }}>
                {draft.logoUrl ? <img src={draft.logoUrl} alt="" className="h-full w-full object-cover" /> : <Flame className="h-4 w-4 text-white/80" />}
              </div>
            </div>
          </FormField>

          <FormField label="Upload Logo" full>
            <label className="flex items-center gap-2 cursor-pointer rounded-xl bg-card/60 border border-dashed border-border px-3 py-2 text-sm hover:bg-card">
              <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                const f = e.target.files?.[0]; if (!f) return;
                const r = new FileReader(); r.onload = () => upd("logoUrl", String(r.result)); r.readAsDataURL(f);
              }} />
              <span className="text-muted-foreground">Choose image file (PNG, JPG, SVG)…</span>
            </label>
          </FormField>

          <FormField label="Logo Background">
            <input type="color" value={draft.logoBg} onChange={(e) => upd("logoBg", e.target.value)} className="h-10 w-full rounded-xl bg-card/60 border border-border cursor-pointer" />
          </FormField>
          <FormField label={`Logo Size (${draft.logoSize}px)`}>
            <input type="range" min={24} max={96} value={draft.logoSize} onChange={(e) => upd("logoSize", +e.target.value)} className="w-full accent-primary" />
          </FormField>
          <FormField label="Iframe URL" full>
            <input value={draft.iframeUrl} onChange={(e) => upd("iframeUrl", e.target.value)} placeholder="https://…" className="w-full rounded-xl bg-card/60 border border-border px-3 py-2 text-sm" />
          </FormField>

          <FormField label="Card Position #">
            <input type="number" min={1} value={draft.cardPosition} onChange={(e) => upd("cardPosition", +e.target.value)} className="w-full rounded-xl bg-card/60 border border-border px-3 py-2 text-sm" />
          </FormField>
          <FormField label="Card Gradient From">
            <input type="color" value={draft.gradFrom} onChange={(e) => upd("gradFrom", e.target.value)} className="h-10 w-full rounded-xl bg-card/60 border border-border cursor-pointer" />
          </FormField>
          <FormField label="Card Gradient To">
            <input type="color" value={draft.gradTo} onChange={(e) => upd("gradTo", e.target.value)} className="h-10 w-full rounded-xl bg-card/60 border border-border cursor-pointer" />
          </FormField>


          <FormField label="Badge Text">
            <input value={draft.badgeText} onChange={(e) => upd("badgeText", e.target.value)} placeholder="e.g. NEW, HOT, 2X" maxLength={12} className="w-full rounded-xl bg-card/60 border border-border px-3 py-2 text-sm" />
          </FormField>
          <FormField label="Badge Color">
            <input type="color" value={draft.badgeColor} onChange={(e) => upd("badgeColor", e.target.value)} className="h-10 w-full rounded-xl bg-card/60 border border-border cursor-pointer" />
          </FormField>

          <div className="md:col-span-2 grid grid-cols-2 gap-3">
            <ToggleRow label="Top Offer" v={draft.isTopOffer} onChange={() => upd("isTopOffer", !draft.isTopOffer)} />
            <ToggleRow label="Enabled" v={draft.enabled} onChange={() => upd("enabled", !draft.enabled)} />
          </div>

          <div className="md:col-span-2 rounded-2xl border border-border p-3 overflow-hidden">
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-2">Live card preview</div>
            <div className="relative h-24 rounded-xl flex items-center justify-center font-display font-bold text-lg" style={{ background: `linear-gradient(135deg, ${draft.gradFrom}, ${draft.gradTo})` }}>
              {draft.badgeText && (
                <span className="absolute top-2 right-2 rounded-full px-2 py-0.5 text-[10px] font-bold text-white shadow" style={{ background: draft.badgeColor }}>{draft.badgeText}</span>
              )}
              {draft.name || "Provider name"}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 p-5 border-t border-border sticky bottom-0 bg-card/80 backdrop-blur-xl">
          <button onClick={onClose} className="rounded-xl glass px-4 py-2 text-sm">Cancel</button>
          <button onClick={onClose} className="rounded-xl bg-gradient-primary px-5 py-2 text-sm font-semibold text-primary-foreground shadow-glow-primary">Save</button>
        </div>
      </div>
    </div>
  );
}

function FormField({ label, children, full }: { label: string; children: React.ReactNode; full?: boolean }) {
  return (
    <label className={`block ${full ? "md:col-span-2" : ""}`}>
      <span className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</span>
      <div className="mt-1.5">{children}</div>
    </label>
  );
}

function ToggleRow({ label, v, onChange }: { label: string; v: boolean; onChange: () => void }) {
  return (
    <div className="flex items-center justify-between rounded-2xl bg-card/60 border border-border p-3">
      <span className="text-sm font-medium">{label}</span>
      <Toggle checked={v} onChange={onChange} />
    </div>
  );
}
