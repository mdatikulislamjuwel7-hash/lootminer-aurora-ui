import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { Toggle } from "@/components/admin/StatusBadge";
import { mockAdminPayments } from "@/data/mock";
import { Plus, Pencil, X } from "lucide-react";

export const Route = createFileRoute("/_admin/admin/payments")({
  head: () => ({ meta: [{ title: "Admin · Payment Methods" }] }),
  component: PaymentsPage,
});

function PaymentsPage() {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState(mockAdminPayments);

  const toggle = (id: string) => setItems(arr => arr.map(p => p.id === id ? { ...p, enabled: !p.enabled } : p));

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Admin"
        title="Payment methods"
        action={
          <button onClick={() => setOpen(true)} className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-glow-primary">
            <Plus className="h-4 w-4" /> Add Method
          </button>
        }
      />

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map(p => {
          const Icon = p.icon;
          return (
            <div key={p.id} className="relative overflow-hidden rounded-3xl glass p-5 shadow-card">
              <div className={`absolute inset-0 bg-gradient-to-br ${p.gradient} opacity-40 pointer-events-none`} />
              <div className="relative flex items-start justify-between">
                <div className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${p.gradient} border border-border shadow-card`}>
                  <Icon className="h-6 w-6" />
                </div>
                <Toggle checked={p.enabled} onChange={() => toggle(p.id)} />
              </div>
              <div className="relative mt-4">
                <div className="font-display text-lg font-bold">{p.name}</div>
                <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
                  <Stat label="Min XP" value={p.minXp.toLocaleString()} />
                  <Stat label="Fee" value={`${p.fee}%`} />
                  <Stat label="Time" value={p.time} />
                </div>
                <button className="relative mt-4 inline-flex items-center gap-1.5 rounded-xl glass px-3 py-1.5 text-xs">
                  <Pencil className="h-3 w-3" /> Edit
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {open && <AddModal onClose={() => setOpen(false)} />}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-card/60 border border-border p-2">
      <div className="text-[9px] uppercase tracking-widest text-muted-foreground">{label}</div>
      <div className="text-sm font-semibold tabular-nums truncate">{value}</div>
    </div>
  );
}

function AddModal({ onClose }: { onClose: () => void }) {
  const [enabled, setEnabled] = useState(true);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button onClick={onClose} className="absolute inset-0 bg-background/70 backdrop-blur-md" />
      <div className="relative w-full max-w-lg rounded-3xl glass shadow-card animate-page-in overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-border">
          <h3 className="font-display text-lg font-bold">Add payment method</h3>
          <button onClick={onClose} className="rounded-lg bg-card/60 hover:bg-card p-1.5"><X className="h-4 w-4" /></button>
        </div>
        <div className="p-5 grid grid-cols-2 gap-4">
          <Field label="Name" full><input className="w-full rounded-xl bg-card/60 border border-border px-3 py-2 text-sm" /></Field>
          <Field label="Icon URL" full><input placeholder="https://…" className="w-full rounded-xl bg-card/60 border border-border px-3 py-2 text-sm" /></Field>
          <Field label="Min XP"><input type="number" defaultValue={500} className="w-full rounded-xl bg-card/60 border border-border px-3 py-2 text-sm" /></Field>
          <Field label="Fee %"><input type="number" defaultValue={0} className="w-full rounded-xl bg-card/60 border border-border px-3 py-2 text-sm" /></Field>
          <Field label="Processing Time" full><input placeholder="Instant / ~30 min / 1–3 days" className="w-full rounded-xl bg-card/60 border border-border px-3 py-2 text-sm" /></Field>
          <div className="col-span-2 flex items-center justify-between rounded-2xl bg-card/60 border border-border p-3">
            <span className="text-sm font-medium">Enabled</span>
            <Toggle checked={enabled} onChange={() => setEnabled(v => !v)} />
          </div>
        </div>
        <div className="flex justify-end gap-2 p-5 border-t border-border">
          <button onClick={onClose} className="rounded-xl glass px-4 py-2 text-sm">Cancel</button>
          <button onClick={onClose} className="rounded-xl bg-gradient-primary px-5 py-2 text-sm font-semibold text-primary-foreground shadow-glow-primary">Save</button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children, full }: { label: string; children: React.ReactNode; full?: boolean }) {
  return (
    <label className={`block ${full ? "col-span-2" : ""}`}>
      <span className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</span>
      <div className="mt-1.5">{children}</div>
    </label>
  );
}
