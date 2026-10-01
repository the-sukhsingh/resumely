'use client';

import { useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { Id } from '../../../convex/_generated/dataModel';
import { ResumeSettings } from '@/types/resume';
import { useMemo, useState } from 'react';
import debounce from 'lodash/debounce';
import CollapsibleSection from './editor/CollapseSection';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SUPPORTED_RESUME_FONTS } from '@/constants/pdf-fonts';

export const DEFAULT_SETTINGS: ResumeSettings = {
  font: 'Times New Roman',
  layout: 'one-column',
};


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
  const [isOpen, setIsOpen] = useState(true);
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

  const currentFont = settings.font || 'Times New Roman';

  return (
    <div className="h-full overflow-y-auto nobar overscroll-none bg-background overflow-hidden mask-b-from-90%">
      <div className="space-y-0 pb-16">
        <CollapsibleSection
          title="Font"
          isOpen={isOpen}
          onToggle={() => setIsOpen((prev) => !prev)}
          sectionKey="font"
        >
          <div className="space-y-1">
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
                  <div className="flex items-center gap-2.5 shrink-0">
                    <div className="w-4 h-4 flex items-center justify-center">
                      {isSelected && (
                        <Check className="w-3.5 h-3.5 text-primary stroke-[2.5]" />
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </CollapsibleSection>
      </div>
    </div>
  );
}
