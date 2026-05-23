import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { PageHeader } from "@/components/common/PageHeader";
import { Toggle } from "@/components/admin/StatusBadge";
import { adminAPI } from "@/lib/api";
import { Copy, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_admin/admin/settings")({
  head: () => ({ meta: [{ title: "Admin · Settings" }] }),
  component: SettingsPage,
});

function SettingsPage() {
  const qc = useQueryClient();
  const { data } = useQuery({ queryKey: ["admin", "settings"], queryFn: adminAPI.settings });
  const [s, setS] = useState<any>({});
  const [confirm1, setConfirm1] = useState("");
  const [confirm2, setConfirm2] = useState("");

  useEffect(() => {
    if (data?.settings) setS(data.settings);
  }, [data]);

  const nets: any[] = data?.networks ?? [];
  const baseUrl = data?.postbackBaseUrl ?? `${typeof window !== "undefined" ? window.location.origin : ""}/api/postback`;

  const set = <K extends string>(k: K, v: any) => setS({ ...s, [k]: v });
  const tog = (k: string) => setS({ ...s, [k]: !s[k] });

  const copy = (url: string) => { navigator.clipboard?.writeText(url); toast.success("Postback URL copied"); };

  const saveMut = useMutation({
    mutationFn: () => adminAPI.saveSettings(s),
    onSuccess: () => { toast.success("Settings saved"); qc.invalidateQueries({ queryKey: ["admin", "settings"] }); },
    onError: (e: any) => toast.error(e?.response?.data?.message ?? "Save failed"),
  });

  const clearXpMut = useMutation({
    mutationFn: () => adminAPI.clearTodayXp(),
    onSuccess: () => { toast.success("Today's XP cleared"); setConfirm1(""); },
    onError: () => toast.error("Failed"),
  });

  return (
    <div className="space-y-6 pb-24">
      <PageHeader eyebrow="Admin" title="Settings" />

      <Card title="XP & Rewards">
        <div className="grid md:grid-cols-2 gap-4">
          <NumberField label="XP per USD" value={s.xpPerUsd ?? 0} onChange={(v) => set("xpPerUsd", v)} />
          <NumberField label="Signup Bonus XP" value={s.signupBonusXp ?? 0} onChange={(v) => set("signupBonusXp", v)} />
          <NumberField label="Referral Bonus XP" value={s.referralBonusXp ?? 0} onChange={(v) => set("referralBonusXp", v)} />
          <NumberField label="Daily Bonus Base XP" value={s.dailyBonusXp ?? 0} onChange={(v) => set("dailyBonusXp", v)} />
          <NumberField label="Minimum Cashout XP" value={s.minCashoutXp ?? 0} onChange={(v) => set("minCashoutXp", v)} />
        </div>
      </Card>

      <Card title="Site Controls">
        <ToggleRow label="Maintenance Mode" desc="When ON shows maintenance page to users" v={!!s.maintenanceMode} onChange={() => tog("maintenanceMode")} />
        <ToggleRow label="Live Leads Ticker" desc="Show/hide the global leads ticker" v={!!s.liveLeadsEnabled} onChange={() => tog("liveLeadsEnabled")} />
        <ToggleRow label="Referrals Enabled" desc="Enable the referral program" v={!!s.referralsEnabled} onChange={() => tog("referralsEnabled")} />
        <ToggleRow label="Promo Codes Enabled" desc="Allow users to redeem codes" v={!!s.promoCodesEnabled} onChange={() => tog("promoCodesEnabled")} />
        <ToggleRow label="New Signups Enabled" desc="Open registration to new users" v={!!s.signupOpen} onChange={() => tog("signupOpen")} />
      </Card>

      <Card title="Fraud & Proxy Detection">
        <ToggleRow label="Block VPN / Proxy traffic" desc="Reject earnings from detected VPNs and proxies" v={!!s.vpnBlocking} onChange={() => tog("vpnBlocking")} />
        <ToggleRow label="Live Proxy-Change Detection" desc="Detect mid-session IP / proxy changes and re-verify" v={!!s.proxyChangeDetect} onChange={() => tog("proxyChangeDetect")} />

        <div className="rounded-2xl bg-card/60 border border-border p-3 space-y-3">
          <ToggleRow label="Fraudlogix" desc="fraudlogix.com fraud scoring" v={!!s.fraudlogix} onChange={() => tog("fraudlogix")} />
          <input value={s.fraudlogixKey ?? ""} onChange={(e) => set("fraudlogixKey", e.target.value)} placeholder="Fraudlogix API key" className="w-full rounded-lg bg-background/60 border border-border px-3 py-2 text-sm font-mono" disabled={!s.fraudlogix} />
        </div>

        <div className="rounded-2xl bg-card/60 border border-border p-3 space-y-3">
          <ToggleRow label="IPQualityScore" desc="ipqualityscore.com fraud + proxy check" v={!!s.ipqs} onChange={() => tog("ipqs")} />
          <input value={s.ipqsKey ?? ""} onChange={(e) => set("ipqsKey", e.target.value)} placeholder="IPQualityScore API key" className="w-full rounded-lg bg-background/60 border border-border px-3 py-2 text-sm font-mono" disabled={!s.ipqs} />
        </div>
      </Card>

      <Card title="Postback Networks">
        <div className="space-y-3">
          {nets.map((n: any) => {
            const url = `${baseUrl}/${n.slug}`;
            return (
              <div key={n.id ?? n.slug} className="rounded-2xl bg-card/60 border border-border p-3 grid grid-cols-1 md:grid-cols-[1fr_auto] gap-3 items-center">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <span className="font-semibold">{n.name}</span>
                    <Toggle checked={!!n.enabled} />
                  </div>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 rounded-lg bg-background/60 border border-border px-3 py-1.5 text-xs font-mono text-muted-foreground truncate">{url}</code>
                    <button onClick={() => copy(url)} className="rounded-lg bg-card/60 hover:bg-card border border-border p-2"><Copy className="h-3.5 w-3.5" /></button>
                  </div>
                </div>
              </div>
            );
          })}
          {nets.length === 0 && <div className="text-xs text-muted-foreground">No postback networks configured.</div>}
        </div>
        <p className="mt-4 text-xs text-muted-foreground flex items-start gap-2">
          <AlertTriangle className="h-4 w-4 text-warning shrink-0" />
          Hash verification is disabled. All postbacks from these URLs are accepted.
        </p>
      </Card>

      <Card title="Danger Zone" danger>
        <div className="space-y-4">
          <DangerRow label="Clear Today's XP" desc="Resets today_earned_xp for all users." confirmText={confirm1} setConfirmText={setConfirm1} onExecute={() => clearXpMut.mutate()} loading={clearXpMut.isPending} />
          <DangerRow label="Clear All Logs" desc="Permanently deletes log history." confirmText={confirm2} setConfirmText={setConfirm2} onExecute={() => { setConfirm2(""); toast.message("Endpoint not enabled"); }} />
        </div>
      </Card>

      <div className="fixed bottom-4 left-0 right-0 z-30 flex justify-center px-4 md:pl-[256px]">
        <button onClick={() => saveMut.mutate()} disabled={saveMut.isPending} className="rounded-2xl bg-gradient-primary px-8 py-3 text-sm font-bold text-primary-foreground shadow-glow-primary backdrop-blur-xl disabled:opacity-60">
          {saveMut.isPending ? "Saving…" : "Save All Settings"}
        </button>
      </div>
    </div>
  );
}

function Card({ title, children, danger }: { title: string; children: React.ReactNode; danger?: boolean }) {
  return (
    <section className={`rounded-3xl glass p-6 shadow-card space-y-4 ${danger ? "ring-1 ring-destructive/40" : ""}`}>
      <h2 className={`font-display text-xl font-bold ${danger ? "text-destructive" : ""}`}>{title}</h2>
      {children}
    </section>
  );
}

function NumberField({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <label className="block">
      <span className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</span>
      <input type="number" value={value} onChange={(e) => onChange(+e.target.value)} className="mt-1.5 w-full rounded-xl bg-card/60 border border-border px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary tabular-nums" />
    </label>
  );
}

function ToggleRow({ label, desc, v, onChange }: { label: string; desc?: string; v: boolean; onChange: () => void }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-border last:border-0">
      <div>
        <div className="text-sm font-medium">{label}</div>
        {desc && <div className="text-xs text-muted-foreground mt-0.5">{desc}</div>}
      </div>
      <Toggle checked={v} onChange={onChange} />
    </div>
  );
}

function DangerRow({ label, desc, confirmText, setConfirmText, onExecute, loading }: { label: string; desc: string; confirmText: string; setConfirmText: (v: string) => void; onExecute: () => void; loading?: boolean }) {
  const ready = confirmText === "CONFIRM";
  return (
    <div className="rounded-2xl bg-destructive/5 border border-destructive/20 p-4 space-y-2">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="font-semibold">{label}</div>
          <div className="text-xs text-muted-foreground mt-0.5">{desc}</div>
        </div>
      </div>
      <div className="flex gap-2">
        <input value={confirmText} onChange={(e) => setConfirmText(e.target.value)} placeholder="Type CONFIRM" className="flex-1 rounded-xl bg-background/60 border border-border px-3 py-2 text-sm font-mono" />
        <button disabled={!ready || loading} onClick={onExecute} className={`rounded-xl px-4 py-2 text-sm font-semibold ${ready && !loading ? "bg-destructive text-destructive-foreground" : "bg-card/60 text-muted-foreground cursor-not-allowed"}`}>
          {loading ? "…" : "Execute"}
        </button>
      </div>
    </div>
  );
}
