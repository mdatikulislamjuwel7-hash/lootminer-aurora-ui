// Shared API DTO types — backend response shapes.

export type ApiProvider = {
  id: number | string;
  name: string;
  slug: string;
  type: "offerwall" | "survey";
  iframeUrl?: string | null;
  logoUrl?: string | null;
  rating?: number | null;
  enabled: boolean;
  isTopOffer?: boolean;
  badge?: string | null;
  gradient?: string | null;
};

export type ApiTopOffer = {
  id: number | string;
  title: string;
  provider: string;
  description?: string | null;
  xp: number;
  url: string;
  imageUrl?: string | null;
  featured?: boolean;
  gradient?: string | null;
};

export type ApiPaymentMethod = {
  id: number | string;
  name: string;
  slug: string;
  min: number;
  fee?: string | null;
  time?: string | null;
  enabled?: boolean;
  iconUrl?: string | null;
};

export type ApiCashout = {
  id: number | string;
  method: string;
  xp: number;
  usd: number;
  status: "Pending" | "Approved" | "Rejected" | string;
  date: string;
  account?: string;
};

export type ApiLead = {
  id: number | string;
  user: string;
  avatar?: string;
  provider: string;
  offer: string;
  xp: number;
  ago: string;
};

export type ApiPublicStats = {
  members: string | number;
  xpPaid: string | number;
  offers: string | number;
  payouts: string | number;
};

export type ApiPublicSettings = {
  maintenance_mode?: boolean;
  live_leads_enabled?: boolean;
  signup_open?: boolean;
  xpPerUsd?: number;
  [k: string]: unknown;
};
