"use client";

import React from 'react';
import { ResumeData } from '@/types/resume';
import { Document, Page, Text as TextR, View as ViewR, Font, Link } from "@react-pdf/renderer";
import { createTw } from "react-pdf-tailwind";
import { cn } from "@/lib/utils";
import { registerResumeFonts, normalizeFontFamily } from '@/constants/pdf-fonts';
import { LatexText } from './latex-text';

registerResumeFonts(Font);

const tw = createTw({
  theme: {},
});

const nonEmpty = (v?: string | null): v is string => !!v && v.trim().length > 0;
const filterStrings = (arr: (string | null)[]): string[] => arr.filter(nonEmpty);

const formatUrl = (url?: string | null) => {
  if (!url) return null;
  const clean = url.trim();
  if (!clean) return null;
  return clean.startsWith('http://') || clean.startsWith('https://') ? clean : `https://${clean}`;
};

const getDisplayUrl = (url?: string | null) => {
  if (!url) return null;
  return url.replace(/^https?:\/\//, '').replace(/^www\./, '').replace(/\/$/, '');
};

// ─── Primitives ───────────────────────────────────────────────────────────────

const View = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <ViewR style={tw(cn("flex flex-col", className))}>{children}</ViewR>
);

const Text = ({ children, className, font }: { children: React.ReactNode; className?: string; font?: string }) => (
  <TextR style={[tw(cn("text-xs text-black", className)), font ? { fontFamily: font } : {}]}>
    {children}
  </TextR>
);

const LinkR = ({ children, src, className, font }: { children: React.ReactNode; src: string; className?: string; font?: string }) => (
  <Link src={src} style={[tw(cn("text-[9px] text-black", className)), { textDecoration: "none" }, font ? { fontFamily: font } : {}]}>
    {children}
  </Link>
);

const SectionHeading = ({ children, font }: { children: React.ReactNode; font: string }) => (
  <ViewR style={tw("border-b border-black pb-0.5 mb-1.5 mt-2")}>
    <TextR
      style={[
        tw("text-xs font-bold uppercase tracking-wider text-black"),
        { lineHeight: 1.1, fontFamily: font }
      ]}
    >
      {children}
    </TextR>
  </ViewR>
);

const Bullet = ({ text, font }: { text: string; font: string }) => (
  <ViewR style={tw("flex-row mb-0.5 pl-2.5")}>
    <TextR style={[tw("text-[9px] mr-1 text-black"), { fontFamily: font }]}>•</TextR>
    <ViewR style={tw("flex-1")}>
      <LatexText font={font} style={tw("text-[9px] leading-normal text-neutral-900")}>
        {text}
      </LatexText>
    </ViewR>
  </ViewR>
);

// ─── Main LaTeX Resume Variant Component ─────────────────────────────────────

const LatexPdf: React.FC<{ data: ResumeData }> = ({ data }) => {
  // LaTeX resumes look best in serif; default to Times New Roman if not set
  const activeFont = normalizeFontFamily(data?.settings?.font);

  if (!data) {
    return (
      <Document>
        <Page size="A4" style={[tw("text-sm bg-white"), { fontFamily: activeFont }]}>
          <ViewR style={tw("flex-1 justify-center items-center")}>
            <TextR>Loading...</TextR>
          </ViewR>
        </Page>
      </Document>
    );
  }

  const { personalInfo: p, summary, experience, education, skills, projects, certifications, achievements } = data;

  const formattedWebsite = formatUrl(p.website);
  const formattedLinkedin = formatUrl(p.linkedin);
  const formattedGithub = formatUrl(p.github);

  // Build clean contact items array with separator
  const contactItems: React.ReactNode[] = [];
  if (nonEmpty(p.phone)) {
    contactItems.push(<Text key="phone" font={activeFont} className="text-[9px]">{p.phone}</Text>);
  }
  if (nonEmpty(p.email)) {
    contactItems.push(
      <LinkR key="email" font={activeFont} src={`mailto:${p.email}`} className="text-[9px] underline">
        {p.email}
      </LinkR>
    );
  }
  if (formattedLinkedin) {
    contactItems.push(
      <LinkR key="linkedin" font={activeFont} src={formattedLinkedin} className="text-[9px] underline">
        {getDisplayUrl(p.linkedin)}
      </LinkR>
    );
  }
  if (formattedGithub) {
    contactItems.push(
      <LinkR key="github" font={activeFont} src={formattedGithub} className="text-[9px] underline">
        {getDisplayUrl(p.github)}
      </LinkR>
    );
  }
  if (formattedWebsite) {
    contactItems.push(
      <LinkR key="website" font={activeFont} src={formattedWebsite} className="text-[9px] underline">
        {getDisplayUrl(p.website)}
      </LinkR>
    );
  }
  if (nonEmpty(p.location)) {
    contactItems.push(<Text key="location" font={activeFont} className="text-[9px]">{p.location}</Text>);
  }

  return (
    <Document
      title={`Resume-${p.name || 'document'}`}
      author={p.name || "Unknown"}
      creator="Resumely LaTeX Engine"
      producer="Resumely"
    >
      <Page size="A4" style={[tw("text-xs text-black bg-white px-8 py-6"), { fontFamily: activeFont }]}>

        {/* ─── Header: Classic Centered LaTeX Header ─── */}
        <View className="text-center mb-2 items-center">
          <TextR
            style={[
              tw("text-2xl font-bold tracking-tight text-black"),
              { lineHeight: 1.15, fontFamily: activeFont }
            ]}
          >
            {p.name || "Your Name"}
          </TextR>

          {/* Contact Row separated by classic LaTeX pipe symbol */}
          {contactItems.length > 0 && (
            <ViewR style={tw("flex-row flex-wrap items-center justify-center gap-1.5 mt-1")}>
              {contactItems.map((item, idx) => (
                <React.Fragment key={idx}>
                  {idx > 0 && <Text font={activeFont} className="text-[9px] text-neutral-400">|</Text>}
                  {item}
                </React.Fragment>
              ))}
            </ViewR>
          )}
        </View>

        {/* ─── Summary / Objective ─── */}
        {nonEmpty(summary) && (
          <View className="mb-2">
            <SectionHeading font={activeFont}>Summary</SectionHeading>
            <LatexText font={activeFont} style={tw("text-[9px] leading-relaxed text-neutral-900")}>
              {summary}
            </LatexText>
          </View>
        )}

        {/* ─── Education (Often prioritized in LaTeX CVs) ─── */}
        {education && education.length > 0 && (
          <View className="mb-2">
            <SectionHeading font={activeFont}>Education</SectionHeading>
            {education.map((edu) => (
              <ViewR key={edu.id} wrap={false} style={tw("mb-1.5")}>
                <ViewR style={tw("flex-row justify-between items-baseline")}>
                  <TextR style={[tw("text-xs font-bold text-black"), { fontFamily: activeFont }]}>
                    <LatexText font={activeFont}>{edu.institution}</LatexText>
                    {nonEmpty(edu.location) && (
                      <TextR style={tw("font-normal text-neutral-700")}> · {edu.location}</TextR>
                    )}
                  </TextR>
                  <TextR style={[tw("text-[9px] text-black font-normal"), { fontFamily: activeFont }]}>
                    {edu.startDate ?? ''}{edu.startDate && edu.endDate ? ' – ' : ''}{edu.endDate ?? ''}
                  </TextR>
                </ViewR>
                <ViewR style={tw("flex-row justify-between items-baseline mt-0.5")}>
                  <TextR style={[tw("text-[9px] italic text-neutral-900"), { fontFamily: activeFont }]}>
                    <LatexText font={activeFont}>
                      {edu.degree}{nonEmpty(edu.field) ? `, ${edu.field}` : ''}
                    </LatexText>
                  </TextR>
                  {nonEmpty(edu.gpa) && (
                    <TextR style={[tw("text-[9px] text-neutral-800"), { fontFamily: activeFont }]}>
                      GPA: {edu.gpa}
                    </TextR>
                  )}
                </ViewR>
              </ViewR>
            ))}
          </View>
        )}

        {/* ─── Work Experience ─── */}
        {experience && experience.length > 0 && (
          <View className="mb-2">
            <SectionHeading font={activeFont}>Experience</SectionHeading>
            {experience.map((exp) => (
              <ViewR key={exp.id} style={tw("mb-2")}>
                {/* Row 1: Role/Position on left, Date on right */}
                <ViewR style={tw("flex-row justify-between items-baseline mb-0.5")}>
                  <TextR style={[tw("text-xs font-bold text-black"), { fontFamily: activeFont }]}>
                    <LatexText font={activeFont}>{exp.position}</LatexText>
                  </TextR>
                  <TextR style={[tw("text-[9px] text-black font-normal"), { fontFamily: activeFont }]}>
                    {exp.startDate} – {exp.current ? 'Present' : (exp.endDate ?? '')}
                  </TextR>
                </ViewR>

                {/* Row 2: Company on left (italic), Location on right */}
                <ViewR style={tw("flex-row justify-between items-baseline mb-1")}>
                  <TextR style={[tw("text-[9px] italic text-neutral-800"), { fontFamily: activeFont }]}>
                    <LatexText font={activeFont}>{exp.company}</LatexText>
                  </TextR>
                  {nonEmpty(exp.location) && (
                    <TextR style={[tw("text-[9px] text-neutral-700 italic"), { fontFamily: activeFont }]}>
                      {exp.location}
                    </TextR>
                  )}
                </ViewR>

                {/* Bullets with LaTeX parsing */}
                {filterStrings(exp.bullets).length > 0 && (
                  <ViewR style={tw("flex-col gap-0.5")}>
                    {filterStrings(exp.bullets).map((line, i) => (
                      <Bullet key={i} text={line} font={activeFont} />
                    ))}
                  </ViewR>
                )}
              </ViewR>
            ))}
          </View>
        )}

        {/* ─── Projects ─── */}
        {projects && projects.length > 0 && (
          <View className="mb-2">
            <SectionHeading font={activeFont}>Projects</SectionHeading>
            {projects.map((proj) => {
              const formattedProjLink = formatUrl(proj.link);
              return (
                <ViewR key={proj.id} style={tw("mb-2")}>
                  <ViewR style={tw("flex-row justify-between items-baseline mb-0.5")}>
                    <ViewR style={tw("flex-row items-baseline gap-1.5 flex-wrap flex-1")}>
                      <TextR style={[tw("text-xs font-bold text-black"), { fontFamily: activeFont }]}>
                        <LatexText font={activeFont}>{proj.name}</LatexText>
                      </TextR>
                      {filterStrings(proj.technologies).length > 0 && (
                        <TextR style={[tw("text-[9px] text-neutral-700 italic"), { fontFamily: activeFont }]}>
                          | {filterStrings(proj.technologies).join(', ')}
                        </TextR>
                      )}
                    </ViewR>
                    {formattedProjLink && (
                      <LinkR src={formattedProjLink} font={activeFont} className="text-[9px] underline text-neutral-800">
                        {getDisplayUrl(proj.link)}
                      </LinkR>
                    )}
                  </ViewR>

                  {nonEmpty(proj.description) && (
                    <ViewR style={tw("mb-0.5 pl-2.5")}>
                      <LatexText font={activeFont} style={tw("text-[9px] leading-normal text-neutral-900")}>
                        {proj.description}
                      </LatexText>
                    </ViewR>
                  )}

                  {filterStrings(proj.bullets).length > 0 && (
                    <ViewR style={tw("flex-col gap-0.5")}>
                      {filterStrings(proj.bullets).map((line, i) => (
                        <Bullet key={i} text={line} font={activeFont} />
                      ))}
                    </ViewR>
                  )}
                </ViewR>
              );
            })}
          </View>
        )}

        {/* ─── Technical Skills (Classic LaTeX Format: \textbf{Category}: list) ─── */}
        {skills && skills.length > 0 && (
          <View className="mb-2">
            <SectionHeading font={activeFont}>Technical Skills</SectionHeading>
            <ViewR style={tw("flex-col gap-0.5")}>
              {skills.map((group, i) => {
                const items = filterStrings(group.items);
                if (items.length === 0) return null;
                return (
                  <ViewR key={i} style={tw("flex-row items-baseline")}>
                    <TextR style={[tw("text-[9px] text-black leading-relaxed"), { fontFamily: activeFont }]}>
                      <TextR style={{ fontWeight: 'bold' }}>{group.category}: </TextR>
                      <LatexText font={activeFont}>
                        {items.join(', ')}
                      </LatexText>
                    </TextR>
                  </ViewR>
                );
              })}
            </ViewR>
          </View>
        )}

        {/* ─── Certifications ─── */}
        {certifications && certifications.length > 0 && (
          <View className="mb-2">
            <SectionHeading font={activeFont}>Certifications</SectionHeading>
            {certifications.map((cert) => {
              const formattedCertLink = formatUrl(cert.link);
              return (
                <ViewR key={cert.id} wrap={false} style={tw("mb-1")}>
                  <ViewR style={tw("flex-row justify-between items-baseline")}>
                    <TextR style={[tw("text-xs font-bold text-black"), { fontFamily: activeFont }]}>
                      {formattedCertLink ? (
                        <LinkR src={formattedCertLink} font={activeFont} className="underline">
                          <LatexText font={activeFont}>{cert.name}</LatexText>
                        </LinkR>
                      ) : (
                        <LatexText font={activeFont}>{cert.name}</LatexText>
                      )}
                      {nonEmpty(cert.issuer) && (
                        <TextR style={tw("font-normal text-neutral-700 italic")}> · {cert.issuer}</TextR>
                      )}
                    </TextR>
                    <TextR style={[tw("text-[9px] text-black font-normal"), { fontFamily: activeFont }]}>
                      {cert.date ?? ''}
                    </TextR>
                  </ViewR>
                </ViewR>
              );
            })}
          </View>
        )}

        {/* ─── Achievements ─── */}
        {achievements && achievements.length > 0 && (
          <View className="mb-2">
            <SectionHeading font={activeFont}>Honors & Awards</SectionHeading>
            {achievements.map((ach) => (
              <ViewR key={ach.id} wrap={false} style={tw("mb-1 pl-2.5")}>
                <ViewR style={tw("flex-row items-baseline")}>
                  <TextR style={[tw("text-[9px] mr-1 text-black"), { fontFamily: activeFont }]}>•</TextR>
                  <TextR style={[tw("text-[9px] text-black leading-relaxed flex-1"), { fontFamily: activeFont }]}>
                    <TextR style={{ fontWeight: 'bold' }}>{ach.title}</TextR>
                    {nonEmpty(ach.description) && (
                      <TextR style={tw("text-neutral-900")}>: <LatexText font={activeFont}>{ach.description}</LatexText></TextR>
                    )}
                  </TextR>
                </ViewR>
              </ViewR>
            ))}
          </View>
        )}

      </Page>
    </Document>
  );
};

export default LatexPdf;
