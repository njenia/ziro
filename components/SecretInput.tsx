'use client';

import { useState } from 'react';
import TTLSelector from './TTLSelector';
import BurnOnReadToggle from './BurnOnReadToggle';

interface SecretInputProps {
  onSecretCreated: (link: string) => void;
}

export default function SecretInput({ onSecretCreated }: SecretInputProps) {
  const [text, setText] = useState('');
  const [ttl, setTtl] = useState(3600); // 1 hour default
  const [burnOnRead, setBurnOnRead] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) {
      setError('Please enter some text');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Import crypto functions
      const { generateKey, exportKey, encrypt } = await import('@/lib/crypto');

      // Generate key and encrypt
      const key = await generateKey();
      const { encrypted, iv } = await encrypt(text, key);
      const keyString = await exportKey(key);

      // Send to server
      const response = await fetch('/api/secret', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          encryptedText: encrypted,
          iv,
          ttl,
          burnOnRead,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to create secret');
      }

      const { id } = await response.json();

      // Construct URL with key in fragment
      const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
      const link = `${baseUrl}/s/${id}#${keyString}`;

      onSecretCreated(link);
      setText(''); // Clear input
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-6">
      <div>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter your secret text here..."
          className="w-full h-64 p-4 bg-black border border-cyan-500/30 rounded-lg text-cyan-50 font-mono text-sm focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/50 resize-none"
          disabled={isLoading}
        />
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <TTLSelector value={ttl} onChange={setTtl} disabled={isLoading} />
        </div>

        <div className="flex-1">
          <BurnOnReadToggle value={burnOnRead} onChange={setBurnOnRead} disabled={isLoading} />
        </div>
      </div>

      {error && (
        <div className="p-3 bg-red-900/20 border border-red-500/30 rounded-lg text-red-400 text-sm">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={isLoading || !text.trim()}
        className="w-full py-4 px-6 bg-cyan-500/10 border border-cyan-500 rounded-lg text-cyan-400 font-semibold hover:bg-cyan-500/20 hover:text-cyan-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2"
      >
        {isLoading ? (
          <>
            <span className="animate-spin">🔒</span>
            <span>Encrypting...</span>
          </>
        ) : (
          <>
            <span>🔒</span>
            <span>Create Secret</span>
          </>
        )}
      </button>
    </form>
  );
}

