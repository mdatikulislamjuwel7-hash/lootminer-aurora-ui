import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { PageHeader } from "@/components/common/PageHeader";
import { Toggle } from "@/components/admin/StatusBadge";
import { adminAPI } from "@/lib/api";
import { Pencil, Trash2, Plus, X, Flame } from "lucide-react";

export const Route = createFileRoute("/_admin/admin/offerwalls")({
  head: () => ({ meta: [{ title: "Admin · Offerwalls" }] }),
  component: OfferwallsPage,
});

type Draft = {
  id?: number;
  name: string; slug: string; type: "offerwall" | "survey";
  logoUrl: string; logoBg: string; logoSize: number;
  iframeUrl: string;
  gradFrom: string; gradTo: string;
  isTopOffer: boolean; enabled: boolean; sortOrder: number;
  cardPosition: number; badgeText: string; badgeColor: string;
};

const emptyDraft: Draft = {
  name: "", slug: "", type: "offerwall",
  logoUrl: "", logoBg: "#0ea5e9", logoSize: 40,
  iframeUrl: "",
  gradFrom: "#22d3ee", gradTo: "#6366f1",
  isTopOffer: false, enabled: true, sortOrder: 0,
  cardPosition: 1, badgeText: "", badgeColor: "#f59e0b",
};

function OfferwallsPage() {
  const qc = useQueryClient();
  const [modal, setModal] = useState<Draft | null>(null);

  const { data: ow } = useQuery({ queryKey: ["admin", "offerwalls"], queryFn: adminAPI.offerwalls });
  const { data: sv } = useQuery({ queryKey: ["admin", "surveys"], queryFn: adminAPI.surveys });
  const all: any[] = [...(ow?.offerwalls ?? []), ...(sv?.surveys ?? [])];

  const saveMut = useMutation({
    mutationFn: (d: Draft) => {
      const api = d.type === "survey"
        ? (d.id ? adminAPI.editSurvey(d.id, d) : adminAPI.createSurvey(d))
        : (d.id ? adminAPI.editOfferwall(d.id, d) : adminAPI.createOfferwall(d));
      return api;
    },
    onSuccess: () => {
      toast.success("Provider saved");
      qc.invalidateQueries({ queryKey: ["admin", "offerwalls"] });
      qc.invalidateQueries({ queryKey: ["admin", "surveys"] });
      setModal(null);
    },
    onError: (e: any) => toast.error(e?.response?.data?.message ?? "Save failed"),
  });

  const delMut = useMutation({
    mutationFn: ({ id, type }: { id: number; type: string }) => type === "survey" ? adminAPI.deleteSurvey(id) : adminAPI.deleteOfferwall(id),
    onSuccess: () => {
      toast.success("Deleted");
      qc.invalidateQueries({ queryKey: ["admin", "offerwalls"] });
      qc.invalidateQueries({ queryKey: ["admin", "surveys"] });
    },
    onError: (e: any) => toast.error(e?.response?.data?.message ?? "Delete failed"),
  });

  const toggleEnabled = (p: any) => {
    if (p.type === "survey") adminAPI.editSurvey(p.id, { enabled: !p.enabled }).then(() => qc.invalidateQueries({ queryKey: ["admin", "surveys"] }));
    else adminAPI.editOfferwall(p.id, { enabled: !p.enabled }).then(() => qc.invalidateQueries({ queryKey: ["admin", "offerwalls"] }));
  };
  const toggleTop = (p: any) => {
    if (p.type === "survey") adminAPI.editSurvey(p.id, { isTopOffer: !p.isTopOffer }).then(() => qc.invalidateQueries({ queryKey: ["admin", "surveys"] }));
    else adminAPI.editOfferwall(p.id, { isTopOffer: !p.isTopOffer }).then(() => qc.invalidateQueries({ queryKey: ["admin", "offerwalls"] }));
  };

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
              {all.map((p, i) => (
                <tr key={`${p.type}-${p.id}`} className="hover:bg-card/40">
                  <td className="p-3 px-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-border shadow-card overflow-hidden" style={{ background: p.logoBg ?? "transparent" }}>
                      {p.logoUrl ? <img src={p.logoUrl} alt="" className="h-full w-full object-cover" /> : <Flame className="h-5 w-5 text-foreground" />}
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="font-medium">{p.name}</div>
                    <div className="font-mono text-[10px] text-muted-foreground">{p.slug}</div>
                  </td>
                  <td className="p-3">
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${p.type === "survey" ? "bg-violet-500/15 text-violet-300 ring-1 ring-violet-400/30" : "bg-cyan-500/15 text-cyan-300 ring-1 ring-cyan-400/30"}`}>{p.type}</span>
                  </td>
                  <td className="p-3"><Toggle checked={!!p.enabled} onChange={() => toggleEnabled(p)} /></td>
                  <td className="p-3"><Toggle checked={!!p.isTopOffer} onChange={() => toggleTop(p)} /></td>
                  <td className="p-3 tabular-nums text-muted-foreground">{p.sortOrder ?? i + 1}</td>
                  <td className="p-3 px-4">
                    <div className="inline-flex gap-1">
                      <button onClick={() => setModal({ ...emptyDraft, ...p })} className="rounded-lg bg-card/60 hover:bg-card p-1.5"><Pencil className="h-3.5 w-3.5" /></button>
                      <button onClick={() => { if (confirm(`Delete ${p.name}?`)) delMut.mutate({ id: p.id, type: p.type }); }} className="rounded-lg bg-destructive/15 text-destructive hover:bg-destructive/25 p-1.5"><Trash2 className="h-3.5 w-3.5" /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {all.length === 0 && <tr><td colSpan={7} className="p-6 text-center text-sm text-muted-foreground">No providers yet.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      {modal && <ProviderModal draft={modal} onChange={setModal} onClose={() => setModal(null)} onSave={() => saveMut.mutate(modal)} saving={saveMut.isPending} />}
    </div>
  );
}

function ProviderModal({ draft, onChange, onClose, onSave, saving }: { draft: Draft; onChange: (d: Draft) => void; onClose: () => void; onSave: () => void; saving: boolean }) {
  const upd = <K extends keyof Draft>(k: K, v: Draft[K]) => onChange({ ...draft, [k]: v });
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button onClick={onClose} className="absolute inset-0 bg-background/70 backdrop-blur-md" />
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl glass shadow-card animate-page-in">
        <div className="flex items-center justify-between p-5 border-b border-border sticky top-0 bg-card/80 backdrop-blur-xl">
          <h3 className="font-display text-lg font-bold">{draft.id ? "Edit Provider" : "Add Provider"}</h3>
          <button onClick={onClose} className="rounded-lg bg-card/60 hover:bg-card p-1.5"><X className="h-4 w-4" /></button>
        </div>

        <div className="p-5 grid md:grid-cols-2 gap-4">
          <FormField label="Name">
            <input value={draft.name} onChange={(e) => { const v = e.target.value; onChange({ ...draft, name: v, slug: draft.slug || v.toLowerCase().replace(/\s+/g, "-") }); }} className="w-full rounded-xl bg-card/60 border border-border px-3 py-2 text-sm" />
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

          <label className="md:col-span-2 flex items-center justify-between rounded-2xl bg-card/60 border border-border p-3">
            <span className="text-sm font-medium">Enabled</span>
            <Toggle checked={draft.enabled} onChange={() => upd("enabled", !draft.enabled)} />
          </label>
          <label className="md:col-span-2 flex items-center justify-between rounded-2xl bg-card/60 border border-border p-3">
            <span className="text-sm font-medium">Top Offer</span>
            <Toggle checked={draft.isTopOffer} onChange={() => upd("isTopOffer", !draft.isTopOffer)} />
          </label>
        </div>

        <div className="flex justify-end gap-2 p-5 border-t border-border sticky bottom-0 bg-card/80 backdrop-blur-xl">
          <button onClick={onClose} className="rounded-xl glass px-4 py-2 text-sm">Cancel</button>
          <button onClick={onSave} disabled={saving} className="rounded-xl bg-gradient-primary px-5 py-2 text-sm font-semibold text-primary-foreground shadow-glow-primary disabled:opacity-60">{saving ? "Saving…" : "Save"}</button>
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
