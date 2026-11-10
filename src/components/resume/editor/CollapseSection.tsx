"use client"
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { ChevronDown, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

export interface CollapsibleSectionProps {
  title: string;
  badge?: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
  sectionKey?: string;
  onReset?: () => void;
  resetTooltip?: string;
}

const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({
  title,
  badge,
  isOpen,
  onToggle,
  children,
  sectionKey = 'default',
  onReset,
}) => {
  const [isResetOpen, setIsResetOpen] = useState(false);

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    onToggle();
  };

  return (
    <div className="overflow-hidden">
      <div
        onClick={handleToggle}
        className={cn(
          `w-full cursor-pointer flex items-center justify-between px-3 py-2 transition-colors border-b group/section`,
          isOpen ? "bg-accent text-neutral-900 dark:text-neutral-50": "hover:bg-sidebar"
        )}
      >
        <div className="flex items-center gap-2 flex-1 pointer-events-none min-w-0">
          <h2 className="font-sans font-medium text-sm select-none">{title}</h2>
          {badge}
        </div>
        <div className="flex items-center gap-1 relative z-10 pointer-events-auto">
          {onReset && (
            <Popover open={isResetOpen} onOpenChange={setIsResetOpen}>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  className="h-6 px-1.5 rounded-md text-[11px] font-medium text-muted-foreground/70 hover:text-foreground hover:bg-muted/60 transition-colors flex items-center gap-1 cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  title={`Reset ${title} to master resume`}
                  aria-label={`Reset ${title} to master resume`}
                >
                  <RotateCcw className="size-3" />
                  <span className="hidden sm:inline">Reset</span>
                </button>
              </PopoverTrigger>
              <PopoverContent
                align="end"
                side="bottom"
                sideOffset={6}
                className="w-64 p-3 bg-popover border border-border shadow-md rounded-xl z-50 text-left"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="space-y-1.5">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
                    <RotateCcw className="size-3.5 text-muted-foreground" />
                    <span>Reset {title}?</span>
                  </div>
                  <p className="text-[11.5px] text-muted-foreground leading-relaxed">
                    This will replace current {title.toLowerCase()} with the content from your master resume.
                  </p>
                </div>
                <div className="flex items-center justify-end gap-1.5 pt-2 mt-2 border-t border-border/40">
                  <button
                    type="button"
                    className="h-6 px-2 text-[11px] rounded font-normal text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsResetOpen(false);
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="h-6 px-2.5 text-[11px] rounded bg-foreground text-background font-medium hover:opacity-90 active:scale-95 transition-all cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      onReset();
                      if (!isOpen) onToggle();
                      setIsResetOpen(false);
                    }}
                  >
                    Reset
                  </button>
                </div>
              </PopoverContent>
            </Popover>
          )}

          <button
            onClick={handleToggle}
            className="p-1 hover:bg-muted rounded transition-colors"
            type="button"
            aria-label={isOpen ? `Collapse ${title}` : `Expand ${title}`}
          >
            <motion.div
              animate={{ rotate: isOpen ? 180 : 0 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
            >
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            </motion.div>
          </button>
        </div>
      </div>
      <AnimatePresence initial={false} mode="wait">
        {isOpen && (
          <motion.div
          className='border-b'
            key={`content-${sectionKey}`}
            initial={{ height: 0, opacity: 0, filter: "blur(2px)" }}
            animate={{ 
              height: "auto", 
              opacity: 1,
              filter: "blur(0px)",
              transition: {
                height: { duration: 0.15, ease: "linear" },
                opacity: { duration: 0.1, ease: "linear", delay: 0.05 },
                filter: { duration: 0.1, ease: "linear", delay: 0.05}
              }
            }}
            exit={{ 
              height: 0, 
              opacity: 0,
              filter: "blur(2px)",
              transition: {
                height: { duration: 0.15, ease: "linear" },
                opacity: { duration: 0.1, ease: "linear" },
                filter: {duration: 0.1, ease: "linear"}
              }
            }}
          >
            <div className="px-4 py-4">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CollapsibleSection