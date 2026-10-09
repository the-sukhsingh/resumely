'use client';

import * as React from 'react';
import { Popover as PopoverPrimitive } from 'radix-ui';
import { Loader2 } from 'lucide-react';
import { TrashDuo } from '@/components/icons';
import { cn } from '@/lib/utils';

export interface DeleteConfirmPopoverProps {
  /** The trigger element (e.g. custom delete icon or button). If omitted, renders a default trash icon button. */
  children?: React.ReactNode;
  /** Title for the popover (e.g. "Delete this version?" or "Delete tracked job?") */
  title?: React.ReactNode;
  /** Descriptive body text (e.g. "Are you sure you want to delete Web Designer? This action cannot be undone.") */
  description?: React.ReactNode;
  /** Confirm button label (defaults to "Delete") */
  confirmText?: string;
  /** Cancel button label (defaults to "Cancel") */
  cancelText?: string;
  /** Action executed on confirmation. If returns a Promise, loading state is tracked automatically. */
  onConfirm: () => Promise<void> | void;
  /** External loading indicator override */
  isDeleting?: boolean;
  /** Preferred popover side (defaults to 'top') */
  side?: 'top' | 'right' | 'bottom' | 'left';
  /** Preferred popover alignment (defaults to 'end') */
  align?: 'start' | 'center' | 'end';
  /** Distance from the trigger in pixels (defaults to 8) */
  sideOffset?: number;
  /** Additional styling for the popover container */
  className?: string;
  /** Disable the trigger */
  disabled?: boolean;
  /** Controlled open state */
  open?: boolean;
  /** Controlled onOpenChange callback */
  onOpenChange?: (open: boolean) => void;
  /** Custom icon for the header badge. Pass null to hide. */
  icon?: React.ReactNode | null;
  /** Compact mode: streamlined layout for narrow contexts like chat or small rows */
  compact?: boolean;
  /** Whether to show the popover arrow pointing to the button (defaults to true) */
  showArrow?: boolean;
}

export function DeleteConfirmPopover({
  children,
  title = 'Delete this item?',
  description,
  confirmText = 'Delete',
  cancelText = 'Cancel',
  onConfirm,
  isDeleting: externalIsDeleting,
  side = 'top',
  align = 'end',
  sideOffset = 8,
  className,
  disabled = false,
  open: controlledOpen,
  onOpenChange: setControlledOpen,
  icon,
  compact = false,
  showArrow = true,
}: DeleteConfirmPopoverProps) {
  const [internalOpen, setInternalOpen] = React.useState(false);
  const [internalIsDeleting, setInternalIsDeleting] = React.useState(false);

  const isControlled = controlledOpen !== undefined;
  const isOpen = isControlled ? controlledOpen : internalOpen;

  const handleOpenChange = (nextOpen: boolean) => {
    if (disabled) return;
    if (isControlled) {
      setControlledOpen?.(nextOpen);
    } else {
      setInternalOpen(nextOpen);
    }
  };

  const isDeleting = externalIsDeleting ?? internalIsDeleting;

  const handleConfirm = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isDeleting || disabled) return;

    try {
      setInternalIsDeleting(true);
      await onConfirm();
      handleOpenChange(false);
    } catch (err) {
      console.error('Delete confirmation action failed:', err);
    } finally {
      setInternalIsDeleting(false);
    }
  };

  const handleCancel = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isDeleting) return;
    handleOpenChange(false);
  };

  return (
    <PopoverPrimitive.Root open={isOpen} onOpenChange={handleOpenChange}>
      <PopoverPrimitive.Trigger
        asChild
        disabled={disabled}
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        {children ? (
          children
        ) : (
          <button
            type="button"
            disabled={disabled}
            aria-label="Delete"
            title="Delete"
            className="size-8 rounded-lg flex items-center justify-center text-muted-foreground/70 hover:text-destructive hover:bg-destructive/10 active:scale-[0.93] transition-all cursor-pointer disabled:opacity-40 disabled:pointer-events-none"
          >
            <TrashDuo className="size-4" />
          </button>
        )}
      </PopoverPrimitive.Trigger>

      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
          data-slot="delete-confirm-popover"
          side={side}
          align={align}
          sideOffset={sideOffset}
          collisionPadding={12}
          onPointerDown={(e) => e.stopPropagation()}
          onClick={(e) => e.stopPropagation()}
          className={cn(
            'z-50 rounded-xl border border-border/80 bg-popover/95 text-popover-foreground shadow-xl backdrop-blur-md ring-1 ring-foreground/5 outline-hidden',
            'origin-(--radix-popover-content-transform-origin)',
            'data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95',
            'data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95',
            'data-[side=top]:slide-in-from-bottom-1 data-[side=bottom]:slide-in-from-top-1 data-[side=left]:slide-in-from-right-1 data-[side=right]:slide-in-from-left-1 duration-150',
            compact ? 'w-60 p-2.5' : 'w-[280px] p-3.5',
            className
          )}
        >
          {showArrow && (
            <PopoverPrimitive.Arrow
              className="fill-popover stroke-border/80 drop-shadow-xs"
              width={12}
              height={6}
            />
          )}

          <div className="flex flex-col gap-2">
            {/* Header: Icon + Title */}
            <div className="flex items-start gap-2.5">
              {icon !== null && (
                <div
                  className={cn(
                    'rounded-lg bg-destructive/10 text-destructive flex items-center justify-center shrink-0 border border-destructive/15',
                    compact ? 'size-6 mt-0.5' : 'size-7 mt-0.5'
                  )}
                  aria-hidden="true"
                >
                  {icon ?? <TrashDuo className={compact ? 'size-3.5' : 'size-4'} />}
                </div>
              )}

              <div className="flex-1 min-w-0">
                <h4 className="text-xs font-semibold text-foreground tracking-tight leading-snug">
                  {title}
                </h4>
                {description && (
                  <div className="text-[11px] text-muted-foreground leading-relaxed mt-1 break-words">
                    {description}
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div
              className={cn(
                'flex items-center justify-end gap-1.5 pt-2 border-t border-border/50',
                compact ? 'mt-1 pt-1.5' : 'mt-1.5'
              )}
            >
              <button
                type="button"
                onClick={handleCancel}
                disabled={isDeleting}
                className="h-7 px-2.5 text-[11px] font-medium rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/80 active:scale-[0.97] transition-all cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
              >
                {cancelText}
              </button>

              <button
                type="button"
                onClick={handleConfirm}
                disabled={isDeleting}
                className="h-7 px-3 text-[11px] font-medium rounded-md bg-destructive text-secondary hover:bg-destructive/90 active:scale-[0.97] transition-all cursor-pointer flex items-center gap-1.5 shadow-xs disabled:opacity-60 disabled:pointer-events-none"
              >
                {isDeleting && <Loader2 className="size-3 animate-spin shrink-0" />}
                <span>{isDeleting ? 'Deleting...' : confirmText}</span>
              </button>
            </div>
          </div>
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  );
}
