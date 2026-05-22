import { useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, RotateCw, ExternalLink } from "lucide-react";

export function IframeOverlay({
  open, url, title, onClose,
}: { open: boolean; url: string; title: string; onClose: () => void }) {
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (typeof document === "undefined") return null;

  const node = (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[2147483000] flex flex-col bg-[oklch(0.06_0.01_260/0.92)] backdrop-blur-2xl"
          style={{ width: "100vw", height: "100dvh", top: 0, left: 0 }}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          transition={{ duration: 0.22 }}
        >
          {/* premium dark glass header */}
          <div
            className="relative flex items-center gap-2 px-3 py-2.5 border-b border-white/10 bg-[oklch(0.1_0.02_265/0.85)] backdrop-blur-xl shadow-[0_8px_32px_oklch(0_0_0/0.5)]"
            style={{ paddingTop: "max(0.625rem, env(safe-area-inset-top))" }}
          >
            <div className="pointer-events-none absolute inset-x-0 -bottom-px h-px bg-gradient-to-r from-transparent via-[oklch(0.82_0.15_200/0.6)] to-transparent" />
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center gap-1.5 rounded-xl bg-white/5 hover:bg-white/10 active:scale-95 px-3 py-2 text-sm font-medium transition border border-white/10"
            >
              <X className="h-4 w-4" /> <span className="hidden sm:inline">Close</span>
            </button>
            <div className="ml-1 truncate font-display font-semibold text-foreground/90">{title}</div>
            <div className="ml-auto flex items-center gap-2">
              <button
                type="button"
                aria-label="Reload"
                onClick={() => {
                  const ifr = document.getElementById("provider-iframe") as HTMLIFrameElement | null;
                  if (ifr) ifr.src = ifr.src;
                }}
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/5 hover:bg-white/10 active:scale-95 transition border border-white/10"
              >
                <RotateCw className="h-4 w-4" />
              </button>
              <a
                href={url} target="_blank" rel="noreferrer"
                className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-primary px-3 py-2 text-sm font-semibold text-primary-foreground shadow-glow-primary"
              >
                <ExternalLink className="h-4 w-4" /> <span className="hidden sm:inline">External</span>
              </a>
            </div>
          </div>

          {/* iframe fills the rest */}
          <div className="relative flex-1 min-h-0 bg-background">
            <iframe
              id="provider-iframe"
              src={url}
              title={title}
              className="absolute inset-0 h-full w-full border-0 bg-background"
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return createPortal(node, document.body);
}
