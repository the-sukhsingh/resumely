"use client"
import React from 'react';
import { ResumeData } from '@/types/resume';
import { Document, Page, Text as TextR, View as ViewR, Font, Link } from "@react-pdf/renderer";
import { createTw } from "react-pdf-tailwind";
import { cn } from "@/lib/utils";
import { INTER_FONT } from '@/constants/pdf-fonts';

Font.register({ family: "Inter", fonts: INTER_FONT });

const tw = createTw({
    theme: {
        fontFamily: { default: ["Inter"], inter: ["Inter"] },
        extend: {
            fontSize: { "2xs": "0.625rem", "3xs": "0.5rem" },
        },
    },
});

const nonEmpty = (v?: string | null): v is string => !!v && v.trim().length > 0;
const filterStrings = (arr: (string | null)[]): string[] => arr.filter(nonEmpty);

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

const Heading = ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <TextR style={[tw(cn("text-lg font-bold", className)), { lineHeight: 1.2 }]}>{children}</TextR>
);

const SectionHeading = ({ children }: { children: React.ReactNode }) => (
    <ViewR style={tw("border-b border-neutral-400 mb-2 pb-1")}>
        <TextR style={tw("text-[13px] font-bold uppercase tracking-widest text-neutral-900")}>
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
    if (!data) {
        return (
            <Document>
                <Page size="A4" style={tw("font-default text-sm bg-white")}>
                    <ViewR style={tw("flex-1 justify-center items-center")}>
                        <TextR>Loading...</TextR>
                    </ViewR>
                </Page>
            </Document>
        );
    }

    const { personalInfo: p, summary, experience, education, skills, projects, certifications, achievements } = data;

    const getPathname = (url?: string | null) => {
        if (!url) return null;
        try { return new URL(url).pathname; } catch { return null; }
    };

    const getHostname = (url?: string | null) => {
        if (!url) return null;
        try { return new URL(url).hostname; } catch { return null; }
    };

    const linkedinPath = getPathname(p.linkedin);
    const githubPath = getPathname(p.github);
    const websiteHost = getHostname(p.website);

    return (
        <Document
            title={`Resume-${p.name}`}
            author={p.name || "Unknown"}
            creator={p.name || "Unknown"}
            producer="Resumely"
        >
            <Page size="A4" style={tw("font-default text-sm text-black bg-white px-8 py-6 flex-row gap-6")}>

                {/* ─── Left Column (60%) ─── */}
                <ViewR style={tw("w-[60%] flex flex-col")}>

                    {/* Header: Personal Info */}
                    <View className="mb-4">
                        <Heading className="text-3xl font-semibold tracking-tight uppercase mb-2">{p.name || "Your Name"}</Heading>
                        <ViewR style={tw("flex-col gap-0.5")}>
                            {nonEmpty(p.phone) && <Text className="text-2xs">{p.phone}{nonEmpty(p.location) && `, ${p.location}`}</Text>}
                            {nonEmpty(p.website) && websiteHost && (
                                <LinkR src={p.website!} className="text-2xs">{websiteHost}</LinkR>
                            )}
                            {nonEmpty(p.email) && <LinkR src={`mailto:${p.email}`} className="text-2xs">{p.email}</LinkR>}
                            {nonEmpty(p.linkedin) && linkedinPath && linkedinPath.length > 1 && (
                                <LinkR src={p.linkedin!} className="text-2xs">linkedin.com{linkedinPath}</LinkR>
                            )}
                            {nonEmpty(p.github) && githubPath && githubPath.length > 1 && (
                                <LinkR src={p.github!} className="text-2xs">github.com{githubPath}</LinkR>
                            )}
                        </ViewR>
                    </View>

                    {/* Projects */}
                    {projects.length > 0 && (
                        <View className="mb-4">
                            <SectionHeading>Projects</SectionHeading>
                            <ViewR style={tw("flex flex-col gap-3")}>
                                {projects.map((proj) => (
                                    <ViewR key={proj.id}>
                                        <ViewR style={tw("flex-row justify-between items-start mb-0.5")}>
                                            <ViewR style={tw("flex-col gap-0.5")}>
                                                <Text className="text-sm font-bold">{proj.name}</Text>
                                                {nonEmpty(proj.link) && (
                                                    <LinkR src={proj.link!} className="text-2xs">
                                                        {getHostname(proj.link!) || proj.link}
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
                                ))}
                            </ViewR>
                        </View>
                    )}

                </ViewR>

                {/* ─── Right Column (40%) ─── */}
                <ViewR style={tw("w-[40%] flex flex-col")}>

                    {/* Summary (About) */}
                    {nonEmpty(summary) && (
                        <View className="mb-4">
                            <SectionHeading>About</SectionHeading>
                            <Text className="text-xs leading-relaxed text-neutral-800">{summary}</Text>
                        </View>
                    )}

                    {/* Experience */}
                    {experience.length > 0 && (
                        <View className="mb-4">
                            <SectionHeading>Experience</SectionHeading>
                            <ViewR style={tw("flex flex-col gap-3")}>
                                {experience.map((exp) => (
                                    <ViewR key={exp.id}>
                                        <ViewR style={tw("flex-row justify-between items-start mb-0.5")}>
                                        <Text className="text-sm font-bold">{exp.company}</Text>
                                        <Text className="text-xs italic text-neutral-700 mb-0.5">{exp.position}</Text>
                                        </ViewR>
                                        <ViewR style={tw("flex-row justify-between items-center mb-1")}>
                                            {nonEmpty(exp.location) && (
                                                <Text className="text-2xs text-neutral-600">{exp.location}</Text>
                                            )}
                                            <Text className="text-2xs text-neutral-600">
                                                {exp.startDate} – {exp.current ? 'Present' : (exp.endDate ?? '')}
                                            </Text>
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

                    {/* Education */}
                    {education.length > 0 && (
                        <View className="mb-4">
                            <SectionHeading>Education</SectionHeading>
                            <ViewR style={tw("flex flex-col gap-3")}>
                                {education.map((edu) => (
                                    <ViewR key={edu.id} style={tw("flex-row justify-between items-start")}>
                                        <View>
                                            <Text className="text-sm font-bold">{edu.institution}</Text>
                                            <Text className="text-xs">{edu.degree}{nonEmpty(edu.field) ? ` · ${edu.field}` : ''}</Text>
                                            {nonEmpty(edu.location) && <Text className="text-2xs text-neutral-600">{edu.location}</Text>}
                                        </View>
                                        <View>
                                            {(nonEmpty(edu.startDate) || nonEmpty(edu.endDate)) && (
                                                <Text className="text-2xs text-neutral-700">
                                                    {edu.startDate ?? ''}{edu.startDate && edu.endDate ? ' – ' : ''}{edu.endDate ?? ''}
                                                </Text>
                                            )}
                                            {nonEmpty(edu.gpa) && <Text className="text-2xs text-neutral-700">GPA: {edu.gpa}</Text>}
                                        </View>
                                    </ViewR>
                                ))}
                            </ViewR>
                        </View>
                    )}

                    {/* Skills */}
                    {skills.length > 0 && (
                        <View className="mb-4">
                            <SectionHeading>Skills</SectionHeading>
                            <ViewR style={tw("flex flex-col gap-1.5")}>
                                {skills.map((group, i) => (
                                    filterStrings(group.items).length > 0 && (
                                        <ViewR key={i}>
                                            <Text className="text-xs font-bold mb-0.5">{group.category}</Text>
                                            <Text className="text-xs leading-relaxed text-neutral-800">
                                                {filterStrings(group.items).join(' • ')}
                                            </Text>
                                        </ViewR>
                                    )
                                ))}
                            </ViewR>
                        </View>
                    )}

                    {/* Certifications */}
                    {certifications && certifications.length > 0 && (
                        <View className="mb-4">
                            <SectionHeading>Certifications</SectionHeading>
                            <ViewR style={tw("flex flex-col gap-2")}>
                                {certifications.map((cert) => (
                                    <ViewR key={cert.id} style={tw("flex-row justify-between items-start")}>
                                        <View className="gap-0.5">
                                            {nonEmpty(cert.link) ? (
                                                <LinkR src={cert.link!} className="text-sm font-bold">{cert.name}</LinkR>
                                            ) : (
                                                <Text className="text-sm font-bold">{cert.name}</Text>
                                            )}
                                            <Text className="text-xs text-neutral-700">{cert.issuer}</Text>
                                        </View>
                                        {nonEmpty(cert.date) && <Text className="text-2xs text-neutral-500">{cert.date}</Text>}
                                    </ViewR>
                                ))}
                            </ViewR>
                        </View>
                    )}

                    {/* Achievements */}
                    {achievements && achievements.length > 0 && (
                        <View className="mb-4">
                            <SectionHeading>Achievements</SectionHeading>
                            <ViewR style={tw("flex flex-col gap-2")}>
                                {achievements.map((ach) => (
                                    <ViewR key={ach.id}>
                                        <Text className="text-sm font-bold mb-0.5">{ach.title}</Text>
                                        <Text className="text-xs text-neutral-800 leading-relaxed">{ach.description}</Text>
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
