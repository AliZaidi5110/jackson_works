const encoder = new TextEncoder();

function base64Url(bytes: Uint8Array) {
  let binary = '';
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

async function hmac(value: string) {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) throw new Error('Admin session secret is not configured.');
  const key = await crypto.subtle.importKey('raw', encoder.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  return base64Url(new Uint8Array(await crypto.subtle.sign('HMAC', key, encoder.encode(value))));
}

export async function createAdminSession() {
  const expiresAt = String(Date.now() + 8 * 60 * 60 * 1000);
  return `${expiresAt}.${await hmac(expiresAt)}`;
}

export async function verifyAdminSession(token: string | undefined) {
  if (!token) return false;
  const [expiresAt, signature] = token.split('.');
  if (!expiresAt || !signature || !/^\d+$/.test(expiresAt) || Number(expiresAt) <= Date.now()) return false;
  try {
    const expected = await hmac(expiresAt);
    return signature === expected;
  } catch {
    return false;
  }
}

function decodeBase32(value: string) {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
  const clean = value.toUpperCase().replace(/[^A-Z2-7]/g, '');
  let bits = '';
  for (const char of clean) bits += alphabet.indexOf(char).toString(2).padStart(5, '0');
  const bytes: number[] = [];
  for (let i = 0; i + 8 <= bits.length; i += 8) bytes.push(parseInt(bits.slice(i, i + 8), 2));
  return new Uint8Array(bytes);
}

export async function verifyTotp(secret: string, code: string) {
  if (!/^\d{6}$/.test(code)) return false;
  const key = await crypto.subtle.importKey('raw', decodeBase32(secret), { name: 'HMAC', hash: 'SHA-1' }, false, ['sign']);
  const currentStep = Math.floor(Date.now() / 30000);
  for (const step of [currentStep - 1, currentStep, currentStep + 1]) {
    const counter = new Uint8Array(8);
    let value = step;
    for (let i = 7; i >= 0; i--) { counter[i] = value & 0xff; value = Math.floor(value / 256); }
    const digest = new Uint8Array(await crypto.subtle.sign('HMAC', key, counter));
    const offset = digest[digest.length - 1] & 0x0f;
    const number = (((digest[offset] & 0x7f) << 24) | (digest[offset + 1] << 16) | (digest[offset + 2] << 8) | digest[offset + 3]) % 1000000;
    if (String(number).padStart(6, '0') === code) return true;
  }
  return false;
}
