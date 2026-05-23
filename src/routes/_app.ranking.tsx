import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { PageHeader } from "@/components/common/PageHeader";
import { rankingsAPI } from "@/lib/api";
import { Crown, Sparkles } from "lucide-react";

export const Route = createFileRoute("/_app/ranking")({
  head: () => ({ meta: [{ title: "Ranking — LootMiner" }] }),
  component: Ranking,
});

const tabs = ["daily", "weekly", "monthly", "all"] as const;
const tabLabels: Record<typeof tabs[number], string> = { daily: "Daily", weekly: "Weekly", monthly: "Monthly", all: "All Time" };

function Ranking() {
  const [tab, setTab] = useState<typeof tabs[number]>("weekly");
  const { data, isLoading } = useQuery({ queryKey: ["rankings", tab], queryFn: () => rankingsAPI.get(tab) });

  const list: any[] = data?.leaderboard ?? [];
  const top3 = list.slice(0, 3);
  const rest = list.slice(3, 50);
  const podiumColors = ["from-amber-400 to-yellow-500", "from-slate-300 to-slate-400", "from-orange-500 to-amber-700"];

  return (
    <div className="space-y-8">
      <PageHeader eyebrow="Leaderboard" title="Ranking" />

      <div className="flex flex-wrap gap-2">
        {tabs.map((t) => (
          <button key={t} onClick={() => setTab(t)} className={`rounded-full px-4 py-2 text-sm font-medium border transition ${
            tab === t ? "bg-gradient-primary text-primary-foreground border-transparent shadow-glow-primary" : "glass text-foreground/80"
          }`}>{tabLabels[t]}</button>
        ))}
      </div>

      {isLoading && <div className="text-sm text-muted-foreground">Loading rankings…</div>}

      {top3.length > 0 && (
        <div className="grid grid-cols-3 gap-3 md:gap-6 items-end">
          {[1, 0, 2].map((i, idx) => {
            const u = top3[i];
            if (!u) return <div key={idx} />;
            const heights = ["h-32 md:h-44", "h-40 md:h-56", "h-28 md:h-36"];
            return (
              <div key={u.rank} className="flex flex-col items-center">
                <Crown className={`mb-2 h-6 w-6 md:h-8 md:w-8 ${i === 0 ? "text-amber-400" : i === 1 ? "text-slate-300" : "text-orange-500"}`} />
                <div className="relative">
                  <div className={`absolute -inset-2 rounded-full bg-gradient-to-br ${podiumColors[i]} opacity-60 blur`} />
                  <div className={`relative flex h-14 w-14 md:h-20 md:w-20 items-center justify-center rounded-full bg-gradient-to-br ${podiumColors[i]} text-white font-display text-lg md:text-2xl font-bold border-2 border-background`}>
                    {u.avatar ?? u.username?.[0]?.toUpperCase() ?? "?"}
                  </div>
                </div>
                <div className="mt-3 font-display text-sm md:text-base font-semibold truncate max-w-full">{u.name ?? u.username}</div>
                <div className="text-[10px] text-muted-foreground">Lv {u.level}</div>
                <div className="mt-2 text-sm font-bold text-gradient-xp tabular-nums">{Number(u.xp).toLocaleString()} XP</div>
                <div className={`mt-2 w-full ${heights[idx]} rounded-t-2xl bg-gradient-to-t ${podiumColors[i]} opacity-30 border-t-2 border-x border-border flex items-start justify-center pt-2`}>
                  <span className="font-display text-2xl md:text-3xl font-bold opacity-80">#{u.rank}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="rounded-3xl glass shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-xs uppercase tracking-wider text-muted-foreground border-b border-border">
              <tr>
                <th className="text-left p-3 px-5 w-12">Rank</th>
                <th className="text-left p-3">User</th>
                <th className="text-right p-3 hidden md:table-cell">Level</th>
                <th className="text-right p-3">XP</th>
                <th className="text-right p-3 px-5 hidden md:table-cell">Change</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {rest.map((u) => (
                <tr key={u.rank} className={`transition ${u.you ? "bg-primary/10" : "hover:bg-card/40"}`}>
                  <td className="p-3 px-5 tabular-nums font-semibold">{u.rank}</td>
                  <td className="p-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-accent text-xs font-bold text-accent-foreground">{u.avatar ?? u.username?.[0]?.toUpperCase() ?? "?"}</div>
                      <span className="font-medium">{u.name ?? u.username} {u.you && <span className="text-[10px] text-primary">(you)</span>}</span>
                    </div>
                  </td>
                  <td className="p-3 text-right hidden md:table-cell">{u.level}</td>
                  <td className="p-3 text-right">
                    <span className="inline-flex items-center gap-1 font-display font-bold text-gradient-xp tabular-nums">
                      <Sparkles className="h-3 w-3 text-xp" /> {Number(u.xp).toLocaleString()}
                    </span>
                  </td>
                  <td className={`p-3 px-5 text-right text-xs hidden md:table-cell ${String(u.change ?? "").startsWith("+") ? "text-success" : String(u.change ?? "").startsWith("-") ? "text-destructive" : "text-muted-foreground"}`}>{u.change ?? "—"}</td>
                </tr>
              ))}
              {!isLoading && rest.length === 0 && (
                <tr><td colSpan={5} className="p-6 text-center text-sm text-muted-foreground">No rankings yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
