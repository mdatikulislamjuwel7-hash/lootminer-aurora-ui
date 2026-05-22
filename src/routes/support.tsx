import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/common/PageHeader";
import { ChevronDown } from "lucide-react";

export const Route = createFileRoute("/support")({
  head: () => ({ meta: [{ title: "Support — LootMiner" }] }),
  component: Support,
});

const faqs = [
  { q: "When do I get paid?", a: "Most withdrawals are instant. Crypto can take up to 30 minutes depending on network." },
  { q: "Why was my offer not credited?", a: "Some offers take up to 24 hours to track. Contact support if it's still missing after that." },
  { q: "Is my data safe?", a: "Yes. We use bank-grade encryption and never sell your data." },
  { q: "How do I level up faster?", a: "Complete daily bonuses, maintain streaks, and tackle higher-payout offers." },
];

function Support() {
  return (
    <div className="space-y-8">
      <PageHeader eyebrow="Help" title="Support" subtitle="We're here 24/7." />
      <div className="space-y-3">
        {faqs.map(f => (
          <details key={f.q} className="group rounded-2xl glass p-5 shadow-card">
            <summary className="flex cursor-pointer items-center justify-between font-display font-semibold">
              {f.q}
              <ChevronDown className="h-4 w-4 transition group-open:rotate-180" />
            </summary>
            <p className="mt-3 text-sm text-muted-foreground">{f.a}</p>
          </details>
        ))}
      </div>
    </div>
  );
}
