import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { PageHeader } from "@/components/common/PageHeader";
import { userAPI } from "@/lib/api";
import { Calendar, MapPin, Mail, ShieldCheck, Trophy } from "lucide-react";

export const Route = createFileRoute("/_app/profile")({
  head: () => ({ meta: [{ title: "Profile — LootMiner" }] }),
  component: Profile,
});

function Profile() {
  const qc = useQueryClient();
  const { data } = useQuery({ queryKey: ["profile"], queryFn: userAPI.profile });
  const { data: act } = useQuery({ queryKey: ["activity", 1], queryFn: () => userAPI.activity(1, "all") });

  const u = data?.user ?? {};
  const stats = data?.stats ?? {};
  const earning = data?.earningSummary ?? { paid: 0, pending: 0, hold: 0 };
  const withdraw = data?.withdrawSummary ?? { paid: 0, pending: 0, hold: 0 };

  const [priv, setPriv] = useState<boolean>(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [curPwd, setCurPwd] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");

  useEffect(() => {
    if (u && Object.keys(u).length) {
      setPriv(Boolean(u.accountPrivate));
      setUsername(u.username ?? "");
      setEmail(u.email ?? "");
    }
  }, [data]);

  const updateProfile = useMutation({
    mutationFn: (payload: any) => userAPI.updateProfile(payload),
    onSuccess: () => {
      toast.success("Profile updated");
      qc.invalidateQueries({ queryKey: ["profile"] });
      qc.invalidateQueries({ queryKey: ["dashboard"] });
    },
    onError: (e: any) => toast.error(e?.response?.data?.message ?? "Update failed"),
  });

  const changePassword = useMutation({
    mutationFn: (payload: any) => userAPI.changePassword(payload),
    onSuccess: () => {
      toast.success("Password changed");
      setCurPwd(""); setNewPwd(""); setConfirmPwd("");
    },
    onError: (e: any) => toast.error(e?.response?.data?.message ?? "Change failed"),
  });

  const togglePrivate = (v: boolean) => {
    setPriv(v);
    updateProfile.mutate({ accountPrivate: v });
  };

  const saveProfile = () => updateProfile.mutate({ username, email });

  const submitPassword = () => {
    if (newPwd.length < 6) return toast.error("Password must be at least 6 characters");
    if (newPwd !== confirmPwd) return toast.error("Passwords don't match");
    changePassword.mutate({ currentPassword: curPwd, newPassword: newPwd });
  };

  const activities: any[] = act?.activities ?? [];

  return (
    <div className="space-y-8">
      <PageHeader eyebrow="Account" title="Your profile" />

      <section className="relative overflow-hidden rounded-3xl glass p-6 md:p-8 shadow-card">
        <div className="absolute -top-20 right-0 h-64 w-64 rounded-full bg-gradient-accent opacity-25 blur-3xl" />
        <div className="relative flex flex-col md:flex-row md:items-center gap-6">
          <div className="relative">
            <div className="absolute -inset-1 rounded-full bg-gradient-primary blur-md opacity-70" />
            <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-card border border-border font-display text-3xl font-bold">
              {u.avatar ?? u.username?.[0]?.toUpperCase() ?? "?"}
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="font-display text-3xl font-bold">{u.username ?? "—"}</h2>
            <div className="mt-3 flex flex-wrap gap-2 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-card/60 px-3 py-1 border border-border"><Mail className="h-3 w-3" /> {u.email ?? "—"} {u.emailVerified && <ShieldCheck className="h-3 w-3 text-success" />}</span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-card/60 px-3 py-1 border border-border"><Calendar className="h-3 w-3" /> Joined {u.joinDate ?? u.createdAt ?? "—"}</span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-card/60 px-3 py-1 border border-border"><MapPin className="h-3 w-3" /> {u.country ?? "—"}</span>
            </div>
            <div className="mt-4 flex items-center gap-3">
              <span className="text-sm">Private account</span>
              <button onClick={() => togglePrivate(!priv)} className={`relative h-6 w-11 rounded-full transition ${priv ? "bg-gradient-primary shadow-glow-primary" : "bg-card border border-border"}`}>
                <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-background shadow transition ${priv ? "left-[22px]" : "left-0.5"}`} />
              </button>
            </div>
          </div>
          <div className="rounded-2xl bg-gradient-primary p-5 text-primary-foreground shadow-glow-primary">
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest opacity-80"><Trophy className="h-3 w-3" /> Level</div>
            <div className="mt-1 font-display text-4xl font-bold">{u.level ?? 1}</div>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        {[
          { label: "Total Earned", value: stats.totalEarned ?? 0 },
          { label: "Cashouts", value: stats.cashouts ?? 0 },
          { label: "Referrals", value: stats.referrals ?? 0 },
          { label: "Streak", value: `${stats.streak ?? 0} days` },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl glass p-4 shadow-card">
            <div className="text-xs text-muted-foreground">{s.label}</div>
            <div className="mt-2 font-display text-2xl font-bold tabular-nums">{typeof s.value === "number" ? s.value.toLocaleString() : s.value}</div>
          </div>
        ))}
      </section>

      <div className="grid md:grid-cols-2 gap-4">
        <section className="rounded-3xl glass p-6 shadow-card space-y-4">
          <h2 className="font-display text-xl font-bold">Edit Profile</h2>
          <label className="block">
            <span className="text-xs uppercase tracking-widest text-muted-foreground">Username</span>
            <input value={username} onChange={(e) => setUsername(e.target.value)} className="mt-1.5 w-full rounded-xl bg-card/60 border border-border px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary" />
          </label>
          <label className="block">
            <span className="text-xs uppercase tracking-widest text-muted-foreground">Email</span>
            <input value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1.5 w-full rounded-xl bg-card/60 border border-border px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary" />
          </label>
          <button onClick={saveProfile} disabled={updateProfile.isPending} className="rounded-xl bg-gradient-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-glow-primary disabled:opacity-60">
            {updateProfile.isPending ? "Saving…" : "Save"}
          </button>
        </section>

        <section className="rounded-3xl glass p-6 shadow-card space-y-4">
          <h2 className="font-display text-xl font-bold">Change Password</h2>
          <label className="block">
            <span className="text-xs uppercase tracking-widest text-muted-foreground">Current password</span>
            <input type="password" value={curPwd} onChange={(e) => setCurPwd(e.target.value)} className="mt-1.5 w-full rounded-xl bg-card/60 border border-border px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary" />
          </label>
          <label className="block">
            <span className="text-xs uppercase tracking-widest text-muted-foreground">New password</span>
            <input type="password" value={newPwd} onChange={(e) => setNewPwd(e.target.value)} className="mt-1.5 w-full rounded-xl bg-card/60 border border-border px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary" />
          </label>
          <label className="block">
            <span className="text-xs uppercase tracking-widest text-muted-foreground">Confirm password</span>
            <input type="password" value={confirmPwd} onChange={(e) => setConfirmPwd(e.target.value)} className="mt-1.5 w-full rounded-xl bg-card/60 border border-border px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary" />
          </label>
          <button onClick={submitPassword} disabled={changePassword.isPending} className="rounded-xl bg-gradient-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-glow-primary disabled:opacity-60">
            {changePassword.isPending ? "Updating…" : "Update password"}
          </button>
        </section>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {([
          { title: "Earning Summary", rows: [
            { l: "Paid",    v: earning.paid    ?? 0, tone: "success" as const },
            { l: "Pending", v: earning.pending ?? 0, tone: "warning" as const },
            { l: "Hold",    v: earning.hold    ?? 0, tone: "muted"   as const },
          ] },
          { title: "Withdraw Summary", rows: [
            { l: "Paid",    v: withdraw.paid    ?? 0, tone: "success" as const },
            { l: "Pending", v: withdraw.pending ?? 0, tone: "warning" as const },
            { l: "Hold",    v: withdraw.hold    ?? 0, tone: "muted"   as const },
          ] },
        ]).map((s) => (
          <section key={s.title} className="relative overflow-hidden rounded-3xl glass p-6 shadow-card">
            <div className="absolute -top-16 -right-16 h-44 w-44 rounded-full bg-gradient-primary opacity-15 blur-3xl" />
            <h2 className="relative font-display text-xl font-bold">{s.title}</h2>
            <div className="relative mt-4 grid grid-cols-3 gap-3">
              {s.rows.map((r) => {
                const styles =
                  r.tone === "success"
                    ? "bg-success/10 ring-success/30 text-success"
                    : r.tone === "warning"
                    ? "bg-xp/10 ring-xp/30 text-xp"
                    : "bg-muted/30 ring-border text-muted-foreground";
                const dot =
                  r.tone === "success"
                    ? "bg-success shadow-[0_0_10px_oklch(0.78_0.18_165/0.7)]"
                    : r.tone === "warning"
                    ? "bg-xp shadow-glow-xp"
                    : "bg-muted-foreground/50";
                return (
                  <div key={r.l} className={`group relative overflow-hidden rounded-2xl ring-1 ${styles} p-3 transition hover:-translate-y-0.5`}>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase tracking-widest font-bold">{r.l}</span>
                      <span className={`h-1.5 w-1.5 rounded-full ${dot} ${r.tone !== "muted" ? "animate-pulse" : ""}`} />
                    </div>
                    <div className="mt-2 font-display text-xl font-bold tabular-nums text-foreground">
                      {Number(r.v).toLocaleString()}
                    </div>
                    <div className="mt-0.5 text-[10px] text-muted-foreground">XP</div>
                  </div>
                );
              })}
            </div>
          </section>
        ))}
      </div>

      <section className="rounded-3xl glass shadow-card overflow-hidden">
        <div className="p-5 font-display text-xl font-bold">Activity History</div>
        <div className="divide-y divide-border">
          {activities.map((a: any) => (
            <div key={a.id} className="flex items-center gap-3 px-5 py-3 text-sm">
              <div className="min-w-0 flex-1">
                <div className="truncate font-medium">{a.offer ?? a.offerName}</div>
                <div className="text-xs text-muted-foreground">{a.provider ?? a.network} · {a.time ?? a.createdAt}</div>
              </div>
              <div className={`font-semibold tabular-nums ${Number(a.xp) > 0 ? "text-gradient-xp" : "text-warning"}`}>{Number(a.xp) > 0 ? "+" : ""}{Number(a.xp).toLocaleString()}</div>
            </div>
          ))}
          {activities.length === 0 && <div className="px-5 py-6 text-sm text-muted-foreground text-center">No activity yet.</div>}
        </div>
      </section>
    </div>
  );
}
