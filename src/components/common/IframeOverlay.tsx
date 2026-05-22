import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, RotateCw, ExternalLink } from "lucide-react";

export function IframeOverlay({
  open, url, title, onClose,
}: { open: boolean; url: string; title: string; onClose: () => void }) {
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex flex-col bg-background/95 backdrop-blur-xl"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        >
          <div className="flex items-center gap-2 border-b border-border px-3 py-2.5 glass">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center gap-1.5 rounded-xl bg-card/70 hover:bg-card px-3 py-1.5 text-sm font-medium transition"
            >
              <X className="h-4 w-4" /> Close
            </button>
            <div className="ml-2 truncate font-display font-semibold">{title}</div>
            <div className="ml-auto flex items-center gap-2">
              <button
                type="button"
                aria-label="Reload"
                onClick={() => {
                  const ifr = document.getElementById("provider-iframe") as HTMLIFrameElement | null;
                  if (ifr) ifr.src = ifr.src;
                }}
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-card/70 hover:bg-card transition"
              >
                <RotateCw className="h-4 w-4" />
              </button>
              <a
                href={url} target="_blank" rel="noreferrer"
                className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-primary px-3 py-1.5 text-sm font-semibold text-primary-foreground shadow-glow-primary"
              >
                <ExternalLink className="h-4 w-4" /> External
              </a>
            </div>
          </div>
          <motion.div
            className="relative m-3 flex-1 overflow-hidden rounded-2xl border border-border bg-card shadow-card"
            initial={{ y: 24, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.05 }}
          >
            <div className="absolute inset-0 bg-gradient-mesh opacity-30 pointer-events-none" />
            <iframe
              id="provider-iframe"
              src={url}
              title={title}
              className="relative h-full w-full bg-background"
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
