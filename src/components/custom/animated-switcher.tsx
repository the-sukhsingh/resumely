'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
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
  className,
  itemClassName,
  size = 'default',
  fullWidth = false,
}: AnimatedSwitcherProps<T>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Map<string, HTMLElement>>(new Map());
  const [pillStyle, setPillStyle] = useState<{
    left: number;
    top: number;
    width: number;
    height: number;
  } | null>(null);

  useEffect(() => {
    const activeEl = itemRefs.current.get(value);
    const containerEl = containerRef.current;
    if (!activeEl || !containerEl) {
      setPillStyle(null);
      return;
    }

    const updatePill = () => {
      const containerRect = containerEl.getBoundingClientRect();
      const activeRect = activeEl.getBoundingClientRect();

      setPillStyle({
        left: activeRect.left - containerRect.left,
        top: activeRect.top - containerRect.top,
        width: activeRect.width,
        height: activeRect.height,
      });
    };

    updatePill();

    window.addEventListener('resize', updatePill);
    return () => window.removeEventListener('resize', updatePill);
  }, [value]);

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
    <div
      ref={containerRef}
      className={cn(
        'inline-flex items-center p-0.5 bg-muted/40 rounded-full border border-border/50 backdrop-blur-md relative',
        fullWidth && 'w-full flex',
        className
      )}
      role="tablist"
    >
      <AnimatePresence>
        {pillStyle && (
          <motion.span
            className="absolute bg-background rounded-full shadow-2xs pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{
              opacity: 1,
              left: pillStyle.left,
              top: pillStyle.top,
              width: pillStyle.width,
              height: pillStyle.height,
            }}
            exit={{ opacity: 0 }}
            transition={{
              type: 'spring',
              stiffness: 450,
              damping: 35,
            }}
          />
        )}
      </AnimatePresence>

      {items.map((item) => {
        const isActive = value === item.value;
        const Icon = item.icon;

        const sharedClassName = cn(
          'flex items-center rounded-full font-medium transition-colors relative cursor-pointer select-none z-10',
          sizeClasses,
          fullWidth ? 'flex-1 justify-center' : 'justify-center',
          isActive
            ? 'text-foreground font-semibold'
            : 'text-muted-foreground hover:text-foreground',
          item.disabled && 'opacity-50 cursor-not-allowed pointer-events-none',
          itemClassName
        );

        const content = (
          <span className="flex items-center justify-center gap-1.5 min-w-0">
            {Icon && <Icon size={iconSizes} className="shrink-0" />}
            <span className="truncate">{item.label}</span>
            {item.badge}
          </span>
        );

        const setRef = (el: HTMLElement | null) => {
          if (el) itemRefs.current.set(item.value, el);
          else itemRefs.current.delete(item.value);
        };

        if (item.href) {
          return (
            <Link
              key={item.value}
              ref={setRef as React.Ref<HTMLAnchorElement>}
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
            ref={setRef as React.Ref<HTMLButtonElement>}
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
    </div>
  );
}