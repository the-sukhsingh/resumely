"use client"
import React from 'react';
import { ResumeData } from '@/types/resume';
import { Document, Page, Text as TextR, View as ViewR, Font, Link } from "@react-pdf/renderer";
import { createTw } from "react-pdf-tailwind";
import { cn } from "@/lib/utils";
import { registerResumeFonts, normalizeFontFamily } from '@/constants/pdf-fonts';

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

// ─── Primitives ───────────────────────────────────────────────────────────────

const View = ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <ViewR style={tw(cn("flex flex-col gap-1", className))}>{children}</ViewR>
);

const Text = ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <TextR style={tw(cn("text-sm text-black", className))}>{children}</TextR>
);

const LinkR = ({ children, src, className }: { children: React.ReactNode; src: string; className?: string }) => (
    <Link src={src} style={[tw(cn("text-xs text-black", className)), { textDecoration: "none" }]}>
        {children}
    </Link>
);

const Heading = ({ children, className, font }: { children: React.ReactNode; className?: string; font: string }) => (
    <TextR style={[tw(cn("text-lg font-bold", className)), { lineHeight: 1.2, fontFamily: font }]}>{children}</TextR>
);

const SectionHeading = ({ children, font }: { children: React.ReactNode; font: string }) => (
    <ViewR style={tw("border-b border-neutral-400 mb-2 pb-0.5")}>
        <TextR style={[tw("text-[12px] font-bold uppercase tracking-wider text-neutral-900"), { fontFamily: font }]}>
            {children}
        </TextR>
    </ViewR>
);

const Bullet = ({ text }: { text: string }) => (
    <ViewR style={tw("flex-row mb-0.5")}>
        <Text className="text-xs font-normal mr-1.5">•</Text>
        <Text className="text-xs font-normal leading-relaxed text-neutral-800 flex-1">{text}</Text>
    </ViewR>
);

// ─── Main Component ───────────────────────────────────────────────────────────

const TwoColumn: React.FC<{ data: ResumeData }> = ({ data }) => {
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

    return (
        <Document
            title={`Resume-${p.name || 'document'}`}
            author={p.name || "Unknown"}
            creator={p.name || "Unknown"}
            producer="Resumely"
        >
            <Page size="A4" style={[tw("text-sm text-black bg-white px-8 py-6 flex-row gap-6"), { fontFamily: activeFont }]}>

                {/* ─── Left Column (62%): Header, Summary, Experience, Projects ─── */}
                <ViewR style={tw("w-[62%] flex flex-col")}>

                    {/* Header: Personal Info */}
                    <View className="mb-4">
                        <Heading font={activeFont} className="text-2xl font-bold tracking-tight uppercase mb-1.5">{p.name || "Your Name"}</Heading>
                        <ViewR style={tw("flex-col gap-0.5")}>
                            {(nonEmpty(p.phone) || nonEmpty(p.location)) && (
                                <Text className="text-2xs text-neutral-700">
                                    {[p.phone, p.location].filter(nonEmpty).join(" · ")}
                                </Text>
                            )}
                            {nonEmpty(p.email) && (
                                <LinkR src={`mailto:${p.email}`} className="text-2xs">{p.email}</LinkR>
                            )}
                            {formattedWebsite && (
                                <LinkR src={formattedWebsite} className="text-2xs">{getDisplayUrl(p.website)}</LinkR>
                            )}
                            {formattedLinkedin && (
                                <LinkR src={formattedLinkedin} className="text-2xs">{getDisplayUrl(p.linkedin)}</LinkR>
                            )}
                            {formattedGithub && (
                                <LinkR src={formattedGithub} className="text-2xs">{getDisplayUrl(p.github)}</LinkR>
                            )}
                        </ViewR>
                    </View>

                    {/* Summary */}
                    {nonEmpty(summary) && (
                        <View className="mb-4">
                            <SectionHeading font={activeFont}>About</SectionHeading>
                            <Text className="text-xs leading-relaxed text-neutral-800">{summary}</Text>
                        </View>
                    )}

                    {/* Experience */}
                    {experience.length > 0 && (
                        <View className="mb-4">
                            <SectionHeading font={activeFont}>Experience</SectionHeading>
                            <ViewR style={tw("flex flex-col gap-3")}>
                                {experience.map((exp) => (
                                    <ViewR key={exp.id}>
                                        <ViewR style={tw("flex-row justify-between items-start mb-0.5")}>
                                            <Text className="text-sm font-bold">{exp.company}</Text>
                                            <Text className="text-xs font-bold text-neutral-700">
                                                {exp.startDate} – {exp.current ? 'Present' : (exp.endDate ?? '')}
                                            </Text>
                                        </ViewR>
                                        <ViewR style={tw("flex-row justify-between items-center mb-1")}>
                                            <Text className="text-xs italic text-neutral-700">{exp.position}</Text>
                                            {nonEmpty(exp.location) && (
                                                <Text className="text-2xs text-neutral-600">{exp.location}</Text>
                                            )}
                                        </ViewR>

                                        {filterStrings(exp.bullets).length > 0 && (
                                            <ViewR style={tw("pl-2")}>
                                                {filterStrings(exp.bullets).map((line, i) => <Bullet key={i} text={line} />)}
                                            </ViewR>
                                        )}
                                    </ViewR>
                                ))}
                            </ViewR>
                        </View>
                    )}

                    {/* Projects */}
                    {projects.length > 0 && (
                        <View className="mb-4">
                            <SectionHeading font={activeFont}>Projects</SectionHeading>
                            <ViewR style={tw("flex flex-col gap-3")}>
                                {projects.map((proj) => {
                                    const formattedProjLink = formatUrl(proj.link);
                                    return (
                                        <ViewR key={proj.id}>
                                            <ViewR style={tw("flex-row justify-between items-start mb-0.5")}>
                                                <ViewR style={tw("flex-row items-center gap-1.5 flex-wrap")}>
                                                    <Text className="text-sm font-bold">{proj.name}</Text>
                                                    {formattedProjLink && (
                                                        <LinkR src={formattedProjLink} className="text-2xs text-neutral-600">
                                                            {getDisplayUrl(proj.link)}
                                                        </LinkR>
                                                    )}
                                                </ViewR>
                                            </ViewR>
                                            {filterStrings(proj.technologies).length > 0 && (
                                                <Text className="text-2xs text-neutral-600 mb-1">
                                                    {filterStrings(proj.technologies).join(' • ')}
                                                </Text>
                                            )}
                                            {nonEmpty(proj.description) && (
                                                <Text className="text-xs leading-relaxed text-neutral-800 mb-0.5">{proj.description}</Text>
                                            )}
                                            {filterStrings(proj.bullets).length > 0 && (
                                                <ViewR style={tw("pl-2")}>
                                                    {filterStrings(proj.bullets).map((line, i) => <Bullet key={i} text={line} />)}
                                                </ViewR>
                                            )}
                                        </ViewR>
                                    );
                                })}
                            </ViewR>
                        </View>
                    )}

                </ViewR>

                {/* ─── Right Column (38%): Skills, Education, Certifications, Achievements ─── */}
                <ViewR style={tw("w-[38%] flex flex-col")}>

                    {/* Skills */}
                    {skills.length > 0 && (
                        <View className="mb-4">
                            <SectionHeading font={activeFont}>Skills</SectionHeading>
                            <ViewR style={tw("flex flex-col gap-2")}>
                                {skills.map((group, i) => (
                                    filterStrings(group.items).length > 0 && (
                                        <ViewR key={i}>
                                            <Text className="text-xs font-bold text-neutral-900 mb-0.5">{group.category}</Text>
                                            <Text className="text-2xs leading-relaxed text-neutral-800">
                                                {filterStrings(group.items).join(' • ')}
                                            </Text>
                                        </ViewR>
                                    )
                                ))}
                            </ViewR>
                        </View>
                    )}

                    {/* Education */}
                    {education.length > 0 && (
                        <View className="mb-4">
                            <SectionHeading font={activeFont}>Education</SectionHeading>
                            <ViewR style={tw("flex flex-col gap-2.5")}>
                                {education.map((edu) => (
                                    <ViewR key={edu.id} style={tw("flex-col")}>
                                        <Text className="text-xs font-bold text-neutral-900 leading-tight">{edu.institution}</Text>
                                        <Text className="text-2xs text-neutral-800 mt-0.5">{edu.degree}{nonEmpty(edu.field) ? ` · ${edu.field}` : ''}</Text>
                                        <ViewR style={tw("flex-row justify-between items-center mt-0.5")}>
                                            {(nonEmpty(edu.startDate) || nonEmpty(edu.endDate)) && (
                                                <Text className="text-3xs text-neutral-600">
                                                    {edu.startDate ?? ''}{edu.startDate && edu.endDate ? ' – ' : ''}{edu.endDate ?? ''}
                                                </Text>
                                            )}
                                            {nonEmpty(edu.gpa) && <Text className="text-3xs text-neutral-600">GPA: {edu.gpa}</Text>}
                                        </ViewR>
                                        {nonEmpty(edu.location) && <Text className="text-3xs text-neutral-500 mt-0.5">{edu.location}</Text>}
                                    </ViewR>
                                ))}
                            </ViewR>
                        </View>
                    )}

                    {/* Certifications */}
                    {certifications && certifications.length > 0 && (
                        <View className="mb-4">
                            <SectionHeading font={activeFont}>Certifications</SectionHeading>
                            <ViewR style={tw("flex flex-col gap-2")}>
                                {certifications.map((cert) => {
                                    const formattedCertLink = formatUrl(cert.link);
                                    return (
                                        <ViewR key={cert.id} style={tw("flex-col")}>
                                            {formattedCertLink ? (
                                                <LinkR src={formattedCertLink} className="text-xs font-bold text-neutral-900 leading-tight">{cert.name}</LinkR>
                                            ) : (
                                                <Text className="text-xs font-bold text-neutral-900 leading-tight">{cert.name}</Text>
                                            )}
                                            {nonEmpty(cert.issuer) && (
                                                <Text className="text-2xs text-neutral-700 mt-0.5">{cert.issuer}</Text>
                                            )}
                                            {nonEmpty(cert.date) && <Text className="text-3xs text-neutral-500 mt-0.5">{cert.date}</Text>}
                                        </ViewR>
                                    );
                                })}
                            </ViewR>
                        </View>
                    )}

                    {/* Achievements */}
                    {achievements && achievements.length > 0 && (
                        <View className="mb-4">
                            <SectionHeading font={activeFont}>Achievements</SectionHeading>
                            <ViewR style={tw("flex flex-col gap-2")}>
                                {achievements.map((ach) => (
                                    <ViewR key={ach.id}>
                                        <Text className="text-xs font-bold mb-0.5 text-neutral-900">{ach.title}</Text>
                                        <Text className="text-2xs text-neutral-800 leading-relaxed">{ach.description}</Text>
                                    </ViewR>
                                ))}
                            </ViewR>
                        </View>
                    )}

                </ViewR>

            </Page>
        </Document>
    );
};

export default TwoColumn;
