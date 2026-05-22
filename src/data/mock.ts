import {
  Gamepad2, Sparkles, Trophy, Wallet, Gift, Zap, Target, Crown,
  Flame, Star, Rocket, Diamond, Coins, Award, ShieldCheck, Hexagon,
  CircuitBoard, Joystick,
} from "lucide-react";

export const user = {
  name: "Alex Rivers",
  username: "@alexr",
  email: "alex@lootminer.gg",
  balance: 12847,
  level: 27,
  xp: 6820,
  xpMax: 10000,
  streak: 14,
  joined: "Mar 2024",
};

export type Provider = {
  id: string;
  name: string;
  icon: typeof Sparkles;
  payoutFrom: number;
  payoutTo: number;
  completions: string;
  gradient: string;
  badge?: "HOT" | "NEW" | "TOP";
};

export const providers: Provider[] = [
  { id: "adgate", name: "AdGate", icon: Sparkles, payoutFrom: 50, payoutTo: 2400, completions: "12.4k", gradient: "from-cyan-500/30 to-blue-600/30", badge: "HOT" },
  { id: "bitlabs", name: "BitLabs", icon: CircuitBoard, payoutFrom: 80, payoutTo: 1800, completions: "9.1k", gradient: "from-violet-500/30 to-fuchsia-600/30", badge: "TOP" },
  { id: "cpx", name: "CPX Research", icon: Target, payoutFrom: 100, payoutTo: 3200, completions: "18.7k", gradient: "from-emerald-500/30 to-teal-600/30" },
  { id: "lootably", name: "Lootably", icon: Diamond, payoutFrom: 60, payoutTo: 2100, completions: "7.8k", gradient: "from-pink-500/30 to-rose-600/30", badge: "NEW" },
  { id: "pollfish", name: "Pollfish", icon: Hexagon, payoutFrom: 40, payoutTo: 900, completions: "22.3k", gradient: "from-orange-500/30 to-amber-600/30" },
  { id: "revu", name: "Revenue Universe", icon: Rocket, payoutFrom: 120, payoutTo: 4500, completions: "5.6k", gradient: "from-indigo-500/30 to-purple-600/30", badge: "TOP" },
  { id: "ayet", name: "AyeT Studios", icon: Joystick, payoutFrom: 70, payoutTo: 2800, completions: "8.9k", gradient: "from-lime-500/30 to-green-600/30" },
  { id: "torox", name: "Torox", icon: Zap, payoutFrom: 90, payoutTo: 2200, completions: "6.2k", gradient: "from-yellow-500/30 to-orange-600/30" },
  { id: "monlix", name: "Monlix", icon: Flame, payoutFrom: 110, payoutTo: 3600, completions: "4.4k", gradient: "from-red-500/30 to-pink-600/30", badge: "HOT" },
  { id: "kiwiwall", name: "Kiwiwall", icon: Star, payoutFrom: 50, payoutTo: 1500, completions: "11.0k", gradient: "from-teal-500/30 to-cyan-600/30" },
  { id: "offertoro", name: "OfferToro", icon: Gift, payoutFrom: 80, payoutTo: 2900, completions: "14.5k", gradient: "from-fuchsia-500/30 to-violet-600/30" },
  { id: "adscend", name: "Adscend Media", icon: Award, payoutFrom: 60, payoutTo: 2000, completions: "9.7k", gradient: "from-sky-500/30 to-indigo-600/30" },
  { id: "wannads", name: "Wannads", icon: Crown, payoutFrom: 100, payoutTo: 3100, completions: "8.1k", gradient: "from-amber-500/30 to-yellow-600/30", badge: "TOP" },
  { id: "tapjoy", name: "Tapjoy", icon: Gamepad2, payoutFrom: 75, payoutTo: 2600, completions: "16.3k", gradient: "from-purple-500/30 to-pink-600/30" },
  { id: "ironsource", name: "ironSource", icon: ShieldCheck, payoutFrom: 90, payoutTo: 3300, completions: "10.2k", gradient: "from-blue-500/30 to-cyan-600/30" },
  { id: "fyber", name: "Fyber", icon: Trophy, payoutFrom: 65, payoutTo: 2400, completions: "7.4k", gradient: "from-rose-500/30 to-red-600/30" },
  { id: "primewall", name: "PrimeWall", icon: Coins, payoutFrom: 55, payoutTo: 1900, completions: "5.9k", gradient: "from-green-500/30 to-emerald-600/30", badge: "NEW" },
  { id: "notik", name: "Notik", icon: Wallet, payoutFrom: 85, payoutTo: 2700, completions: "6.8k", gradient: "from-violet-500/30 to-indigo-600/30" },
];

export const activity = [
  { id: 1, provider: "BitLabs", task: "Survey completed", amount: 240, time: "2m ago", type: "earn" as const },
  { id: 2, provider: "AdGate", task: "App install — Coin Master", amount: 1200, time: "18m ago", type: "earn" as const },
  { id: 3, provider: "Cashout", task: "PayPal withdrawal", amount: -5000, time: "1h ago", type: "cashout" as const },
  { id: 4, provider: "CPX Research", task: "Survey completed", amount: 180, time: "3h ago", type: "earn" as const },
  { id: 5, provider: "Daily Bonus", task: "14-day streak reward", amount: 500, time: "Today", type: "bonus" as const },
  { id: 6, provider: "Lootably", task: "Offer completed", amount: 850, time: "Yesterday", type: "earn" as const },
];

export const payoutMethods = [
  { id: "paypal", name: "PayPal", min: 5, fee: "0%", time: "Instant", gradient: "from-blue-500/30 to-cyan-500/30", icon: Wallet },
  { id: "btc", name: "Bitcoin", min: 10, fee: "Network", time: "~30 min", gradient: "from-amber-500/30 to-orange-500/30", icon: Coins },
  { id: "eth", name: "Ethereum", min: 10, fee: "Network", time: "~5 min", gradient: "from-indigo-500/30 to-violet-500/30", icon: Hexagon },
  { id: "ltc", name: "Litecoin", min: 5, fee: "Network", time: "~10 min", gradient: "from-slate-400/30 to-zinc-500/30", icon: Diamond },
  { id: "amazon", name: "Amazon Gift Card", min: 3, fee: "0%", time: "1–24 hrs", gradient: "from-orange-500/30 to-yellow-500/30", icon: Gift },
  { id: "steam", name: "Steam Wallet", min: 5, fee: "0%", time: "Instant", gradient: "from-slate-700/40 to-blue-700/40", icon: Gamepad2 },
  { id: "visa", name: "Visa Prepaid", min: 25, fee: "2%", time: "1–3 days", gradient: "from-blue-600/30 to-indigo-600/30", icon: ShieldCheck },
  { id: "google", name: "Google Play", min: 3, fee: "0%", time: "Instant", gradient: "from-green-500/30 to-emerald-500/30", icon: Star },
];

export const achievements = [
  { id: 1, name: "First Cashout", desc: "Withdraw your first reward", icon: Wallet, unlocked: true, points: 100 },
  { id: 2, name: "Survey Master", desc: "Complete 50 surveys", icon: Target, unlocked: true, points: 250 },
  { id: 3, name: "Streak Hunter", desc: "Maintain a 14-day streak", icon: Flame, unlocked: true, points: 500 },
  { id: 4, name: "High Roller", desc: "Earn 10,000 coins in a day", icon: Crown, unlocked: false, points: 1000 },
  { id: 5, name: "Loyalty Legend", desc: "Reach level 50", icon: Trophy, unlocked: false, points: 2000 },
  { id: 6, name: "Diamond Tier", desc: "Earn 100k lifetime", icon: Diamond, unlocked: false, points: 5000 },
];

export const leaderboard = [
  { rank: 1, name: "Nova_X", earned: 48720, avatar: "N" },
  { rank: 2, name: "PixelKing", earned: 42100, avatar: "P" },
  { rank: 3, name: "GhostByte", earned: 39850, avatar: "G" },
  { rank: 4, name: "Alex Rivers", earned: 12847, avatar: "A", you: true },
  { rank: 5, name: "ZeroCool", earned: 11200, avatar: "Z" },
];
