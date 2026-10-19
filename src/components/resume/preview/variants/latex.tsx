"use client"
import React from 'react';
import { ResumeData } from '@/types/resume';
import { Document, Page, Text as TextR, View as ViewR, Font, Link } from "@react-pdf/renderer";
import { createTw } from "react-pdf-tailwind";
import { registerResumeFonts } from '@/constants/pdf-fonts';
import LatexText from './latex-text';
import { computeResumeStyles } from '@/lib/pdf/style-utils';

registerResumeFonts(Font);

const tw = createTw({
  theme: {
    extend: {
      fontSize: { "2xs": "0.625rem", "3xs": "0.5rem" },
    },
  },
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

// ─── Main LaTeX Resume Variant Component ─────────────────────────────────────

const LatexPdf: React.FC<{ data: ResumeData }> = ({ data }) => {
  const s = computeResumeStyles(data?.settings);

  if (!data) {
    return (
      <Document>
        <Page size={s.paperSize} style={[tw("text-sm bg-white"), { fontFamily: s.activeFont }]}>
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
    contactItems.push(
      <TextR key="phone" style={{ fontSize: s.fontSizeMeta, fontFamily: s.activeFont, color: '#334155' }}>
        {p.phone}
      </TextR>
    );
  }
  if (nonEmpty(p.email)) {
    contactItems.push(
      <Link key="email" src={`mailto:${p.email}`} style={{ fontSize: s.fontSizeMeta, fontFamily: s.activeFont, color: '#1e293b', textDecoration: 'underline' }}>
        {p.email}
      </Link>
    );
  }
  if (formattedLinkedin) {
    contactItems.push(
      <Link key="linkedin" src={formattedLinkedin} style={{ fontSize: s.fontSizeMeta, fontFamily: s.activeFont, color: '#1e293b', textDecoration: 'underline' }}>
        {getDisplayUrl(p.linkedin)}
      </Link>
    );
  }
  if (formattedGithub) {
    contactItems.push(
      <Link key="github" src={formattedGithub} style={{ fontSize: s.fontSizeMeta, fontFamily: s.activeFont, color: '#1e293b', textDecoration: 'underline' }}>
        {getDisplayUrl(p.github)}
      </Link>
    );
  }
  if (formattedWebsite) {
    contactItems.push(
      <Link key="website" src={formattedWebsite} style={{ fontSize: s.fontSizeMeta, fontFamily: s.activeFont, color: '#1e293b', textDecoration: 'underline' }}>
        {getDisplayUrl(p.website)}
      </Link>
    );
  }
  if (nonEmpty(p.location)) {
    contactItems.push(
      <TextR key="location" style={{ fontSize: s.fontSizeMeta, fontFamily: s.activeFont, color: '#334155' }}>
        {p.location}
      </TextR>
    );
  }

  const renderSectionHeader = (title: string) => (
    <ViewR
      style={{
        borderBottomWidth: s.showUnderline ? 1 : 0,
        borderBottomColor: s.accentColor,
        paddingBottom: 2,
        marginBottom: s.paragraphSpacing + 3,
        marginTop: s.sectionSpacing * 0.4,
      }}
    >
      <TextR
        style={{
          fontSize: s.fontSizeTitle,
          fontWeight: 'bold',
          textTransform: s.headingTextTransform,
          letterSpacing: 0.8,
          color: s.accentColor,
          fontFamily: s.activeFont,
          lineHeight: 1.1,
        }}
      >
        {title}
      </TextR>
    </ViewR>
  );

  return (
    <Document
      title={`Resume-${p.name || 'document'}`}
      author={p.name || "Unknown"}
      creator="Resumely LaTeX Engine"
      producer="Resumely"
    >
      <Page
        size={s.paperSize}
        style={{
          backgroundColor: '#ffffff',
          fontFamily: s.activeFont,
          paddingHorizontal: s.activeMargin,
          paddingVertical: s.activeMargin * 0.8,
          color: '#0f172a',
        }}
      >
        {/* ─── Header: Classic Centered LaTeX Header ─── */}
        <ViewR style={{ textAlign: 'center', marginBottom: s.sectionSpacing * 0.7, alignItems: 'center' }}>
          <TextR
            style={{
              fontSize: s.fontSizeName,
              fontWeight: 'bold',
              letterSpacing: -0.3,
              color: '#0f172a',
              lineHeight: 1.15,
              fontFamily: s.activeFont,
              textTransform: s.headingTextTransform,
            }}
          >
            {p.name || "Your Name"}
          </TextR>

          {/* Contact Row separated by classic LaTeX pipe symbol */}
          {contactItems.length > 0 && (
            <ViewR style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: 5, marginTop: 4 }}>
              {contactItems.map((item, idx) => (
                <React.Fragment key={idx}>
                  {idx > 0 && <TextR style={{ fontSize: s.fontSizeMeta, color: '#94a3b8', fontFamily: s.activeFont }}>|</TextR>}
                  {item}
                </React.Fragment>
              ))}
            </ViewR>
          )}
        </ViewR>

        {/* ─── Summary / Objective ─── */}
        {nonEmpty(summary) && (
          <ViewR style={{ marginBottom: s.sectionSpacing }}>
            {renderSectionHeader("Summary")}
            <LatexText font={s.activeFont} style={{ fontSize: s.fontSizeBody, lineHeight: s.lineHeight, color: '#1e293b' }}>
              {summary}
            </LatexText>
          </ViewR>
        )}

        {/* ─── Work Experience ─── */}
        {experience && experience.length > 0 && (
          <ViewR style={{ marginBottom: s.sectionSpacing }}>
            {renderSectionHeader("Work Experience")}
            {experience.map((exp) => (
              <ViewR key={exp.id} style={{ marginBottom: s.sectionSpacing * 0.75 }}>
                {/* Row 1: Company on left (bold), Date on right */}
                <ViewR style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 1 }}>
                  <TextR style={{ fontSize: s.fontSizeSubheading, fontWeight: 'bold', color: '#0f172a', fontFamily: s.activeFont }}>
                    <LatexText font={s.activeFont}>{exp.company}</LatexText>
                    {nonEmpty(exp.location) && (
                      <TextR style={{ fontWeight: 'normal', color: '#475569', fontFamily: s.activeFont }}>
                        {" "}· {exp.location}
                      </TextR>
                    )}
                  </TextR>
                  <TextR style={{ fontSize: s.fontSizeSmall, fontWeight: 'bold', color: '#334155', fontFamily: s.activeFont }}>
                    {exp.startDate} – {exp.current ? 'Present' : (exp.endDate ?? '')}
                  </TextR>
                </ViewR>

                {/* Row 2: Position on left (italic) */}
                <ViewR style={{ marginBottom: 2 }}>
                  <TextR style={{ fontSize: s.fontSizeSmall, fontStyle: 'italic', color: '#475569', fontFamily: s.activeFont }}>
                    <LatexText font={s.activeFont}>{exp.position}</LatexText>
                  </TextR>
                </ViewR>

                {/* Bullets with LaTeX parsing */}
                {filterStrings(exp.bullets).length > 0 && (
                  <ViewR style={{ paddingLeft: 8 }}>
                    {filterStrings(exp.bullets).map((line, i) => (
                      <ViewR key={i} style={{ flexDirection: 'row', marginBottom: s.paragraphSpacing }}>
                        <TextR style={{ fontSize: s.fontSizeSmall, color: s.accentColor, marginRight: 5, lineHeight: s.lineHeight, fontFamily: s.activeFont }}>•</TextR>
                        <ViewR style={{ flex: 1 }}>
                          <LatexText font={s.activeFont} style={{ fontSize: s.fontSizeBody, lineHeight: s.lineHeight, color: '#1e293b' }}>
                            {line}
                          </LatexText>
                        </ViewR>
                      </ViewR>
                    ))}
                  </ViewR>
                )}
              </ViewR>
            ))}
          </ViewR>
        )}

        {/* ─── Projects ─── */}
        {projects && projects.length > 0 && (
          <ViewR style={{ marginBottom: s.sectionSpacing }}>
            {renderSectionHeader("Projects")}
            {projects.map((proj) => {
              const formattedProjLink = formatUrl(proj.link);
              return (
                <ViewR key={proj.id} style={{ marginBottom: s.sectionSpacing * 0.6 }}>
                  <ViewR style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 2 }}>
                    <ViewR style={{ flexDirection: 'row', alignItems: 'baseline', gap: 6, flexWrap: 'wrap', flex: 1 }}>
                      <TextR style={{ fontSize: s.fontSizeSubheading, fontWeight: 'bold', color: '#0f172a', fontFamily: s.activeFont }}>
                        <LatexText font={s.activeFont}>{proj.name}</LatexText>
                      </TextR>
                      {filterStrings(proj.technologies).length > 0 && (
                        <TextR style={{ fontSize: s.fontSizeMeta, color: '#64748b', fontStyle: 'italic', fontFamily: s.activeFont }}>
                          | {filterStrings(proj.technologies).join(', ')}
                        </TextR>
                      )}
                    </ViewR>
                    {formattedProjLink && (
                      <Link src={formattedProjLink} style={{ fontSize: s.fontSizeSmall, color: '#475569', textDecoration: 'underline', fontFamily: s.activeFont }}>
                        {getDisplayUrl(proj.link)}
                      </Link>
                    )}
                  </ViewR>

                  {nonEmpty(proj.description) && (
                    <ViewR style={{ marginBottom: 2, paddingLeft: 8 }}>
                      <LatexText font={s.activeFont} style={{ fontSize: s.fontSizeBody, lineHeight: s.lineHeight, color: '#1e293b' }}>
                        {proj.description}
                      </LatexText>
                    </ViewR>
                  )}

                  {filterStrings(proj.bullets).length > 0 && (
                    <ViewR style={{ paddingLeft: 8 }}>
                      {filterStrings(proj.bullets).map((line, i) => (
                        <ViewR key={i} style={{ flexDirection: 'row', marginBottom: s.paragraphSpacing }}>
                          <TextR style={{ fontSize: s.fontSizeSmall, color: s.accentColor, marginRight: 5, lineHeight: s.lineHeight, fontFamily: s.activeFont }}>•</TextR>
                          <ViewR style={{ flex: 1 }}>
                            <LatexText font={s.activeFont} style={{ fontSize: s.fontSizeBody, lineHeight: s.lineHeight, color: '#1e293b' }}>
                              {line}
                            </LatexText>
                          </ViewR>
                        </ViewR>
                      ))}
                    </ViewR>
                  )}
                </ViewR>
              );
            })}
          </ViewR>
        )}

        {/* ─── Skills ─── */}
        {skills && skills.length > 0 && (
          <ViewR style={{ marginBottom: s.sectionSpacing }}>
            {renderSectionHeader("Skills")}
            <ViewR style={{ gap: 2 }}>
              {skills.map((group, i) => {
                const items = filterStrings(group.items);
                if (items.length === 0) return null;
                return (
                  <ViewR key={i} style={{ flexDirection: 'row', alignItems: 'baseline' }}>
                    <TextR style={{ fontSize: s.fontSizeBody, lineHeight: s.lineHeight, color: '#1e293b', fontFamily: s.activeFont }}>
                      <TextR style={{ fontWeight: 'bold', color: '#0f172a' }}>{group.category}: </TextR>
                      <LatexText font={s.activeFont}>
                        {items.join(', ')}
                      </LatexText>
                    </TextR>
                  </ViewR>
                );
              })}
            </ViewR>
          </ViewR>
        )}

        {/* ─── Education ─── */}
        {education && education.length > 0 && (
          <ViewR style={{ marginBottom: s.sectionSpacing }}>
            {renderSectionHeader("Education")}
            {education.map((edu) => (
              <ViewR key={edu.id} wrap={false} style={{ marginBottom: s.sectionSpacing * 0.5 }}>
                <ViewR style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <TextR style={{ fontSize: s.fontSizeSubheading, fontWeight: 'bold', color: '#0f172a', fontFamily: s.activeFont }}>
                    <LatexText font={s.activeFont}>{edu.institution}</LatexText>
                    {nonEmpty(edu.location) && (
                      <TextR style={{ fontWeight: 'normal', color: '#475569' }}> · {edu.location}</TextR>
                    )}
                  </TextR>
                  <TextR style={{ fontSize: s.fontSizeSmall, fontWeight: 'bold', color: '#334155', fontFamily: s.activeFont }}>
                    {edu.startDate ?? ''}{edu.startDate && edu.endDate ? ' – ' : ''}{edu.endDate ?? ''}
                  </TextR>
                </ViewR>
                <ViewR style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', marginTop: 1 }}>
                  <TextR style={{ fontSize: s.fontSizeSmall, color: '#334155', fontFamily: s.activeFont }}>
                    <LatexText font={s.activeFont}>
                      {edu.degree}{nonEmpty(edu.field) ? ` · ${edu.field}` : ''}
                    </LatexText>
                  </TextR>
                  {nonEmpty(edu.gpa) && (
                    <TextR style={{ fontSize: s.fontSizeSmall, color: '#475569', fontFamily: s.activeFont }}>
                      GPA: {edu.gpa}
                    </TextR>
                  )}
                </ViewR>
              </ViewR>
            ))}
          </ViewR>
        )}

        {/* ─── Certifications ─── */}
        {certifications && certifications.length > 0 && (
          <ViewR style={{ marginBottom: s.sectionSpacing }}>
            {renderSectionHeader("Certifications")}
            {certifications.map((cert) => {
              const formattedCertLink = formatUrl(cert.link);
              return (
                <ViewR key={cert.id} wrap={false} style={{ marginBottom: s.sectionSpacing * 0.5 }}>
                  <ViewR style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <TextR style={{ fontSize: s.fontSizeSubheading, fontWeight: 'bold', color: '#0f172a', fontFamily: s.activeFont }}>
                      {formattedCertLink ? (
                        <Link src={formattedCertLink} style={{ textDecoration: 'underline', color: '#0f172a' }}>
                          <LatexText font={s.activeFont}>{cert.name}</LatexText>
                        </Link>
                      ) : (
                        <LatexText font={s.activeFont}>{cert.name}</LatexText>
                      )}
                      {nonEmpty(cert.issuer) && (
                        <TextR style={{ fontWeight: 'normal', color: '#475569', fontStyle: 'italic' }}> · {cert.issuer}</TextR>
                      )}
                    </TextR>
                    <TextR style={{ fontSize: s.fontSizeSmall, color: '#475569', fontFamily: s.activeFont }}>
                      {cert.date ?? ''}
                    </TextR>
                  </ViewR>
                </ViewR>
              );
            })}
          </ViewR>
        )}

        {/* ─── Achievements ─── */}
        {achievements && achievements.length > 0 && (
          <ViewR style={{ marginBottom: s.sectionSpacing }}>
            {renderSectionHeader("Achievements")}
            {achievements.map((ach) => (
              <ViewR key={ach.id} wrap={false} style={{ marginBottom: s.paragraphSpacing + 2, paddingLeft: 8 }}>
                <ViewR style={{ flexDirection: 'row', alignItems: 'baseline' }}>
                  <TextR style={{ fontSize: s.fontSizeSmall, color: s.accentColor, marginRight: 5, fontFamily: s.activeFont }}>•</TextR>
                  <TextR style={{ fontSize: s.fontSizeBody, lineHeight: s.lineHeight, color: '#1e293b', flex: 1, fontFamily: s.activeFont }}>
                    <TextR style={{ fontWeight: 'bold', color: '#0f172a' }}>{ach.title}</TextR>
                    {nonEmpty(ach.description) && (
                      <TextR style={{ color: '#334155' }}>: <LatexText font={s.activeFont}>{ach.description}</LatexText></TextR>
                    )}
                  </TextR>
                </ViewR>
              </ViewR>
            ))}
          </ViewR>
        )}

      </Page>
    </Document>
  );
};

export default LatexPdf;
