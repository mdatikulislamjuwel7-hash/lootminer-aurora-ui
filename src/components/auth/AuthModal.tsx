import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useNavigate } from "@tanstack/react-router";
import { signIn } from "@/lib/auth";
import { Check, Diamond, Flame, Crown, Hexagon, Rocket, Star, Sparkles, Zap } from "lucide-react";

const avatars = [
  { id: "diamond", icon: Diamond, color: "from-cyan-400 to-blue-500" },
  { id: "flame", icon: Flame, color: "from-orange-400 to-rose-500" },
  { id: "crown", icon: Crown, color: "from-amber-400 to-yellow-500" },
  { id: "hex", icon: Hexagon, color: "from-violet-400 to-fuchsia-500" },
  { id: "rocket", icon: Rocket, color: "from-emerald-400 to-teal-500" },
  { id: "star", icon: Star, color: "from-pink-400 to-rose-500" },
  { id: "sparkle", icon: Sparkles, color: "from-indigo-400 to-violet-500" },
  { id: "zap", icon: Zap, color: "from-lime-400 to-green-500" },
];

export function AuthModal({
  open, mode, onOpenChange,
}: { open: boolean; mode: "signin" | "signup"; onOpenChange: (v: boolean) => void }) {
  const nav = useNavigate();
  const [tab, setTab] = useState<"signin" | "signup">(mode);
  const [selected, setSelected] = useState("diamond");
  const [username, setUsername] = useState("");

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    signIn("CrystalMiner", "CM");
    onOpenChange(false);
    nav({ to: "/dashboard" });
  };
  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    signIn(username || "CrystalMiner", (username || "CM").slice(0, 2).toUpperCase());
    onOpenChange(false);
    nav({ to: "/dashboard" });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md p-0 border-border bg-card/95 backdrop-blur-2xl overflow-hidden">
        <div className="relative">
          <div className="absolute -top-20 -right-20 h-56 w-56 rounded-full bg-gradient-primary opacity-30 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 h-56 w-56 rounded-full bg-gradient-accent opacity-30 blur-3xl" />
          <div className="relative p-6">
            <DialogHeader>
              <DialogTitle className="font-display text-2xl">
                {tab === "signin" ? "Welcome back" : "Start earning XP"}
              </DialogTitle>
              <p className="text-sm text-muted-foreground">
                {tab === "signin" ? "Sign in to your LootMiner account." : "Create an account in seconds."}
              </p>
            </DialogHeader>

            <div className="mt-4 inline-flex rounded-xl bg-card/60 p-1 border border-border">
              <button
                type="button"
                onClick={() => setTab("signin")}
                className={`rounded-lg px-4 py-1.5 text-sm font-medium transition ${tab === "signin" ? "bg-gradient-primary text-primary-foreground shadow-glow-primary" : "text-muted-foreground"}`}
              >Sign In</button>
              <button
                type="button"
                onClick={() => setTab("signup")}
                className={`rounded-lg px-4 py-1.5 text-sm font-medium transition ${tab === "signup" ? "bg-gradient-primary text-primary-foreground shadow-glow-primary" : "text-muted-foreground"}`}
              >Sign Up</button>
            </div>

            {tab === "signin" ? (
              <form onSubmit={handleSignIn} className="mt-5 space-y-3">
                <Field label="Email" type="email" placeholder="you@mail.com" required />
                <Field label="Password" type="password" placeholder="••••••••" required />
                <button type="submit" className="w-full rounded-xl bg-gradient-primary py-3 text-sm font-semibold text-primary-foreground shadow-glow-primary hover:opacity-95 transition">
                  Sign In
                </button>
              </form>
            ) : (
              <form onSubmit={handleSignUp} className="mt-5 space-y-4">
                <div>
                  <div className="font-display text-sm font-semibold">Choose your avatar</div>
                  <p className="text-xs text-muted-foreground">Pick a profile badge</p>
                  <div className="mt-3 grid grid-cols-4 gap-2">
                    {avatars.map((a) => {
                      const Icon = a.icon;
                      const isSel = selected === a.id;
                      return (
                        <button
                          key={a.id}
                          type="button"
                          onClick={() => setSelected(a.id)}
                          className={`group relative aspect-square rounded-2xl border transition ${isSel ? "border-primary shadow-glow-primary" : "border-border hover:border-primary/50"}`}
                        >
                          <div className={`absolute inset-1 rounded-xl bg-gradient-to-br ${a.color} flex items-center justify-center`}>
                            <Icon className="h-5 w-5 text-white" />
                          </div>
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
                <Field label="Email" type="email" placeholder="you@mail.com" required />
                <Field label="Password" type="password" placeholder="•••••••• (8+ chars)" required />
                <button type="submit" className="w-full rounded-xl bg-gradient-primary py-3 text-sm font-semibold text-primary-foreground shadow-glow-primary hover:opacity-95 transition">
                  Create Account
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
