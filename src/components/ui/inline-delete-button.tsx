'use client';

import * as React from 'react';
import { Loader2, X } from 'lucide-react';
import { TrashDuo } from '@/components/icons';
import { cn } from '@/lib/utils';

export interface InlineDeleteButtonProps {
  /** Callback executed on confirmed delete */
  onConfirm: () => Promise<void> | void;
  /** Custom confirm button text (defaults to "Delete") */
  confirmText?: string;
  /** Accessible label / tooltip */
  label?: string;
  /** External loading state */
  isDeleting?: boolean;
  /** Disable the button */
  disabled?: boolean;
  /** Auto-reset timeout in milliseconds (defaults to 4000) */
  autoResetMs?: number;
  /** Additional styling */
  className?: string;
  /** Button size variant */
  size?: 'sm' | 'md';
}

export function InlineDeleteButton({
  onConfirm,
  confirmText = 'Delete',
  label = 'Delete item',
  isDeleting: externalIsDeleting,
  disabled = false,
  autoResetMs = 4000,
  className,
  size = 'md',
}: InlineDeleteButtonProps) {
  const [isConfirming, setIsConfirming] = React.useState(false);
  const [internalIsDeleting, setInternalIsDeleting] = React.useState(false);
  const timerRef = React.useRef<NodeJS.Timeout | null>(null);

  const isDeleting = externalIsDeleting ?? internalIsDeleting;

  const clearTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const startAutoReset = () => {
    clearTimer();
    if (autoResetMs > 0) {
      timerRef.current = setTimeout(() => {
        setIsConfirming(false);
      }, autoResetMs);
    }
  };

  React.useEffect(() => {
    return () => clearTimer();
  }, []);

  const handleClickInitial = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (disabled || isDeleting) return;
    setIsConfirming(true);
    startAutoReset();
  };

  const handleCancel = (e: React.MouseEvent) => {
    e.stopPropagation();
    clearTimer();
    setIsConfirming(false);
  };

  const handleConfirm = async (e: React.MouseEvent) => {
    e.stopPropagation();
    clearTimer();
    if (disabled || isDeleting) return;

    try {
      setInternalIsDeleting(true);
      await onConfirm();
      setIsConfirming(false);
    } catch (err) {
      console.error('Delete action failed:', err);
    } finally {
      setInternalIsDeleting(false);
    }
  };

  if (!isConfirming) {
    return (
      <button
        type="button"
        disabled={disabled || isDeleting}
        onClick={handleClickInitial}
        title={label}
        aria-label={label}
        className={cn(
          'rounded-lg flex items-center justify-center text-muted-foreground/70 hover:text-destructive hover:bg-destructive/10 active:scale-[0.93] transition-all cursor-pointer disabled:opacity-40 disabled:pointer-events-none',
          size === 'sm' ? 'size-7' : 'size-8',
          className
        )}
      >
        <TrashDuo className={size === 'sm' ? 'size-3.5' : 'size-4'} />
      </button>
    );
  }

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className={cn(
        'inline-flex items-center gap-1 rounded-lg border border-destructive/30 bg-destructive/5 p-0.5 animate-in fade-in-0 zoom-in-95 duration-150',
        className
      )}
    >
      <button
        type="button"
        onClick={handleConfirm}
        disabled={disabled || isDeleting}
        className={cn(
          'px-2 font-medium rounded-md bg-destructive text-destructive-foreground hover:bg-destructive/90 active:scale-[0.96] transition-all cursor-pointer flex items-center gap-1 text-[11px] shadow-xs disabled:opacity-60 disabled:pointer-events-none',
          size === 'sm' ? 'h-6' : 'h-7'
        )}
      >
        {isDeleting && <Loader2 className="size-3 animate-spin shrink-0" />}
        <span>{isDeleting ? 'Deleting...' : confirmText}</span>
      </button>

      <button
        type="button"
        onClick={handleCancel}
        disabled={isDeleting}
        title="Cancel"
        aria-label="Cancel deletion"
        className={cn(
          'rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/70 active:scale-[0.92] transition-colors cursor-pointer',
          size === 'sm' ? 'size-6' : 'size-7'
        )}
      >
        <X className="size-3.5" />
      </button>
    </div>
  );
}
