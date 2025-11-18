import { NextRequest, NextResponse } from 'next/server';
import { getSecret, redis } from '@/lib/redis';
import { isBot, getUserAgent } from '@/lib/bot-detection';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    if (!id) {
      return NextResponse.json(
        { error: 'Missing secret ID' },
        { status: 400 }
      );
    }

    // Check if request is from a bot
    const userAgent = getUserAgent(request.headers);
    if (isBot(userAgent)) {
      // Return 404 for bots to prevent accidental burn-on-read
      console.log(`Bot detected - User-Agent: ${userAgent}`);
      return NextResponse.json(
        { error: 'Not found' },
        { status: 404 }
      );
    }

    // First, check if secret exists and get burnOnRead flag
    const secret = await getSecret(id, false);

    if (!secret) {
      console.log(`Secret not found in Redis for ID: ${id}`);
      // Try to get raw data for debugging
      try {
        const rawData = await redis.get(id);
        console.log(`Raw data from Redis for ID ${id}:`, rawData, typeof rawData);
      } catch (err) {
        console.error(`Error getting raw data for debugging:`, err);
      }
      return NextResponse.json(
        { error: 'Secret not found or expired' },
        { status: 404 }
      );
    }

    // If burn-on-read is enabled, atomically get and delete the secret
    // Otherwise, just return the data (it will expire via TTL)
    const finalSecret = secret.burnOnRead
      ? await getSecret(id, true) // Atomically get and delete
      : secret;

    if (!finalSecret) {
      // This shouldn't happen, but handle edge case
      return NextResponse.json(
        { error: 'Secret not found' },
        { status: 404 }
      );
    }

    // Return encrypted data and IV (key is in URL fragment, never sent to server)
    return NextResponse.json({
      encryptedText: finalSecret.encryptedText,
      iv: finalSecret.iv,
    });
  } catch (error) {
    console.error('Error retrieving secret:', error);
    // Check if it's a Redis connection error
    if (error instanceof Error) {
      console.error('Error details:', error.message, error.stack);
    }
    return NextResponse.json(
      { error: 'Failed to retrieve secret', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

