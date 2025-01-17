import {
  createCipheriv,
  createDecipheriv,
  randomBytes,
  scrypt as scryptCallback,
  timingSafeEqual,
} from 'crypto';
import { promisify } from 'util';

const randomBytesAsync = promisify(randomBytes);
const scrypt = promisify<string, Buffer, number, Buffer>(scryptCallback);

// Environment variables for encryption
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY;

if (!ENCRYPTION_KEY) {
  throw new Error('ENCRYPTION_KEY environment variable is required');
}

// Ensure key is 32 bytes (256 bits)
const key = Buffer.from(ENCRYPTION_KEY, 'hex');

if (key.length !== 32) {
  throw new Error('ENCRYPTION_KEY must be 32 bytes (64 hex characters)');
}

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 12; // 96 bits for GCM
const AUTH_TAG_LENGTH = 16; // 128 bits for GCM authentication tag
const SALT_LENGTH = 16;

export async function generateSecureToken(bytes: number = 32): Promise<string> {
  const buffer = await randomBytesAsync(bytes);
  return buffer.toString('hex');
}

export async function encrypt(text: string): Promise<string> {
  try {
    // Generate a random IV for each encryption
    const iv = await randomBytesAsync(IV_LENGTH);

    // Create cipher with random IV
    const cipher = createCipheriv(ALGORITHM, key, iv, {
      authTagLength: AUTH_TAG_LENGTH,
    });

    // Encrypt the text
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    // Get the auth tag
    const authTag = cipher.getAuthTag();

    // Combine IV, encrypted text, and auth tag
    // Format: iv:encrypted:authTag
    return `${iv.toString('hex')}:${encrypted}:${authTag.toString('hex')}`;
  } catch (error) {
    console.error('Encryption error:', error);
    throw new Error('Failed to encrypt data');
  }
}

export async function decrypt(encryptedData: string): Promise<string> {
  try {
    // Split the encrypted data into components
    const [ivHex, encryptedText, authTagHex] = encryptedData.split(':');

    if (!ivHex || !encryptedText || !authTagHex) {
      throw new Error('Invalid encrypted data format');
    }

    // Convert components back to buffers
    const iv = Buffer.from(ivHex, 'hex');
    const authTag = Buffer.from(authTagHex, 'hex');

    // Create decipher with auth tag length
    const decipher = createDecipheriv(ALGORITHM, key, iv, {
      authTagLength: AUTH_TAG_LENGTH,
    });
    decipher.setAuthTag(authTag);

    // Decrypt the text
    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
  } catch (error) {
    console.error('Decryption error:', error);
    throw new Error('Failed to decrypt data');
  }
}

export async function generateKeyPair(): Promise<{
  publicKey: string;
  privateKey: string;
}> {
  try {
    const { generateKeyPairSync } = await import('crypto');
    const { publicKey, privateKey } = generateKeyPairSync('rsa', {
      modulusLength: 4096,
      publicKeyEncoding: {
        type: 'spki',
        format: 'pem',
      },
      privateKeyEncoding: {
        type: 'pkcs8',
        format: 'pem',
        cipher: 'aes-256-cbc',
        passphrase: await generateSecureToken(32),
      },
    });
    return { publicKey, privateKey };
  } catch (error) {
    console.error('Key pair generation error:', error);
    throw new Error('Failed to generate key pair');
  }
}

export async function hashPassword(password: string): Promise<string> {
  try {
    const salt = await randomBytesAsync(SALT_LENGTH);
    const derivedKey = await scrypt(password, salt, 64);
    return `${salt.toString('hex')}:${derivedKey.toString('hex')}`;
  } catch (error) {
    console.error('Password hashing error:', error);
    throw new Error('Failed to hash password');
  }
}

export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  try {
    const [saltHex, hashHex] = hashedPassword.split(':');
    const salt = Buffer.from(saltHex, 'hex');
    const hash = Buffer.from(hashHex, 'hex');
    const derivedKey = await scrypt(password, salt, 64);
    return timingSafeEqual(hash, derivedKey);
  } catch (error) {
    console.error('Password verification error:', error);
    throw new Error('Failed to verify password');
  }
}

export async function generateSecureRandom(
  min: number,
  max: number
): Promise<number> {
  if (min >= max) {
    throw new Error('Min must be less than max');
  }

  const range = max - min;
  const bytesNeeded = Math.ceil(Math.log2(range) / 8);
  const maxValid = Math.floor(256 ** bytesNeeded / range) * range - 1;

  let value: number;
  do {
    const randomBuffer = await randomBytesAsync(bytesNeeded);
    value = randomBuffer.reduce((acc, byte, i) => acc + byte * 256 ** i, 0);
  } while (value > maxValid);

  return min + (value % range);
}

export async function generateSecureString(
  length: number = 32
): Promise<string> {
  if (length <= 0) {
    throw new Error('Length must be greater than 0');
  }

  const charset =
    'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()';
  const randomValues = await randomBytesAsync(length);
  let result = '';

  for (let i = 0; i < length; i++) {
    result += charset[randomValues[i] % charset.length];
  }

  return result;
}
