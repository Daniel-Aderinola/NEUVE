'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('App Error Boundary caught:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="text-center max-w-md">
        <h2 className="text-2xl font-display font-bold mb-4">Something went wrong</h2>
        <p className="text-white/50 text-sm mb-2">{error.message}</p>
        <p className="text-white/30 text-xs mb-6 break-all">{error.stack?.split('\n').slice(0, 3).join('\n')}</p>
        <button
          onClick={() => reset()}
          className="px-6 py-3 bg-white text-black text-xs tracking-[0.15em] uppercase hover:bg-white/90 transition-colors"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
