'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { signOut } from 'next-auth/react';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  LogOut,
  CreditCard,
  FileText,
  Briefcase,
  ChevronRight,
  SlidersHorizontal,
  Sun,
  Moon,
  Monitor,
  Plus,
} from 'lucide-react';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';
import ColoredButton from '@/components/custom/colored-button';
import AgentRulesDialog from '@/components/resume/AgentRulesDialog';
import BuyCreditsDialog from './BuyCreditsDialog';
import { Id } from '../../../convex/_generated/dataModel';

interface UserData {
  _id: Id<'users'>;
  name?: string | null;
  email?: string | null;
  picture?: string | null;
  credits?: number;
}

interface Props {
  user: UserData;
  className?: string;
}

export default function UserProfilePopover({ user, className }: Props) {
  const [open, setOpen] = useState(false);
  const [buyCreditsOpen, setBuyCreditsOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  const handleNavClick = () => {
    setOpen(false);
  };

  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            aria-label="User account menu"
            className={cn(
              'group relative rounded-full p-0.5 outline-none transition-all duration-150 cursor-pointer select-none',
              'hover:ring-2 hover:ring-primary/25 active:scale-[0.96]',
              open && 'ring-2 ring-primary/30',
              className
            )}
          >
            <Avatar className="h-8 w-8 rounded-full border border-border/80 shadow-2xs group-hover:border-foreground/30 transition-colors">
              <AvatarImage src={user.picture || undefined} alt={user.name || 'User avatar'} />
              <AvatarFallback className="bg-primary/10 text-primary font-semibold text-xs">
                {user.name?.charAt(0).toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
            {/* Status indicator dot */}
            <span className="absolute bottom-0 right-0 size-2 rounded-full bg-emerald-500 ring-2 ring-background" />
          </button>
        </PopoverTrigger>

        <PopoverContent
          align="end"
          sideOffset={8}
          className="w-80 p-0 rounded-3xl border border-border/70 bg-popover/95 dark:bg-card/95 backdrop-blur-2xl shadow-2xl overflow-hidden outline-none animate-in fade-in-0 zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2 duration-150 z-50"
        >
          {/* ── Top Identity Card ── */}
          <div className="relative p-4 pb-3.5 border-b border-border/50 bg-linear-to-b from-muted/50 via-muted/20 to-transparent overflow-hidden">
            {/* Ambient subtle glow blob */}
            <div className="absolute -top-8 -right-8 size-24 rounded-full bg-primary/10 dark:bg-primary/20 blur-xl pointer-events-none" />

            <div className="flex items-center gap-3 relative z-10">
              <Avatar className="h-11 w-11 rounded-full border-2 border-background shadow-xs ring-1 ring-border/80">
                <AvatarImage src={user.picture || undefined} alt={user.name || 'User avatar'} />
                <AvatarFallback className="bg-primary/10 text-primary font-bold text-sm">
                  {user.name?.charAt(0).toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>

              <div className="min-w-0 flex-1">
                <h4 className="font-semibold text-sm text-foreground tracking-tight truncate leading-tight">
                  {user.name || 'Account'}
                </h4>
                <p className="text-xs text-muted-foreground font-mono truncate mt-0.5">
                  {user.email}
                </p>

                <div className="mt-1 flex items-center gap-1.5">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                    <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span>Active Member</span>
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* ── Interactive Credits Card ── */}
          <div className="m-3 p-3 rounded-2xl bg-card border border-border/70 shadow-2xs flex items-center justify-between gap-3 relative overflow-hidden group/credits">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="size-8 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0">
                <CreditCard className="size-4" />
              </div>
              <div className="min-w-0">
                <div className="flex items-baseline gap-1">
                  <span className="font-mono text-base font-bold text-foreground leading-none">
                    {user.credits ?? 0}
                  </span>
                  <span className="text-[11px] font-medium text-muted-foreground">credits</span>
                </div>
                <p className="text-[10px] text-muted-foreground/80 mt-0.5 leading-none">
                  Never expire
                </p>
              </div>
            </div>

            <ColoredButton
              type="button"
              color="amber"
              size="sm"
              onClick={() => {
                setOpen(false);
                setBuyCreditsOpen(true);
              }}
              className="rounded-full px-3 py-1 text-xs font-medium cursor-pointer shadow-2xs active:scale-[0.96] shrink-0"
            >
              <Plus className="size-3 mr-1" />
              <span>Top Up</span>
            </ColoredButton>
          </div>

          {/* ── Navigation Items ── */}
          <div className="px-2 py-1 space-y-0.5">
            <Link
              href="/resume"
              onClick={handleNavClick}
              className="flex items-center justify-between p-2 rounded-xl hover:bg-muted/40 transition-colors group cursor-pointer"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="size-7 rounded-lg bg-muted/60 flex items-center justify-center text-muted-foreground group-hover:text-foreground transition-colors shrink-0">
                  <FileText className="size-3.5" />
                </div>
                <div className="min-w-0 text-left">
                  <div className="text-xs font-medium text-foreground tracking-tight leading-none">
                    Resumes
                  </div>
                  <div className="text-[10px] text-muted-foreground truncate mt-0.5">
                    Master ledger & tailored versions
                  </div>
                </div>
              </div>
              <ChevronRight className="size-3.5 text-muted-foreground/40 group-hover:text-foreground group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
            </Link>

            <Link
              href="/tracker"
              onClick={handleNavClick}
              className="flex items-center justify-between p-2 rounded-xl hover:bg-muted/40 transition-colors group cursor-pointer"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="size-7 rounded-lg bg-muted/60 flex items-center justify-center text-muted-foreground group-hover:text-foreground transition-colors shrink-0">
                  <Briefcase className="size-3.5" />
                </div>
                <div className="min-w-0 text-left">
                  <div className="text-xs font-medium text-foreground tracking-tight leading-none">
                    Job Tracker
                  </div>
                  <div className="text-[10px] text-muted-foreground truncate mt-0.5">
                    Pipeline & application stages
                  </div>
                </div>
              </div>
              <ChevronRight className="size-3.5 text-muted-foreground/40 group-hover:text-foreground group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
            </Link>

            {/* AI Agent Directives Dialog Trigger */}
            <AgentRulesDialog
              userId={user._id}
              trigger={
                <button
                  type="button"
                  onClick={handleNavClick}
                  className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-muted/40 transition-colors group cursor-pointer"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="size-7 rounded-lg bg-muted/60 flex items-center justify-center text-muted-foreground group-hover:text-foreground transition-colors shrink-0">
                      <SlidersHorizontal className="size-3.5" />
                    </div>
                    <div className="min-w-0 text-left">
                      <div className="text-xs font-medium text-foreground tracking-tight leading-none flex items-center gap-1.5">
                        <span>AI Agent Directives</span>
                        <span className="px-1.5 py-0.2 rounded-full text-[9px] font-mono font-semibold bg-primary/10 text-primary border border-primary/20">
                          AI
                        </span>
                      </div>
                      <div className="text-[10px] text-muted-foreground truncate mt-0.5">
                        Custom prompt tailoring rules
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="size-3.5 text-muted-foreground/40 group-hover:text-foreground group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
                </button>
              }
            />
          </div>

          {/* ── Theme Switcher ── */}
          <div className="px-3 py-2 border-t border-border/40 bg-muted/10">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                Appearance
              </span>
            </div>

            <div className="grid grid-cols-3 gap-1 p-0.5 rounded-xl bg-muted/40 border border-border/50">
              <button
                type="button"
                onClick={() => setTheme('light')}
                className={cn(
                  'flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer select-none',
                  theme === 'light'
                    ? 'bg-background text-foreground shadow-2xs font-semibold'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                <Sun className="size-3" />
                <span>Light</span>
              </button>

              <button
                type="button"
                onClick={() => setTheme('dark')}
                className={cn(
                  'flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer select-none',
                  theme === 'dark'
                    ? 'bg-background text-foreground shadow-2xs font-semibold'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                <Moon className="size-3" />
                <span>Dark</span>
              </button>

              <button
                type="button"
                onClick={() => setTheme('system')}
                className={cn(
                  'flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer select-none',
                  theme === 'system'
                    ? 'bg-background text-foreground shadow-2xs font-semibold'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                <Monitor className="size-3" />
                <span>Auto</span>
              </button>
            </div>
          </div>

          {/* ── Footer Actions: Sign Out ── */}
          <div className="p-2 border-t border-border/40 bg-muted/5">
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                signOut();
              }}
              className="w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs font-medium text-muted-foreground hover:text-destructive hover:bg-destructive/10 active:scale-[0.98] transition-colors cursor-pointer group"
            >
              <div className="flex items-center gap-2">
                <LogOut className="size-3.5 group-hover:translate-x-0.5 transition-transform" />
                <span>Sign Out</span>
              </div>
              <span className="text-[10px] font-mono text-muted-foreground/50">
                Resumely
              </span>
            </button>
          </div>
        </PopoverContent>
      </Popover>

      {/* Buy Credits Modal */}
      <BuyCreditsDialog open={buyCreditsOpen} onOpenChange={setBuyCreditsOpen} />
    </>
  );
}
