import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/common/PageHeader";
import { payoutMethods, user } from "@/data/mock";
import { ShieldCheck, Zap, Lock } from "lucide-react";

export const Route = createFileRoute("/cashout")({
  head: () => ({
    meta: [
      { title: "Cashout — LootMiner" },
      { name: "description", content: "Withdraw your earnings to PayPal, crypto, or gift cards." },
    ],
  }),
  component: Cashout,
});

function Cashout() {
  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Cashout"
        title="Withdraw your rewards"
        subtitle="Instant payouts to your favorite method. No hidden fees."
        action={
          <div className="rounded-2xl glass p-3 shadow-card">
            <div className="text-xs text-muted-foreground">Available</div>
            <div className="font-display text-2xl font-bold text-gradient-primary tabular-nums">
              {user.balance.toLocaleString()}
            </div>
          </div>
        }
      />

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
        {payoutMethods.map((m) => {
          const Icon = m.icon;
          return (
            <button
              key={m.id}
              className="group relative overflow-hidden rounded-2xl glass p-4 md:p-5 text-left shadow-card transition-all hover:-translate-y-1 hover:shadow-glow-accent"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${m.gradient} opacity-50 group-hover:opacity-90 transition`} />
              <div className="absolute inset-0 bg-gradient-to-t from-card/80 to-transparent" />
              <div className="relative flex flex-col gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-background/60 backdrop-blur border border-border">
                  <Icon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-display font-semibold">{m.name}</h3>
                  <p className="mt-0.5 text-xs text-muted-foreground">Min ${m.min} · {m.time}</p>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Fee {m.fee}</span>
                  <span className="rounded-full bg-success/15 text-success px-2 py-0.5 font-medium">Available</span>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {[
          { icon: Zap, title: "Instant payouts", desc: "Most methods process within seconds." },
          { icon: ShieldCheck, title: "Bank-grade security", desc: "All transactions are encrypted end-to-end." },
          { icon: Lock, title: "Zero hidden fees", desc: "What you see is what you get. Always." },
        ].map((f) => (
          <div key={f.title} className="rounded-2xl glass p-5 shadow-card">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-primary shadow-glow-primary">
              <f.icon className="h-5 w-5 text-primary-foreground" />
            </div>
            <h3 className="mt-4 font-display font-semibold">{f.title}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{f.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
