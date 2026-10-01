'use client';

import { useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { Id } from '../../../convex/_generated/dataModel';
import { ResumeSettings } from '@/types/resume';
import { useMemo, useState } from 'react';
import debounce from 'lodash/debounce';
import CollapsibleSection from './editor/CollapseSection';

export const DEFAULT_SETTINGS: ResumeSettings = {
  font: 'Times New Roman',
  layout: 'one-column',
};

import { SUPPORTED_RESUME_FONTS } from '@/constants/pdf-fonts';

// ─── Option data ──────────────────────────────────────────────────────────────

const FONTS = SUPPORTED_RESUME_FONTS;

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
  const [openSection, setOpenSection] = useState<string | null>('font');
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
    const next = { ...settings, ...partial, layout: 'one-column' as const };
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
          title="Font"
          isOpen={openSection === 'font' || openSection === null}
          onToggle={() => toggleSection('font')}
          sectionKey="font"
        >
          <div className="grid grid-cols-1 gap-2">
            {FONTS.map((f) => (
              <button
                key={f.value}
                onClick={() => update({ font: f.value })}
                className={`h-9 rounded-md border px-3 text-left text-xs transition-colors flex items-center justify-between
                  ${(settings.font || 'Times New Roman') === f.value
                    ? 'border-primary bg-primary/10 text-primary ring-1 ring-primary/20 font-semibold'
                    : 'border-border bg-accent/40 text-muted-foreground hover:bg-accent hover:text-foreground'
                  }`}
                style={{ fontFamily: f.value }}
              >
                <span>{f.label}</span>
                {f.value === 'Times New Roman' && (
                  <span className="text-[10px] uppercase font-normal px-1.5 py-0.5 rounded bg-primary/15 text-primary">
                    Default
                  </span>
                )}
              </button>
            ))}
          </div>
        </CollapsibleSection>

      </div>
    </div>
  );
}
