import { Loader2 } from 'lucide-react';
import React, { PropsWithChildren } from 'react';

export default function LoaderCircle({
  loading,
  children,
}: PropsWithChildren<{ loading: boolean }>) {
  return (
    <div className="sm:relative w-full h-full">
      {loading && (
        <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-auto">
          <div className="absolute inset-0 bg-background/50 backdrop-blur-sm" />
          <Loader2
            className="relative animate-spin h-16 w-16 z-30"
            role="status"
            aria-label="loading"
          />
        </div>
      )}

      <div className={loading ? 'pointer-events-none' : undefined} aria-busy={loading}>
        {children}
      </div>
    </div>
  );
}
