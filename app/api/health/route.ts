import { getFirestore } from 'firebase-admin/firestore';

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

import { Cache } from '@/lib/cache';

interface ServiceCheck {
  status: 'up' | 'down';
  latency: number;
}

async function checkDatabase(): Promise<ServiceCheck> {
  const start = performance.now();
  try {
    const db = getFirestore();
    await db.collection('health_checks').add({
      timestamp: new Date(),
      type: 'api_health_check',
    });
    return { status: 'up', latency: performance.now() - start };
  } catch {
    return { status: 'down', latency: performance.now() - start };
  }
}

async function checkCache(): Promise<ServiceCheck> {
  const start = performance.now();
  try {
    const cache = Cache.getInstance();
    await cache.set('health_check', 'ok');
    await cache.get('health_check');
    return { status: 'up', latency: performance.now() - start };
  } catch {
    return { status: 'down', latency: performance.now() - start };
  }
}

async function checkServices(): Promise<{ status: 'up'; uptime: number }> {
  return {
    status: 'up',
    uptime: process.uptime(),
  };
}

export async function GET(_request: NextRequest) {
  try {
    const dbCheck = await checkDatabase();
    const cacheCheck = await checkCache();
    const servicesCheck = await checkServices();

    const status = determineOverallStatus(dbCheck, cacheCheck);

    return NextResponse.json(
      {
        status,
        timestamp: new Date().toISOString(),
        version: process.env.APP_VERSION,
        services: {
          database: dbCheck,
          cache: cacheCheck,
          api: servicesCheck,
        },
      },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate',
          Pragma: 'no-cache',
        },
      }
    );
  } catch {
    return NextResponse.json(
      {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: 'Health check failed',
      },
      { status: 503 }
    );
  }
}

function determineOverallStatus(
  dbCheck: ServiceCheck,
  cacheCheck: ServiceCheck
): 'healthy' | 'degraded' | 'unhealthy' {
  if (dbCheck.status === 'down' && cacheCheck.status === 'down') {
    return 'unhealthy';
  }
  if (dbCheck.status === 'down' || cacheCheck.status === 'down') {
    return 'degraded';
  }
  return 'healthy';
}
