'use client';

import { useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { Id } from '../../../convex/_generated/dataModel';
import { ResumeSettings } from '@/types/resume';
import { useMemo, useState } from 'react';
import debounce from 'lodash/debounce';
import CollapsibleSection from './editor/CollapseSection';

const SvgSingleColumn = () => (
  <svg className='size-16' viewBox="0 0 24 24" fill="none">
    <rect x="5" y="4" width="14" height="16" rx="2" stroke="currentColor" strokeWidth="1.5" className="text-muted-foreground/40"/>
    <rect x="7" y="7" width="10" height="2" rx="1" fill="currentColor"/>
    <rect x="7" y="11" width="10" height="2" rx="1" className="text-muted-foreground/30" fill="currentColor"/>
    <rect x="7" y="15" width="7" height="2" rx="1" className="text-muted-foreground/30" fill="currentColor"/>
  </svg>
);

const SvgTwoColumns = () => (
  <svg className='size-16' viewBox="0 0 24 24" fill="none">
    <rect x="4" y="4" width="16" height="16" rx="2" stroke="currentColor" strokeWidth="1.5" className="text-muted-foreground opacity-30"/>
    <rect x="6" y="7" width="5" height="2" rx="1" fill="currentColor"/>
    <rect x="13" y="7" width="5" height="2" rx="1"  fill="currentColor"/>
    <rect x="6" y="11" width="5" height="2" rx="1"  fill="currentColor"/>
    <rect x="13" y="11" width="5" height="2" rx="1"  fill="currentColor"/>
    <rect x="6" y="15" width="5" height="2" rx="1"  fill="currentColor"/>
    <rect x="13" y="15" width="5" height="2" rx="1"  fill="currentColor"/>
  </svg>
);

export const DEFAULT_SETTINGS: ResumeSettings = {
  font: 'Inter',
  layout: 'one-column',
};

// ─── Option data ──────────────────────────────────────────────────────────────


const FONTS = [
  { value: 'Inter', label: 'Inter' },
  { value: 'Roboto', label: 'Roboto' },
  { value: 'Merriweather', label: 'Merriweather' },
  { value: 'Lato', label: 'Lato' },
  { value: 'Source Serif 4', label: 'Source Serif 4' },
];

// ─── Component ────────────────────────────────────────────────────────────────

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
  const [openSection, setOpenSection] = useState<string | null>('template');
  const updateMasterSettings = useMutation(api.masterResumes.updateMasterResumeSettings);
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
    const next = { ...settings, ...partial };
    onChange(next);
    debouncedSave(next);
  };

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section);
  };

  return (
    <div className="h-full overflow-y-auto nobar overscroll-none bg-background overflow-hidden mask-b-from-90%">
      <div className="space-y-0 pb-16">

        <CollapsibleSection
          title="Layout"
          isOpen={openSection === 'layout'}
          onToggle={() => toggleSection('layout')}
          sectionKey="layout"
        >
          <div className="grid grid-cols-2 gap-2">
            {(['one-column', 'two-column'] as const).map((l) => (
              <button
                key={l}
                onClick={() => update({ layout: l })}
                className={`flex flex-col items-center gap-3 rounded-lg border py-3 text-left text-xs font-medium transition-colors
                  ${settings.layout === l
                    ? 'border-primary/40 bg-primary/10 text-primary ring-1 ring-primary/20'
                    : 'border-border bg-accent/40 text-muted-foreground hover:bg-accent hover:text-foreground'
                  }`}
              >
                {l === 'one-column' ? <SvgSingleColumn  /> : <SvgTwoColumns />}
                <span className='text-base'>{l === 'one-column' ? 'Single Column' : 'Two Columns'}</span>
              </button>
            ))}
          </div>
        </CollapsibleSection>

        <CollapsibleSection
          title="Font"
          isOpen={openSection === 'font'}
          onToggle={() => toggleSection('font')}
          sectionKey="font"
        >
          <div className="grid grid-cols-1 gap-2">
            {FONTS.map((f) => (
              <button
                key={f.value}
                onClick={() => update({ font: f.value })}
                className={`h-9 rounded-md border px-3 text-left text-xs transition-colors
                  ${settings.font === f.value
                    ? 'border-primary bg-primary/10 text-primary ring-1 ring-primary/20 font-semibold'
                    : 'border-border bg-accent/40 text-muted-foreground hover:bg-accent hover:text-foreground'
                  }`}
                style={{ fontFamily: f.value }}
              >
                {f.label}
              </button>
            ))}
          </div>
        </CollapsibleSection>

      </div>
    </div>
  );
}
