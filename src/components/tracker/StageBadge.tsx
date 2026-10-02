'use client';

import React from 'react';
import { JobStage, STAGE_CONFIGS } from './types';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChevronDown, Check } from 'lucide-react';

interface Props {
  stage: JobStage;
  interactive?: boolean;
  onStageChange?: (newStage: JobStage) => void;
  size?: 'sm' | 'default';
  variant?: 'default' | 'minimal';
  className?: string;
}

export default function StageBadge({
  stage,
  interactive = false,
  onStageChange,
  size = 'default',
  variant = 'default',
  className,
}: Props) {
  const config = STAGE_CONFIGS[stage] || STAGE_CONFIGS.saved;

  const badgeContent = (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 font-mono font-medium transition-colors',
        variant === 'minimal'
          ? 'px-1.5 py-0.5 text-[10px] text-muted-foreground/80 hover:text-foreground rounded-md'
          : cn(
              'rounded-full border transition-all duration-150',
              size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs',
              config.badgeClass
            ),
        interactive && 'cursor-pointer active:scale-[0.97]',
        className
      )}
    >
      <span
        className={cn(
          'rounded-full shrink-0',
          size === 'sm' || variant === 'minimal' ? 'size-1.5' : 'size-2',
          config.dotClass
        )}
      />
      <span className="truncate">{config.shortLabel}</span>
      {interactive && <ChevronDown className="size-2.5 opacity-50 ml-0.5 shrink-0" />}
    </span>
  );

  if (!interactive) {
    return badgeContent;
  }

  return (
    <div onClick={(e) => e.stopPropagation()}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className="outline-none focus-visible:ring-1 focus-visible:ring-foreground/20 rounded-md"
          >
            {badgeContent}
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="w-48 p-1.5 rounded-xl border-border/60 shadow-lg bg-background/95 backdrop-blur-xl"
        >
          <div className="px-2 py-1 text-[10px] font-mono uppercase tracking-wider text-muted-foreground border-b border-border/40 mb-1">
            Change Stage
          </div>
          {(Object.keys(STAGE_CONFIGS) as JobStage[]).map((st) => {
            const itemConfig = STAGE_CONFIGS[st];
            const isCurrent = st === stage;
            return (
              <DropdownMenuItem
                key={st}
                onClick={() => onStageChange?.(st)}
                className={cn(
                  'flex items-center justify-between px-2 py-1.5 rounded-lg text-xs cursor-pointer transition-colors',
                  isCurrent ? 'bg-muted/70 font-medium' : 'hover:bg-muted/40'
                )}
              >
                <div className="flex items-center gap-2">
                  <span className={cn('size-2 rounded-full', itemConfig.dotClass)} />
                  <span>{itemConfig.label}</span>
                </div>
                {isCurrent && <Check className="size-3.5 text-foreground shrink-0" />}
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
