import axios from 'axios';
import { prisma } from '../config/database';

export async function checkVpnOnSignup(ip: string): Promise<{ blocked: boolean; reason?: string }> {
  const settings: Record<string, string> = {};
  const allSettings = await prisma.setting.findMany();
  for (const s of allSettings) settings[s.key] = s.value;

  if (settings.vpn_check_enabled !== 'true') return { blocked: false };

  if (settings.fraudlogix_enabled === 'true' && settings.fraudlogix_api_key) {
    try {
      const res = await axios.get(`https://iplist.fraudlogix.com/v5?ip=${ip}`, {
        headers: { 'x-api-key': settings.fraudlogix_api_key },
        timeout: 5000,
      });
      const d = res.data;
      if (settings.fraudlogix_block_high === 'true' && ['High', 'Extreme'].includes(d.RiskScore)) {
        return { blocked: true, reason: 'High risk IP detected' };
      }
      if (settings.fraudlogix_block_proxy === 'true' && (d.Proxy || d.VPN || d.TOR) && !d.SearchEngineBot) {
        return { blocked: true, reason: 'VPN/Proxy detected' };
      }
      if (settings.fraudlogix_geo_blocking === 'true') {
        const banned = (settings.fraudlogix_banned_countries || '').split(',').map((c) => c.trim());
        if (d.CountryCode && banned.includes(d.CountryCode)) {
          return { blocked: true, reason: 'Region not allowed' };
        }
      }
    } catch {
      /* allow if fails */
    }
  }

  if (settings.ipqs_enabled === 'true' && settings.ipqs_api_key) {
    try {
      const strictness = settings.ipqs_strictness || '1';
      const allowPublic = settings.ipqs_allow_public || 'true';
      const url = `https://www.ipqualityscore.com/api/json/ip/${settings.ipqs_api_key}/${ip}?strictness=${strictness}&allow_public_access_points=${allowPublic}&lighter_penalties=false`;
      const res = await axios.get(url, { timeout: 5000 });
      const d = res.data;
      if (d.success) {
        const threshold = parseInt(settings.ipqs_fraud_threshold || '80', 10);
        if (d.fraud_score >= threshold && !d.is_crawler) {
          return { blocked: true, reason: 'High fraud score detected' };
        }
        if (settings.ipqs_block_proxy === 'true' && d.proxy === true && !d.is_crawler) {
          return { blocked: true, reason: 'Proxy/VPN not allowed' };
        }
      }
    } catch {
      /* allow if fails */
    }
  }

  return { blocked: false };
}
