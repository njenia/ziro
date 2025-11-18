/**
 * Redis client configuration for Upstash
 */

import { Redis } from '@upstash/redis';

if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
  throw new Error(
    'Missing Upstash Redis environment variables. Please set UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN'
  );
}

export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

export interface SecretData {
  encryptedText: string;
  iv: string;
  burnOnRead: boolean;
}

/**
 * Store a secret in Redis with TTL
 */
export async function storeSecret(
  id: string,
  data: SecretData,
  ttlSeconds: number
): Promise<void> {
  await redis.setex(id, ttlSeconds, JSON.stringify(data));
}

/**
 * Retrieve and optionally delete a secret from Redis
 */
export async function getSecret(
  id: string,
  deleteAfterRead: boolean = false
): Promise<SecretData | null> {
  let data: any;
  
  if (deleteAfterRead) {
    data = await redis.getdel(id);
  } else {
    data = await redis.get(id);
  }
  
  if (!data) {
    return null;
  }
  
  // Upstash Redis may auto-parse JSON, so handle both string and object cases
  try {
    if (typeof data === 'string') {
      return JSON.parse(data) as SecretData;
    } else if (typeof data === 'object' && data !== null) {
      // Already parsed JSON object
      return data as SecretData;
    } else {
      console.error(`Unexpected data type from Redis: ${typeof data}`, data);
      return null;
    }
  } catch (error) {
    console.error(`Error parsing secret data for ID ${id}:`, error, 'Data:', data);
    return null;
  }
}

