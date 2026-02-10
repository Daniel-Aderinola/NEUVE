'use client';

import { useEffect } from 'react';

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Admin Error Boundary caught:', error);
  }, [error]);

  return (
    <div className="pt-20 md:pt-24 pb-20">
      <div className="container-luxury">
        <div className="text-center max-w-md mx-auto py-20">
          <h2 className="text-2xl font-display font-bold mb-4">Admin Error</h2>
          <p className="text-white/50 text-sm mb-2">{error.message}</p>
          <p className="text-white/30 text-xs mb-6 break-all font-mono whitespace-pre-wrap">
            {error.stack?.split('\n').slice(0, 5).join('\n')}
          </p>
          <button
            onClick={() => reset()}
            className="px-6 py-3 bg-white text-black text-xs tracking-[0.15em] uppercase hover:bg-white/90 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    </div>
  );
}
