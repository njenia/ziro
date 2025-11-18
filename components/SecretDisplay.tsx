'use client';

import { useEffect, useState } from 'react';

interface SecretDisplayProps {
  encryptedText: string;
  iv: string;
  keyString: string;
  burnOnRead: boolean;
}

export default function SecretDisplay({
  encryptedText,
  iv,
  keyString,
  burnOnRead,
}: SecretDisplayProps) {
  const [decryptedText, setDecryptedText] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isBurned, setIsBurned] = useState(false);
  const [isDecrypting, setIsDecrypting] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const decryptSecret = async () => {
      try {
        const { importKey, decrypt } = await import('@/lib/crypto');
        const key = await importKey(keyString);
        const text = await decrypt(encryptedText, iv, key);
        setDecryptedText(text);
        setIsBurned(burnOnRead);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to decrypt secret');
      } finally {
        setIsDecrypting(false);
      }
    };

    decryptSecret();
  }, [encryptedText, iv, keyString, burnOnRead]);

  const handleCopy = async () => {
    if (!decryptedText) return;
    
    try {
      await navigator.clipboard.writeText(decryptedText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  if (isDecrypting) {
    return (
      <div className="w-full p-8 text-center">
        <div className="inline-block animate-spin text-4xl mb-4">🔓</div>
        <p className="text-cyan-400">Decrypting secret...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full p-6 bg-red-900/20 border border-red-500/30 rounded-lg">
        <p className="text-red-400">{error}</p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      {isBurned && (
        <div className="p-4 bg-cyan-500/10 border border-cyan-500/30 rounded-lg animate-fade-in">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-2xl">🔥</span>
            <h3 className="text-lg font-semibold text-cyan-400">Secret Burned</h3>
          </div>
          <p className="text-sm text-cyan-300/70">
            This secret has been permanently deleted and can never be accessed again.
          </p>
        </div>
      )}

      <div className="p-6 bg-black border border-cyan-500/30 rounded-lg">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-cyan-400">Your Secret</h2>
          <button
            onClick={handleCopy}
            className="px-4 py-2 bg-cyan-500/10 border border-cyan-500 rounded-lg text-cyan-400 hover:bg-cyan-500/20 hover:text-cyan-300 transition-all cursor-pointer text-sm font-mono"
          >
            {copied ? '✓ Copied' : 'Copy'}
          </button>
        </div>
        <div className="p-4 bg-black border border-cyan-500/20 rounded-lg">
          <pre className="whitespace-pre-wrap break-words text-cyan-50 font-mono text-sm animate-fade-in">
            {decryptedText}
          </pre>
        </div>
      </div>

      <div className="text-center">
        <a
          href="/"
          className="inline-block py-3 px-6 bg-cyan-500/10 border border-cyan-500 rounded-lg text-cyan-400 hover:bg-cyan-500/20 hover:text-cyan-300 transition-all"
        >
          Create Your Own Secret
        </a>
      </div>
    </div>
  );
}

