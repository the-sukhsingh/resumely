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
    <TextR style={[tw(cn("text-lg font-bold", className)), {
        lineHeight: 1.2,
        fontFamily: font
    }]}>{children}</TextR>
);

const SectionHeading = ({ children, font }: { children: React.ReactNode; font: string }) => (
    <TextR style={[tw("text-sm font-bold uppercase tracking-wide mb-1 text-neutral-900 border-b"), {
        lineHeight: 1.1,
        fontFamily: font
    }]}>
        {children}
    </TextR>
);

const Bullet = ({ text }: { text: string }) => (
    <ViewR style={tw("flex-row mb-0.5")}>
        <Text className="text-xs font-normal mr-1.5">•</Text>
        <Text className="text-xs font-normal leading-relaxed text-neutral-800 flex-1">{text}</Text>
    </ViewR>
);

// ─── Main Component ───────────────────────────────────────────────────────────

const ClassicPdf: React.FC<{ data: ResumeData }> = ({ data }) => {
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
            <Page size="A4" style={[tw("text-sm text-black bg-white px-8 py-5"), { fontFamily: activeFont }]}>

                {/* Header */}
                <View className="text-center mb-3">
                    <Heading font={activeFont} className="text-3xl font-bold tracking-tight uppercase">{p.name || "Your Name"}</Heading>
                    <View>
                        <ViewR style={tw("flex-row gap-2 flex-wrap items-center justify-center mt-1")}>
                            {nonEmpty(p.phone) && <Text className="text-2xs">{p.phone}</Text>}
                            {nonEmpty(p.location) && (
                                <>
                                    {nonEmpty(p.phone) && <Text className="text-2xs text-neutral-400">·</Text>}
                                    <Text className="text-2xs">{p.location}</Text>
                                </>
                            )}
                        </ViewR>
                        <ViewR style={tw("flex-row gap-2 flex-wrap items-center justify-center mt-0.5")}>
                            {formattedWebsite && (
                                <LinkR src={formattedWebsite} className="text-2xs">{getDisplayUrl(p.website)}</LinkR>
                            )}
                            {nonEmpty(p.email) && (
                                <>
                                    {formattedWebsite && <Text className="text-2xs text-neutral-400">·</Text>}
                                    <LinkR src={`mailto:${p.email}`} className="text-2xs">{p.email}</LinkR>
                                </>
                            )}
                            {formattedLinkedin && (
                                <>
                                    {(formattedWebsite || nonEmpty(p.email)) && <Text className="text-2xs text-neutral-400">·</Text>}
                                    <LinkR src={formattedLinkedin} className="text-2xs">{getDisplayUrl(p.linkedin)}</LinkR>
                                </>
                            )}
                            {formattedGithub && (
                                <>
                                    {(formattedWebsite || nonEmpty(p.email) || formattedLinkedin) && <Text className="text-2xs text-neutral-400">·</Text>}
                                    <LinkR src={formattedGithub} className="text-2xs">{getDisplayUrl(p.github)}</LinkR>
                                </>
                            )}
                        </ViewR>
                    </View>
                </View>

                {/* Summary */}
                {nonEmpty(summary) && (
                    <View className="mb-3">
                        <SectionHeading font={activeFont}>Summary</SectionHeading>
                        <Text className="text-xs leading-relaxed text-neutral-800">{summary}</Text>
                    </View>
                )}

                {/* Experience */}
                {experience.length > 0 && (
                    <View className="mb-4">
                        <SectionHeading font={activeFont}>Work Experience</SectionHeading>
                        {experience.map((exp) => (
                            <ViewR key={exp.id} style={tw("mb-3")}>
                                <ViewR style={tw("flex-row justify-between items-start mb-0.5")}>
                                    <Text className="text-sm font-bold">{exp.company}{nonEmpty(exp.location) ? ` · ${exp.location}` : ''}</Text>
                                    <Text className="text-xs font-bold">
                                        {exp.startDate} – {exp.current ? 'Present' : (exp.endDate ?? '')}
                                    </Text>
                                </ViewR>
                                <Text className="text-xs italic text-neutral-700 mb-1">{exp.position}</Text>
                                {filterStrings(exp.bullets).length > 0 && (
                                    <ViewR style={tw("pl-3")}>
                                        {filterStrings(exp.bullets).map((line, i) => <Bullet key={i} text={line} />)}
                                    </ViewR>
                                )}
                            </ViewR>
                        ))}
                    </View>
                )}

                {/* Projects */}
                {projects.length > 0 && (
                    <View className="mb-2">
                        <SectionHeading font={activeFont}>Projects</SectionHeading>
                        {projects.map((proj) => {
                            const formattedProjLink = formatUrl(proj.link);
                            return (
                                <ViewR key={proj.id} style={tw("mb-2")}>
                                    <ViewR style={tw("flex-row justify-between items-center mb-0.5")}>
                                        <ViewR style={tw("flex-row items-start gap-2")}>
                                            <Text className="text-sm font-bold">{proj.name}</Text>
                                            {formattedProjLink && (
                                                <LinkR src={formattedProjLink} className="text-xs text-neutral-600">
                                                    {getDisplayUrl(proj.link)}
                                                </LinkR>
                                            )}
                                        </ViewR>
                                        {filterStrings(proj.technologies).length > 0 && (
                                            <Text className="text-2xs text-neutral-600">
                                                {filterStrings(proj.technologies).join(' • ')}
                                            </Text>
                                        )}
                                    </ViewR>
                                    {nonEmpty(proj.description) && (
                                        <Text className="text-xs leading-relaxed text-neutral-800 mb-0.5">{proj.description}</Text>
                                    )}
                                    {filterStrings(proj.bullets).length > 0 && (
                                        <ViewR style={tw("pl-3")}>
                                            {filterStrings(proj.bullets).map((line, i) => <Bullet key={i} text={line} />)}
                                        </ViewR>
                                    )}
                                </ViewR>
                            );
                        })}
                    </View>
                )}

                {/* Skills */}
                {skills.length > 0 && (
                    <View className="mb-3">
                        <SectionHeading font={activeFont}>Skills</SectionHeading>
                        {skills.map((group, i) => (
                            filterStrings(group.items).length > 0 && (
                                <Text key={i} className="text-xs leading-relaxed text-neutral-800">
                                    <TextR style={tw("font-bold")}>{group.category}: </TextR>
                                    {filterStrings(group.items).join(' • ')}
                                </Text>
                            )
                        ))}
                    </View>
                )}

                {/* Education · Certifications · Achievements */}
                {education.length > 0 && (
                    <View className="mb-3">
                        <SectionHeading font={activeFont}>Education</SectionHeading>
                        {education.map((edu) => (
                            <ViewR key={edu.id} wrap={false} style={tw("mb-2.5")}>
                                <ViewR style={tw("flex-row justify-between")}>
                                    <Text className="font-bold text-neutral-900 leading-tight">
                                        {edu.institution}
                                        {nonEmpty(edu.location) ? ` · ${edu.location}` : ''}
                                    </Text>
                                    <Text className="text-2xs text-neutral-800 mt-0.5">
                                        {edu.startDate ?? ''}{edu.startDate && edu.endDate ? ' – ' : ''}{edu.endDate ?? ''}
                                    </Text>
                                </ViewR>
                                <Text className="text-sm text-neutral-800 mt-0.5">
                                    {edu.degree}{nonEmpty(edu.field) ? ` · ${edu.field}` : ''}{nonEmpty(edu.gpa) ? ` | GPA: ${edu.gpa}` : ''}
                                </Text>
                            </ViewR>
                        ))}
                    </View>
                )}

                {certifications && certifications.length > 0 && (
                    <View className="mb-3">
                        <SectionHeading font={activeFont}>Certifications</SectionHeading>
                        {certifications.map((cert) => {
                            const formattedCertLink = formatUrl(cert.link);
                            return (
                                <ViewR key={cert.id} wrap={false} style={tw("mb-2.5")}>
                                    <ViewR style={tw("flex-row justify-between")}>
                                        {formattedCertLink ? (
                                            <LinkR src={formattedCertLink} className="text-sm font-bold text-neutral-900 leading-tight">{cert.name}</LinkR>
                                        ) : (
                                            <Text className="font-bold text-neutral-900 leading-tight">{cert.name}</Text>
                                        )}
                                        <Text className="text-2xs text-neutral-800 mt-0.5">
                                            {cert.date ?? ''}
                                        </Text>
                                    </ViewR>
                                    {nonEmpty(cert.issuer) && (
                                        <Text className="text-sm text-neutral-800 mt-0.5">
                                            {cert.issuer}
                                        </Text>
                                    )}
                                </ViewR>
                            );
                        })}
                    </View>
                )}

                {achievements && achievements.length > 0 && (
                    <View className="mb-3">
                        <SectionHeading font={activeFont}>Achievements</SectionHeading>
                        {achievements.map((ach) => (
                            <ViewR key={ach.id} wrap={false} style={tw("mb-2.5")}>
                                <ViewR style={tw("flex-row justify-between")}>
                                    <Text className="font-bold text-neutral-900 leading-tight">{ach.title}</Text>
                                </ViewR>
                                {nonEmpty(ach.description) && (
                                    <Text className="text-sm text-neutral-800 mt-0.5">{ach.description}</Text>
                                )}
                            </ViewR>
                        ))}
                    </View>
                )}

            </Page>
        </Document>
    );
};

export default ClassicPdf;
