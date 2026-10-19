"use client"
import React from 'react';
import { ResumeData } from '@/types/resume';
import { Document, Page, Text as TextR, View as ViewR, Font, Link } from "@react-pdf/renderer";
import { registerResumeFonts } from '@/constants/pdf-fonts';
import { computeResumeStyles } from '@/lib/pdf/style-utils';

registerResumeFonts(Font);

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

// ─── Main Classic Resume Variant Component ───────────────────────────────────

const ClassicPdf: React.FC<{ data: ResumeData }> = ({ data }) => {
    const s = computeResumeStyles(data?.settings);

    if (!data) {
        return (
            <Document>
                <Page size={s.paperSize} style={{ backgroundColor: '#ffffff', fontFamily: s.activeFont }}>
                    <ViewR style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
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

    return (
        <Document
            title={`Resume-${p.name || 'document'}`}
            author={p.name || "Unknown"}
            creator={p.name || "Unknown"}
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
                {/* Header */}
                <ViewR style={{ textAlign: 'center', marginBottom: s.sectionSpacing * 0.85 }}>
                    <TextR
                        style={{
                            fontSize: s.fontSizeName,
                            fontFamily: s.activeFont,
                            fontWeight: 'bold',
                            textTransform: s.headingTextTransform,
                            letterSpacing: -0.3,
                            lineHeight: 1.15,
                            color: '#0f172a',
                        }}
                    >
                        {p.name || "Your Name"}
                    </TextR>

                    <ViewR style={{ flexDirection: 'row', gap: 6, flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', marginTop: 4 }}>
                        {nonEmpty(p.phone) && (
                            <TextR style={{ fontSize: s.fontSizeLink, color: '#334155' }}>{p.phone}</TextR>
                        )}
                        {nonEmpty(p.location) && (
                            <>
                                {nonEmpty(p.phone) && <TextR style={{ fontSize: s.fontSizeLink, color: '#94a3b8' }}>·</TextR>}
                                <TextR style={{ fontSize: s.fontSizeLink, color: '#334155' }}>{p.location}</TextR>
                            </>
                        )}
                    </ViewR>

                    <ViewR style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', marginTop: 3 }}>
                        {formattedWebsite && (
                            <Link src={formattedWebsite} style={{ fontSize: s.fontSizeLink, color: '#1e293b', textDecoration: 'none' }}>
                                {getDisplayUrl(p.website)}
                            </Link>
                        )}
                        {nonEmpty(p.email) && (
                            <>
                                {formattedWebsite && <TextR style={{ fontSize: s.fontSizeLink, color: '#94a3b8' }}>·</TextR>}
                                <Link src={`mailto:${p.email}`} style={{ fontSize: s.fontSizeLink, color: '#1e293b', textDecoration: 'none' }}>
                                    {p.email}
                                </Link>
                            </>
                        )}
                        {formattedLinkedin && (
                            <>
                                {(formattedWebsite || nonEmpty(p.email)) && <TextR style={{ fontSize: s.fontSizeLink, color: '#94a3b8' }}>·</TextR>}
                                <Link src={formattedLinkedin} style={{ fontSize: s.fontSizeLink, color: '#1e293b', textDecoration: 'none' }}>
                                    {getDisplayUrl(p.linkedin)}
                                </Link>
                            </>
                        )}
                        {formattedGithub && (
                            <>
                                {(formattedWebsite || nonEmpty(p.email) || formattedLinkedin) && <TextR style={{ fontSize: s.fontSizeLink, color: '#94a3b8' }}>·</TextR>}
                                <Link src={formattedGithub} style={{ fontSize: s.fontSizeLink, color: '#1e293b', textDecoration: 'none' }}>
                                    {getDisplayUrl(p.github)}
                                </Link>
                            </>
                        )}
                    </ViewR>
                </ViewR>

                {/* Summary */}
                {nonEmpty(summary) && (
                    <ViewR style={{ marginBottom: s.sectionSpacing }}>
                        <TextR
                            style={{
                                fontSize: s.fontSizeTitle,
                                fontWeight: 'bold',
                                textTransform: s.headingTextTransform,
                                color: s.accentColor,
                                borderBottomWidth: s.showUnderline ? 1 : 0,
                                borderBottomColor: s.accentColor,
                                paddingBottom: 2,
                                marginBottom: s.paragraphSpacing + 3,
                                letterSpacing: 0.5,
                            }}
                        >
                            Summary
                        </TextR>
                        <TextR
                            style={{
                                fontSize: s.fontSizeBody,
                                lineHeight: s.lineHeight,
                                color: '#1e293b',
                            }}
                        >
                            {summary}
                        </TextR>
                    </ViewR>
                )}

                {/* Experience */}
                {experience.length > 0 && (
                    <ViewR style={{ marginBottom: s.sectionSpacing }}>
                        <TextR
                            style={{
                                fontSize: s.fontSizeTitle,
                                fontWeight: 'bold',
                                textTransform: s.headingTextTransform,
                                color: s.accentColor,
                                borderBottomWidth: s.showUnderline ? 1 : 0,
                                borderBottomColor: s.accentColor,
                                paddingBottom: 2,
                                marginBottom: s.paragraphSpacing + 3,
                                letterSpacing: 0.5,
                            }}
                        >
                            Work Experience
                        </TextR>
                        {experience.map((exp) => (
                            <ViewR key={exp.id} style={{ marginBottom: s.sectionSpacing * 0.75 }}>
                                <ViewR style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 1 }}>
                                    <TextR style={{ fontSize: s.fontSizeSubheading, fontWeight: 'bold', color: '#0f172a' }}>
                                        {exp.company}{nonEmpty(exp.location) ? ` · ${exp.location}` : ''}
                                    </TextR>
                                    <TextR style={{ fontSize: s.fontSizeSmall, fontWeight: 'bold', color: '#334155' }}>
                                        {exp.startDate} – {exp.current ? 'Present' : (exp.endDate ?? '')}
                                    </TextR>
                                </ViewR>
                                <TextR style={{ fontSize: s.fontSizeBody, fontStyle: 'italic', color: '#475569', marginBottom: 2 }}>
                                    {exp.position}
                                </TextR>
                                {filterStrings(exp.bullets).length > 0 && (
                                    <ViewR style={{ paddingLeft: 8 }}>
                                        {filterStrings(exp.bullets).map((line, i) => (
                                            <ViewR key={i} style={{ flexDirection: 'row', marginBottom: s.paragraphSpacing }}>
                                                <TextR style={{ fontSize: s.fontSizeSmall, color: s.accentColor, marginRight: 5, lineHeight: s.lineHeight }}>•</TextR>
                                                <TextR style={{ fontSize: s.fontSizeBody, lineHeight: s.lineHeight, color: '#1e293b', flex: 1 }}>
                                                    {line}
                                                </TextR>
                                            </ViewR>
                                        ))}
                                    </ViewR>
                                )}
                            </ViewR>
                        ))}
                    </ViewR>
                )}

                {/* Projects */}
                {projects.length > 0 && (
                    <ViewR style={{ marginBottom: s.sectionSpacing }}>
                        <TextR
                            style={{
                                fontSize: s.fontSizeTitle,
                                fontWeight: 'bold',
                                textTransform: s.headingTextTransform,
                                color: s.accentColor,
                                borderBottomWidth: s.showUnderline ? 1 : 0,
                                borderBottomColor: s.accentColor,
                                paddingBottom: 2,
                                marginBottom: s.paragraphSpacing + 3,
                                letterSpacing: 0.5,
                            }}
                        >
                            Projects
                        </TextR>
                        {projects.map((proj) => {
                            const formattedProjLink = formatUrl(proj.link);
                            return (
                                <ViewR key={proj.id} style={{ marginBottom: s.sectionSpacing * 0.65 }}>
                                    <ViewR style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
                                        <ViewR style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                                            <TextR style={{ fontSize: s.fontSizeSubheading, fontWeight: 'bold', color: '#0f172a' }}>
                                                {proj.name}
                                            </TextR>
                                            {formattedProjLink && (
                                                <Link src={formattedProjLink} style={{ fontSize: s.fontSizeLink, color: '#2563eb', textDecoration: 'none' }}>
                                                    {getDisplayUrl(proj.link)}
                                                </Link>
                                            )}
                                        </ViewR>
                                        {filterStrings(proj.technologies).length > 0 && (
                                            <TextR style={{ fontSize: s.fontSizeSmall, color: '#64748b' }}>
                                                {filterStrings(proj.technologies).join(' • ')}
                                            </TextR>
                                        )}
                                    </ViewR>
                                    {nonEmpty(proj.description) && (
                                        <TextR style={{ fontSize: s.fontSizeBody, lineHeight: s.lineHeight, color: '#1e293b', marginBottom: 2 }}>
                                            {proj.description}
                                        </TextR>
                                    )}
                                    {filterStrings(proj.bullets).length > 0 && (
                                        <ViewR style={{ paddingLeft: 8 }}>
                                            {filterStrings(proj.bullets).map((line, i) => (
                                                <ViewR key={i} style={{ flexDirection: 'row', marginBottom: s.paragraphSpacing }}>
                                                    <TextR style={{ fontSize: s.fontSizeSmall, color: s.accentColor, marginRight: 5, lineHeight: s.lineHeight }}>•</TextR>
                                                    <TextR style={{ fontSize: s.fontSizeBody, lineHeight: s.lineHeight, color: '#1e293b', flex: 1 }}>
                                                        {line}
                                                    </TextR>
                                                </ViewR>
                                            ))}
                                        </ViewR>
                                    )}
                                </ViewR>
                            );
                        })}
                    </ViewR>
                )}

                {/* Skills */}
                {skills.length > 0 && (
                    <ViewR style={{ marginBottom: s.sectionSpacing }}>
                        <TextR
                            style={{
                                fontSize: s.fontSizeTitle,
                                fontWeight: 'bold',
                                textTransform: s.headingTextTransform,
                                color: s.accentColor,
                                borderBottomWidth: s.showUnderline ? 1 : 0,
                                borderBottomColor: s.accentColor,
                                paddingBottom: 2,
                                marginBottom: s.paragraphSpacing + 3,
                                letterSpacing: 0.5,
                            }}
                        >
                            Skills
                        </TextR>
                        {skills.map((group, i) => (
                            filterStrings(group.items).length > 0 && (
                                <TextR key={i} style={{ fontSize: s.fontSizeBody, lineHeight: s.lineHeight, color: '#1e293b', marginBottom: 2 }}>
                                    <TextR style={{ fontWeight: 'bold', color: '#0f172a' }}>{group.category}: </TextR>
                                    {filterStrings(group.items).join(' • ')}
                                </TextR>
                            )
                        ))}
                    </ViewR>
                )}

                {/* Education */}
                {education.length > 0 && (
                    <ViewR style={{ marginBottom: s.sectionSpacing }}>
                        <TextR
                            style={{
                                fontSize: s.fontSizeTitle,
                                fontWeight: 'bold',
                                textTransform: s.headingTextTransform,
                                color: s.accentColor,
                                borderBottomWidth: s.showUnderline ? 1 : 0,
                                borderBottomColor: s.accentColor,
                                paddingBottom: 2,
                                marginBottom: s.paragraphSpacing + 3,
                                letterSpacing: 0.5,
                            }}
                        >
                            Education
                        </TextR>
                        {education.map((edu) => (
                            <ViewR key={edu.id} wrap={false} style={{ marginBottom: s.sectionSpacing * 0.55 }}>
                                <ViewR style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <TextR style={{ fontSize: s.fontSizeSubheading, fontWeight: 'bold', color: '#0f172a' }}>
                                        {edu.institution}
                                        {nonEmpty(edu.location) ? ` · ${edu.location}` : ''}
                                    </TextR>
                                    <TextR style={{ fontSize: s.fontSizeSmall, color: '#475569' }}>
                                        {edu.startDate ?? ''}{edu.startDate && edu.endDate ? ' – ' : ''}{edu.endDate ?? ''}
                                    </TextR>
                                </ViewR>
                                <TextR style={{ fontSize: s.fontSizeBody, color: '#334155', marginTop: 1 }}>
                                    {edu.degree}{nonEmpty(edu.field) ? ` · ${edu.field}` : ''}{nonEmpty(edu.gpa) ? ` | GPA: ${edu.gpa}` : ''}
                                </TextR>
                            </ViewR>
                        ))}
                    </ViewR>
                )}

                {/* Certifications */}
                {certifications && certifications.length > 0 && (
                    <ViewR style={{ marginBottom: s.sectionSpacing }}>
                        <TextR
                            style={{
                                fontSize: s.fontSizeTitle,
                                fontWeight: 'bold',
                                textTransform: s.headingTextTransform,
                                color: s.accentColor,
                                borderBottomWidth: s.showUnderline ? 1 : 0,
                                borderBottomColor: s.accentColor,
                                paddingBottom: 2,
                                marginBottom: s.paragraphSpacing + 3,
                                letterSpacing: 0.5,
                            }}
                        >
                            Certifications
                        </TextR>
                        {certifications.map((cert) => {
                            const formattedCertLink = formatUrl(cert.link);
                            return (
                                <ViewR key={cert.id} wrap={false} style={{ marginBottom: s.sectionSpacing * 0.5 }}>
                                    <ViewR style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                        {formattedCertLink ? (
                                            <Link src={formattedCertLink} style={{ fontSize: s.fontSizeSubheading, fontWeight: 'bold', color: '#2563eb', textDecoration: 'none' }}>
                                                {cert.name}
                                            </Link>
                                        ) : (
                                            <TextR style={{ fontSize: s.fontSizeSubheading, fontWeight: 'bold', color: '#0f172a' }}>
                                                {cert.name}
                                            </TextR>
                                        )}
                                        <TextR style={{ fontSize: s.fontSizeSmall, color: '#475569' }}>
                                            {cert.date ?? ''}
                                        </TextR>
                                    </ViewR>
                                    {nonEmpty(cert.issuer) && (
                                        <TextR style={{ fontSize: s.fontSizeBody, color: '#334155', marginTop: 1 }}>
                                            {cert.issuer}
                                        </TextR>
                                    )}
                                </ViewR>
                            );
                        })}
                    </ViewR>
                )}

                {/* Achievements */}
                {achievements && achievements.length > 0 && (
                    <ViewR style={{ marginBottom: s.sectionSpacing }}>
                        <TextR
                            style={{
                                fontSize: s.fontSizeTitle,
                                fontWeight: 'bold',
                                textTransform: s.headingTextTransform,
                                color: s.accentColor,
                                borderBottomWidth: s.showUnderline ? 1 : 0,
                                borderBottomColor: s.accentColor,
                                paddingBottom: 2,
                                marginBottom: s.paragraphSpacing + 3,
                                letterSpacing: 0.5,
                            }}
                        >
                            Achievements
                        </TextR>
                        {achievements.map((ach) => (
                            <ViewR key={ach.id} wrap={false} style={{ marginBottom: s.sectionSpacing * 0.5 }}>
                                <TextR style={{ fontSize: s.fontSizeSubheading, fontWeight: 'bold', color: '#0f172a' }}>
                                    {ach.title}
                                </TextR>
                                {nonEmpty(ach.description) && (
                                    <TextR style={{ fontSize: s.fontSizeBody, lineHeight: s.lineHeight, color: '#1e293b', marginTop: 1 }}>
                                        {ach.description}
                                    </TextR>
                                )}
                            </ViewR>
                        ))}
                    </ViewR>
                )}
            </Page>
        </Document>
    );
};

export default ClassicPdf;
