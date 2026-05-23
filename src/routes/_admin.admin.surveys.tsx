import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { Toggle } from "@/components/admin/StatusBadge";
import { mockSurveys } from "@/data/mock";
import { Pencil, Trash2, Plus, X, Flame } from "lucide-react";

export const Route = createFileRoute("/_admin/admin/surveys")({
  head: () => ({ meta: [{ title: "Admin · Survey Partners" }] }),
  component: SurveysPage,
});

type Draft = {
  name: string; slug: string;
  logoUrl: string; logoBg: string; logoSize: number;
  iframeUrl: string;
  gradFrom: string; gradTo: string;
  isTopOffer: boolean; enabled: boolean; sortOrder: number;
  cardPosition: number;
};

const emptyDraft: Draft = {
  name: "", slug: "",
  logoUrl: "", logoBg: "#7c3aed", logoSize: 40,
  iframeUrl: "",
  gradFrom: "#a855f7", gradTo: "#6366f1",
  isTopOffer: false, enabled: true, sortOrder: 0,
  cardPosition: 1,
};

function SurveysPage() {
  const [modal, setModal] = useState<Draft | null>(null);
  const all = mockSurveys;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Admin"
        title="Survey Partners"
        action={
          <button onClick={() => setModal({ ...emptyDraft })} className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-glow-primary">
            <Plus className="h-4 w-4" /> Add Survey Partner
          </button>
        }
      />

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {all.map((p, i) => {
          const Icon = p.icon;
          return (
            <div key={p.id} className="relative overflow-hidden rounded-3xl glass p-5 shadow-card">
              <div className={`absolute inset-0 bg-gradient-to-br ${p.gradient} opacity-40 pointer-events-none`} />
              <div className="relative flex items-start justify-between">
                <div className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${p.gradient} border border-border shadow-card`}>
                  <Icon className="h-6 w-6" />
                </div>
                <Toggle checked={p.enabled} />
              </div>
              <div className="relative mt-4">
                <div className="font-display text-lg font-bold">{p.name}</div>
                <div className="font-mono text-[10px] text-muted-foreground">{p.slug}</div>
                <div className="mt-2 flex items-center gap-2 text-[10px] uppercase tracking-widest">
                  <span className="rounded-full px-2 py-0.5 bg-violet-500/15 text-violet-300 ring-1 ring-violet-400/30">Survey</span>
                  <span className="text-muted-foreground">Sort #{i + 1}</span>
                </div>
                <div className="mt-4 flex gap-1.5">
                  <button onClick={() => setModal({ ...emptyDraft, name: p.name, slug: p.slug, iframeUrl: p.iframeUrl, isTopOffer: !!p.isTopOffer, enabled: p.enabled })} className="inline-flex items-center gap-1 rounded-xl glass px-3 py-1.5 text-xs">
                    <Pencil className="h-3 w-3" /> Edit
                  </button>
                  <button className="inline-flex items-center gap-1 rounded-xl bg-destructive/15 text-destructive px-3 py-1.5 text-xs">
                    <Trash2 className="h-3 w-3" /> Delete
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {modal && <SurveyModal draft={modal} onChange={setModal} onClose={() => setModal(null)} />}
    </div>
  );
}

function SurveyModal({ draft, onChange, onClose }: { draft: Draft; onChange: (d: Draft) => void; onClose: () => void }) {
  const upd = <K extends keyof Draft>(k: K, v: Draft[K]) => onChange({ ...draft, [k]: v });
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button onClick={onClose} className="absolute inset-0 bg-background/70 backdrop-blur-md" />
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl glass shadow-card animate-page-in">
        <div className="flex items-center justify-between p-5 border-b border-border sticky top-0 bg-card/80 backdrop-blur-xl">
          <h3 className="font-display text-lg font-bold">{draft.name ? "Edit Survey Partner" : "Add Survey Partner"}</h3>
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
            <input value="Survey" readOnly className="w-full rounded-xl bg-card/40 border border-border px-3 py-2 text-sm text-muted-foreground" />
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

          <div className="md:col-span-2 grid grid-cols-2 gap-3">
            <ToggleRow label="Top Offer" v={draft.isTopOffer} onChange={() => upd("isTopOffer", !draft.isTopOffer)} />
            <ToggleRow label="Enabled" v={draft.enabled} onChange={() => upd("enabled", !draft.enabled)} />
          </div>

          <div className="md:col-span-2 rounded-2xl border border-border p-3 overflow-hidden">
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-2">Live card preview</div>
            <div className="h-24 rounded-xl flex items-center justify-center font-display font-bold text-lg" style={{ background: `linear-gradient(135deg, ${draft.gradFrom}, ${draft.gradTo})` }}>
              {draft.name || "Survey partner name"}
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
