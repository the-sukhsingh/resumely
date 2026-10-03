'use client';

import React, { useId } from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';

export interface SwitcherItem<T extends string = string> {
  value: T;
  label: React.ReactNode;
  icon?: React.ComponentType<{ className?: string; size?: number }>;
  href?: string;
  disabled?: boolean;
  title?: string;
  badge?: React.ReactNode;
}

export interface AnimatedSwitcherProps<T extends string = string> {
  items: SwitcherItem<T>[];
  value: T;
  onChange?: (value: T) => void;
  layoutId?: string;
  className?: string;
  itemClassName?: string;
  size?: 'sm' | 'default' | 'lg';
  fullWidth?: boolean;
}

export default function AnimatedSwitcher<T extends string = string>({
  items,
  value,
  onChange,
  layoutId,
  className,
  itemClassName,
  size = 'default',
  fullWidth = false,
}: AnimatedSwitcherProps<T>) {
  const generatedId = useId();
  const activeLayoutId = layoutId || `switcher-pill-${generatedId}`;

  const sizeClasses = {
    sm: 'px-2.5 py-1 text-[11px] gap-1',
    default: 'px-3.5 py-1.5 text-xs gap-1.5',
    lg: 'px-4 py-2 text-sm gap-2',
  }[size];

  const iconSizes = {
    sm: 13,
    default: 14,
    lg: 16,
  }[size];

  return (
    <motion.div
      className={cn(
        'inline-flex items-center p-0.5 bg-muted/40 rounded-full border border-border/50 backdrop-blur-md',
        fullWidth && 'w-full flex',
        className
      )}
      role="tablist"
    >
      {items.map((item) => {
        const isActive = value === item.value;
        const Icon = item.icon;

        const sharedClassName = cn(
          'flex items-center rounded-full font-medium transition-colors relative cursor-pointer select-none',
          sizeClasses,
          fullWidth ? 'flex-1 justify-center' : 'justify-center',
          isActive
            ? 'text-foreground font-semibold'
            : 'text-muted-foreground hover:text-foreground',
          item.disabled && 'opacity-50 cursor-not-allowed pointer-events-none',
          itemClassName
        );

        const content = (
          <>
            {isActive && (
              <motion.span
                layoutId={activeLayoutId}
                transition={{
                  type: 'spring',
                  stiffness: 450,
                  damping: 35,
                }}
                className="absolute inset-0 bg-background rounded-full shadow-2xs"
              />
            )}
            <span className="flex items-center justify-center gap-1.5 relative z-10 min-w-0">
              {Icon && <Icon size={iconSizes} className="shrink-0" />}
              <span className="truncate">{item.label}</span>
              {item.badge}
            </span>
          </>
        );

        if (item.href) {
          return (
            <Link
              key={item.value}
              href={item.href}
              prefetch={true}
              title={item.title}
              role="tab"
              aria-selected={isActive}
              className={sharedClassName}
            >
              {content}
            </Link>
          );
        }

        return (
          <button
            key={item.value}
            type="button"
            title={item.title}
            role="tab"
            aria-selected={isActive}
            disabled={item.disabled}
            onClick={() => !item.disabled && onChange?.(item.value)}
            className={sharedClassName}
          >
            {content}
          </button>
        );
      })}
    </motion.div>
  );
}
