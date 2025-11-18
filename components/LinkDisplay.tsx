'use client';

import { useState } from 'react';

interface LinkDisplayProps {
  link: string;
  onNewSecret: () => void;
}

export default function LinkDisplay({ link, onNewSecret }: LinkDisplayProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="w-full space-y-6 animate-fade-in">
      <div className="p-6 bg-black border border-cyan-500/30 rounded-lg">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-4xl animate-lock-close">🔒</span>
          <h2 className="text-xl font-semibold text-cyan-400">Secret Created</h2>
        </div>
        <p className="text-sm text-cyan-300/70 mb-4">
          Your secret has been encrypted. Share this link - it will be destroyed after viewing.
        </p>
        <div className="flex gap-2">
          <input
            type="text"
            value={link}
            readOnly
            className="flex-1 p-3 bg-black border border-cyan-500/30 rounded-lg text-cyan-50 font-mono text-sm focus:outline-none"
          />
          <button
            onClick={handleCopy}
            className="px-6 py-3 bg-cyan-500/10 border border-cyan-500 rounded-lg text-cyan-400 hover:bg-cyan-500/20 hover:text-cyan-300 transition-all cursor-pointer"
          >
            {copied ? '✓ Copied' : 'Copy'}
          </button>
        </div>
      </div>

      <button
        onClick={onNewSecret}
        className="w-full py-3 px-6 bg-cyan-500/10 border border-cyan-500 rounded-lg text-cyan-400 hover:bg-cyan-500/20 hover:text-cyan-300 transition-all cursor-pointer"
      >
        Create Another Secret
      </button>
    </div>
  );
}

