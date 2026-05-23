export function buildIframeUrl(baseUrl: string, slug: string, userId: number, email: string): string {
  const s = (slug || '').toLowerCase();
  const sep = baseUrl.includes('?') ? '&' : '?';
  const e = encodeURIComponent(email);
  if (s.includes('cpx')) return `${baseUrl}${sep}user_id=${userId}&email=${e}`;
  if (s.includes('playtime')) return `${baseUrl}${sep}user_id=${userId}&sub1=${userId}`;
  if (s.includes('pixylabs') || s.includes('pixy')) return `${baseUrl}${sep}unique1=${userId}`;
  if (s.includes('vortex')) return `${baseUrl}${sep}identity_id=${userId}&sub1=${userId}`;
  if (s.includes('notik')) return `${baseUrl}${sep}user_id=${userId}&s1=${userId}`;
  if (s.includes('pubscale')) return `${baseUrl}${sep}unique_id=${userId}`;
  if (s.includes('adswed')) return `${baseUrl}${sep}sub_id=${userId}`;
  if (s.includes('gemad')) return `${baseUrl}${sep}user_id=${userId}`;
  if (s.includes('offery')) return `${baseUrl}${sep}subId=${userId}`;
  if (s.includes('radient')) return `${baseUrl}${sep}subId=${userId}`;
  if (s.includes('upwall')) return `${baseUrl}${sep}userid=${userId}`;
  return `${baseUrl}${sep}user_id=${userId}&sub1=${userId}`;
}
