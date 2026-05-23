import { Router } from 'express';
import { prisma } from '../../config/database';

const router = Router();

const settingAliases: Record<string, string> = {
  xpPerUsd: 'xp_per_usd',
  signupBonusXp: 'signup_bonus_xp',
  referralBonusXp: 'referral_bonus_xp',
  dailyBonusXp: 'daily_bonus_base_xp',
  minCashoutXp: 'min_cashout_xp',
  maintenanceMode: 'maintenance_mode',
  liveLeadsEnabled: 'live_leads_enabled',
  referralsEnabled: 'referrals_enabled',
  promoCodesEnabled: 'promo_codes_enabled',
  signupOpen: 'new_signups_enabled',
  vpnBlocking: 'vpn_check_enabled',
  proxyChangeDetect: 'live_ip_change_detection',
  fraudlogix: 'fraudlogix_enabled',
  fraudlogixKey: 'fraudlogix_api_key',
  ipqs: 'ipqs_enabled',
  ipqsKey: 'ipqs_api_key',
};

const adminSettingKeys = Object.keys(settingAliases);
const toBoolean = (value: string | undefined) => value === 'true' || value === '1';
const toNumber = (value: string | undefined) => Number(value ?? 0);

router.get('/', async (_req, res) => {
  const items = await prisma.setting.findMany();
  const raw: Record<string, string> = {};
  for (const s of items) raw[s.key] = s.value;

  const settings = {
    xpPerUsd: toNumber(raw.xp_per_usd),
    signupBonusXp: toNumber(raw.signup_bonus_xp),
    referralBonusXp: toNumber(raw.referral_bonus_xp),
    dailyBonusXp: toNumber(raw.daily_bonus_base_xp),
    minCashoutXp: toNumber(raw.min_cashout_xp),
    maintenanceMode: toBoolean(raw.maintenance_mode ?? raw.maintenanceMode),
    liveLeadsEnabled: toBoolean(raw.live_leads_enabled),
    referralsEnabled: toBoolean(raw.referrals_enabled),
    promoCodesEnabled: toBoolean(raw.promo_codes_enabled),
    signupOpen: toBoolean(raw.new_signups_enabled),
    vpnBlocking: toBoolean(raw.vpn_check_enabled),
    proxyChangeDetect: toBoolean(raw.live_ip_change_detection),
    fraudlogix: toBoolean(raw.fraudlogix_enabled),
    fraudlogixKey: raw.fraudlogix_api_key ?? '',
    ipqs: toBoolean(raw.ipqs_enabled),
    ipqsKey: raw.ipqs_api_key ?? '',
  };

  const networks = await prisma.offerwall.findMany({ orderBy: { sortOrder: 'asc' } });
  res.json({ settings, networks });
});

router.patch('/', async (req, res) => {
  const body = req.body || {};
  const updates = Object.entries(body)
    .filter(([key]) => adminSettingKeys.includes(key))
    .map(([key, value]) => [settingAliases[key], value] as const);

  await prisma.$transaction(
    updates.map(([key, value]) =>
      prisma.setting.upsert({ where: { key }, update: { value: String(value) }, create: { key, value: String(value) } }),
    ),
  );
  res.json({ ok: true });
});

router.post('/clear-today-xp', async (_req, res) => {
  await prisma.user.updateMany({ data: { todayEarnedXp: 0 } });
  res.json({ ok: true });
});

export default router;
