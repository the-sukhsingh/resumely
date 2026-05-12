'use client';

import { Globe, Mail, Phone, MapPin } from 'lucide-react';
import type { ResumeData, ResumeSettings } from '@/types/resume';

// ─── Default settings (used when none supplied) ───────────────────────────────

const ALL_VISIBLE: ResumeSettings['sections'] = {
  personalInfo: true,
  summary: true,
  experience: true,
  education: true,
  skills: true,
  projects: true,
  achievements: true,
  certifications: true,
};

const DEFAULT_ORDER = [
  'personalInfo', 'summary', 'experience', 'education',
  'skills', 'projects', 'certifications', 'achievements',
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function DocSection({
  title,
  children,
  accentColor,
}: {
  title: string;
  children: React.ReactNode;
  accentColor: string;
}) {
  return (
    <div className="mb-5">
      <h2
        className="text-sm font-bold uppercase tracking-widest border-b pb-1 mb-3"
        style={{ borderColor: accentColor, color: accentColor }}
      >
        {title}
      </h2>
      {children}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

interface PreviewPanelProps {
  data: ResumeData;
  settings?: ResumeSettings;
}

export default function PreviewPanel({ data, settings }: PreviewPanelProps) {
  const { personalInfo: p, summary, experience, education, skills, projects, certifications, achievements } = data;

  const sectionVis = settings?.sections ?? ALL_VISIBLE;
  const accentColor = settings?.color ?? '#2563eb';
  const fontFamily = settings?.font ?? 'Inter';
  const order = settings?.order ?? DEFAULT_ORDER;
  const layout = settings?.layout ?? 'one-column';

  // Section renderers keyed by section name
  const sectionRenderers: Record<string, React.ReactNode> = {
    personalInfo: sectionVis.personalInfo ? (
      <div key="personalInfo" className="mb-6 text-center">
        <h1 className="text-2xl font-bold tracking-tight" style={{ color: accentColor }}>{p.name}</h1>
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 mt-2 text-xs text-muted-foreground">
          {p.email && <span className="flex items-center gap-1"><Mail className="h-3 w-3" />{p.email}</span>}
          {p.phone && <span className="flex items-center gap-1"><Phone className="h-3 w-3" />{p.phone}</span>}
          {p.location && <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{p.location}</span>}
          {p.linkedin && <a href={p.linkedin} target="_blank" rel="noreferrer" className="hover:underline" style={{ color: accentColor }}>LinkedIn</a>}
          {p.github && <a href={p.github} target="_blank" rel="noreferrer" className="hover:underline" style={{ color: accentColor }}>GitHub</a>}
          {p.website && <a href={p.website} target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:underline" style={{ color: accentColor }}><Globe className="h-3 w-3" />Website</a>}
        </div>
      </div>
    ) : null,

    summary: sectionVis.summary && summary ? (
      <DocSection key="summary" title="Summary" accentColor={accentColor}>
        <p className="text-muted-foreground leading-relaxed">{summary}</p>
      </DocSection>
    ) : null,

    experience: sectionVis.experience && experience.length > 0 ? (
      <DocSection key="experience" title="Experience" accentColor={accentColor}>
        <div className="space-y-4">
          {experience.map((exp) => (
            <div key={exp.id}>
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold">{exp.position}</p>
                  <p className="text-muted-foreground">{exp.company}{exp.location ? ` · ${exp.location}` : ''}</p>
                </div>
                <p className="text-xs text-muted-foreground shrink-0 ml-4">
                  {exp.startDate} — {exp.current ? 'Present' : (exp.endDate ?? '')}
                </p>
              </div>
              {exp.bullets.filter(Boolean).length > 0 && (
                <ul className="list-disc ml-5 mt-1.5 space-y-0.5 text-muted-foreground">
                  {exp.bullets.filter(Boolean).map((b, i) => <li key={i}>{b}</li>)}
                </ul>
              )}
            </div>
          ))}
        </div>
      </DocSection>
    ) : null,

    education: sectionVis.education && education.length > 0 ? (
      <DocSection key="education" title="Education" accentColor={accentColor}>
        <div className="space-y-3">
          {education.map((edu) => (
            <div key={edu.id} className="flex justify-between items-start">
              <div>
                <p className="font-semibold">{edu.institution}</p>
                <p className="text-muted-foreground">{edu.degree}{edu.field ? `, ${edu.field}` : ''}</p>
                {edu.gpa && <p className="text-xs text-muted-foreground">GPA: {edu.gpa}</p>}
              </div>
              {(edu.startDate || edu.endDate) && (
                <p className="text-xs text-muted-foreground shrink-0 ml-4">
                  {edu.startDate} — {edu.endDate ?? 'Present'}
                </p>
              )}
            </div>
          ))}
        </div>
      </DocSection>
    ) : null,

    skills: sectionVis.skills && skills.length > 0 ? (
      <DocSection key="skills" title="Skills" accentColor={accentColor}>
        <div className="space-y-1.5">
          {skills.map((s, i) => (
            <div key={i} className="flex gap-2">
              <span className="font-medium shrink-0" style={{ color: accentColor }}>{s.category}:</span>
              <span className="text-muted-foreground">{s.items.filter(Boolean).join(', ')}</span>
            </div>
          ))}
        </div>
      </DocSection>
    ) : null,

    projects: sectionVis.projects && projects.length > 0 ? (
      <DocSection key="projects" title="Projects" accentColor={accentColor}>
        <div className="space-y-4">
          {projects.map((proj) => (
            <div key={proj.id}>
              <div className="flex items-center gap-2">
                <p className="font-semibold">{proj.name}</p>
                {proj.technologies.filter(Boolean).length > 0 && (
                  <span className="text-xs text-muted-foreground">· {proj.technologies.filter(Boolean).join(', ')}</span>
                )}
                {proj.link && (
                  <a href={proj.link} target="_blank" rel="noreferrer" className="text-xs hover:underline ml-auto shrink-0" style={{ color: accentColor }}>Link</a>
                )}
              </div>
              <p className="text-muted-foreground mt-0.5">{proj.description}</p>
              {proj.bullets.filter(Boolean).length > 0 && (
                <ul className="list-disc ml-5 mt-1 space-y-0.5 text-muted-foreground">
                  {proj.bullets.filter(Boolean).map((b, i) => <li key={i}>{b}</li>)}
                </ul>
              )}
            </div>
          ))}
        </div>
      </DocSection>
    ) : null,

    certifications: sectionVis.certifications && certifications && certifications.length > 0 ? (
      <DocSection key="certifications" title="Certifications" accentColor={accentColor}>
        <div className="space-y-1.5">
          {certifications.map((cert) => (
            <div key={cert.id} className="flex justify-between">
              <div>
                <span className="font-medium">{cert.name}</span>
                <span className="text-muted-foreground"> · {cert.issuer}</span>
              </div>
              {cert.date && <span className="text-xs text-muted-foreground">{cert.date}</span>}
            </div>
          ))}
        </div>
      </DocSection>
    ) : null,

    achievements: sectionVis.achievements && achievements && achievements.length > 0 ? (
      <DocSection key="achievements" title="Achievements" accentColor={accentColor}>
        <div className="space-y-2">
          {achievements.map((ach) => (
            <div key={ach.id}>
              <p className="font-semibold">{ach.title}</p>
              <p className="text-muted-foreground text-xs">{ach.description}</p>
            </div>
          ))}
        </div>
      </DocSection>
    ) : null,
  };

  // Render sections in the configured order
  const orderedSections = order.map((key) => sectionRenderers[key] ?? null);

  const isTwoCol = layout === 'two-column';

  return (
    <div className="h-full overflow-y-auto bg-muted/30 flex justify-center p-6 rounded-lg">
      <div
        className="w-full max-w-2xl bg-background shadow-md rounded-lg p-10 text-sm"
        style={{ fontFamily }}
      >
        {isTwoCol ? (
          <>
            {/* In two-column mode: personalInfo spans full width, rest split */}
            {sectionRenderers['personalInfo']}
            <div className="grid grid-cols-2 gap-6">
              <div>
                {order
                  .filter((k) => !['personalInfo', 'summary', 'experience'].includes(k))
                  .map((k) => sectionRenderers[k])}
              </div>
              <div>
                {['summary', 'experience']
                  .filter((k) => order.includes(k))
                  .map((k) => sectionRenderers[k])}
              </div>
            </div>
          </>
        ) : (
          orderedSections
        )}
      </div>
    </div>
  );
}
