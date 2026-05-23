import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { adminAPI } from "@/lib/api";
import { Plus, Trash2, ShieldAlert, Check, XCircle } from "lucide-react";

export const Route = createFileRoute("/_admin/admin/offer-pending")({
  head: () => ({ meta: [{ title: "Admin · Offer Pending Rules" }] }),
  component: OfferPendingPage,
});

function OfferPendingPage() {
  const qc = useQueryClient();
  const [keyword, setKeyword] = useState("");
  const [note, setNote] = useState("");
  const [page, setPage] = useState(1);

  const { data: rulesData } = useQuery({ queryKey: ["admin", "offer-pending", "rules"], queryFn: adminAPI.offerPendingRules });
  const { data: leadsData } = useQuery({ queryKey: ["admin", "offer-pending", "leads", page], queryFn: () => adminAPI.pendingLeads(page) });

  const rules: any[] = rulesData?.rules ?? [];
  const leads: any[] = leadsData?.leads ?? [];
  const pendingCount = leads.filter(l => l.status === "Pending").length;

  const addMut = useMutation({
    mutationFn: () => adminAPI.addOfferPendingRule({ keyword: keyword.trim(), note: note.trim() }),
    onSuccess: () => {
      toast.success("Rule added");
      qc.invalidateQueries({ queryKey: ["admin", "offer-pending", "rules"] });
      setKeyword(""); setNote("");
    },
    onError: (e: any) => toast.error(e?.response?.data?.message ?? "Add failed"),
  });

  const delMut = useMutation({
    mutationFn: (id: number) => adminAPI.deleteOfferPendingRule(id),
    onSuccess: () => { toast.success("Deleted"); qc.invalidateQueries({ queryKey: ["admin", "offer-pending", "rules"] }); },
    onError: (e: any) => toast.error(e?.response?.data?.message ?? "Delete failed"),
  });

  const decideMut = useMutation({
    mutationFn: ({ id, action }: { id: number; action: "approve" | "reject" }) => adminAPI.processPendingLead(id, { action }),
    onSuccess: () => {
      toast.success("Lead updated");
      qc.invalidateQueries({ queryKey: ["admin", "offer-pending", "leads"] });
      qc.invalidateQueries({ queryKey: ["admin"] });
    },
    onError: (e: any) => toast.error(e?.response?.data?.message ?? "Failed"),
  });

  const addRule = () => keyword.trim() && addMut.mutate();

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Admin"
        title="Offer Pending Rules"
        action={
          <span className="inline-flex items-center gap-2 rounded-full glass px-3 py-1.5 text-xs">
            <span className="h-2 w-2 rounded-full bg-warning shadow-[0_0_10px_oklch(0.78_0.16_88)]" />
            <span className="text-muted-foreground">Active rules</span>
            <span className="font-display font-bold tabular-nums">{rules.length}</span>
          </span>
        }
      />

      <div className="rounded-3xl glass shadow-card p-5">
        <div className="flex items-center gap-2 mb-4">
          <div className="h-9 w-9 rounded-xl bg-gradient-primary shadow-glow-primary flex items-center justify-center">
            <ShieldAlert className="h-4 w-4 text-primary-foreground" />
          </div>
          <div>
            <div className="font-display font-bold">Add Pending Rule</div>
            <div className="text-xs text-muted-foreground">Postbacks matching any keyword (case-insensitive) will be held for review.</div>
          </div>
        </div>

        <div className="grid md:grid-cols-[1fr_2fr_auto] gap-3">
          <label className="block">
            <span className="text-[10px] uppercase tracking-widest text-muted-foreground">Keyword</span>
            <input value={keyword} onChange={(e) => setKeyword(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addRule()} placeholder='e.g. "Survey", "GameApp", "TikTok"' className="mt-1.5 w-full rounded-xl bg-card/60 border border-border px-3 py-2 text-sm font-mono" />
          </label>
          <label className="block">
            <span className="text-[10px] uppercase tracking-widest text-muted-foreground">Note (optional)</span>
            <input value={note} onChange={(e) => setNote(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addRule()} placeholder="Why is this offer pending?" className="mt-1.5 w-full rounded-xl bg-card/60 border border-border px-3 py-2 text-sm" />
          </label>
          <div className="flex items-end">
            <button onClick={addRule} disabled={addMut.isPending} className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-glow-primary disabled:opacity-60">
              <Plus className="h-4 w-4" /> {addMut.isPending ? "…" : "Add Rule"}
            </button>
          </div>
        </div>
      </div>

      <div className="rounded-3xl glass shadow-card overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h3 className="font-display font-bold">Active Rules</h3>
          <span className="text-xs text-muted-foreground tabular-nums">{rules.length} rule{rules.length === 1 ? "" : "s"}</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-xs uppercase tracking-wider text-muted-foreground border-b border-border">
              <tr>
                {["#", "Keyword", "Note", "Created", "Actions"].map(c => (
                  <th key={c} className="text-left p-3 px-4 whitespace-nowrap">{c}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {rules.length === 0 && (
                <tr><td colSpan={5} className="p-10 text-center text-sm text-muted-foreground">No rules yet — every postback credits XP normally.</td></tr>
              )}
              {rules.map((r, i) => (
                <tr key={r.id} className="hover:bg-card/40">
                  <td className="p-3 px-4 text-muted-foreground tabular-nums">{i + 1}</td>
                  <td className="p-3"><span className="font-mono font-bold text-foreground">{r.keyword}</span></td>
                  <td className="p-3 text-muted-foreground">{r.note || <span className="opacity-50">—</span>}</td>
                  <td className="p-3 tabular-nums text-muted-foreground">{r.createdAt}</td>
                  <td className="p-3 px-4">
                    <button onClick={() => { if (confirm(`Delete rule "${r.keyword}"?`)) delMut.mutate(r.id); }} className="inline-flex items-center gap-1 rounded-lg bg-destructive/15 text-destructive hover:bg-destructive/25 px-2.5 py-1.5 text-xs">
                      <Trash2 className="h-3.5 w-3.5" /> Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="rounded-3xl glass shadow-card overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div>
            <h3 className="font-display font-bold">Pending Leads</h3>
            <p className="text-xs text-muted-foreground">Activities held for manual review. Approve to credit XP, reject to reverse.</p>
          </div>
          <span className="rounded-full bg-warning/15 text-warning ring-1 ring-warning/30 px-3 py-1 text-xs font-semibold tabular-nums">
            {pendingCount} pending
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-xs uppercase tracking-wider text-muted-foreground border-b border-border">
              <tr>
                {["User", "Offer Name", "Network", "XP", "Matched Keyword", "Date", "Status", "Actions"].map(c => (
                  <th key={c} className="text-left p-3 px-4 whitespace-nowrap">{c}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {leads.length === 0 && (
                <tr><td colSpan={8} className="p-10 text-center text-sm text-muted-foreground">No pending leads.</td></tr>
              )}
              {leads.map((l) => (
                <tr key={l.id} className="hover:bg-card/40">
                  <td className="p-3 px-4 font-medium">{l.user ?? l.username}</td>
                  <td className="p-3">{l.offerName}</td>
                  <td className="p-3 text-muted-foreground">{l.network}</td>
                  <td className="p-3 font-display font-bold text-gradient-xp tabular-nums">+{Number(l.xp).toLocaleString()}</td>
                  <td className="p-3"><span className="font-mono text-xs rounded-md bg-card/60 border border-border px-2 py-0.5">{l.matched ?? l.matchedKeyword}</span></td>
                  <td className="p-3 tabular-nums text-muted-foreground whitespace-nowrap">{l.date ?? l.createdAt}</td>
                  <td className="p-3"><StatusBadge status={l.status} /></td>
                  <td className="p-3 px-4">
                    {l.status === "Pending" ? (
                      <div className="inline-flex gap-1">
                        <button onClick={() => decideMut.mutate({ id: l.id, action: "approve" })} disabled={decideMut.isPending} className="inline-flex items-center gap-1 rounded-lg bg-success/15 text-success hover:bg-success/25 px-2.5 py-1.5 text-xs font-semibold disabled:opacity-60">
                          <Check className="h-3.5 w-3.5" /> Approve
                        </button>
                        <button onClick={() => decideMut.mutate({ id: l.id, action: "reject" })} disabled={decideMut.isPending} className="inline-flex items-center gap-1 rounded-lg bg-destructive/15 text-destructive hover:bg-destructive/25 px-2.5 py-1.5 text-xs font-semibold disabled:opacity-60">
                          <XCircle className="h-3.5 w-3.5" /> Reject
                        </button>
                      </div>
                    ) : (
                      <span className="text-xs text-muted-foreground">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex justify-end gap-1 p-3 border-t border-border">
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page <= 1} className="rounded-lg glass px-3 py-1 text-xs disabled:opacity-40">‹ Prev</button>
          <span className="rounded-lg bg-gradient-primary text-primary-foreground px-3 py-1 text-xs">{page}</span>
          <button onClick={() => setPage(p => p + 1)} disabled={leads.length < 50} className="rounded-lg glass px-3 py-1 text-xs disabled:opacity-40">Next ›</button>
        </div>
      </div>
    </div>
  );
}
