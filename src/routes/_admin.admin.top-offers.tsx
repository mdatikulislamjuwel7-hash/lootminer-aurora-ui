import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { mockTopOffers, mockOfferwalls, mockSurveys } from "@/data/mock";
import { Pencil, Trash2, Plus, X, Flame } from "lucide-react";

export const Route = createFileRoute("/_admin/admin/top-offers")({
  head: () => ({ meta: [{ title: "Admin · Top Offers" }] }),
  component: TopOffersPage,
});

type Draft = {
  title: string;
  provider: string;
  description: string;
  url: string;
  logoUrl: string;
  xp: number;
  featured: boolean;
};

const emptyDraft: Draft = {
  title: "", provider: "", description: "", url: "", logoUrl: "", xp: 1000, featured: false,
};

function TopOffersPage() {
  const [modal, setModal] = useState<Draft | null>(null);
  const partners = [...mockOfferwalls, ...mockSurveys];

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Admin" title="Top Offers" action={
        <button onClick={() => setModal({ ...emptyDraft })} className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-glow-primary">
          <Plus className="h-4 w-4" /> Add Offer
        </button>
      } />

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {mockTopOffers.map(o => {
          const Icon = o.icon;
          return (
            <div key={o.id} className="relative overflow-hidden rounded-3xl glass p-5 shadow-card">
              <div className={`absolute inset-0 bg-gradient-to-br ${o.gradient} opacity-40 pointer-events-none`} />
              <div className="relative flex items-start justify-between">
                <div className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${o.gradient} border border-border shadow-card`}>
                  <Icon className="h-6 w-6" />
                </div>
                {o.featured && <span className="rounded-full bg-destructive/20 text-destructive ring-1 ring-destructive/40 text-[10px] font-bold px-2 py-0.5">HOT</span>}
              </div>
              <div className="relative mt-4 space-y-2">
                <div className="font-display text-lg font-bold leading-tight">{o.title}</div>
                <div className="text-xs text-muted-foreground line-clamp-2">{o.description}</div>
                <div className="flex items-center justify-between pt-1">
                  <span className="rounded-full bg-card/70 border border-border px-2 py-0.5 text-[10px] font-semibold">{o.provider}</span>
                  <span className="font-display text-sm font-bold text-gradient-xp tabular-nums">+{o.xp.toLocaleString()} XP</span>
                </div>
                <div className="flex gap-1.5 pt-3">
                  <button onClick={() => setModal({ title: o.title, provider: o.provider, description: o.description, url: o.url, logoUrl: "", xp: o.xp, featured: !!o.featured })} className="inline-flex items-center gap-1 rounded-xl glass px-3 py-1.5 text-xs"><Pencil className="h-3 w-3" /> Edit</button>
                  <button className="inline-flex items-center gap-1 rounded-xl bg-destructive/15 text-destructive px-3 py-1.5 text-xs"><Trash2 className="h-3 w-3" /> Delete</button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {modal && <OfferModal draft={modal} onChange={setModal} onClose={() => setModal(null)} partners={partners.map(p => p.name)} />}
    </div>
  );
}

function OfferModal({ draft, onChange, onClose, partners }: { draft: Draft; onChange: (d: Draft) => void; onClose: () => void; partners: string[] }) {
  const upd = <K extends keyof Draft>(k: K, v: Draft[K]) => onChange({ ...draft, [k]: v });
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button onClick={onClose} className="absolute inset-0 bg-background/70 backdrop-blur-md" />
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl glass shadow-card animate-page-in">
        <div className="flex items-center justify-between p-5 border-b border-border sticky top-0 bg-card/80 backdrop-blur-xl">
          <h3 className="font-display text-lg font-bold">{draft.title ? "Edit Top Offer" : "Add Top Offer"}</h3>
          <button onClick={onClose} className="rounded-lg bg-card/60 hover:bg-card p-1.5"><X className="h-4 w-4" /></button>
        </div>

        <div className="p-5 grid md:grid-cols-2 gap-4">
          <Field label="Title" full>
            <input value={draft.title} onChange={(e) => upd("title", e.target.value)} className="w-full rounded-xl bg-card/60 border border-border px-3 py-2 text-sm" />
          </Field>
          <Field label="Source Provider">
            <select value={draft.provider} onChange={(e) => upd("provider", e.target.value)} className="w-full rounded-xl bg-card/60 border border-border px-3 py-2 text-sm">
              <option value="">Select provider…</option>
              {partners.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </Field>
          <Field label="XP Reward">
            <input type="number" value={draft.xp} onChange={(e) => upd("xp", +e.target.value)} className="w-full rounded-xl bg-card/60 border border-border px-3 py-2 text-sm tabular-nums" />
          </Field>

          <Field label="Offer Logo URL" full>
            <div className="flex gap-2">
              <input value={draft.logoUrl} onChange={(e) => upd("logoUrl", e.target.value)} placeholder="https://…/logo.png" className="flex-1 rounded-xl bg-card/60 border border-border px-3 py-2 text-sm" />
              <div className="h-10 w-10 rounded-full border border-border bg-card/60 shrink-0 flex items-center justify-center overflow-hidden">
                {draft.logoUrl ? <img src={draft.logoUrl} alt="" className="h-full w-full object-cover" /> : <Flame className="h-4 w-4 text-muted-foreground" />}
              </div>
            </div>
          </Field>

          <Field label="Upload Logo" full>
            <label className="flex items-center gap-2 cursor-pointer rounded-xl bg-card/60 border border-dashed border-border px-3 py-2 text-sm hover:bg-card">
              <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                const f = e.target.files?.[0]; if (!f) return;
                const r = new FileReader(); r.onload = () => upd("logoUrl", String(r.result)); r.readAsDataURL(f);
              }} />
              <span className="text-muted-foreground">Choose image file (PNG, JPG, SVG)…</span>
            </label>
          </Field>

          <Field label="Offer URL" full>
            <input value={draft.url} onChange={(e) => upd("url", e.target.value)} placeholder="https://…" className="w-full rounded-xl bg-card/60 border border-border px-3 py-2 text-sm" />
          </Field>

          <Field label="Description" full>
            <textarea value={draft.description} onChange={(e) => upd("description", e.target.value)} rows={3} className="w-full rounded-xl bg-card/60 border border-border px-3 py-2 text-sm resize-none" />
          </Field>

          <label className="md:col-span-2 flex items-center justify-between rounded-2xl bg-card/60 border border-border p-3">
            <span className="text-sm font-medium">Featured (HOT badge)</span>
            <input type="checkbox" checked={draft.featured} onChange={(e) => upd("featured", e.target.checked)} className="h-5 w-5 accent-primary" />
          </label>
        </div>

        <div className="flex justify-end gap-2 p-5 border-t border-border sticky bottom-0 bg-card/80 backdrop-blur-xl">
          <button onClick={onClose} className="rounded-xl glass px-4 py-2 text-sm">Cancel</button>
          <button onClick={onClose} className="rounded-xl bg-gradient-primary px-5 py-2 text-sm font-semibold text-primary-foreground shadow-glow-primary">Save</button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children, full }: { label: string; children: React.ReactNode; full?: boolean }) {
  return (
    <label className={`block ${full ? "md:col-span-2" : ""}`}>
      <span className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</span>
      <div className="mt-1.5">{children}</div>
    </label>
  );
}
