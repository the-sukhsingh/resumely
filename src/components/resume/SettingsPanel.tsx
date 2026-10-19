'use client';

import { useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { Id } from '../../../convex/_generated/dataModel';
import { ResumeSettings } from '@/types/resume';
import { useMemo, useState } from 'react';
import debounce from 'lodash/debounce';
import CollapsibleSection from './editor/CollapseSection';
import { Check, Sparkles, RotateCcw, Minus, Plus, ArrowUpDown, AlignJustify, MoveHorizontal, Palette, Type, Underline } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SUPPORTED_RESUME_FONTS } from '@/constants/pdf-fonts';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export const DEFAULT_SETTINGS: ResumeSettings = {
  font: 'Times New Roman',
  layout: 'one-column',
  fontSize: 9.5,
  lineHeight: 1.35,
  sectionSpacing: 1.4,
  paragraphSpacing: 2,
  pageMargin: 'normal',
  paperSize: 'letter',
  accentColor: '#0f172a',
  headingStyle: 'uppercase',
  showUnderline: true,
};

export const ACCENT_COLORS = [
  { name: 'Onyx / Slate', value: '#0f172a', ring: 'ring-slate-900' },
  { name: 'Classic Navy', value: '#1e3a8a', ring: 'ring-blue-900' },
  { name: 'Royal Blue', value: '#2563eb', ring: 'ring-blue-600' },
  { name: 'Deep Emerald', value: '#065f46', ring: 'ring-emerald-800' },
  { name: 'Burgundy', value: '#831843', ring: 'ring-pink-900' },
  { name: 'Charcoal', value: '#374151', ring: 'ring-gray-700' },
  { name: 'Deep Purple', value: '#581c87', ring: 'ring-purple-900' },
  { name: 'Warm Amber', value: '#92400e', ring: 'ring-amber-800' },
];

interface SettingsPanelProps {
  resumeId: string;
  settings: ResumeSettings;
  onChange: (settings: ResumeSettings) => void;
}

export default function SettingsPanel({
  resumeId,
  settings,
  onChange,
}: SettingsPanelProps) {
  const [openSections, setOpenSections] = useState({
    font: true,
    typography: true,
    spacing: true,
    layout: true,
    colors: true,
  });

  const toggleSection = (key: keyof typeof openSections) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const updateVersionSettings = useMutation(api.resumeVersions.updateResumeVersionSettings);

  const debouncedSave = useMemo(
    () =>
      debounce((next: ResumeSettings) => {
        if (resumeId === 'create') return;
        void updateVersionSettings({
          versionId: resumeId as Id<'resumeVersions'>,
          settings: next,
        });
      }, 800),
    [resumeId, updateVersionSettings]
  );

  const update = (partial: Partial<ResumeSettings>) => {
    const next: ResumeSettings = {
      ...DEFAULT_SETTINGS,
      ...settings,
      ...partial,
      layout: 'one-column' as const,
    };
    onChange(next);
    debouncedSave(next);
  };

  const handleAutoAdjust = () => {
    const adjusted: ResumeSettings = {
      ...DEFAULT_SETTINGS,
      ...settings,
      fontSize: 9.0,
      lineHeight: 1.3,
      sectionSpacing: 1.25,
      paragraphSpacing: 2,
      pageMargin: 'compact',
    };
    update(adjusted);
    toast.success('Resume layout auto-adjusted for optimal fit!');
  };

  const handleResetDefaults = () => {
    update(DEFAULT_SETTINGS);
    toast.info('Settings reset to default values');
  };

  const currentFont = settings.font || DEFAULT_SETTINGS.font;
  const currentFontSize = settings.fontSize ?? DEFAULT_SETTINGS.fontSize ?? 9.5;
  const currentLineHeight = settings.lineHeight ?? DEFAULT_SETTINGS.lineHeight ?? 1.35;
  const currentSectionSpacing = settings.sectionSpacing ?? DEFAULT_SETTINGS.sectionSpacing ?? 1.4;
  const currentMargin = (settings.pageMargin as string) ?? DEFAULT_SETTINGS.pageMargin ?? 'normal';
  const currentPaper = (settings.paperSize || DEFAULT_SETTINGS.paperSize || 'letter').toLowerCase();
  const currentAccent = settings.accentColor || settings.primaryColor || DEFAULT_SETTINGS.accentColor || '#0f172a';
  const showUnderline = settings.showUnderline !== false;
  const headingStyle = settings.headingStyle || DEFAULT_SETTINGS.headingStyle || 'uppercase';

  return (
    <div className="h-full overflow-y-auto nobar overscroll-none bg-background pb-20 mask-b-from-90%">
      {/* Top Banner Actions */}
      <div className="p-3 border-b bg-muted/20 flex items-center justify-between gap-2">
        <Button
          type="button"
          size="sm"
          onClick={handleAutoAdjust}
          className="h-8 text-xs font-semibold bg-linear-to-r from-violet-600 via-indigo-600 to-teal-500 hover:opacity-90 text-white shadow-xs gap-1.5 cursor-pointer"
        >
          <Sparkles className="size-3.5" />
          Auto Adjust
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleResetDefaults}
          className="h-8 text-xs text-muted-foreground hover:text-foreground gap-1.5 cursor-pointer"
        >
          <RotateCcw className="size-3" />
          Reset
        </Button>
      </div>

      <div className="divide-y divide-border/60">
        {/* 1. Typography: Font Family */}
        <CollapsibleSection
          title="Font Family"
          isOpen={openSections.font}
          onToggle={() => toggleSection('font')}
          sectionKey="font"
        >
          <div className="space-y-1 pt-1">
            {SUPPORTED_RESUME_FONTS.map((f) => {
              const isSelected = currentFont === f.value;
              return (
                <button
                  key={f.value}
                  type="button"
                  onClick={() => update({ font: f.value })}
                  className={cn(
                    "w-full h-8 px-3 rounded-lg text-left transition-all duration-150 flex items-center justify-between group cursor-pointer",
                    isSelected
                      ? "bg-accent/80 text-foreground font-medium shadow-2xs"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent/40"
                  )}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span
                      className="text-sm tracking-tight truncate"
                      style={{ fontFamily: f.value }}
                    >
                      {f.label}
                    </span>
                  </div>
                  <div className="w-4 h-4 flex items-center justify-center">
                    {isSelected && (
                      <Check className="w-3.5 h-3.5 text-primary stroke-[2.5]" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </CollapsibleSection>

        {/* 2. Font Size & Line Spacing */}
        <CollapsibleSection
          title="Font Size & Line Height"
          isOpen={openSections.typography}
          onToggle={() => toggleSection('typography')}
          sectionKey="typography"
        >
          <div className="space-y-4 pt-1 pb-2">
            {/* Font Size Stepper */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-medium text-foreground flex items-center gap-1.5">
                  <Type className="size-3.5 text-muted-foreground" />
                  Font Size
                </span>
                <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded-md bg-muted text-foreground">
                  {currentFontSize.toFixed(1)} pt
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="size-7 shrink-0 cursor-pointer"
                  onClick={() => update({ fontSize: Math.max(7.5, Math.round((currentFontSize - 0.5) * 10) / 10) })}
                  disabled={currentFontSize <= 7.5}
                >
                  <Minus className="size-3" />
                </Button>

                <div className="flex-1 flex gap-1 justify-center">
                  {[8.0, 8.5, 9.0, 9.5, 10.0, 11.0].map((sz) => (
                    <button
                      key={sz}
                      type="button"
                      onClick={() => update({ fontSize: sz })}
                      className={cn(
                        "text-[11px] px-2 py-1 rounded transition-colors cursor-pointer",
                        Math.abs(currentFontSize - sz) < 0.2
                          ? "bg-primary text-primary-foreground font-semibold"
                          : "bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground"
                      )}
                    >
                      {sz}
                    </button>
                  ))}
                </div>

                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="size-7 shrink-0 cursor-pointer"
                  onClick={() => update({ fontSize: Math.min(13.0, Math.round((currentFontSize + 0.5) * 10) / 10) })}
                  disabled={currentFontSize >= 13.0}
                >
                  <Plus className="size-3" />
                </Button>
              </div>
            </div>

            {/* Line Height Stepper */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-medium text-foreground flex items-center gap-1.5">
                  <ArrowUpDown className="size-3.5 text-muted-foreground" />
                  Line Spacing (Line Height)
                </span>
                <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded-md bg-muted text-foreground">
                  {currentLineHeight.toFixed(2)}x
                </span>
              </div>
              <div className="grid grid-cols-5 gap-1">
                {[1.15, 1.25, 1.35, 1.5, 1.75].map((lh) => (
                  <button
                    key={lh}
                    type="button"
                    onClick={() => update({ lineHeight: lh })}
                    className={cn(
                      "text-[11px] py-1 rounded text-center transition-colors cursor-pointer",
                      Math.abs(currentLineHeight - lh) < 0.05
                        ? "bg-primary text-primary-foreground font-semibold"
                        : "bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {lh}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </CollapsibleSection>

        {/* 3. Spacing (Section & Paragraph) */}
        <CollapsibleSection
          title="Section & Content Spacing"
          isOpen={openSections.spacing}
          onToggle={() => toggleSection('spacing')}
          sectionKey="spacing"
        >
          <div className="space-y-4 pt-1 pb-2">
            {/* Section Spacing */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-medium text-foreground flex items-center gap-1.5">
                  <AlignJustify className="size-3.5 text-muted-foreground" />
                  Section Spacing
                </span>
                <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded-md bg-muted text-foreground">
                  {currentSectionSpacing.toFixed(1)}x
                </span>
              </div>
              <div className="grid grid-cols-4 gap-1.5">
                {[
                  { label: 'Compact', val: 1.0 },
                  { label: 'Normal', val: 1.4 },
                  { label: 'Relaxed', val: 1.8 },
                  { label: 'Spacious', val: 2.2 },
                ].map((s) => (
                  <button
                    key={s.label}
                    type="button"
                    onClick={() => update({ sectionSpacing: s.val })}
                    className={cn(
                      "text-[11px] py-1 px-1 rounded text-center transition-colors cursor-pointer",
                      Math.abs(currentSectionSpacing - s.val) < 0.2
                        ? "bg-primary text-primary-foreground font-semibold"
                        : "bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Page Margins */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-medium text-foreground flex items-center gap-1.5">
                  <MoveHorizontal className="size-3.5 text-muted-foreground" />
                  Page Margins
                </span>
                <span className="text-xs capitalize font-medium text-muted-foreground">
                  {currentMargin}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { label: 'Compact', value: 'compact', desc: '0.25 in' },
                  { label: 'Normal', value: 'normal', desc: '0.4 in' },
                  { label: 'Relaxed', value: 'relaxed', desc: '0.6 in' },
                ].map((m) => (
                  <button
                    key={m.value}
                    type="button"
                    onClick={() => update({ pageMargin: m.value as 'compact' | 'normal' | 'relaxed' })}
                    className={cn(
                      "text-left py-1.5 px-2 rounded-lg border transition-all cursor-pointer",
                      currentMargin === m.value
                        ? "border-primary bg-primary/10 text-foreground font-medium"
                        : "border-border/50 bg-background hover:bg-muted/40 text-muted-foreground"
                    )}
                  >
                    <div className="text-xs font-medium">{m.label}</div>
                    <div className="text-[10px] text-muted-foreground">{m.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </CollapsibleSection>

        {/* 4. Page Format & Layout */}
        <CollapsibleSection
          title="Paper Format & Headings"
          isOpen={openSections.layout}
          onToggle={() => toggleSection('layout')}
          sectionKey="layout"
        >
          <div className="space-y-4 pt-1 pb-2">
            {/* Paper Size */}
            <div>
              <span className="text-xs font-medium text-foreground block mb-1.5">Paper Format</span>
              <div className="grid grid-cols-2 gap-1.5">
                {[
                  { label: 'Letter (US)', value: 'letter', desc: '8.5 × 11 in' },
                  { label: 'A4 (International)', value: 'a4', desc: '210 × 297 mm' },
                ].map((p) => {
                  const isSelected = currentPaper === p.value;
                  return (
                    <button
                      key={p.value}
                      type="button"
                      onClick={() => update({ paperSize: p.value as 'letter' | 'a4' })}
                      className={cn(
                        "text-left py-1.5 px-2.5 rounded-lg border transition-all cursor-pointer",
                        isSelected
                          ? "border-primary bg-primary/10 text-foreground font-medium shadow-2xs"
                          : "border-border/50 bg-background hover:bg-muted/40 text-muted-foreground"
                      )}
                    >
                      <div className="text-xs font-medium">{p.label}</div>
                      <div className="text-[10px] text-muted-foreground">{p.desc}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Heading Underline */}
            <div className="flex items-center justify-between py-1">
              <div>
                <span className="text-xs font-medium text-foreground flex items-center gap-1.5">
                  <Underline className="size-3.5 text-muted-foreground" />
                  Section Divider Lines
                </span>
                <span className="text-[11px] text-muted-foreground">Show underline border on section headers</span>
              </div>
              <Button
                type="button"
                variant={showUnderline ? "default" : "outline"}
                size="sm"
                className="h-7 text-xs px-2.5 cursor-pointer"
                onClick={() => update({ showUnderline: !showUnderline })}
              >
                {showUnderline ? 'Enabled' : 'Disabled'}
              </Button>
            </div>

            {/* Heading Capitalization */}
            <div>
              <span className="text-xs font-medium text-foreground block mb-1.5">Heading Capitalization</span>
              <div className="grid grid-cols-2 gap-1.5">
                {[
                  { label: 'UPPERCASE', value: 'uppercase' },
                  { label: 'Capitalize', value: 'capitalize' },
                ].map((hc) => (
                  <button
                    key={hc.value}
                    type="button"
                    onClick={() => update({ headingStyle: hc.value as 'uppercase' | 'capitalize' })}
                    className={cn(
                      "text-center py-1 rounded text-xs transition-colors cursor-pointer",
                      headingStyle === hc.value
                        ? "bg-primary text-primary-foreground font-semibold"
                        : "bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {hc.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </CollapsibleSection>

        {/* 5. Colors & Accents */}
        <CollapsibleSection
          title="Accent Color"
          isOpen={openSections.colors}
          onToggle={() => toggleSection('colors')}
          sectionKey="colors"
        >
          <div className="space-y-3 pt-1 pb-3">
            <span className="text-xs text-muted-foreground block">
              Used for headings, dividers, bullets, and links
            </span>
            <div className="grid grid-cols-4 gap-2">
              {ACCENT_COLORS.map((color) => {
                const isSelected = currentAccent.toLowerCase() === color.value.toLowerCase();
                return (
                  <button
                    key={color.value}
                    type="button"
                    onClick={() => update({ accentColor: color.value, primaryColor: color.value })}
                    className={cn(
                      "flex flex-col items-center gap-1 p-2 rounded-lg border transition-all text-center cursor-pointer",
                      isSelected
                        ? "border-primary bg-primary/10 shadow-2xs font-medium text-foreground"
                        : "border-border/40 hover:bg-muted/30 text-muted-foreground"
                    )}
                  >
                    <span
                      className="size-5 rounded-full shadow-xs border border-white/20 flex items-center justify-center"
                      style={{ backgroundColor: color.value }}
                    >
                      {isSelected && <Check className="size-3 text-white stroke-[3]" />}
                    </span>
                    <span className="text-[10px] truncate max-w-full">{color.name.split('/')[0]}</span>
                  </button>
                );
              })}
            </div>

            {/* Custom Hex Color */}
            <div className="flex items-center gap-2 pt-1">
              <span className="text-xs font-medium text-foreground shrink-0 flex items-center gap-1.5">
                <Palette className="size-3.5 text-muted-foreground" />
                Custom Color:
              </span>
              <div className="flex items-center gap-1.5 flex-1">
                <input
                  type="color"
                  value={currentAccent.startsWith('#') ? currentAccent : '#0f172a'}
                  onChange={(e) => update({ accentColor: e.target.value, primaryColor: e.target.value })}
                  className="size-7 rounded cursor-pointer border border-border bg-transparent p-0.5"
                />
                <input
                  type="text"
                  value={currentAccent}
                  onChange={(e) => update({ accentColor: e.target.value, primaryColor: e.target.value })}
                  placeholder="#000000"
                  className="text-xs font-mono h-7 px-2 rounded border border-border/70 bg-background w-24"
                />
              </div>
            </div>
          </div>
        </CollapsibleSection>
      </div>
    </div>
  );
}
