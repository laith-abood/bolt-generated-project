import { ErrorHandler } from '@/lib/errors/ErrorHandler';

// Ensure CSRF_SECRET is properly set
const CSRF_SECRET = process.env.CSRF_SECRET || '';
if (!CSRF_SECRET || CSRF_SECRET === 'default-csrf-secret') {
  throw new Error('CSRF_SECRET must be set in environment variables');
}

const TOKEN_EXPIRY = 3600000; // 1 hour in milliseconds

// Convert string to Uint8Array
function stringToUint8Array(str: string): Uint8Array {
  return new TextEncoder().encode(str);
}

// Convert Uint8Array to hex string
function uint8ArrayToHex(arr: Uint8Array): string {
  return Array.from(arr)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

// Generate random bytes using Web Crypto API
async function getRandomBytes(length: number): Promise<Uint8Array> {
  return crypto.getRandomValues(new Uint8Array(length));
}

// Create HMAC using Web Crypto API
async function createHmac(message: string, secret: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    'raw',
    stringToUint8Array(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );

  const signature = await crypto.subtle.sign(
    'HMAC',
    key,
    stringToUint8Array(message)
  );

  return uint8ArrayToHex(new Uint8Array(signature));
}

// Timing-safe comparison using Web Crypto API
async function timingSafeEqual(a: string, b: string): Promise<boolean> {
  const aBytes = stringToUint8Array(a);
  const bBytes = stringToUint8Array(b);

  if (aBytes.length !== bBytes.length) {
    return false;
  }

  // XOR the bytes and check if any are non-zero
  let diff = 0;
  for (let i = 0; i < aBytes.length; i++) {
    diff |= aBytes[i] ^ bBytes[i];
  }

  return diff === 0;
}

export async function generateToken(): Promise<string> {
  try {
    const timestamp = Date.now().toString();
    const nonce = uint8ArrayToHex(await getRandomBytes(32));
    const hash = await createHmac(`${timestamp}:${nonce}`, CSRF_SECRET);
    return `${timestamp}:${nonce}:${hash}`;
  } catch (error) {
    ErrorHandler.getErrorResponse(error as Error, {
      action: 'csrf_token_generation',
      context: { error: 'Failed to generate CSRF token' },
    });
    throw new Error('Failed to generate CSRF token');
  }
}

export async function validateToken(token: string): Promise<boolean> {
  try {
    const [timestamp, nonce, hash] = token.split(':');

    if (!timestamp || !nonce || !hash) {
      return false;
    }

    // Check if token is expired
    const tokenAge = Date.now() - parseInt(timestamp, 10);
    if (tokenAge > TOKEN_EXPIRY) {
      return false;
    }

    // Verify HMAC using timing-safe comparison
    const expectedHash = await createHmac(`${timestamp}:${nonce}`, CSRF_SECRET);
    return await timingSafeEqual(hash, expectedHash);
  } catch (error) {
    ErrorHandler.getErrorResponse(error as Error, {
      action: 'csrf_validation',
      context: { token },
    });
    return false;
  }
}
