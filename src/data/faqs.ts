export interface FAQ {
  q: string;
  a: string;
}

export const mockFAQs: FAQ[] = [
  {
    q: "How do I earn XP?",
    a: "Complete offers, surveys, and daily tasks from the Earn page. Each completed action rewards XP instantly.",
  },
  {
    q: "When can I cash out?",
    a: "You can request a cashout once you reach the minimum threshold for your chosen payment method.",
  },
  {
    q: "How long do payments take?",
    a: "Most payments are processed within 24-72 hours after admin approval.",
  },
  {
    q: "Why was my offer not credited?",
    a: "Some offers take time to track. If after 24 hours it's still missing, contact support with proof of completion.",
  },
  {
    q: "How does the referral program work?",
    a: "Share your referral link. You earn a percentage of XP from every offer your referrals complete, for life.",
  },
];
