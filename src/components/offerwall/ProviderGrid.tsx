import { useState } from "react";
import { ProviderCard } from "./ProviderCard";
import { IframeOverlay } from "@/components/common/IframeOverlay";
import type { ApiProvider } from "@/lib/types";

export function ProviderGrid({ items }: { items: ApiProvider[] }) {
  const [open, setOpen] = useState<ApiProvider | null>(null);
  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-3 md:gap-4">
        {items.map((p) => <ProviderCard key={p.id} p={p} onOpen={setOpen} />)}
      </div>
      <IframeOverlay
        open={!!open}
        url={open?.iframeUrl ?? ""}
        title={open?.name ?? ""}
        onClose={() => setOpen(null)}
      />
    </>
  );
}
