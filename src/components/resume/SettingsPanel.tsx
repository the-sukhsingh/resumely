'use client';

import { useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { Id } from '../../../convex/_generated/dataModel';
import { ResumeSettings } from '@/types/resume';
import { useMemo, useState } from 'react';
import debounce from 'lodash/debounce';
import CollapsibleSection from './editor/CollapseSection';
import { Check, Sparkles, RotateCcw, Minus, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SUPPORTED_RESUME_FONTS } from '@/constants/pdf-fonts';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import AnimatedSwitcher from '@/components/custom/animated-switcher';

export const DEFAULT_SETTINGS: ResumeSettings = {
  font: 'Times New Roman',
  layout: 'one-column',
  fontSize: 10.0,
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
  { name: 'Onyx', value: '#0f172a' },
  { name: 'Navy', value: '#1e3a8a' },
  { name: 'Royal', value: '#2563eb' },
  { name: 'Emerald', value: '#065f46' },
  { name: 'Burgundy', value: '#831843' },
  { name: 'Charcoal', value: '#374151' },
  { name: 'Plum', value: '#581c87' },
  { name: 'Amber', value: '#92400e' },
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
    font: false,
    typography: false,
    spacing: false,
    layout: false,
    colors: false,
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
      fontSize: 9.5,
      lineHeight: 1.3,
      sectionSpacing: 1.25,
      paragraphSpacing: 2,
      pageMargin: 'compact',
    };
    update(adjusted);
    toast.success('Resume layout auto-adjusted for optimal fit');
  };

  const handleResetDefaults = () => {
    update(DEFAULT_SETTINGS);
    toast.info('Settings reset to defaults');
  };

  const currentFont = settings.font || DEFAULT_SETTINGS.font;
  const currentFontSize = settings.fontSize ?? DEFAULT_SETTINGS.fontSize ?? 10.0;
  const currentLineHeight = settings.lineHeight ?? DEFAULT_SETTINGS.lineHeight ?? 1.35;
  const currentSectionSpacing = settings.sectionSpacing ?? DEFAULT_SETTINGS.sectionSpacing ?? 1.4;
  const currentMargin = (settings.pageMargin as string) ?? DEFAULT_SETTINGS.pageMargin ?? 'normal';
  const currentPaper = (settings.paperSize || DEFAULT_SETTINGS.paperSize || 'letter').toLowerCase();
  const currentAccent = settings.accentColor || settings.primaryColor || DEFAULT_SETTINGS.accentColor || '#0f172a';
  const showUnderline = settings.showUnderline !== false;
  const headingStyle = settings.headingStyle || DEFAULT_SETTINGS.headingStyle || 'uppercase';

  // Find closest section spacing key for AnimatedSwitcher
  const activeSpacingValue =
    currentSectionSpacing <= 1.15 ? '1.0' :
    currentSectionSpacing <= 1.55 ? '1.4' :
    currentSectionSpacing <= 1.95 ? '1.8' : '2.2';

  // Find closest line height key for AnimatedSwitcher
  const activeLineHeightValue =
    Math.abs(currentLineHeight - 1.15) <= 0.05 ? '1.15' :
    Math.abs(currentLineHeight - 1.25) <= 0.05 ? '1.25' :
    Math.abs(currentLineHeight - 1.35) <= 0.05 ? '1.35' :
    Math.abs(currentLineHeight - 1.50) <= 0.05 ? '1.50' : '1.75';

  return (
    <div className="h-full overflow-y-auto nobar overscroll-none bg-background pb-20 mask-b-from-90%">
      {/* Clean Minimal Header Actions */}
      <div className="px-4 py-2.5 border-b border-border/40 flex items-center justify-between bg-muted/10">
        <button
          type="button"
          onClick={handleAutoAdjust}
          className="h-7 px-2.5 rounded-md text-xs font-medium border border-border/70 hover:border-foreground/30 bg-background hover:bg-muted/50 text-foreground transition-all flex items-center gap-1.5 shadow-2xs active:scale-95 cursor-pointer"
        >
          <Sparkles className="size-3 text-amber-500 dark:text-amber-400" />
          <span>Auto Adjust</span>
        </button>

        <button
          type="button"
          onClick={handleResetDefaults}
          className="h-7 px-2 rounded-md text-[11px] text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1 cursor-pointer"
        >
          <RotateCcw className="size-3" />
          <span>Reset</span>
        </button>
      </div>

      <div className="divide-y divide-border/40">
        {/* 1. Font Family */}
        <CollapsibleSection
          title="Font Family"
          isOpen={openSections.font}
          onToggle={() => toggleSection('font')}
          sectionKey="font"
        >
          <div className="space-y-0.5 pt-1">
            {SUPPORTED_RESUME_FONTS.map((f) => {
              const isSelected = currentFont.toLowerCase() === f.value.toLowerCase();
              return (
                <button
                  key={f.value}
                  type="button"
                  onClick={() => update({ font: f.value })}
                  className={cn(
                    "w-full h-8 px-2.5 rounded-md text-left transition-colors flex items-center justify-between cursor-pointer",
                    isSelected
                      ? "bg-accent/80 text-foreground font-medium"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
                  )}
                >
                  <span
                    className="text-xs tracking-tight truncate"
                    style={{ fontFamily: f.value }}
                  >
                    {f.label}
                  </span>
                  {isSelected && (
                    <Check className="size-3.5 text-primary stroke-[2.5]" />
                  )}
                </button>
              );
            })}
          </div>
        </CollapsibleSection>

        {/* 2. Sizing & Line Spacing */}
        <CollapsibleSection
          title="Font Size & Line Height"
          isOpen={openSections.typography}
          onToggle={() => toggleSection('typography')}
          sectionKey="typography"
        >
          <div className="space-y-3.5 pt-1 pb-2">
            {/* Font Size Stepper with AnimatedSwitcher */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs text-muted-foreground">Font Size</span>
                <span className="text-xs font-mono font-medium text-foreground">
                  {currentFontSize.toFixed(1)} pt
                </span>
              </div>
              <div className="flex items-center gap-1.5">
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

                <div className="flex-1 min-w-0">
                  <AnimatedSwitcher
                    size="sm"
                    fullWidth
                    value={currentFontSize.toFixed(1)}
                    onChange={(val) => update({ fontSize: parseFloat(val) })}
                    items={[
                      { value: '8.5', label: '8.5' },
                      { value: '9.0', label: '9.0' },
                      { value: '9.5', label: '9.5' },
                      { value: '10.0', label: '10' },
                      { value: '10.5', label: '10.5' },
                      { value: '11.0', label: '11' },
                    ]}
                  />
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

            {/* Line Height with AnimatedSwitcher */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs text-muted-foreground">Line Spacing</span>
                <span className="text-xs font-mono font-medium text-foreground">
                  {currentLineHeight.toFixed(2)}x
                </span>
              </div>
              <AnimatedSwitcher
                size="sm"
                fullWidth
                value={activeLineHeightValue}
                onChange={(val) => update({ lineHeight: parseFloat(val) })}
                items={[
                  { value: '1.15', label: '1.15' },
                  { value: '1.25', label: '1.25' },
                  { value: '1.35', label: '1.35' },
                  { value: '1.50', label: '1.50' },
                  { value: '1.75', label: '1.75' },
                ]}
              />
            </div>
          </div>
        </CollapsibleSection>

        {/* 3. Spacing & Margins */}
        <CollapsibleSection
          title="Spacing & Margins"
          isOpen={openSections.spacing}
          onToggle={() => toggleSection('spacing')}
          sectionKey="spacing"
        >
          <div className="space-y-3.5 pt-1 pb-2">
            {/* Section Spacing with AnimatedSwitcher */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs text-muted-foreground">Section Spacing</span>
                <span className="text-xs font-mono font-medium text-foreground">
                  {currentSectionSpacing.toFixed(1)}x
                </span>
              </div>
              <AnimatedSwitcher
                size="sm"
                fullWidth
                value={activeSpacingValue}
                onChange={(val) => update({ sectionSpacing: parseFloat(val) })}
                items={[
                  { value: '1.0', label: 'Compact' },
                  { value: '1.4', label: 'Normal' },
                  { value: '1.8', label: 'Relaxed' },
                  { value: '2.2', label: 'Spacious' },
                ]}
              />
            </div>

            {/* Page Margins with AnimatedSwitcher */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs text-muted-foreground">Page Margins</span>
                <span className="text-xs capitalize text-foreground font-medium">
                  {currentMargin}
                </span>
              </div>
              <AnimatedSwitcher
                size="sm"
                fullWidth
                value={currentMargin}
                onChange={(val) => update({ pageMargin: val as 'compact' | 'normal' | 'relaxed' })}
                items={[
                  { value: 'compact', label: 'Compact' },
                  { value: 'normal', label: 'Normal' },
                  { value: 'relaxed', label: 'Relaxed' },
                ]}
              />
            </div>

            {/* Paper Size with AnimatedSwitcher */}
            <div>
              <span className="text-xs text-muted-foreground block mb-1.5">Paper Format</span>
              <AnimatedSwitcher
                size="sm"
                fullWidth
                value={currentPaper}
                onChange={(val) => update({ paperSize: val as 'letter' | 'a4' })}
                items={[
                  { value: 'letter', label: 'Letter (US)' },
                  { value: 'a4', label: 'A4 (International)' },
                ]}
              />
            </div>
          </div>
        </CollapsibleSection>

        {/* 4. Headings & Styling */}
        <CollapsibleSection
          title="Headings & Dividers"
          isOpen={openSections.layout}
          onToggle={() => toggleSection('layout')}
          sectionKey="layout"
        >
          <div className="space-y-3 pt-1 pb-2">
            {/* Heading Underline with AnimatedSwitcher */}
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs text-foreground font-medium block">Section Divider</span>
                <span className="text-[11px] text-muted-foreground">Line below section titles</span>
              </div>
              <AnimatedSwitcher
                size="sm"
                value={showUnderline ? 'visible' : 'hidden'}
                onChange={(val) => update({ showUnderline: val === 'visible' })}
                items={[
                  { value: 'visible', label: 'Visible' },
                  { value: 'hidden', label: 'Hidden' },
                ]}
              />
            </div>

            {/* Heading Capitalization with AnimatedSwitcher */}
            <div>
              <span className="text-xs text-muted-foreground block mb-1.5">Heading Case</span>
              <AnimatedSwitcher
                size="sm"
                fullWidth
                value={headingStyle}
                onChange={(val) => update({ headingStyle: val as 'uppercase' | 'capitalize' })}
                items={[
                  { value: 'uppercase', label: 'UPPERCASE' },
                  { value: 'capitalize', label: 'Capitalize' },
                ]}
              />
            </div>
          </div>
        </CollapsibleSection>

        {/* 5. Accent Color */}
        <CollapsibleSection
          title="Accent Color"
          isOpen={openSections.colors}
          onToggle={() => toggleSection('colors')}
          sectionKey="colors"
        >
          <div className="space-y-3 pt-1 pb-2">
            <div className="flex flex-wrap gap-2 items-center">
              {ACCENT_COLORS.map((color) => {
                const isSelected = currentAccent.toLowerCase() === color.value.toLowerCase();
                return (
                  <button
                    key={color.value}
                    type="button"
                    onClick={() => update({ accentColor: color.value, primaryColor: color.value })}
                    className={cn(
                      "size-6 rounded-full border border-black/20 flex items-center justify-center transition-all cursor-pointer",
                      isSelected && "ring-2 ring-primary ring-offset-2 ring-offset-background scale-110"
                    )}
                    style={{ backgroundColor: color.value }}
                    title={color.name}
                  >
                    {isSelected && <Check className="size-3 text-white stroke-[3]" />}
                  </button>
                );
              })}

              <div className="h-5 w-px bg-border/60 mx-1" />

              {/* Custom Color Input */}
              <div className="flex items-center gap-1.5">
                <input
                  type="color"
                  value={currentAccent.startsWith('#') ? currentAccent : '#0f172a'}
                  onChange={(e) => update({ accentColor: e.target.value, primaryColor: e.target.value })}
                  className="size-6 rounded cursor-pointer border border-border bg-transparent p-0"
                  title="Pick custom color"
                />
                <input
                  type="text"
                  value={currentAccent}
                  onChange={(e) => update({ accentColor: e.target.value, primaryColor: e.target.value })}
                  placeholder="#000000"
                  className="text-[11px] font-mono h-6 px-1.5 rounded border border-border/70 bg-background w-20"
                />
              </div>
            </div>
          </div>
        </CollapsibleSection>
      </div>
    </div>
  );
}
