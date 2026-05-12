'use client';

import { useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { Id } from '../../../convex/_generated/dataModel';
import { ResumeSettings } from '@/types/resume';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useMemo, useState } from 'react';
import debounce from 'lodash/debounce';
import CollapsibleSection from './editor/CollapseSection';
import { GripVertical } from 'lucide-react';
import { Reorder } from 'motion/react';

const SvgSingleColumn = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <rect x="4" y="4" width="16" height="16" rx="2" stroke="currentColor" strokeWidth="1.5" className="text-muted-foreground/40"/>
    <rect x="7" y="7" width="10" height="2" rx="1" fill="currentColor"/>
    <rect x="7" y="11" width="10" height="2" rx="1" className="text-muted-foreground/30" fill="currentColor"/>
    <rect x="7" y="15" width="7" height="2" rx="1" className="text-muted-foreground/30" fill="currentColor"/>
  </svg>
);

const SvgTwoColumns = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <rect x="4" y="4" width="16" height="16" rx="2" stroke="currentColor" strokeWidth="1.5" className="text-muted-foreground opacity-30"/>
    <path d="M12 4.6V19.4" stroke="currentColor" strokeWidth="1.5" className="text-muted-foreground opacity-30"/>
    <rect x="6" y="7" width="4" height="2" rx="1" fill="currentColor"/>
    <rect x="14" y="7" width="4" height="2" rx="1" className="text-muted-foreground/30" fill="currentColor"/>
    <rect x="6" y="11" width="4" height="2" rx="1" className="text-muted-foreground/30" fill="currentColor"/>
    <rect x="14" y="11" width="4" height="2" rx="1" className="text-muted-foreground/30" fill="currentColor"/>
  </svg>
);


// &#x2500;&#x2500;&#x2500; Defaults &#x2500;&#x2500;&#x2500;&#x2500;&#x2500;─────────────────────────────────────────────────────

export const DEFAULT_SETTINGS: ResumeSettings = {
  font: 'Inter',
  color: '#2563eb',
  sections: {
    personalInfo: true,
    summary: true,
    experience: true,
    education: true,
    skills: true,
    projects: true,
    achievements: true,
    certifications: true,
  },
  order: [
    'personalInfo',
    'summary',
    'experience',
    'education',
    'skills',
    'projects',
    'certifications',
    'achievements',
  ],
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

const ACCENT_COLORS = [
  { value: '#2563eb', label: 'Blue' },
  { value: '#16a34a', label: 'Green' },
  { value: '#9333ea', label: 'Purple' },
  { value: '#dc2626', label: 'Red' },
  { value: '#0891b2', label: 'Cyan' },
  { value: '#d97706', label: 'Amber' },
  { value: '#374151', label: 'Slate' },
  { value: '#000000', label: 'Black' },
];

const SECTION_LABELS: Record<keyof ResumeSettings['sections'], string> = {
  personalInfo: 'Personal Info',
  summary: 'Summary',
  experience: 'Experience',
  education: 'Education',
  skills: 'Skills',
  projects: 'Projects',
  achievements: 'Achievements',
  certifications: 'Certifications',
};

// ─── Component ────────────────────────────────────────────────────────────────

interface SettingsPanelProps {
  resumeId: string;
  isVersion: boolean;
  settings: ResumeSettings;
  onChange: (settings: ResumeSettings) => void;
}

export default function SettingsPanel({
  resumeId,
  isVersion,
  settings,
  onChange,
}: SettingsPanelProps) {
  const [openSection, setOpenSection] = useState<string | null>('template');
  const updateMasterSettings = useMutation(api.masterResumes.updateMasterResumeSettings);
  const updateVersionSettings = useMutation(api.resumeVersions.updateResumeVersionSettings);

  const debouncedSave = useMemo(
    () =>
      debounce((next: ResumeSettings) => {
        void updateVersionSettings({
          versionId: resumeId as Id<'resumeVersions'>,
          settings: next,
        });
      }, 800),
    [resumeId, isVersion, updateMasterSettings, updateVersionSettings]
  );

  const update = (partial: Partial<ResumeSettings>) => {
    const next = { ...settings, ...partial };
    onChange(next);
    debouncedSave(next);
  };

  const updateSection = (key: keyof ResumeSettings['sections'], value: boolean) => {
    update({ sections: { ...settings.sections, [key]: value } });
  };

  const updateOrder = (newOrder: string[]) => {
    update({ order: newOrder as (keyof ResumeSettings['sections'])[] });
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
                className={`flex h-11 items-center gap-3 rounded-md border px-3 text-left text-xs font-medium transition-colors
                  ${settings.layout === l
                    ? 'border-primary bg-primary/10 text-primary ring-1 ring-primary/20'
                    : 'border-border bg-accent/40 text-muted-foreground hover:bg-accent hover:text-foreground'
                  }`}
              >
                {l === 'one-column' ? <SvgSingleColumn /> : <SvgTwoColumns />}
                <span>{l === 'one-column' ? 'Single Column' : 'Two Columns'}</span>
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

        <CollapsibleSection
          title="Accent Color"
          isOpen={openSection === 'accent'}
          onToggle={() => toggleSection('accent')}
          sectionKey="accent"
        >
          <div className="flex flex-wrap gap-2">
            {ACCENT_COLORS.map((c) => (
              <button
                key={c.value}
                onClick={() => update({ color: c.value })}
                title={c.label}
                className={`h-8 w-8 rounded-full border-2 transition-transform hover:scale-110
                  ${settings.color === c.value ? 'border-foreground scale-110 ring-2 ring-offset-1 ring-foreground/40' : 'border-transparent'}`}
                style={{ backgroundColor: c.value }}
                aria-label={`Select ${c.label} color`}
              />
            ))}
            <label
              title="Custom color"
              className="h-8 w-8 rounded-full border-2 border-dashed border-muted-foreground/40 flex items-center justify-center cursor-pointer hover:border-primary transition-colors overflow-hidden"
            >
              <input
                type="color"
                value={settings.color}
                onChange={(e) => update({ color: e.target.value })}
                className="opacity-0 absolute w-px h-px"
                aria-label="Custom accent color"
              />
              <span className="text-muted-foreground text-xs select-none">+</span>
            </label>
          </div>
        </CollapsibleSection>

        <CollapsibleSection
          title="Sections"
          isOpen={openSection === 'sections'}
          onToggle={() => toggleSection('sections')}
          sectionKey="sections"
        >
          <div className="">
            <Reorder.Group axis="y" values={settings.order || Object.keys(SECTION_LABELS)} onReorder={updateOrder} className="divide-y divide-border border border-border rounded-lg shadow-xs overflow-hidden">
              {(settings.order || Object.keys(SECTION_LABELS) as (keyof ResumeSettings['sections'])[]).map((key) => (
                <Reorder.Item key={key} value={key} className="flex items-center gap-2 bg-muted px-2.5 py-2.5 cursor-grab active:cursor-grabbing">
                  <GripVertical className="h-4 w-4 text-muted-foreground shrink-0 cursor-grab active:cursor-grabbing" />
                  <div className="flex-1 flex items-center justify-between">
                    <Label htmlFor={`section-${key}`} className="text-xs font-medium text-primary/90 cursor-pointer">
                      {SECTION_LABELS[key as keyof ResumeSettings['sections']]}
                    </Label>
                    <Switch
                      id={`section-${key}`}
                      checked={settings.sections[key as keyof ResumeSettings['sections']]}
                      onCheckedChange={(val) => updateSection(key as keyof ResumeSettings['sections'], val)}
                      className=''
                    />
                  </div>
                </Reorder.Item>
              ))}
            </Reorder.Group>
          </div>
        </CollapsibleSection>
      </div>
    </div>
  );
}
