import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { PageHeader } from "@/components/common/PageHeader";
import { cashoutAPI, publicAPI } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import type { ApiCashout, ApiPaymentMethod } from "@/lib/types";
import { SkeletonCard, EmptyState } from "@/components/common/SkeletonCard";
import { Wallet } from "lucide-react";

export const Route = createFileRoute("/_app/cashout")({
  head: () => ({ meta: [{ title: "Cashout — LootMiner" }] }),
  component: Cashout,
});

function Cashout() {
  const qc = useQueryClient();
  const { user } = useAuth();
  const balanceXp = user?.balanceXp ?? 0;

  const methodsQ = useQuery({ queryKey: ["cashout-methods"], queryFn: cashoutAPI.methods });
  const historyQ = useQuery({ queryKey: ["cashout-history"], queryFn: () => cashoutAPI.history(1) });
  const settingsQ = useQuery({ queryKey: ["public-settings"], queryFn: publicAPI.settings });

  const methods: ApiPaymentMethod[] = methodsQ.data?.methods ?? methodsQ.data ?? [];
  const history: ApiCashout[] = historyQ.data?.cashouts ?? historyQ.data ?? [];
  const xpPerUsd: number = settingsQ.data?.xpPerUsd ?? 1000;

  const [selected, setSelected] = useState<string | number | null>(null);
  const [xp, setXp] = useState(1000);
  const [account, setAccount] = useState("");

  useEffect(() => {
    if (selected == null && methods.length) {
      setSelected(methods[0].id);
      setXp(Math.max(1000, methods[0].min));
    }
  }, [methods, selected]);

  const method = methods.find((m) => m.id === selected);
  const usd = (xp / xpPerUsd).toFixed(2);

  const submit = useMutation({
    mutationFn: (payload: { paymentMethodId: string | number; xp: number; account: string }) => cashoutAPI.submit(payload),
    onSuccess: () => {
      toast.success("Cashout submitted");
      setAccount("");
      qc.invalidateQueries({ queryKey: ["cashout-history"] });
    },
    onError: (e: any) => toast.error(e?.response?.data?.message || "Cashout failed"),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!method) return toast.error("Pick a payment method");
    if (!account.trim()) return toast.error("Account / address required");
    if (xp < method.min) return toast.error(`Minimum ${method.min} XP`);
    if (xp > balanceXp) return toast.error("Insufficient balance");
    submit.mutate({ paymentMethodId: method.id, xp, account });
  };

  return (
    <div className="space-y-8">
      <PageHeader eyebrow="Withdraw" title="Cashout" subtitle="Convert XP to real money. Instant on most methods." />

      <div className="relative overflow-hidden rounded-3xl glass p-6 md:p-8 shadow-card">
        <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-gradient-xp opacity-30 blur-3xl animate-glow-pulse" />
        <div className="relative">
          <div className="text-xs uppercase tracking-widest text-muted-foreground">Available XP</div>
          <div className="mt-2 font-display text-6xl font-bold tabular-nums text-gradient-xp">{balanceXp.toLocaleString()}</div>
          <p className="mt-1 text-sm text-muted-foreground">≈ ${(balanceXp / xpPerUsd).toFixed(2)} USD</p>
        </div>
      </div>

      {methodsQ.isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} className="h-28" />)}
        </div>
      ) : methods.length === 0 ? (
        <EmptyState title="No payment methods available" />
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {methods.map((m) => {
            const active = selected === m.id;
            return (
              <button key={m.id} onClick={() => { setSelected(m.id); setXp(Math.max(m.min, xp)); }}
                className={`relative overflow-hidden rounded-2xl glass p-4 text-left shadow-card transition ${active ? "ring-2 ring-primary shadow-glow-primary" : "hover:bg-card"}`}>
                <div className="relative">
                  {m.iconUrl
                    ? <img src={m.iconUrl} alt={m.name} className="h-6 w-6 object-contain" />
                    : <Wallet className="h-6 w-6" />}
                  <div className="mt-3 font-display font-semibold">{m.name}</div>
                  <div className="mt-0.5 text-[10px] text-muted-foreground">Min {m.min} XP · {m.time ?? "—"}</div>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {method && (
        <form onSubmit={handleSubmit} className="rounded-3xl glass p-6 shadow-card">
          <h2 className="font-display text-xl font-bold">Withdraw to {method.name}</h2>
          <div className="mt-4 grid md:grid-cols-2 gap-4">
            <label className="block">
              <span className="text-xs uppercase tracking-widest text-muted-foreground">Account / Address</span>
              <input value={account} onChange={(e) => setAccount(e.target.value)} placeholder="you@mail.com or wallet address" className="mt-1.5 w-full rounded-xl bg-card/60 border border-border px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary" />
            </label>
            <label className="block">
              <span className="text-xs uppercase tracking-widest text-muted-foreground">XP Amount</span>
              <input type="number" value={xp} min={method.min} onChange={(e) => setXp(Math.max(method.min, +e.target.value || 0))} className="mt-1.5 w-full rounded-xl bg-card/60 border border-border px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary" />
            </label>
            <div className="md:col-span-2">
              <input type="range" min={method.min} max={Math.max(method.min, balanceXp)} step={100} value={xp} onChange={(e) => setXp(+e.target.value)} className="w-full accent-primary" />
              <div className="mt-2 flex items-center justify-between text-sm">
                <span className="text-muted-foreground">USD estimate</span>
                <span className="font-display text-2xl font-bold text-gradient-primary">${usd}</span>
              </div>
            </div>
          </div>
          <button type="submit" disabled={submit.isPending} className="mt-5 w-full md:w-auto rounded-xl bg-gradient-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-glow-primary disabled:opacity-60">
            {submit.isPending ? "Submitting…" : "Submit Withdrawal"}
          </button>
        </form>
      )}

      <div className="rounded-3xl glass shadow-card overflow-hidden">
        <div className="p-5 font-display text-xl font-bold">Cashout History</div>
        {historyQ.isLoading ? (
          <div className="p-5"><SkeletonCard className="h-32" /></div>
        ) : history.length === 0 ? (
          <div className="px-5 pb-5 text-sm text-muted-foreground">No withdrawals yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-xs uppercase tracking-wider text-muted-foreground border-y border-border">
                <tr>
                  <th className="text-left p-3 px-5">Method</th>
                  <th className="text-right p-3">XP</th>
                  <th className="text-right p-3">USD</th>
                  <th className="text-center p-3">Status</th>
                  <th className="text-right p-3 px-5">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {history.map((c) => (
                  <tr key={c.id} className="hover:bg-card/40 transition">
                    <td className="p-3 px-5 font-medium">{c.method}</td>
                    <td className="p-3 text-right tabular-nums">{c.xp.toLocaleString()}</td>
                    <td className="p-3 text-right tabular-nums">${Number(c.usd).toFixed(2)}</td>
                    <td className="p-3 text-center">
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                        c.status === "Approved" ? "bg-success/15 text-success" :
                        c.status === "Pending" ? "bg-warning/15 text-warning" :
                        "bg-destructive/15 text-destructive"
                      }`}>{c.status}</span>
                    </td>
                    <td className="p-3 px-5 text-right text-muted-foreground">{c.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
