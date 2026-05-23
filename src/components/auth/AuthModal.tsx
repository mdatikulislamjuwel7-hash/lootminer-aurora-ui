import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";
import { Logo } from "@/components/common/Logo";
import { Check, Shuffle } from "lucide-react";

const AVATAR_STYLE = "bottts-neutral";
const dicebearUrl = (seed: string) =>
  `https://api.dicebear.com/9.x/${AVATAR_STYLE}/svg?seed=${encodeURIComponent(seed)}&radius=20`;
const randomSeed = () => Math.random().toString(36).slice(2, 10);
const makeAvatars = () => Array.from({ length: 8 }, () => randomSeed());

export function AuthModal({
  open, mode, onOpenChange,
}: { open: boolean; mode: "signin" | "signup"; onOpenChange: (v: boolean) => void }) {
  const nav = useNavigate();
  const { login, register } = useAuth();
  const [tab, setTab] = useState<"signin" | "signup">(mode);
  const [avatars, setAvatars] = useState<string[]>(() => makeAvatars());
  const [selected, setSelected] = useState<string>(avatars[0]);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null); setBusy(true);
    try {
      await login(email, password);
      toast.success("Signed in");
      onOpenChange(false);
      nav({ to: "/dashboard" });
    } catch (e: any) {
      const msg = e?.response?.data?.message || e?.message || "Sign-in failed";
      setErr(msg); toast.error(msg);
    } finally { setBusy(false); }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null); setBusy(true);
    try {
      await register({ username, email, password, avatar: selected });
      toast.success("Account created");
      onOpenChange(false);
      nav({ to: "/dashboard" });
    } catch (e: any) {
      const msg = e?.response?.data?.message || e?.message || "Sign-up failed";
      setErr(msg); toast.error(msg);
    } finally { setBusy(false); }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md p-0 border-border bg-card/95 backdrop-blur-2xl overflow-hidden">
        <div className="relative">
          <div className="absolute -top-20 -right-20 h-56 w-56 rounded-full bg-gradient-primary opacity-30 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 h-56 w-56 rounded-full bg-gradient-accent opacity-30 blur-3xl" />
          <div className="relative p-6">
            <div className="mb-4 flex items-center justify-center">
              <Logo to="/" size="lg" />
            </div>
            <DialogHeader>
              <DialogTitle className="font-display text-2xl text-center">
                {tab === "signin" ? "Welcome back" : "Start earning XP"}
              </DialogTitle>
              <p className="text-sm text-muted-foreground text-center">
                {tab === "signin" ? "Sign in to your LootMiner account." : "Create an account in seconds."}
              </p>
            </DialogHeader>

            <div className="mt-4 inline-flex rounded-xl bg-card/60 p-1 border border-border">
              <button type="button" onClick={() => setTab("signin")}
                className={`rounded-lg px-4 py-1.5 text-sm font-medium transition ${tab === "signin" ? "bg-gradient-primary text-primary-foreground shadow-glow-primary" : "text-muted-foreground"}`}
              >Sign In</button>
              <button type="button" onClick={() => setTab("signup")}
                className={`rounded-lg px-4 py-1.5 text-sm font-medium transition ${tab === "signup" ? "bg-gradient-primary text-primary-foreground shadow-glow-primary" : "text-muted-foreground"}`}
              >Sign Up</button>
            </div>

            {err && <div className="mt-3 rounded-lg bg-destructive/15 px-3 py-2 text-xs text-destructive">{err}</div>}

            {tab === "signin" ? (
              <form onSubmit={handleSignIn} className="mt-5 space-y-3">
                <Field label="Email" type="email" placeholder="you@mail.com" required value={email} onChange={(e) => setEmail(e.target.value)} />
                <Field label="Password" type="password" placeholder="••••••••" required value={password} onChange={(e) => setPassword(e.target.value)} />
                <button type="submit" disabled={busy} className="w-full rounded-xl bg-gradient-primary py-3 text-sm font-semibold text-primary-foreground shadow-glow-primary hover:opacity-95 transition disabled:opacity-60">
                  {busy ? "Signing in…" : "Sign In"}
                </button>
              </form>
            ) : (
              <form onSubmit={handleSignUp} className="mt-5 space-y-4">
                <div>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-display text-sm font-semibold">Choose your avatar</div>
                      <p className="text-xs text-muted-foreground">Pick one or shuffle</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const next = makeAvatars();
                        setAvatars(next);
                        setSelected(next[0]);
                      }}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card/60 px-2.5 py-1.5 text-xs text-muted-foreground hover:text-foreground hover:border-primary/50 transition"
                    >
                      <Shuffle className="h-3.5 w-3.5" /> Shuffle
                    </button>
                  </div>
                  <div className="mt-3 grid grid-cols-4 gap-2">
                    {avatars.map((seed) => {
                      const isSel = selected === seed;
                      return (
                        <button key={seed} type="button" onClick={() => setSelected(seed)}
                          className={`group relative aspect-square rounded-2xl border transition overflow-hidden ${isSel ? "border-primary shadow-glow-primary" : "border-border hover:border-primary/50"}`}>
                          <img
                            src={dicebearUrl(seed)}
                            alt="avatar"
                            loading="lazy"
                            className="absolute inset-1 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20"
                          />
                          {isSel && (
                            <div className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-gradient-primary shadow-glow-primary text-primary-foreground">
                              <Check className="h-3 w-3" />
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
                <Field label="Username" placeholder="CrystalMiner" value={username} onChange={(e) => setUsername(e.target.value)} required />
                <Field label="Email" type="email" placeholder="you@mail.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
                <Field label="Password" type="password" placeholder="•••••••• (8+ chars)" value={password} onChange={(e) => setPassword(e.target.value)} required />
                <button type="submit" disabled={busy} className="w-full rounded-xl bg-gradient-primary py-3 text-sm font-semibold text-primary-foreground shadow-glow-primary hover:opacity-95 transition disabled:opacity-60">
                  {busy ? "Creating…" : "Create Account"}
                </button>
              </form>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function Field({ label, ...rest }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <span className="text-xs uppercase tracking-widest text-muted-foreground">{label}</span>
      <input
        {...rest}
        className="mt-1.5 w-full rounded-xl bg-card/60 border border-border px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary placeholder:text-muted-foreground/60"
      />
    </label>
  );
}
