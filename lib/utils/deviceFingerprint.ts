import { createHash } from 'crypto';
import { UAParser } from 'ua-parser-js';

import { ErrorLogger } from '@/lib/errors/logger';

interface DeviceInfo {
  userAgent: string;
  language: string;
  colorDepth: number;
  deviceMemory?: number;
  hardwareConcurrency: number;
  screenResolution: string;
  availableScreenResolution: string;
  timezoneOffset: number;
  timezone: string;
  sessionStorage: boolean;
  localStorage: boolean;
  platform: string;
  vendor: string;
  cpuClass?: string;
  plugins?: string[];
}

/**
 * Collects device information for fingerprinting
 */
async function getDeviceInfo(): Promise<DeviceInfo> {
  if (typeof window === 'undefined') {
    return {
      userAgent: 'Server',
      language: 'en-US',
      colorDepth: 24,
      hardwareConcurrency: 1,
      screenResolution: '1920x1080',
      availableScreenResolution: '1920x1080',
      timezoneOffset: 0,
      timezone: 'UTC',
      sessionStorage: false,
      localStorage: false,
      platform: 'Server',
      vendor: 'Server',
    };
  }

  const uaParser = new UAParser();
  uaParser.setUA(window.navigator.userAgent);
  const ua = uaParser.getResult();

  const screenRes = `${window.screen.width}x${window.screen.height}`;
  const availableScreenRes = `${window.screen.availWidth}x${window.screen.availHeight}`;

  const deviceInfo: DeviceInfo = {
    userAgent: window.navigator.userAgent,
    language: window.navigator.language,
    colorDepth: window.screen.colorDepth,
    deviceMemory: (navigator as any).deviceMemory,
    hardwareConcurrency: window.navigator.hardwareConcurrency,
    screenResolution: screenRes,
    availableScreenResolution: availableScreenRes,
    timezoneOffset: new Date().getTimezoneOffset(),
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    sessionStorage: !!window.sessionStorage,
    localStorage: !!window.localStorage,
    platform: ua.os.name || window.navigator.platform,
    vendor: window.navigator.vendor,
    cpuClass: (navigator as any).cpuClass,
    plugins: Array.from(navigator.plugins).map((p) => p.name),
  };

  return deviceInfo;
}

/**
 * Generates a unique device fingerprint
 */
export async function getDeviceFingerprint(): Promise<string> {
  try {
    const deviceInfo = await getDeviceInfo();
    const components = [
      deviceInfo.userAgent,
      deviceInfo.language,
      deviceInfo.colorDepth,
      deviceInfo.deviceMemory,
      deviceInfo.hardwareConcurrency,
      deviceInfo.screenResolution,
      deviceInfo.availableScreenResolution,
      deviceInfo.timezoneOffset,
      deviceInfo.timezone,
      deviceInfo.platform,
      deviceInfo.vendor,
      deviceInfo.cpuClass,
      deviceInfo.plugins?.join(','),
    ];

    // Create a stable string representation
    const fingerprint = components
      .map((component) => String(component).replace(/\s+/g, ''))
      .join('|');

    // Generate SHA-256 hash
    const hash = createHash('sha256');
    hash.update(fingerprint);
    return hash.digest('hex');
  } catch (error) {
    // Fallback to a timestamp-based identifier if fingerprinting fails
    const fallbackId = `fallback-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    void ErrorLogger.logError(
      error instanceof Error
        ? error
        : new Error('Device fingerprinting failed'),
      {
        context: 'getDeviceFingerprint',
        fallbackId,
      }
    );

    return fallbackId;
  }
}

/**
 * Checks if the current device fingerprint matches a stored one
 * @param storedFingerprint Previously stored fingerprint to compare against
 */
export async function verifyDeviceFingerprint(
  storedFingerprint: string
): Promise<boolean> {
  try {
    const currentFingerprint = await getDeviceFingerprint();
    return currentFingerprint === storedFingerprint;
  } catch {
    // If fingerprinting fails, err on the side of caution
    return false;
  }
}

/**
 * Gets a simplified device info string for logging
 */
export async function getDeviceInfoString(): Promise<string> {
  const deviceInfo = await getDeviceInfo();
  const uaParser = new UAParser();
  uaParser.setUA(deviceInfo.userAgent);
  const ua = uaParser.getResult();

  return [
    ua.browser.name,
    ua.browser.version,
    ua.os.name,
    ua.os.version,
    deviceInfo.screenResolution,
    deviceInfo.platform,
  ]
    .filter(Boolean)
    .join(' | ');
}
