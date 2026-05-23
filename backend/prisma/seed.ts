import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { randomBytes } from 'crypto';

const prisma = new PrismaClient();

const SETTINGS: Record<string, string> = {
  xp_per_usd: '1000',
  signup_bonus_xp: '500',
  referral_bonus_xp: '500',
  daily_bonus_base_xp: '100',
  min_cashout_xp: '500',
  maintenance_mode: 'false',
  live_leads_enabled: 'true',
  referrals_enabled: 'true',
  promo_codes_enabled: 'true',
  new_signups_enabled: 'true',
  vpn_check_enabled: 'false',
  fraudlogix_enabled: 'false',
  fraudlogix_api_key: '',
  fraudlogix_block_high: 'true',
  fraudlogix_block_proxy: 'true',
  fraudlogix_geo_blocking: 'false',
  fraudlogix_banned_countries: 'CN,RU',
  ipqs_enabled: 'false',
  ipqs_api_key: '',
  ipqs_fraud_threshold: '80',
  ipqs_block_proxy: 'true',
  ipqs_allow_public: 'true',
  ipqs_strictness: '1',
  live_ip_change_detection: 'false',
  live_ip_action: 'warn',
};

const LEVELS: Array<[number, string, number, number, string, string]> = [
  [1, 'Novice', 0, 0, '#CD7F32', 'Bronze'],
  [2, 'Rookie', 500, 50, '#CD7F32', 'Bronze'],
  [3, 'Beginner', 1500, 75, '#CD7F32', 'Bronze'],
  [4, 'Learner', 3000, 100, '#CD7F32', 'Bronze'],
  [5, 'Apprentice', 5000, 150, '#CD7F32', 'Bronze'],
  [6, 'Explorer', 8000, 200, '#C0C0C0', 'Silver'],
  [7, 'Scout', 12000, 250, '#C0C0C0', 'Silver'],
  [8, 'Adventurer', 17000, 300, '#C0C0C0', 'Silver'],
  [9, 'Seeker', 23000, 350, '#C0C0C0', 'Silver'],
  [10, 'Pioneer', 30000, 400, '#C0C0C0', 'Silver'],
  [11, 'Miner', 40000, 500, '#FFD700', 'Gold'],
  [12, 'Digger', 52000, 600, '#FFD700', 'Gold'],
  [13, 'Prospector', 65000, 700, '#FFD700', 'Gold'],
  [14, 'Excavator', 80000, 800, '#FFD700', 'Gold'],
  [15, 'Expert', 100000, 1000, '#FFD700', 'Gold'],
  [16, 'Elite', 125000, 1200, '#E5E4E2', 'Platinum'],
  [17, 'Master', 155000, 1500, '#E5E4E2', 'Platinum'],
  [18, 'Veteran', 190000, 1800, '#E5E4E2', 'Platinum'],
  [19, 'Pro', 230000, 2000, '#E5E4E2', 'Platinum'],
  [20, 'Champion', 275000, 2500, '#E5E4E2', 'Platinum'],
  [21, 'Legend', 325000, 3000, '#A855F7', 'Crystal'],
  [22, 'Crystal Miner', 400000, 3500, '#A855F7', 'Crystal'],
  [23, 'Crystal Lord', 500000, 4000, '#A855F7', 'Crystal'],
  [24, 'Crystal King', 650000, 5000, '#A855F7', 'Crystal'],
  [25, 'Crystal God', 1000000, 10000, '#A855F7', 'Crystal'],
];

const PAYMENT_METHODS: Array<[string, number, number, string]> = [
  ['PayPal', 500, 0, 'Instant'],
  ['Bitcoin', 2000, 0, '1-2 Days'],
  ['Ethereum', 2000, 0, '1-2 Days'],
  ['USDT TRC-20', 1000, 0, 'Instant'],
  ['Amazon Gift Card', 500, 5, '1-3 Days'],
  ['Bank Transfer', 5000, 2, '3-5 Days'],
];

async function main() {
  console.log('Seeding settings...');
  for (const [key, value] of Object.entries(SETTINGS)) {
    await prisma.setting.upsert({
      where: { key },
      update: {},
      create: { key, value },
    });
  }

  console.log('Seeding levels...');
  for (const [levelNumber, name, xpRequired, bonusXp, badgeColor, tier] of LEVELS) {
    await prisma.level.upsert({
      where: { levelNumber },
      update: { name, xpRequired, bonusXp, badgeColor, tier },
      create: { levelNumber, name, xpRequired, bonusXp, badgeColor, tier },
    });
  }

  console.log('Seeding payment methods...');
  let sortOrder = 0;
  for (const [name, minXp, feePercent, processingTime] of PAYMENT_METHODS) {
    const existing = await prisma.paymentMethod.findFirst({ where: { name } });
    if (existing) {
      await prisma.paymentMethod.update({
        where: { id: existing.id },
        data: { minXp, feePercent, processingTime, sortOrder },
      });
    } else {
      await prisma.paymentMethod.create({
        data: { name, minXp, feePercent, processingTime, sortOrder, enabled: true },
      });
    }
    sortOrder++;
  }

  console.log('Seeding admin user...');
  const adminEmail = 'admin@lootminer.com';
  const adminExisting = await prisma.user.findUnique({ where: { email: adminEmail } });
  if (!adminExisting) {
    const passwordHash = await bcrypt.hash('Admin@123456', 10);
    await prisma.user.create({
      data: {
        username: 'admin',
        email: adminEmail,
        passwordHash,
        role: 'admin',
        referralCode: randomBytes(4).toString('hex').toUpperCase(),
        balanceXp: 0,
      },
    });
    console.log('   admin@lootminer.com / Admin@123456');
  }

  console.log('Seed complete.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
