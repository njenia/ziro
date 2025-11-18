'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import SecretDisplay from '@/components/SecretDisplay';

export default function SecretPage() {
  const params = useParams();
  const id = params?.id as string;
  const [secretData, setSecretData] = useState<{
    encryptedText: string;
    iv: string;
    keyString: string;
    burnOnRead: boolean;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadSecret = async () => {
      if (!id) {
        setError('Invalid secret ID');
        setIsLoading(false);
        return;
      }

      // Extract key from URL fragment
      const hash = window.location.hash.slice(1); // Remove the #
      if (!hash) {
        setError('Missing decryption key in URL');
        setIsLoading(false);
        return;
      }

      try {
        // Fetch encrypted data from server
        const response = await fetch(`/api/secret/${id}`);
        
        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || 'Failed to load secret');
        }

        const { encryptedText, iv } = await response.json();

        setSecretData({
          encryptedText,
          iv,
          keyString: hash,
          burnOnRead: true, // Assume burn-on-read since we're viewing it
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    loadSecret();
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-cyan-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="inline-block animate-spin text-4xl mb-4">🔓</div>
          <p className="text-cyan-400">Loading secret...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black text-cyan-50 flex items-center justify-center p-4">
        <div className="w-full max-w-2xl">
          <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-red-400 mb-2">Error</h2>
            <p className="text-red-300">{error}</p>
            <div className="mt-6">
              <a
                href="/"
                className="inline-block py-3 px-6 bg-cyan-500/10 border border-cyan-500 rounded-lg text-cyan-400 hover:bg-cyan-500/20 hover:text-cyan-300 transition-all"
              >
                Go Home
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!secretData) {
    return null;
  }

  return (
    <div className="min-h-screen bg-black text-cyan-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
            Ziro
          </h1>
        </div>

        <div className="bg-black border border-cyan-500/30 rounded-lg p-8">
          <SecretDisplay {...secretData} />
        </div>
      </div>
    </div>
  );
}

