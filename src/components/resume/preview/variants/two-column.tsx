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

// ─── Main Component ───────────────────────────────────────────────────────────

const TwoColumn: React.FC<{ data: ResumeData }> = ({ data }) => {
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

    const renderSectionHeader = (title: string) => (
        <ViewR
            style={{
                borderBottomWidth: s.showUnderline ? 1 : 0,
                borderBottomColor: s.accentColor,
                paddingBottom: 2,
                marginBottom: s.paragraphSpacing + 3,
            }}
        >
            <TextR
                style={{
                    fontSize: s.fontSizeTitle,
                    fontWeight: 'bold',
                    textTransform: s.headingTextTransform,
                    letterSpacing: 0.6,
                    color: s.accentColor,
                    fontFamily: s.activeFont,
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
                    flexDirection: 'row',
                    gap: 16,
                    color: '#0f172a',
                }}
            >
                {/* ─── Left Column (62%): Header, Summary, Experience, Projects ─── */}
                <ViewR style={{ width: '62%', flexDirection: 'column' }}>

                    {/* Header: Personal Info */}
                    <ViewR style={{ marginBottom: s.sectionSpacing * 0.8 }}>
                        <TextR
                            style={{
                                fontSize: s.fontSizeName * 0.95,
                                fontWeight: 'bold',
                                letterSpacing: -0.3,
                                color: '#0f172a',
                                lineHeight: 1.15,
                                textTransform: s.headingTextTransform,
                                marginBottom: 4,
                            }}
                        >
                            {p.name || "Your Name"}
                        </TextR>
                        <ViewR style={{ flexDirection: 'column', gap: 2 }}>
                            {(nonEmpty(p.phone) || nonEmpty(p.location)) && (
                                <TextR style={{ fontSize: s.fontSizeMeta, color: '#475569' }}>
                                    {[p.phone, p.location].filter(nonEmpty).join(" · ")}
                                </TextR>
                            )}
                            {nonEmpty(p.email) && (
                                <Link src={`mailto:${p.email}`} style={{ fontSize: s.fontSizeMeta, color: '#334155', textDecoration: 'none' }}>
                                    {p.email}
                                </Link>
                            )}
                            {formattedWebsite && (
                                <Link src={formattedWebsite} style={{ fontSize: s.fontSizeMeta, color: '#334155', textDecoration: 'none' }}>
                                    {getDisplayUrl(p.website)}
                                </Link>
                            )}
                            {formattedLinkedin && (
                                <Link src={formattedLinkedin} style={{ fontSize: s.fontSizeMeta, color: '#334155', textDecoration: 'none' }}>
                                    {getDisplayUrl(p.linkedin)}
                                </Link>
                            )}
                            {formattedGithub && (
                                <Link src={formattedGithub} style={{ fontSize: s.fontSizeMeta, color: '#334155', textDecoration: 'none' }}>
                                    {getDisplayUrl(p.github)}
                                </Link>
                            )}
                        </ViewR>
                    </ViewR>

                    {/* Summary */}
                    {nonEmpty(summary) && (
                        <ViewR style={{ marginBottom: s.sectionSpacing }}>
                            {renderSectionHeader("About")}
                            <TextR style={{ fontSize: s.fontSizeBody, lineHeight: s.lineHeight, color: '#1e293b' }}>
                                {summary}
                            </TextR>
                        </ViewR>
                    )}

                    {/* Experience */}
                    {experience.length > 0 && (
                        <ViewR style={{ marginBottom: s.sectionSpacing }}>
                            {renderSectionHeader("Experience")}
                            <ViewR style={{ flexDirection: 'column', gap: s.sectionSpacing * 0.5 }}>
                                {experience.map((exp) => (
                                    <ViewR key={exp.id}>
                                        <ViewR style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 1 }}>
                                            <TextR style={{ fontSize: s.fontSizeSubheading, fontWeight: 'bold', color: '#0f172a' }}>
                                                {exp.company}
                                            </TextR>
                                            <TextR style={{ fontSize: s.fontSizeSmall, fontWeight: 'bold', color: '#334155' }}>
                                                {exp.startDate} – {exp.current ? 'Present' : (exp.endDate ?? '')}
                                            </TextR>
                                        </ViewR>
                                        <ViewR style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
                                            <TextR style={{ fontSize: s.fontSizeSmall, fontStyle: 'italic', color: '#475569' }}>
                                                {exp.position}
                                            </TextR>
                                            {nonEmpty(exp.location) && (
                                                <TextR style={{ fontSize: s.fontSizeMeta, color: '#64748b' }}>
                                                    {exp.location}
                                                </TextR>
                                            )}
                                        </ViewR>

                                        {filterStrings(exp.bullets).length > 0 && (
                                            <ViewR style={{ paddingLeft: 6 }}>
                                                {filterStrings(exp.bullets).map((line, i) => (
                                                    <ViewR key={i} style={{ flexDirection: 'row', marginBottom: s.paragraphSpacing }}>
                                                        <TextR style={{ fontSize: s.fontSizeSmall, color: s.accentColor, marginRight: 4, lineHeight: s.lineHeight }}>•</TextR>
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
                        </ViewR>
                    )}

                    {/* Projects */}
                    {projects.length > 0 && (
                        <ViewR style={{ marginBottom: s.sectionSpacing }}>
                            {renderSectionHeader("Projects")}
                            <ViewR style={{ flexDirection: 'column', gap: s.sectionSpacing * 0.5 }}>
                                {projects.map((proj) => {
                                    const formattedProjLink = formatUrl(proj.link);
                                    return (
                                        <ViewR key={proj.id}>
                                            <ViewR style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 1 }}>
                                                <ViewR style={{ flexDirection: 'row', alignItems: 'center', gap: 4, flexWrap: 'wrap' }}>
                                                    <TextR style={{ fontSize: s.fontSizeSubheading, fontWeight: 'bold', color: '#0f172a' }}>
                                                        {proj.name}
                                                    </TextR>
                                                    {formattedProjLink && (
                                                        <Link src={formattedProjLink} style={{ fontSize: s.fontSizeMeta, color: '#475569', textDecoration: 'none' }}>
                                                            {getDisplayUrl(proj.link)}
                                                        </Link>
                                                    )}
                                                </ViewR>
                                            </ViewR>
                                            {filterStrings(proj.technologies).length > 0 && (
                                                <TextR style={{ fontSize: s.fontSizeMeta, color: '#64748b', marginBottom: 2 }}>
                                                    {filterStrings(proj.technologies).join(' • ')}
                                                </TextR>
                                            )}
                                            {nonEmpty(proj.description) && (
                                                <TextR style={{ fontSize: s.fontSizeBody, lineHeight: s.lineHeight, color: '#1e293b', marginBottom: 2 }}>
                                                    {proj.description}
                                                </TextR>
                                            )}
                                            {filterStrings(proj.bullets).length > 0 && (
                                                <ViewR style={{ paddingLeft: 6 }}>
                                                    {filterStrings(proj.bullets).map((line, i) => (
                                                        <ViewR key={i} style={{ flexDirection: 'row', marginBottom: s.paragraphSpacing }}>
                                                            <TextR style={{ fontSize: s.fontSizeSmall, color: s.accentColor, marginRight: 4, lineHeight: s.lineHeight }}>•</TextR>
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
                        </ViewR>
                    )}

                </ViewR>

                {/* ─── Right Column (38%): Skills, Education, Certifications, Achievements ─── */}
                <ViewR style={{ width: '38%', flexDirection: 'column' }}>

                    {/* Skills */}
                    {skills.length > 0 && (
                        <ViewR style={{ marginBottom: s.sectionSpacing }}>
                            {renderSectionHeader("Skills")}
                            <ViewR style={{ flexDirection: 'column', gap: 4 }}>
                                {skills.map((group, i) => (
                                    filterStrings(group.items).length > 0 && (
                                        <ViewR key={i}>
                                            <TextR style={{ fontSize: s.fontSizeSmall, fontWeight: 'bold', color: '#0f172a', marginBottom: 1 }}>
                                                {group.category}
                                            </TextR>
                                            <TextR style={{ fontSize: s.fontSizeBody, lineHeight: s.lineHeight, color: '#1e293b' }}>
                                                {filterStrings(group.items).join(' • ')}
                                            </TextR>
                                        </ViewR>
                                    )
                                ))}
                            </ViewR>
                        </ViewR>
                    )}

                    {/* Education */}
                    {education.length > 0 && (
                        <ViewR style={{ marginBottom: s.sectionSpacing }}>
                            {renderSectionHeader("Education")}
                            <ViewR style={{ flexDirection: 'column', gap: s.sectionSpacing * 0.4 }}>
                                {education.map((edu) => (
                                    <ViewR key={edu.id} style={{ flexDirection: 'column' }}>
                                        <TextR style={{ fontSize: s.fontSizeSubheading, fontWeight: 'bold', color: '#0f172a', lineHeight: 1.2 }}>
                                            {edu.institution}
                                        </TextR>
                                        <TextR style={{ fontSize: s.fontSizeSmall, color: '#334155', marginTop: 1 }}>
                                            {edu.degree}{nonEmpty(edu.field) ? ` · ${edu.field}` : ''}
                                        </TextR>
                                        <ViewR style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 1 }}>
                                            {(nonEmpty(edu.startDate) || nonEmpty(edu.endDate)) && (
                                                <TextR style={{ fontSize: s.fontSizeMeta, color: '#64748b' }}>
                                                    {edu.startDate ?? ''}{edu.startDate && edu.endDate ? ' – ' : ''}{edu.endDate ?? ''}
                                                </TextR>
                                            )}
                                            {nonEmpty(edu.gpa) && (
                                                <TextR style={{ fontSize: s.fontSizeMeta, color: '#64748b' }}>
                                                    GPA: {edu.gpa}
                                                </TextR>
                                            )}
                                        </ViewR>
                                    </ViewR>
                                ))}
                            </ViewR>
                        </ViewR>
                    )}

                    {/* Certifications */}
                    {certifications && certifications.length > 0 && (
                        <ViewR style={{ marginBottom: s.sectionSpacing }}>
                            {renderSectionHeader("Certifications")}
                            <ViewR style={{ flexDirection: 'column', gap: s.sectionSpacing * 0.4 }}>
                                {certifications.map((cert) => {
                                    const formattedCertLink = formatUrl(cert.link);
                                    return (
                                        <ViewR key={cert.id} wrap={false} style={{ flexDirection: 'column' }}>
                                            {formattedCertLink ? (
                                                <Link src={formattedCertLink} style={{ fontSize: s.fontSizeSmall, fontWeight: 'bold', color: '#0f172a', textDecoration: 'none' }}>
                                                    {cert.name}
                                                </Link>
                                            ) : (
                                                <TextR style={{ fontSize: s.fontSizeSmall, fontWeight: 'bold', color: '#0f172a' }}>
                                                    {cert.name}
                                                </TextR>
                                            )}
                                            {nonEmpty(cert.issuer) && (
                                                <TextR style={{ fontSize: s.fontSizeMeta, color: '#475569' }}>
                                                    {cert.issuer}
                                                </TextR>
                                            )}
                                            {nonEmpty(cert.date) && (
                                                <TextR style={{ fontSize: s.fontSizeMeta, color: '#64748b' }}>
                                                    {cert.date}
                                                </TextR>
                                            )}
                                        </ViewR>
                                    );
                                })}
                            </ViewR>
                        </ViewR>
                    )}

                    {/* Achievements */}
                    {achievements && achievements.length > 0 && (
                        <ViewR style={{ marginBottom: s.sectionSpacing }}>
                            {renderSectionHeader("Achievements")}
                            <ViewR style={{ flexDirection: 'column', gap: s.sectionSpacing * 0.35 }}>
                                {achievements.map((ach) => (
                                    <ViewR key={ach.id} wrap={false} style={{ flexDirection: 'column' }}>
                                        <TextR style={{ fontSize: s.fontSizeSmall, fontWeight: 'bold', color: '#0f172a' }}>
                                            {ach.title}
                                        </TextR>
                                        {nonEmpty(ach.description) && (
                                            <TextR style={{ fontSize: s.fontSizeBody, lineHeight: s.lineHeight, color: '#334155', marginTop: 1 }}>
                                                {ach.description}
                                            </TextR>
                                        )}
                                    </ViewR>
                                ))}
                            </ViewR>
                        </ViewR>
                    )}

                </ViewR>
            </Page>
        </Document>
    );
};

export default TwoColumn;
