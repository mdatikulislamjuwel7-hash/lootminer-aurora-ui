import {
  Gamepad2, Sparkles, Trophy, Wallet, Gift, Zap, Target, Crown,
  Flame, Star, Rocket, Diamond, Coins, Award, ShieldCheck, Hexagon,
  CircuitBoard, Joystick, Layers, Atom, Compass, Cpu, Orbit, Boxes,
} from "lucide-react";

/* ───────── user ───────── */
export const mockUser = {
  username: "CrystalMiner",
  userID: "bd90cd31-96f7-48e9-815e-7296f974dc94",
  balanceXp: 12450,
  totalEarned: 28900,
  todayEarned: 750,
  pendingXp: 320,
  level: 7,
  xpToNext: 5500,
  xpForNext: 8000,
  streak: 4,
  referralCode: "CRYSTAL91",
  avatar: "CM",
  country: "BD",
  email: "crystal@lootminer.gg",
  joinDate: "2024-09-12",
  emailVerified: true,
  accountPrivate: false,
};

/* ───────── providers ───────── */
export type Provider = {
  id: string;
  name: string;
  slug: string;
  type: "offerwall" | "survey";
  icon: typeof Sparkles;
  rating: number;
  iframeUrl: string;
  gradient: string;
  isTopOffer?: boolean;
  enabled: boolean;
};

export const mockOfferwalls: Provider[] = [
  { id: "adgem", name: "AdGem", slug: "adgem", type: "offerwall", icon: Diamond, rating: 4.8, iframeUrl: "https://example.com/adgem", gradient: "from-cyan-500/40 to-blue-600/30", isTopOffer: true, enabled: true },
  { id: "lootably", name: "Lootably", slug: "lootably", type: "offerwall", icon: Sparkles, rating: 4.7, iframeUrl: "https://example.com/lootably", gradient: "from-violet-500/40 to-fuchsia-600/30", isTopOffer: true, enabled: true },
  { id: "monlix", name: "Monlix", slug: "monlix", type: "offerwall", icon: Flame, rating: 4.6, iframeUrl: "https://example.com/monlix", gradient: "from-pink-500/40 to-rose-600/30", isTopOffer: true, enabled: true },
  { id: "timewall", name: "TimeWall", slug: "timewall", type: "offerwall", icon: Hexagon, rating: 4.5, iframeUrl: "https://example.com/timewall", gradient: "from-emerald-500/40 to-teal-600/30", enabled: true },
  { id: "notik", name: "Notik", slug: "notik", type: "offerwall", icon: Zap, rating: 4.4, iframeUrl: "https://example.com/notik", gradient: "from-amber-500/40 to-orange-600/30", enabled: true },
  { id: "offery", name: "Offery", slug: "offery", type: "offerwall", icon: Gift, rating: 4.3, iframeUrl: "https://example.com/offery", gradient: "from-indigo-500/40 to-purple-600/30", enabled: true },
  { id: "upwall", name: "Upwall", slug: "upwall", type: "offerwall", icon: Rocket, rating: 4.5, iframeUrl: "https://example.com/upwall", gradient: "from-lime-500/40 to-green-600/30", isTopOffer: true, enabled: true },
  { id: "radientwall", name: "Radientwall", slug: "radientwall", type: "offerwall", icon: Orbit, rating: 4.2, iframeUrl: "https://example.com/radientwall", gradient: "from-yellow-500/40 to-amber-600/30", enabled: true },
  { id: "pubscale", name: "PubScale", slug: "pubscale", type: "offerwall", icon: Layers, rating: 4.6, iframeUrl: "https://example.com/pubscale", gradient: "from-sky-500/40 to-cyan-600/30", enabled: true },
  { id: "pixylabs", name: "Pixylabs", slug: "pixylabs", type: "offerwall", icon: Boxes, rating: 4.1, iframeUrl: "https://example.com/pixylabs", gradient: "from-fuchsia-500/40 to-pink-600/30", enabled: false },
  { id: "vortexwall", name: "Vortexwall", slug: "vortexwall", type: "offerwall", icon: Atom, rating: 4.7, iframeUrl: "https://example.com/vortexwall", gradient: "from-violet-500/40 to-indigo-600/30", isTopOffer: true, enabled: true },
  { id: "ayet", name: "AyeT", slug: "ayet", type: "offerwall", icon: Joystick, rating: 4.4, iframeUrl: "https://example.com/ayet", gradient: "from-teal-500/40 to-emerald-600/30", enabled: true },
];

export const mockSurveys: Provider[] = [
  { id: "bitlabs", name: "BitLabs", slug: "bitlabs", type: "survey", icon: CircuitBoard, rating: 4.8, iframeUrl: "https://example.com/bitlabs", gradient: "from-cyan-500/40 to-teal-600/30", isTopOffer: true, enabled: true },
  { id: "cpx", name: "CPX Research", slug: "cpx", type: "survey", icon: Target, rating: 4.7, iframeUrl: "https://example.com/cpx", gradient: "from-violet-500/40 to-purple-600/30", isTopOffer: true, enabled: true },
  { id: "pollmine", name: "Poll Mine", slug: "pollmine", type: "survey", icon: Compass, rating: 4.5, iframeUrl: "https://example.com/pollmine", gradient: "from-emerald-500/40 to-lime-600/30", enabled: true },
  { id: "pollfish", name: "Pollfish", slug: "pollfish", type: "survey", icon: Cpu, rating: 4.4, iframeUrl: "https://example.com/pollfish", gradient: "from-amber-500/40 to-yellow-600/30", enabled: true },
  { id: "theoremreach", name: "TheoremReach", slug: "theoremreach", type: "survey", icon: Hexagon, rating: 4.3, iframeUrl: "https://example.com/theoremreach", gradient: "from-rose-500/40 to-pink-600/30", enabled: true },
  { id: "yoursurveys", name: "YourSurveys", slug: "yoursurveys", type: "survey", icon: Star, rating: 4.2, iframeUrl: "https://example.com/yoursurveys", gradient: "from-indigo-500/40 to-blue-600/30", enabled: false },
];

/* ───────── top offers ───────── */
export type TopOffer = {
  id: string; title: string; provider: string; description: string;
  xp: number; gradient: string; icon: typeof Sparkles; featured?: boolean;
  url: string;
};
export const mockTopOffers: TopOffer[] = [
  { id: "to1", title: "Install & reach Level 10", provider: "AdGem", description: "Install the game and reach level 10 within 7 days.", xp: 12500, gradient: "from-cyan-500/30 to-blue-600/30", icon: Gamepad2, featured: true, url: "https://example.com/offer1" },
  { id: "to2", title: "Complete the Tutorial", provider: "Lootably", description: "Finish the in-app tutorial. Fastest payout.", xp: 4200, gradient: "from-violet-500/30 to-fuchsia-600/30", icon: Sparkles, featured: true, url: "https://example.com/offer2" },
  { id: "to3", title: "Sign-up + Verify", provider: "Monlix", description: "Create account and verify email.", xp: 1800, gradient: "from-pink-500/30 to-rose-600/30", icon: Award, url: "https://example.com/offer3" },
  { id: "to4", title: "Deposit $10 in Crypto", provider: "BitLabs", description: "First-time KYC verified deposit.", xp: 28000, gradient: "from-amber-500/30 to-orange-600/30", icon: Diamond, featured: true, url: "https://example.com/offer4" },
  { id: "to5", title: "Watch 10 Videos", provider: "TimeWall", description: "Watch 10 short rewarded videos.", xp: 950, gradient: "from-emerald-500/30 to-teal-600/30", icon: Rocket, url: "https://example.com/offer5" },
  { id: "to6", title: "Daily Survey Bundle", provider: "CPX Research", description: "Complete 3 surveys back-to-back.", xp: 3400, gradient: "from-indigo-500/30 to-purple-600/30", icon: Target, url: "https://example.com/offer6" },
  { id: "to7", title: "Reach 5,000 score", provider: "Upwall", description: "Reach 5k score in the puzzle game.", xp: 6800, gradient: "from-lime-500/30 to-green-600/30", icon: Trophy, url: "https://example.com/offer7" },
  { id: "to8", title: "Subscribe trial", provider: "Notik", description: "Start free trial, cancel anytime.", xp: 9500, gradient: "from-fuchsia-500/30 to-pink-600/30", icon: Crown, url: "https://example.com/offer8" },
];

/* ───────── live leads ───────── */
const fakeNames = ["Nova_X", "PixelKing", "GhostByte", "ZeroCool", "Aurora", "Hex77", "QuantumQ", "Vex", "Lyra", "Drift", "Echo", "Forge", "Halo", "Iris", "Jett", "Kira", "Lumen", "Mako", "Onyx", "Pulse"];
const providerNames = ["AdGem", "Lootably", "Monlix", "TimeWall", "BitLabs", "CPX Research", "Notik", "Upwall"];
export const mockLeads = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  user: fakeNames[i % fakeNames.length],
  avatar: fakeNames[i % fakeNames.length][0],
  provider: providerNames[i % providerNames.length],
  offer: ["Survey", "App install", "Sign-up", "Trial", "Video bundle", "Tutorial"][i % 6],
  xp: [250, 480, 1200, 2400, 850, 4200, 320, 6800][i % 8],
  ago: `${(i % 9) + 1}m ago`,
}));

/* ───────── stats ───────── */
export const mockStats = {
  members: "248,310",
  xpPaid: "412,840,000",
  offers: "1.8M",
  payouts: "$2.4M",
};

/* ───────── activity ───────── */
export const mockActivities = [
  { id: 1, provider: "BitLabs", offer: "Survey completed", xp: 240, time: "2m ago", status: "Credited" },
  { id: 2, provider: "AdGem", offer: "Install — Coin Master", xp: 1200, time: "18m ago", status: "Credited" },
  { id: 3, provider: "Cashout", offer: "PayPal withdrawal", xp: -5000, time: "1h ago", status: "Pending" },
  { id: 4, provider: "CPX Research", offer: "Survey completed", xp: 180, time: "3h ago", status: "Credited" },
  { id: 5, provider: "Daily Bonus", offer: "Streak reward", xp: 500, time: "Today", status: "Credited" },
];

/* ───────── payment methods ───────── */
export const mockPaymentMethods = [
  { id: "paypal", name: "PayPal", min: 500, fee: "0%", time: "Instant", gradient: "from-blue-500/40 to-cyan-500/30", icon: Wallet },
  { id: "btc", name: "Bitcoin", min: 1000, fee: "Network", time: "~30 min", gradient: "from-amber-500/40 to-orange-500/30", icon: Coins },
  { id: "amazon", name: "Amazon Gift Card", min: 300, fee: "0%", time: "1–24 hrs", gradient: "from-orange-500/40 to-yellow-500/30", icon: Gift },
  { id: "bank", name: "Bank Transfer", min: 2500, fee: "1%", time: "1–3 days", gradient: "from-indigo-500/40 to-violet-500/30", icon: ShieldCheck },
];

export const mockCashouts = [
  { id: 1, method: "PayPal", xp: 5000, usd: 5.0, status: "Approved" as const, date: "2026-05-18", account: "alex@mail.com" },
  { id: 2, method: "Bitcoin", xp: 12000, usd: 12.0, status: "Pending" as const, date: "2026-05-20", account: "bc1q...x4k" },
  { id: 3, method: "Amazon", xp: 3000, usd: 3.0, status: "Approved" as const, date: "2026-05-09", account: "alex@mail.com" },
  { id: 4, method: "PayPal", xp: 7500, usd: 7.5, status: "Rejected" as const, date: "2026-04-28", account: "old@mail.com" },
];

/* ───────── achievements ───────── */
export const mockAchievements = [
  { id: 1, name: "First Crystal", desc: "Complete your first offer", icon: Diamond, unlocked: true, xp: 250 },
  { id: 2, name: "Survey Sage", desc: "Complete 50 surveys", icon: Target, unlocked: true, xp: 1500 },
  { id: 3, name: "Streak Hunter", desc: "Maintain a 14-day streak", icon: Flame, unlocked: false, xp: 3500 },
  { id: 4, name: "High Roller", desc: "Earn 10,000 XP in a day", icon: Crown, unlocked: false, xp: 5000 },
  { id: 5, name: "Loyalty Legend", desc: "Reach level 25", icon: Trophy, unlocked: false, xp: 10000 },
  { id: 6, name: "Diamond Tier", desc: "Earn 100k lifetime", icon: Star, unlocked: false, xp: 25000 },
];

/* ───────── promos / rewards ───────── */
export const mockPromoHistory = [
  { id: 1, code: "WELCOME500", xp: 500, claimed: "2026-04-12" },
  { id: 2, code: "MAYBOOST", xp: 1200, claimed: "2026-05-01" },
];
export const mockRewardCalendar = Array.from({ length: 30 }, (_, i) => ({
  day: i + 1, xp: 100 + i * 25, claimed: i < 4, today: i === 4,
}));

/* ───────── leaderboard ───────── */
export const mockLeaderboard = Array.from({ length: 50 }, (_, i) => {
  const xp = Math.round(50000 - i * (820 + (i % 5) * 60));
  return {
    rank: i + 1,
    name: i === 0 ? "Nova_X" : i === 1 ? "PixelKing" : i === 2 ? "GhostByte" : `${fakeNames[i % fakeNames.length]}${i}`,
    avatar: (i === 0 ? "N" : i === 1 ? "P" : i === 2 ? "G" : fakeNames[i % fakeNames.length][0]),
    level: Math.max(3, 35 - Math.floor(i / 2)),
    xp,
    change: i % 3 === 0 ? "+2" : i % 3 === 1 ? "-1" : "0",
    you: i === 6,
  };
});

/* ───────── referrals ───────── */
export const mockReferrals = [
  { id: 1, username: "AuroraK", joined: "2026-05-12", status: "Active", xp: 1200 },
  { id: 2, username: "Hex77", joined: "2026-05-08", status: "Active", xp: 480 },
  { id: 3, username: "Drift", joined: "2026-04-28", status: "Pending", xp: 0 },
  { id: 4, username: "Mako", joined: "2026-04-19", status: "Active", xp: 2400 },
  { id: 5, username: "Pulse", joined: "2026-04-03", status: "Active", xp: 850 },
];

/* ───────── FAQ ───────── */
export const mockFAQs = [
  { q: "What is LootMiner?", a: "A premium rewards platform that pays you XP for completing offers, surveys, and tasks. Cash out anytime." },
  { q: "Is LootMiner free?", a: "Yes. 100% free to join. No subscription, no hidden fees." },
  { q: "How fast are cashouts?", a: "PayPal and gift cards are instant. Bitcoin takes about 30 minutes." },
  { q: "How is XP calculated?", a: "1,000 XP = $1.00 USD. Higher offers reward more XP." },
  { q: "Why didn't my offer credit?", a: "Some offers track within 24 hours. If still missing, contact support with your transaction ID." },
  { q: "Is my data safe?", a: "Yes — bank-grade encryption. We never sell your data." },
  { q: "Can I use a VPN?", a: "No. VPNs and proxies block crediting and trigger account review." },
  { q: "Do you have a referral program?", a: "Yes — earn 10% of everything your friends earn, for life." },
];

/* ───────── admin ───────── */
export const mockAdminStats = {
  totalUsers: 248310,
  todaySignups: 1284,
  xpPaid: 412840000,
  pendingCashouts: 38,
  userTodayEarnings: 18420,
  userMonthlyEarnings: 412840,
  myTodayRevenue: 2840,
  myMonthlyRevenue: 84120,
};
export const mockChartData = {
  signups: [
    { day: "Mon", v: 980 }, { day: "Tue", v: 1240 }, { day: "Wed", v: 1080 },
    { day: "Thu", v: 1420 }, { day: "Fri", v: 1680 }, { day: "Sat", v: 1380 }, { day: "Sun", v: 1284 },
  ],
  xpDist: [
    { day: "Mon", v: 1.2e6 }, { day: "Tue", v: 1.6e6 }, { day: "Wed", v: 1.4e6 },
    { day: "Thu", v: 1.9e6 }, { day: "Fri", v: 2.4e6 }, { day: "Sat", v: 2.1e6 }, { day: "Sun", v: 1.8e6 },
  ],
};
export const mockAdminUsers = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  avatar: fakeNames[i % fakeNames.length][0],
  username: fakeNames[i % fakeNames.length] + (i > 9 ? i : ""),
  userID: `usr-${1000 + i}`,
  email: `${fakeNames[i % fakeNames.length].toLowerCase()}${i}@mail.com`,
  level: ((i * 3) % 30) + 1,
  balance: 1200 + i * 240,
  role: i === 0 ? "admin" : "user",
  joined: `2026-0${(i % 5) + 1}-${(i % 27) + 1}`,
  banned: i === 7,
}));
export const mockAdminCashouts = Array.from({ length: 12 }, (_, i) => ({
  id: i + 1,
  user: fakeNames[i % fakeNames.length],
  method: ["PayPal", "Bitcoin", "Amazon", "Bank"][i % 4],
  xp: 1000 + i * 500,
  usd: (1000 + i * 500) / 1000,
  account: i % 2 ? "user@mail.com" : "bc1q...x4k",
  date: `2026-05-${(i % 27) + 1}`,
  status: ["Pending", "Approved", "Rejected"][i % 3] as "Pending" | "Approved" | "Rejected",
}));
export const mockAdminLeads = Array.from({ length: 15 }, (_, i) => ({
  id: i + 1,
  user: fakeNames[i % fakeNames.length],
  userID: `usr-${1000 + i}`,
  provider: providerNames[i % providerNames.length],
  offer: ["Survey 480", "Install game", "Trial sub", "Sign-up"][i % 4],
  txId: `tx_${Math.random().toString(36).slice(2, 10)}`,
  usd: (0.3 + (i % 7) * 0.4).toFixed(2),
  xp: 300 + i * 220,
  status: ["Approved", "Pending", "Rejected"][i % 3],
  ip: `192.0.${(i * 7) % 255}.${(i * 13) % 255}`,
  country: ["US", "BD", "IN", "DE", "BR"][i % 5],
  source: ["offerwall", "top_offers", "survey"][i % 3],
  date: `2026-05-${(i % 27) + 1}`,
}));
export const mockLogs = Array.from({ length: 18 }, (_, i) => ({
  id: i + 1,
  time: `2026-05-${(i % 27) + 1} 1${i % 9}:${(i * 7) % 60}`,
  user: fakeNames[i % fakeNames.length],
  action: ["LOGIN", "POSTBACK", "CASHOUT_REQ", "PROMO_USED", "API_ERROR", "VPN_BLOCK"][i % 6],
  details: ["Successful login", "Lead credited", "PayPal $5", "WELCOME500", "Timeout 504", "Proxy detected"][i % 6],
  ip: `192.0.${(i * 11) % 255}.${(i * 5) % 255}`,
  level: (["info", "info", "info", "info", "error", "warn"][i % 6]) as "info" | "warn" | "error",
}));
export const mockLevels = Array.from({ length: 15 }, (_, i) => ({
  level: i + 1,
  requiredXp: (i + 1) * 1000 + i * i * 200,
  bonusXp: 100 + i * 50,
  badge: ["Starter", "Earner", "Explorer", "Hunter", "Diamond", "Master", "Legend"][i % 7],
}));
export const mockSettings = {
  xpPerUsd: 1000,
  signupBonusXp: 500,
  referralBonusXp: 500,
  dailyBonusXp: 100,
  minCashoutXp: 500,
  maintenanceMode: false,
  liveLeadsEnabled: true,
  referralsEnabled: true,
  promoCodesEnabled: true,
  signupOpen: true,
  vpnBlocking: true,
  fraudlogix: false,
  fraudlogixKey: "",
  ipqs: false,
  ipqsKey: "",
  proxyChangeDetect: true,
};

/* ───────── postbacks ───────── */
export const postbackNetworks = [
  { id: "cpx", name: "CPX Research", slug: "cpx", enabled: true },
  { id: "playtimeads", name: "PlaytimeAds", slug: "playtimeads", enabled: true },
  { id: "pixylabs", name: "Pixylabs", slug: "pixylabs", enabled: true },
  { id: "vortexwall", name: "Vortexwall", slug: "vortexwall", enabled: true },
  { id: "notik", name: "Notik", slug: "notik", enabled: true },
  { id: "pubscale", name: "Pubscale", slug: "pubscale", enabled: true },
  { id: "adswedmedia", name: "Adswedmedia", slug: "adswedmedia", enabled: true },
];

export const mockPostbacks = Array.from({ length: 22 }, (_, i) => {
  const net = postbackNetworks[i % postbackNetworks.length];
  const statuses = ["Valid", "Valid", "Valid", "Duplicate", "Reversed", "Failed"] as const;
  return {
    id: i + 1,
    time: `2026-05-${(i % 27) + 1} 1${i % 9}:${String((i * 7) % 60).padStart(2, "0")}`,
    network: net.name,
    networkSlug: net.slug,
    user: fakeNames[i % fakeNames.length],
    offer: ["Survey 1284", "App install Coin Master", "Trial sub", "Sign-up + verify", "Game level 10"][i % 5],
    xp: 250 + (i % 9) * 380,
    usd: ((250 + (i % 9) * 380) / 1000).toFixed(2),
    txId: `tx_${Math.random().toString(36).slice(2, 12)}`,
    ip: `192.0.${(i * 7) % 255}.${(i * 13) % 255}`,
    status: statuses[i % statuses.length],
    credited: i % 6 < 3,
  };
});

export const mockPostbackStats = {
  total: 4218,
  valid: 3940,
  duplicate: 184,
  reversed: 94,
};

/* ───────── admin payment methods ───────── */
export const mockAdminPayments = [
  { id: "paypal", name: "PayPal", icon: Wallet, minXp: 500, fee: 0, time: "Instant", enabled: true, gradient: "from-blue-500/40 to-cyan-500/30" },
  { id: "btc", name: "Bitcoin", icon: Coins, minXp: 1000, fee: 2, time: "~30 min", enabled: true, gradient: "from-amber-500/40 to-orange-500/30" },
  { id: "amazon", name: "Amazon Gift Card", icon: Gift, minXp: 300, fee: 0, time: "1–24 hrs", enabled: true, gradient: "from-orange-500/40 to-yellow-500/30" },
  { id: "bank", name: "Bank Transfer", icon: ShieldCheck, minXp: 2500, fee: 1, time: "1–3 days", enabled: false, gradient: "from-indigo-500/40 to-violet-500/30" },
  { id: "usdt", name: "USDT (TRC20)", icon: Diamond, minXp: 1000, fee: 1, time: "~10 min", enabled: true, gradient: "from-emerald-500/40 to-teal-500/30" },
  { id: "visa", name: "Visa Prepaid", icon: Award, minXp: 5000, fee: 3, time: "2–5 days", enabled: false, gradient: "from-violet-500/40 to-fuchsia-500/30" },
];
