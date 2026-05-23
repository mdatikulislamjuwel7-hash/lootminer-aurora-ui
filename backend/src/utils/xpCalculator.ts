export function xpToUsd(xp: number, xpPerUsd: number, feePercent: number): number {
  const gross = xp / xpPerUsd;
  const net = gross * (1 - feePercent / 100);
  return Math.max(0, Math.round(net * 100) / 100);
}
