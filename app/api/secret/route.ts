import { NextRequest, NextResponse } from 'next/server';
import { nanoid } from 'nanoid';
import { storeSecret } from '@/lib/redis';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { encryptedText, iv, ttl, burnOnRead } = body;

    // Validate required fields
    if (!encryptedText || !iv || ttl === undefined || burnOnRead === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields: encryptedText, iv, ttl, burnOnRead' },
        { status: 400 }
      );
    }

    // Validate TTL (must be positive and reasonable, e.g., max 30 days)
    const maxTTL = 30 * 24 * 60 * 60; // 30 days in seconds
    if (ttl <= 0 || ttl > maxTTL) {
      return NextResponse.json(
        { error: 'TTL must be between 1 second and 30 days' },
        { status: 400 }
      );
    }

    // Generate unique ID
    const id = nanoid();

    // Store in Redis with TTL
    await storeSecret(
      id,
      {
        encryptedText,
        iv,
        burnOnRead: Boolean(burnOnRead),
      },
      ttl
    );

    return NextResponse.json({ id });
  } catch (error) {
    console.error('Error storing secret:', error);
    return NextResponse.json(
      { error: 'Failed to store secret' },
      { status: 500 }
    );
  }
}

