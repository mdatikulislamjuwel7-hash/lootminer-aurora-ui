import { providers } from "@/data/mock";
import { ProviderCard } from "./ProviderCard";

export function ProviderGrid({ limit }: { limit?: number }) {
  const list = limit ? providers.slice(0, limit) : providers;
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
      {list.map(p => <ProviderCard key={p.id} p={p} />)}
    </div>
  );
}
