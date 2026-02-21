import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
import React, { PropsWithChildren } from 'react';

export default function LoaderCircle({
  loading,
  children,
  className,
}: PropsWithChildren<{ loading: boolean; className?: string }>) {
  return (
    <div className={cn('relative w-full', className)}>
      {loading && (
        <div className="absolute inset-0 z-20 flex items-center justify-center">
          <div className="absolute inset-0 bg-background/50 backdrop-blur-sm" />
          <Loader2 className="relative h-16 w-16 animate-spin" />
        </div>
      )}
      <div
        className={cn(
          'relative w-full h-full flex flex-col gap-4',
          loading && 'pointer-events-none',
        )}
        aria-busy={loading}
      >
        {children}
      </div>
    </div>
  );
}
