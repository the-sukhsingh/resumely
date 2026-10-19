'use client';

import React from 'react';
import { ResumeSettings } from '@/types/resume';
import { SUPPORTED_RESUME_FONTS } from '@/constants/pdf-fonts';
import { DEFAULT_SETTINGS, ACCENT_COLORS } from './SettingsPanel';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sparkles,
  ChevronDown,
  Minus,
  Plus,
  ArrowUpDown,
  AlignJustify,
  MoveHorizontal,
  Check,
  Palette,
  Underline as UnderlineIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface ResumeToolbarProps {
  settings: ResumeSettings;
  onChange: (settings: ResumeSettings) => void;
  className?: string;
}

export default function ResumeToolbar({
  settings,
  onChange,
  className,
}: ResumeToolbarProps) {
  const currentFont = settings.font || DEFAULT_SETTINGS.font;
  const currentFontSize = settings.fontSize ?? DEFAULT_SETTINGS.fontSize ?? 9.5;
  const currentLineHeight = settings.lineHeight ?? DEFAULT_SETTINGS.lineHeight ?? 1.35;
  const currentSectionSpacing = settings.sectionSpacing ?? DEFAULT_SETTINGS.sectionSpacing ?? 1.4;
  const currentMargin = (settings.pageMargin as string) ?? DEFAULT_SETTINGS.pageMargin ?? 'normal';
  const currentPaper = (settings.paperSize || DEFAULT_SETTINGS.paperSize || 'letter').toUpperCase();
  const currentAccent = settings.accentColor || settings.primaryColor || DEFAULT_SETTINGS.accentColor || '#0f172a';
  const showUnderline = settings.showUnderline !== false;

  const update = (partial: Partial<ResumeSettings>) => {
    onChange({
      ...DEFAULT_SETTINGS,
      ...settings,
      ...partial,
      layout: 'one-column' as const,
    });
  };

  const handleAutoAdjust = () => {
    update({
      fontSize: 9.0,
      lineHeight: 1.3,
      sectionSpacing: 1.25,
      paragraphSpacing: 2,
      pageMargin: 'compact',
    });
    toast.success('Resume layout auto-adjusted for optimal 1-page fit!');
  };

  const currentFontLabel =
    SUPPORTED_RESUME_FONTS.find((f) => f.value.toLowerCase() === currentFont.toLowerCase())?.label ||
    currentFont;

  return (
    <div
      className={cn(
        "w-full bg-background/95 backdrop-blur-md border-b border-border/60 px-2 py-1 flex items-center justify-between gap-1.5 overflow-x-auto nobar text-xs shrink-0 select-none",
        className
      )}
    >
      <div className="flex items-center gap-1.5 flex-nowrap">
        {/* Auto Adjust Button */}
        <button
          type="button"
          onClick={handleAutoAdjust}
          className="h-7 px-2.5 rounded-md font-semibold text-[11px] bg-gradient-to-r from-violet-600 via-indigo-600 to-teal-500 hover:opacity-90 text-white flex items-center gap-1 shrink-0 shadow-2xs transition-all active:scale-95 cursor-pointer"
          title="Auto Adjust Spacing & Sizing"
        >
          <Sparkles className="size-3 text-white" />
          <span className="uppercase tracking-wider text-[10px] font-bold">Auto Adjust</span>
        </button>

        <div className="h-4 w-px bg-border/60 mx-0.5 shrink-0" />

        {/* Font Family Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="h-7 px-2 rounded-md hover:bg-accent/60 flex items-center gap-1 font-medium text-foreground tracking-tight max-w-[130px] truncate cursor-pointer transition-colors"
              title="Font Family"
            >
              <span className="truncate uppercase text-[11px] font-semibold" style={{ fontFamily: currentFont }}>
                {currentFontLabel}
              </span>
              <ChevronDown className="size-3 opacity-60 shrink-0 ml-0.5" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-48 p-1">
            {SUPPORTED_RESUME_FONTS.map((f) => {
              const isSelected = currentFont.toLowerCase() === f.value.toLowerCase();
              return (
                <DropdownMenuItem
                  key={f.value}
                  onSelect={() => update({ font: f.value })}
                  className={cn(
                    "flex items-center justify-between cursor-pointer text-xs py-1.5",
                    isSelected && "font-semibold bg-accent text-foreground"
                  )}
                >
                  <span style={{ fontFamily: f.value }}>{f.label}</span>
                  {isSelected && <Check className="size-3.5 text-primary" />}
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Font Size Stepper: [- 8.5 +] */}
        <div className="flex items-center bg-muted/40 border border-border/50 rounded-md h-7 px-0.5 shrink-0">
          <button
            type="button"
            onClick={() => update({ fontSize: Math.max(7.5, Math.round((currentFontSize - 0.5) * 10) / 10) })}
            disabled={currentFontSize <= 7.5}
            className="size-6 flex items-center justify-center rounded hover:bg-background/80 text-muted-foreground hover:text-foreground disabled:opacity-30 cursor-pointer transition-colors"
            title="Decrease Font Size"
          >
            <Minus className="size-2.5" />
          </button>
          <span className="px-1.5 text-[11px] font-mono font-medium min-w-[28px] text-center text-foreground">
            {currentFontSize.toFixed(1)}
          </span>
          <button
            type="button"
            onClick={() => update({ fontSize: Math.min(13.0, Math.round((currentFontSize + 0.5) * 10) / 10) })}
            disabled={currentFontSize >= 13.0}
            className="size-6 flex items-center justify-center rounded hover:bg-background/80 text-muted-foreground hover:text-foreground disabled:opacity-30 cursor-pointer transition-colors"
            title="Increase Font Size"
          >
            <Plus className="size-2.5" />
          </button>
        </div>

        {/* Line Spacing: [↕ 1.5 ⌵] */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="h-7 px-1.5 rounded-md hover:bg-accent/60 flex items-center gap-1 font-medium text-foreground text-[11px] shrink-0 cursor-pointer transition-colors"
              title="Line Spacing (Line Height)"
            >
              <ArrowUpDown className="size-3 text-muted-foreground" />
              <span>{currentLineHeight.toFixed(2)}</span>
              <ChevronDown className="size-3 opacity-60 ml-0.5" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-32 p-1">
            <div className="text-[10px] text-muted-foreground px-2 py-1 font-semibold">Line Spacing</div>
            {[1.0, 1.15, 1.25, 1.35, 1.5, 1.75, 2.0].map((lh) => {
              const isSelected = Math.abs(currentLineHeight - lh) < 0.05;
              return (
                <DropdownMenuItem
                  key={lh}
                  onSelect={() => update({ lineHeight: lh })}
                  className={cn("flex items-center justify-between cursor-pointer text-xs", isSelected && "font-semibold bg-accent")}
                >
                  <span>{lh.toFixed(2)}x</span>
                  {isSelected && <Check className="size-3 text-primary" />}
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Section Spacing: [≡ 1.4 ⌵] */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="h-7 px-1.5 rounded-md hover:bg-accent/60 flex items-center gap-1 font-medium text-foreground text-[11px] shrink-0 cursor-pointer transition-colors"
              title="Section Spacing"
            >
              <AlignJustify className="size-3 text-muted-foreground" />
              <span>{currentSectionSpacing.toFixed(1)}</span>
              <ChevronDown className="size-3 opacity-60 ml-0.5" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-36 p-1">
            <div className="text-[10px] text-muted-foreground px-2 py-1 font-semibold">Section Spacing</div>
            {[
              { label: 'Compact', val: 1.0 },
              { label: 'Normal', val: 1.4 },
              { label: 'Relaxed', val: 1.8 },
              { label: 'Spacious', val: 2.2 },
            ].map((sp) => {
              const isSelected = Math.abs(currentSectionSpacing - sp.val) < 0.15;
              return (
                <DropdownMenuItem
                  key={sp.label}
                  onSelect={() => update({ sectionSpacing: sp.val })}
                  className={cn("flex items-center justify-between cursor-pointer text-xs", isSelected && "font-semibold bg-accent")}
                >
                  <span>{sp.label} ({sp.val.toFixed(1)}x)</span>
                  {isSelected && <Check className="size-3 text-primary" />}
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Page Margins: [⇤ - ⇥] */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="h-7 px-1.5 rounded-md hover:bg-accent/60 flex items-center gap-1 font-medium text-foreground text-[11px] shrink-0 cursor-pointer transition-colors"
              title="Page Margins"
            >
              <MoveHorizontal className="size-3 text-muted-foreground" />
              <span className="capitalize">{currentMargin}</span>
              <ChevronDown className="size-3 opacity-60 ml-0.5" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-36 p-1">
            <div className="text-[10px] text-muted-foreground px-2 py-1 font-semibold">Page Margins</div>
            {[
              { label: 'Compact (0.25in)', value: 'compact' },
              { label: 'Normal (0.4in)', value: 'normal' },
              { label: 'Relaxed (0.6in)', value: 'relaxed' },
            ].map((m) => {
              const isSelected = currentMargin === m.value;
              return (
                <DropdownMenuItem
                  key={m.value}
                  onSelect={() => update({ pageMargin: m.value as 'compact' | 'normal' | 'relaxed' })}
                  className={cn("flex items-center justify-between cursor-pointer text-xs", isSelected && "font-semibold bg-accent")}
                >
                  <span>{m.label}</span>
                  {isSelected && <Check className="size-3 text-primary" />}
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Paper Size: [LETTER ⌵] */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="h-7 px-1.5 rounded-md hover:bg-accent/60 flex items-center gap-1 font-medium text-foreground text-[11px] shrink-0 cursor-pointer transition-colors"
              title="Paper Size"
            >
              <span className="font-semibold">{currentPaper}</span>
              <ChevronDown className="size-3 opacity-60 ml-0.5" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-32 p-1">
            <div className="text-[10px] text-muted-foreground px-2 py-1 font-semibold">Paper Format</div>
            {['LETTER', 'A4'].map((size) => {
              const isSelected = currentPaper === size;
              return (
                <DropdownMenuItem
                  key={size}
                  onSelect={() => update({ paperSize: size as 'LETTER' | 'A4' })}
                  className={cn("flex items-center justify-between cursor-pointer text-xs", isSelected && "font-semibold bg-accent")}
                >
                  <span>{size === 'LETTER' ? 'Letter (US)' : 'A4 (Intl)'}</span>
                  {isSelected && <Check className="size-3 text-primary" />}
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Heading Underline: [T _] */}
        <button
          type="button"
          onClick={() => update({ showUnderline: !showUnderline })}
          className={cn(
            "size-7 rounded-md flex items-center justify-center shrink-0 transition-colors cursor-pointer",
            showUnderline
              ? "bg-primary/15 text-primary border border-primary/30"
              : "text-muted-foreground hover:bg-accent/60 hover:text-foreground"
          )}
          title={showUnderline ? "Disable Heading Underlines" : "Enable Heading Underlines"}
        >
          <UnderlineIcon className="size-3.5 stroke-[2.5]" />
        </button>

        {/* Accent Color: [A ⌵] */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="h-7 px-1.5 rounded-md hover:bg-accent/60 flex items-center gap-1 text-[11px] shrink-0 cursor-pointer transition-colors"
              title="Accent Color"
            >
              <span
                className="size-3.5 rounded-full border border-black/20 shadow-xs"
                style={{ backgroundColor: currentAccent }}
              />
              <span className="font-bold font-serif text-foreground">A</span>
              <ChevronDown className="size-3 opacity-60 ml-0.5" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 p-2">
            <div className="text-[10px] text-muted-foreground mb-1.5 font-semibold">Accent Color</div>
            <div className="grid grid-cols-4 gap-1.5 mb-2">
              {ACCENT_COLORS.map((c) => {
                const isSelected = currentAccent.toLowerCase() === c.value.toLowerCase();
                return (
                  <button
                    key={c.value}
                    type="button"
                    onClick={() => update({ accentColor: c.value, primaryColor: c.value })}
                    className={cn(
                      "size-7 rounded-md border flex items-center justify-center transition-all cursor-pointer",
                      isSelected ? "border-primary ring-2 ring-primary/30 scale-105" : "border-border/40 hover:scale-105"
                    )}
                    style={{ backgroundColor: c.value }}
                    title={c.name}
                  >
                    {isSelected && <Check className="size-3.5 text-white stroke-[3]" />}
                  </button>
                );
              })}
            </div>
            <div className="pt-1.5 border-t border-border/50 flex items-center gap-2">
              <Palette className="size-3 text-muted-foreground" />
              <input
                type="color"
                value={currentAccent.startsWith('#') ? currentAccent : '#0f172a'}
                onChange={(e) => update({ accentColor: e.target.value, primaryColor: e.target.value })}
                className="size-5 rounded cursor-pointer border border-border bg-transparent p-0"
              />
              <input
                type="text"
                value={currentAccent}
                onChange={(e) => update({ accentColor: e.target.value, primaryColor: e.target.value })}
                className="text-[10px] font-mono h-6 px-1.5 rounded border border-border bg-background w-20"
                placeholder="#000000"
              />
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
