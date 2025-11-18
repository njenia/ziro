'use client';

import { useState } from 'react';
import SecretInput from '@/components/SecretInput';
import LinkDisplay from '@/components/LinkDisplay';
import Footer from '@/components/Footer';

export default function Home() {
  const [secretLink, setSecretLink] = useState<string | null>(null);

  const handleSecretCreated = (link: string) => {
    setSecretLink(link);
  };

  const handleNewSecret = () => {
    setSecretLink(null);
  };

  return (
    <div className="min-h-screen bg-black text-cyan-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
            Ziro
          </h1>
          <p className="text-cyan-400/70 text-lg">Zero knowledge, pure secrecy.</p>
        </div>

        <div className="bg-black border border-cyan-500/30 rounded-lg p-8">
          {secretLink ? (
            <LinkDisplay link={secretLink} onNewSecret={handleNewSecret} />
          ) : (
            <SecretInput onSecretCreated={handleSecretCreated} />
          )}
        </div>

        <div className="mt-8 text-center text-sm text-cyan-400/50">
          <p>All encryption happens in your browser. The server never sees your secret.</p>
        </div>

        <Footer />
      </div>
    </div>
  );
}
