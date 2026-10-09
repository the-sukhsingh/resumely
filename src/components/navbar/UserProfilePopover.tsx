'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { signOut } from 'next-auth/react';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  CreditCard,
  DuoFile,
  Briefcase,
  SlidersDuo,
  Sun,
  MoonStars,
  MonitorDuo,
  LogOutDuo,
  AddCircle,
} from '@/components/icons';
import { ChevronRight } from 'lucide-react';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';
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
              'hover:ring-2 hover:ring-primary/20',
              open && 'ring-2 ring-primary/30',
              className
            )}
          >
            <Avatar className="h-8 w-8 rounded-full border border-border/70 shadow-2xs group-hover:border-foreground/30 transition-colors">
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
          className="p-0 rounded-2xl border border-border/60 bg-popover/95 dark:bg-card/95 backdrop-blur-xl shadow-xl shadow-black/5 dark:shadow-black/40 overflow-hidden outline-none animate-in fade-in-0 zoom-in-95 data-[side=bottom]:slide-in-from-top-1.5 data-[side=top]:slide-in-from-bottom-1.5 duration-150 z-50 select-none"
        >
          {/* <div className='absolute inset-0 -z-1 '>
            <span className='size-84'></span>
          </div> */}
          {/* ── User Header ── */}
          <div className="px-3.5 pt-3.5 pb-3 border-b border-border/40">
            <div className="flex items-center gap-3">
              <Avatar className="h-9 w-9 rounded-full ring-1 ring-border/60 shrink-0">
                <AvatarImage src={user.picture || undefined} alt={user.name || 'User avatar'} />
                <AvatarFallback className="bg-primary/10 text-primary font-semibold text-xs">
                  {user.name?.charAt(0).toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>

              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-1">
                  <h4 className="font-semibold text-[13px] text-foreground tracking-tight truncate leading-tight">
                    {user.name || 'Account'}
                  </h4>
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 shrink-0">
                    <span className="size-1.5 rounded-full bg-emerald-500" />
                    <span>Active</span>
                  </span>
                </div>
                <p className="text-[11px] text-muted-foreground truncate mt-0.5 leading-tight">
                  {user.email}
                </p>
              </div>
            </div>
          </div>

          {/* ── Credits Strip ── */}
          <div className="mx-2.5 my-2 p-2.5 rounded-xl bg-muted/30 border border-border/50 flex items-center justify-between gap-2.5 transition-colors">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="size-7 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                <CreditCard size={15} />
              </div>
              <div className="min-w-0">
                <div className="flex items-baseline gap-1 leading-none">
                  <span className="font-semibold text-[13px] tabular-nums text-foreground tracking-tight">
                    {user.credits ?? 0}
                  </span>
                  <span className="text-[11px] text-muted-foreground">credits</span>
                </div>
                <span className="text-[10px] text-muted-foreground/70 leading-none mt-0.5 block">
                  Never expire
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setOpen(false);
                setBuyCreditsOpen(true);
              }}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-medium bg-foreground text-background hover:opacity-90 active:scale-[0.96] transition-all cursor-pointer shadow-2xs shrink-0"
            >
              <AddCircle size={12} className="[&_.duo-icons-secondary-layer]:opacity-0" />
              <span>Top up</span>
            </button>
          </div>

          {/* ── Navigation Items ── */}
          <div className="px-1.5 py-1 space-y-0.5">
            <Link
              href="/resume"
              onClick={handleNavClick}
              className="group flex items-center justify-between px-2 py-1.5 rounded-xl hover:bg-muted/50 active:scale-[0.99] transition-all cursor-pointer"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="size-7 rounded-lg bg-muted/60 text-muted-foreground group-hover:text-foreground group-hover:bg-muted flex items-center justify-center shrink-0 transition-colors">
                  <DuoFile size={16} />
                </div>
                <div className="min-w-0">
                  <div className="text-[12px] font-medium text-foreground tracking-tight leading-snug">
                    Resumes
                  </div>
                  <div className="text-[10px] text-muted-foreground/75 truncate leading-tight">
                    Master ledger & tailored versions
                  </div>
                </div>
              </div>
              <ChevronRight className="size-3.5 text-muted-foreground/35 group-hover:text-foreground/70 group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
            </Link>

            <Link
              href="/tracker"
              onClick={handleNavClick}
              className="group flex items-center justify-between px-2 py-1.5 rounded-xl hover:bg-muted/50 active:scale-[0.99] transition-all cursor-pointer"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="size-7 rounded-lg bg-muted/60 text-muted-foreground group-hover:text-foreground group-hover:bg-muted flex items-center justify-center shrink-0 transition-colors">
                  <Briefcase size={16} />
                </div>
                <div className="min-w-0">
                  <div className="text-[12px] font-medium text-foreground tracking-tight leading-snug">
                    Job Tracker
                  </div>
                  <div className="text-[10px] text-muted-foreground/75 truncate leading-tight">
                    Pipeline & application stages
                  </div>
                </div>
              </div>
              <ChevronRight className="size-3.5 text-muted-foreground/35 group-hover:text-foreground/70 group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
            </Link>

            {/* AI Agent Directives Dialog Trigger */}
            <AgentRulesDialog
              userId={user._id}
              trigger={
                <button
                  type="button"
                  onClick={handleNavClick}
                  className="w-full group flex items-center justify-between px-2 py-1.5 rounded-xl hover:bg-muted/50 active:scale-[0.99] transition-all cursor-pointer text-left"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="size-7 rounded-lg bg-muted/60 text-muted-foreground group-hover:text-foreground group-hover:bg-muted flex items-center justify-center shrink-0 transition-colors">
                      <SlidersDuo size={16} />
                    </div>
                    <div className="min-w-0">
                      <div className="text-[12px] font-medium text-foreground tracking-tight leading-snug flex items-center gap-1.5">
                        <span>AI Agent Directives</span>
                        <span className="px-1 py-0.2 rounded text-[9px] font-mono font-medium bg-muted text-muted-foreground border border-border/50">
                          AI
                        </span>
                      </div>
                      <div className="text-[10px] text-muted-foreground/75 truncate leading-tight">
                        Custom prompt tailoring rules
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="size-3.5 text-muted-foreground/35 group-hover:text-foreground/70 group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
                </button>
              }
            />
          </div>

          {/* ── Appearance Segmented Control ── */}
          <div className="px-2.5 pt-2 pb-2.5 border-t border-border/40">
            <div className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground/70 px-1 mb-1.5">
              Appearance
            </div>
            <div className="grid grid-cols-3 gap-1 p-0.5 rounded-xl bg-muted/40 border border-border/40">
              <button
                type="button"
                onClick={() => setTheme('light')}
                className={cn(
                  'flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-[11px] font-medium transition-all duration-150 cursor-pointer select-none active:scale-[0.97]',
                  theme === 'light'
                    ? 'bg-background text-foreground shadow-2xs font-semibold border border-border/40'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                <Sun size={13} className={cn(theme === 'light' ? 'text-amber-500' : 'text-muted-foreground')} />
                <span>Light</span>
              </button>

              <button
                type="button"
                onClick={() => setTheme('dark')}
                className={cn(
                  'flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-[11px] font-medium transition-all duration-150 cursor-pointer select-none active:scale-[0.97]',
                  theme === 'dark'
                    ? 'bg-background text-foreground shadow-2xs font-semibold border border-border/40'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                <MoonStars size={13} className={cn(theme === 'dark' ? 'text-blue-400' : 'text-muted-foreground')} />
                <span>Dark</span>
              </button>

              <button
                type="button"
                onClick={() => setTheme('system')}
                className={cn(
                  'flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-[11px] font-medium transition-all duration-150 cursor-pointer select-none active:scale-[0.97]',
                  theme === 'system'
                    ? 'bg-background text-foreground shadow-2xs font-semibold border border-border/40'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                <MonitorDuo size={13} className={cn(theme === 'system' ? 'text-foreground' : 'text-muted-foreground')} />
                <span>Auto</span>
              </button>
            </div>
          </div>

          {/* ── Footer / Sign Out ── */}
          <div className="p-1.5 border-t border-border/40 bg-muted/20">
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                signOut();
              }}
              className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs font-medium text-muted-foreground hover:text-destructive hover:bg-destructive/10 active:scale-[0.98] transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-2">
                <LogOutDuo size={14} className="group-hover:translate-x-0.5 transition-transform" />
                <span>Sign Out</span>
              </div>
              <span className="text-[10px] font-mono text-muted-foreground/40 group-hover:text-muted-foreground/60 transition-colors">
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
