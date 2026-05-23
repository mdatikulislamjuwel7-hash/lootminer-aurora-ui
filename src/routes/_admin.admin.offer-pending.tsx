import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { Plus, Trash2, X, ShieldAlert, Check, XCircle } from "lucide-react";

export const Route = createFileRoute("/_admin/admin/offer-pending")({
  head: () => ({ meta: [{ title: "Admin · Offer Pending Rules" }] }),
  component: OfferPendingPage,
});

type Rule = { id: string; keyword: string; note: string; createdAt: string };
type PendingLead = {
  id: string; user: string; offerName: string; network: string;
  xp: number; matched: string; date: string; status: "Pending" | "Valid" | "Reversed";
};

const seedRules: Rule[] = [
  { id: "r1", keyword: "Survey", note: "Manual review for survey completions", createdAt: "2026-05-12" },
  { id: "r2", keyword: "GameApp", note: "High fraud rate — verify install", createdAt: "2026-05-15" },
  { id: "r3", keyword: "TikTok", note: "Wait 48h for advertiser confirm", createdAt: "2026-05-18" },
];

const seedLeads: PendingLead[] = [
  { id: "l1", user: "alex.j@mail.com", offerName: "Quick Survey Pro", network: "BitLabs", xp: 1200, matched: "Survey", date: "2026-05-22 14:02", status: "Pending" },
  { id: "l2", user: "miya88", offerName: "GameApp – Reach Level 10", network: "AdGate", xp: 8500, matched: "GameApp", date: "2026-05-22 11:48", status: "Pending" },
  { id: "l3", user: "rkhan", offerName: "TikTok Install + Watch 60s", network: "OfferToro", xp: 600, matched: "TikTok", date: "2026-05-22 09:11", status: "Pending" },
  { id: "l4", user: "lina_c", offerName: "Daily Survey Burst", network: "TheoremReach", xp: 450, matched: "Survey", date: "2026-05-21 22:35", status: "Pending" },
];

function OfferPendingPage() {
  const [rules, setRules] = useState<Rule[]>(seedRules);
  const [leads, setLeads] = useState<PendingLead[]>(seedLeads);
  const [keyword, setKeyword] = useState("");
  const [note, setNote] = useState("");
  const [confirmDelete, setConfirmDelete] = useState<Rule | null>(null);

  const activeCount = rules.length;
  const pendingCount = useMemo(() => leads.filter(l => l.status === "Pending").length, [leads]);

  const addRule = () => {
    const k = keyword.trim();
    if (!k) return;
    setRules([{ id: crypto.randomUUID(), keyword: k, note: note.trim(), createdAt: new Date().toISOString().slice(0, 10) }, ...rules]);
    setKeyword(""); setNote("");
  };

  const decide = (id: string, action: "approve" | "reject") => {
    setLeads(prev => prev.map(l => l.id === id ? { ...l, status: action === "approve" ? "Valid" : "Reversed" } : l));
  };

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Admin"
        title="Offer Pending Rules"
        action={
          <span className="inline-flex items-center gap-2 rounded-full glass px-3 py-1.5 text-xs">
            <span className="h-2 w-2 rounded-full bg-warning shadow-[0_0_10px_oklch(0.78_0.16_88)]" />
            <span className="text-muted-foreground">Active rules</span>
            <span className="font-display font-bold tabular-nums">{activeCount}</span>
          </span>
        }
      />

      {/* Add Rule Card */}
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
            <input
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addRule()}
              placeholder='e.g. "Survey", "GameApp", "TikTok"'
              className="mt-1.5 w-full rounded-xl bg-card/60 border border-border px-3 py-2 text-sm font-mono"
            />
          </label>
          <label className="block">
            <span className="text-[10px] uppercase tracking-widest text-muted-foreground">Note (optional)</span>
            <input
              value={note}
              onChange={(e) => setNote(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addRule()}
              placeholder="Why is this offer pending?"
              className="mt-1.5 w-full rounded-xl bg-card/60 border border-border px-3 py-2 text-sm"
            />
          </label>
          <div className="flex items-end">
            <button onClick={addRule} className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-glow-primary">
              <Plus className="h-4 w-4" /> Add Rule
            </button>
          </div>
        </div>
      </div>

      {/* Rules Table */}
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
                    <button onClick={() => setConfirmDelete(r)} className="inline-flex items-center gap-1 rounded-lg bg-destructive/15 text-destructive hover:bg-destructive/25 px-2.5 py-1.5 text-xs">
                      <Trash2 className="h-3.5 w-3.5" /> Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pending Leads */}
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
                  <td className="p-3 px-4 font-medium">{l.user}</td>
                  <td className="p-3">{l.offerName}</td>
                  <td className="p-3 text-muted-foreground">{l.network}</td>
                  <td className="p-3 font-display font-bold text-gradient-xp tabular-nums">+{l.xp.toLocaleString()}</td>
                  <td className="p-3"><span className="font-mono text-xs rounded-md bg-card/60 border border-border px-2 py-0.5">{l.matched}</span></td>
                  <td className="p-3 tabular-nums text-muted-foreground whitespace-nowrap">{l.date}</td>
                  <td className="p-3"><StatusBadge status={l.status} /></td>
                  <td className="p-3 px-4">
                    {l.status === "Pending" ? (
                      <div className="inline-flex gap-1">
                        <button onClick={() => decide(l.id, "approve")} className="inline-flex items-center gap-1 rounded-lg bg-success/15 text-success hover:bg-success/25 px-2.5 py-1.5 text-xs font-semibold">
                          <Check className="h-3.5 w-3.5" /> Approve
                        </button>
                        <button onClick={() => decide(l.id, "reject")} className="inline-flex items-center gap-1 rounded-lg bg-destructive/15 text-destructive hover:bg-destructive/25 px-2.5 py-1.5 text-xs font-semibold">
                          <XCircle className="h-3.5 w-3.5" /> Reject
                        </button>
                      </div>
                    ) : (
                      <span className="text-xs text-muted-foreground">Resolved</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <button onClick={() => setConfirmDelete(null)} className="absolute inset-0 bg-background/70 backdrop-blur-md" />
          <div className="relative w-full max-w-md rounded-3xl glass shadow-card p-5 animate-page-in">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-display font-bold">Delete rule?</h4>
              <button onClick={() => setConfirmDelete(null)} className="rounded-lg bg-card/60 hover:bg-card p-1.5"><X className="h-4 w-4" /></button>
            </div>
            <p className="text-sm text-muted-foreground">
              The keyword <span className="font-mono font-bold text-foreground">{confirmDelete.keyword}</span> will no longer hold matching postbacks. Existing pending leads remain unchanged.
            </p>
            <div className="flex justify-end gap-2 mt-5">
              <button onClick={() => setConfirmDelete(null)} className="rounded-xl glass px-4 py-2 text-sm">Cancel</button>
              <button
                onClick={() => { setRules(rules.filter(r => r.id !== confirmDelete.id)); setConfirmDelete(null); }}
                className="rounded-xl bg-destructive text-destructive-foreground px-5 py-2 text-sm font-semibold"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
