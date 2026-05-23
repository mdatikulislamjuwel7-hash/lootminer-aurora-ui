import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge, Toggle } from "@/components/admin/StatusBadge";
import { adminAPI } from "@/lib/api";
import { Pencil, Ban, Trash2, X, Search } from "lucide-react";

export const Route = createFileRoute("/_admin/admin/users")({
  head: () => ({ meta: [{ title: "Admin · Users — LootMiner" }] }),
  component: UsersPage,
});

function UsersPage() {
  const qc = useQueryClient();
  const [tab, setTab] = useState<"All" | "Active" | "Banned" | "Admin">("All");
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [edit, setEdit] = useState<any | null>(null);
  const [confirm, setConfirm] = useState<{ user: any; kind: "ban" | "delete" } | null>(null);

  const { data } = useQuery({
    queryKey: ["admin", "users", { tab, q, page }],
    queryFn: () => adminAPI.users({ tab: tab.toLowerCase(), q, page }),
  });

  const users: any[] = data?.users ?? [];
  const total = data?.total ?? 0;
  const totalPages = data?.totalPages ?? 1;

  const list = useMemo(() => users, [users]);

  const editMut = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: any }) => adminAPI.editUser(id, payload),
    onSuccess: () => { toast.success("User updated"); qc.invalidateQueries({ queryKey: ["admin", "users"] }); setEdit(null); },
    onError: (e: any) => toast.error(e?.response?.data?.message ?? "Update failed"),
  });

  const delMut = useMutation({
    mutationFn: (id: number) => adminAPI.deleteUser(id),
    onSuccess: () => { toast.success("User deleted"); qc.invalidateQueries({ queryKey: ["admin", "users"] }); setConfirm(null); },
    onError: (e: any) => toast.error(e?.response?.data?.message ?? "Delete failed"),
  });

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Admin" title="Users" />

      <div className="flex flex-wrap items-center gap-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input value={q} onChange={(e) => { setQ(e.target.value); setPage(1); }} placeholder="Search users…" className="rounded-xl glass pl-9 pr-4 py-2 text-sm outline-none focus:ring-2 focus:ring-primary" />
        </div>
        <div className="flex flex-wrap gap-2 ml-auto">
          {(["All", "Active", "Banned", "Admin"] as const).map(t => (
            <button key={t} onClick={() => { setTab(t); setPage(1); }} className={`rounded-full px-3 py-1.5 text-sm border ${tab === t ? "bg-gradient-primary text-primary-foreground border-transparent shadow-glow-primary" : "glass"}`}>{t}</button>
          ))}
        </div>
      </div>

      <div className="rounded-3xl glass shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-xs uppercase tracking-wider text-muted-foreground border-b border-border">
              <tr>
                {["User", "Email", "Level", "Balance XP", "Total Earned", "Role", "Status", "Joined", "Actions"].map(c => (
                  <th key={c} className="text-left p-3 px-4 whitespace-nowrap">{c}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {list.map(u => (
                <tr key={u.id} className="hover:bg-card/40 transition">
                  <td className="p-3 px-4">
                    <div className="flex items-center gap-2">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-primary text-xs font-bold text-primary-foreground shadow-glow-primary">{u.avatar ?? u.username?.[0]?.toUpperCase()}</div>
                      <div>
                        <div className="font-medium">{u.username}</div>
                        <div className="font-mono text-[10px] text-muted-foreground">{u.userID ?? u.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-3 text-muted-foreground">{u.email}</td>
                  <td className="p-3"><span className="rounded-full bg-gradient-accent text-accent-foreground px-2 py-0.5 text-[10px] font-bold">Lv {u.level}</span></td>
                  <td className="p-3 text-right font-semibold text-gradient-xp tabular-nums">{Number(u.balance ?? 0).toLocaleString()}</td>
                  <td className="p-3 text-right tabular-nums">{Number(u.totalEarned ?? 0).toLocaleString()}</td>
                  <td className="p-3"><span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${u.role === "admin" ? "bg-gradient-accent text-accent-foreground" : "bg-card/60 border border-border"}`}>{u.role}</span></td>
                  <td className="p-3"><StatusBadge status={u.banned ? "Banned" : "Active"} /></td>
                  <td className="p-3 text-muted-foreground whitespace-nowrap">{u.joined ?? u.createdAt}</td>
                  <td className="p-3 px-4">
                    <div className="inline-flex gap-1">
                      <button onClick={() => setEdit(u)} className="rounded-lg bg-card/60 hover:bg-card p-1.5" title="Edit"><Pencil className="h-3.5 w-3.5" /></button>
                      <button onClick={() => setConfirm({ user: u, kind: "ban" })} className="rounded-lg bg-warning/15 text-warning hover:bg-warning/25 p-1.5" title="Ban / Unban"><Ban className="h-3.5 w-3.5" /></button>
                      <button onClick={() => setConfirm({ user: u, kind: "delete" })} className="rounded-lg bg-destructive/15 text-destructive hover:bg-destructive/25 p-1.5" title="Delete"><Trash2 className="h-3.5 w-3.5" /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {list.length === 0 && <tr><td colSpan={9} className="p-6 text-center text-sm text-muted-foreground">No users found.</td></tr>}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between p-4 text-xs text-muted-foreground border-t border-border">
          <span>Showing {list.length} of {total} users</span>
          <div className="flex gap-1">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page <= 1} className="rounded-lg glass px-3 py-1 disabled:opacity-40">‹</button>
            <span className="rounded-lg bg-gradient-primary text-primary-foreground px-3 py-1">{page}</span>
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page >= totalPages} className="rounded-lg glass px-3 py-1 disabled:opacity-40">›</button>
          </div>
        </div>
      </div>

      {edit && <EditPanel user={edit} onClose={() => setEdit(null)} onSave={(payload) => editMut.mutate({ id: edit.id, payload })} saving={editMut.isPending} />}
      {confirm && (
        <ConfirmDialog
          title={confirm.kind === "ban" ? (confirm.user.banned ? "Unban user?" : "Ban user?") : "Delete user?"}
          desc={`This action affects ${confirm.user.username}. Continue?`}
          danger={confirm.kind === "delete"}
          onClose={() => setConfirm(null)}
          onConfirm={() => {
            if (confirm.kind === "delete") delMut.mutate(confirm.user.id);
            else editMut.mutate({ id: confirm.user.id, payload: { banned: !confirm.user.banned } });
          }}
          loading={editMut.isPending || delMut.isPending}
        />
      )}
    </div>
  );
}

function EditPanel({ user, onClose, onSave, saving }: { user: any; onClose: () => void; onSave: (p: any) => void; saving: boolean }) {
  const [xpDelta, setXpDelta] = useState(0);
  const [reason, setReason] = useState("");
  const [role, setRole] = useState<string>(user.role ?? "user");
  const [banned, setBanned] = useState<boolean>(!!user.banned);

  const submit = () => {
    const payload: any = { role, banned };
    if (xpDelta !== 0) {
      if (!reason.trim()) return toast.error("Reason required for XP changes");
      payload.xpDelta = xpDelta;
      payload.reason = reason;
    }
    onSave(payload);
  };

  return (
    <div className="fixed inset-0 z-50 flex">
      <button onClick={onClose} className="flex-1 bg-background/60 backdrop-blur-sm" aria-label="Close" />
      <aside className="w-full max-w-md h-full overflow-y-auto bg-card/95 backdrop-blur-2xl border-l border-border shadow-card animate-page-in">
        <div className="flex items-center justify-between p-5 border-b border-border">
          <h2 className="font-display text-lg font-bold">Edit User</h2>
          <button onClick={onClose} className="rounded-lg bg-card/60 hover:bg-card p-1.5"><X className="h-4 w-4" /></button>
        </div>

        <div className="p-5 space-y-6">
          <div className="flex items-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-primary text-base font-bold text-primary-foreground shadow-glow-primary">{user.avatar ?? user.username?.[0]?.toUpperCase()}</div>
            <div>
              <div className="font-display text-lg font-bold">{user.username}</div>
              <div className="text-xs text-muted-foreground">{user.email}</div>
              <div className="font-mono text-[10px] text-muted-foreground mt-0.5">{user.userID ?? user.id}</div>
            </div>
          </div>

          <div className="rounded-2xl bg-card/60 border border-border p-4 space-y-3">
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground">XP Adjustment</div>
            <div className="flex gap-2">
              <button onClick={() => setXpDelta(Math.abs(xpDelta || 100))} className="rounded-lg bg-success/15 text-success px-3 py-1.5 text-xs font-semibold">+ Add</button>
              <button onClick={() => setXpDelta(-Math.abs(xpDelta || 100))} className="rounded-lg bg-destructive/15 text-destructive px-3 py-1.5 text-xs font-semibold">− Remove</button>
              <input type="number" value={xpDelta} onChange={(e) => setXpDelta(+e.target.value)} className="flex-1 rounded-lg bg-background/60 border border-border px-3 py-1.5 text-sm" />
            </div>
            <input value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Reason (required for XP)" className="w-full rounded-lg bg-background/60 border border-border px-3 py-1.5 text-sm" />
          </div>

          <label className="block">
            <span className="text-[10px] uppercase tracking-widest text-muted-foreground">Role</span>
            <select value={role} onChange={(e) => setRole(e.target.value)} className="mt-1.5 w-full rounded-xl bg-card/60 border border-border px-3 py-2 text-sm">
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </label>

          <div className="flex items-center justify-between rounded-2xl bg-card/60 border border-border p-4">
            <div>
              <div className="text-sm font-semibold">Banned</div>
              <div className="text-xs text-muted-foreground">Blocks login and earning</div>
            </div>
            <Toggle checked={banned} onChange={() => setBanned(!banned)} />
          </div>

          <button onClick={submit} disabled={saving} className="w-full rounded-xl bg-gradient-primary text-primary-foreground py-2.5 text-sm font-semibold shadow-glow-primary disabled:opacity-60">
            {saving ? "Saving…" : "Save Changes"}
          </button>
        </div>
      </aside>
    </div>
  );
}

function ConfirmDialog({ title, desc, danger, onClose, onConfirm, loading }: { title: string; desc: string; danger?: boolean; onClose: () => void; onConfirm: () => void; loading?: boolean }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button onClick={onClose} className="absolute inset-0 bg-background/70 backdrop-blur-md" />
      <div className="relative w-full max-w-sm rounded-3xl glass shadow-card p-6 animate-page-in">
        <h3 className="font-display text-lg font-bold">{title}</h3>
        <p className="mt-1 text-sm text-muted-foreground">{desc}</p>
        <div className="mt-5 flex gap-2 justify-end">
          <button onClick={onClose} className="rounded-xl glass px-4 py-2 text-sm">Cancel</button>
          <button onClick={onConfirm} disabled={loading} className={`rounded-xl px-4 py-2 text-sm font-semibold disabled:opacity-60 ${danger ? "bg-destructive text-destructive-foreground" : "bg-gradient-primary text-primary-foreground shadow-glow-primary"}`}>{loading ? "…" : "Confirm"}</button>
        </div>
      </div>
    </div>
  );
}
