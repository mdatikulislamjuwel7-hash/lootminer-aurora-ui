import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { PageHeader } from "@/components/common/PageHeader";
import { referralsAPI } from "@/lib/api";
import { Copy, Users, Sparkles, Clock, Share2 } from "lucide-react";

export const Route = createFileRoute("/_app/referrals")({
  head: () => ({ meta: [{ title: "Referrals — LootMiner" }] }),
  component: Referrals,
});

function Referrals() {
  const { data } = useQuery({ queryKey: ["referrals"], queryFn: referralsAPI.get });

  const code = data?.referralCode ?? "";
  const link = code
    ? `${typeof window !== "undefined" ? window.location.origin : ""}/?ref=${code}`
    : "";

  const stats = [
    { icon: Users, label: "Total Referrals", value: data?.stats?.total ?? 0 },
    { icon: Sparkles, label: "XP Earned", value: data?.stats?.xpEarned ?? 0 },
    { icon: Clock, label: "Pending", value: data?.stats?.pending ?? 0 },
  ];

  const referrals: any[] = data?.referrals ?? [];

  const copy = async () => {
    if (!link) return;
    try {
      await navigator.clipboard.writeText(link);
      toast.success("Link copied");
    } catch {
      toast.error("Could not copy");
    }
  };

  const share = async () => {
    if (!link) return;
    if (navigator.share) {
      try { await navigator.share({ url: link, title: "Join me on LootMiner" }); } catch {}
    } else {
      copy();
    }
  };

  return (
    <div className="space-y-8">
      <PageHeader eyebrow="Invite" title="Refer friends, earn XP forever" subtitle="Earn 10% of every friend's XP — for life." />

      <div className="grid grid-cols-3 gap-3 md:gap-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl glass p-4 md:p-5 shadow-card">
            <s.icon className="h-5 w-5 text-primary" />
            <div className="mt-2 font-display text-2xl md:text-3xl font-bold tabular-nums">{Number(s.value).toLocaleString()}</div>
            <div className="text-xs text-muted-foreground">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="relative overflow-hidden rounded-3xl glass p-6 md:p-8 shadow-card">
        <div className="absolute -top-20 right-0 h-56 w-56 rounded-full bg-gradient-primary opacity-25 blur-3xl animate-glow-pulse" />
        <div className="relative">
          <span className="text-xs uppercase tracking-widest text-muted-foreground">Your link</span>
          <div className="mt-3 flex flex-col sm:flex-row gap-2">
            <div className="flex-1 rounded-xl bg-card/60 border border-border px-4 py-3 font-mono text-sm truncate">{link || "—"}</div>
            <button onClick={copy} className="inline-flex items-center gap-2 rounded-xl bg-gradient-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-glow-primary">
              <Copy className="h-4 w-4" /> Copy
            </button>
            <button onClick={share} className="inline-flex items-center gap-2 rounded-xl glass px-5 py-3 text-sm font-semibold">
              <Share2 className="h-4 w-4" /> Share
            </button>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-3">
        {[
          { n: "01", t: "Share link", d: "Send your code to friends." },
          { n: "02", t: "They join", d: "They sign up and start earning." },
          { n: "03", t: "You earn", d: "Get 10% of their XP forever." },
        ].map((s) => (
          <div key={s.n} className="rounded-2xl glass p-5 shadow-card">
            <div className="font-display text-3xl font-bold text-gradient-primary opacity-40">{s.n}</div>
            <div className="mt-2 font-display font-bold">{s.t}</div>
            <div className="text-xs text-muted-foreground">{s.d}</div>
          </div>
        ))}
      </div>

      <div className="rounded-3xl glass shadow-card overflow-hidden">
        <div className="p-5 font-display text-xl font-bold">Your referrals</div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-xs uppercase tracking-wider text-muted-foreground border-y border-border">
              <tr><th className="text-left p-3 px-5">User</th><th className="text-left p-3">Joined</th><th className="text-center p-3">Status</th><th className="text-right p-3 px-5">XP Earned</th></tr>
            </thead>
            <tbody className="divide-y divide-border">
              {referrals.map((r) => (
                <tr key={r.id} className="hover:bg-card/40 transition">
                  <td className="p-3 px-5 font-medium">{r.username}</td>
                  <td className="p-3 text-muted-foreground">{r.joined ?? r.joinedAt}</td>
                  <td className="p-3 text-center">
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${r.status === "Active" ? "bg-success/15 text-success" : "bg-warning/15 text-warning"}`}>{r.status}</span>
                  </td>
                  <td className="p-3 px-5 text-right font-semibold text-gradient-xp tabular-nums">+{Number(r.xp ?? 0).toLocaleString()}</td>
                </tr>
              ))}
              {referrals.length === 0 && (
                <tr><td colSpan={4} className="p-6 text-center text-sm text-muted-foreground">No referrals yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
