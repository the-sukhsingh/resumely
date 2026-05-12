"use client"
import React from 'react'
import { Document, Page, Text as TextR, View as ViewR, Font, Link, Svg, Line } from "@react-pdf/renderer";
import { GEIST_FONT, GEIST_MONO_FONT } from "@/constants/pdf-fonts";
import { createTw } from "react-pdf-tailwind";
import { cn } from "@/lib/utils";
import { ResumeData } from '@/types/resume';

// Register fonts
Font.register({
    family: "GeistMono",
    fonts: GEIST_MONO_FONT,
});


Font.register({
    family: "Geist",
    fonts: GEIST_FONT,
});


const tw = createTw({
    theme: {
        fontFamily: {
            default: ["Geist"],
            geistmono: ["GeistMono"],
        },
        extend: {
            colors: {
                background: "#040404",
                borderColor: "#262626",
            },
            fontSize: {
                "2xs": "0.625rem",
                "3xs": "0.5rem",
            },
        },
    },
});

let darkTheme = false;


const VercelPdf: React.FC<{ data: ResumeData }> = ({ data }) => {
    darkTheme = data.darkTheme;
    if (!data) {
        return (
            <Document>
                <Page size="A4" style={tw(cn("font-default text-sm text-white bg-[#040404]"))}>
                    <ViewR style={tw(cn("flex-1 justify-center items-center"))}>
                        Loading...
                    </ViewR>
                </Page>
            </Document>
        )
    }
    const {
        personalInfo,
        achievements,
        certificates,
        education,
        experience,
        languages,
        projects,
        skills,
        social,
        summary
    } = data;

    const url = new URL(social.website || "https://www.google.com")


    return (
        <Document
            title={`Resume-${data.personalInfo.fullName}`}
            author={data.personalInfo.fullName || "Unknown"}
            creator={data.personalInfo.fullName || "Unknown"}
            producer="Resumely"
        >
            <Page size="A4" style={tw(cn("font-default text-sm text-white ",
                darkTheme ? "bg-[#040404]" : "bg-white "
            ))}>
                <View className='flex-row w-full justify-between items-end border-b px-5 pb-2 pt-6 '>
                    <View className="">
                        <Text className={cn("mb-2 text-5xl font-bold leading-none tracking-tight",
                            darkTheme ? "text-white" : "text-black"
                        )}>
                            {personalInfo.fullName || "Your Name"}
                        </Text>
                        {personalInfo.headline && (
                            <TextR
                                style={[tw(cn("text-sm font-geistmono font-light uppercase",
                                    darkTheme ? "text-neutral-300" : "text-neutral-800"
                                )),
                                {
                                    letterSpacing: "0.18rem",
                                    fontFamily: "GeistMono",
                                }
                                ]}>
                                {personalInfo.headline}
                            </TextR>
                        )}
                    </View>
                    {/* Website */}
                    {social.website && (

                        <Link src={social.website || `https://${url.hostname}`} style={[tw(cn("text-xs mb-0.5 font-geistmono uppercase tracking-[0.16em] transition-colors",
                            darkTheme ? "text-white" : "text-black"
                        )),
                        {
                            textDecoration: "none",
                            letterSpacing: "0.16rem",
                            fontFamily: "GeistMono",
                        }]}>
                            {url.hostname.replace("www.", "")}
                        </Link>
                    )}

                </View>
                {personalInfo.location || personalInfo.phone || social.email || social.github || social.linkedin || social.twitter || personalInfo.country || personalInfo.location || personalInfo.phone ? (<View className="flex flex-row items-center justify-between border-b px-5 py-1.5 text-[8px]">
                    {/* Quick Links Bar */}
                    <View className="flex flex-row flex-nowrap items-center">
                        {social.email && (
                            <SocialLink url={`mailto:${social.email}`} className="border-l">
                                Email
                            </SocialLink>
                        )}
                        {social.github && (
                            <SocialLink url={social.github}>
                                GitHub
                            </SocialLink>
                        )}
                        {social.linkedin && (
                            <SocialLink url={social.linkedin}>
                                LinkedIn
                            </SocialLink>
                        )}
                        {social.twitter && (
                            <SocialLink url={social.twitter}>
                                Twitter
                            </SocialLink>
                        )}
                        {social.medium && (
                            <SocialLink url={social.medium}>
                                Medium
                            </SocialLink>
                        )}
                        {social.instagram && (
                            <SocialLink url={social.instagram}>
                                Instagram
                            </SocialLink>
                        )}
                    </View>

                    <View className='flex-row justify-end gap-1'>
                        {personalInfo.location && (
                            <Text >{personalInfo.location}{personalInfo.country ? `, ${personalInfo.country}` : ''}</Text>
                        )}
                        {personalInfo.phone && (
                            <Text>{personalInfo.phone}</Text>
                        )}
                    </View>

                </View>) : null}

                {/* About Section */}
                {summary && (
                    <View className="px-5 py-4 border-b">
                        <Heading className="mb-3">
                            About
                        </Heading>
                        <Text className="max-w-4xl text-base text-balance ">
                            {summary}
                        </Text>
                    </View>
                )}


                {/* Experience Section */}
                {experience.length > 0 && (
                    <>
                        <View className="pt-4">
                            <Heading className="mb-4 ml-5">
                                Experience
                            </Heading>
                            <View className="flex-row flex-wrap gap-y-0 border-y bg-black/30">
                                {experience.map((exp) => (
                                    <View
                                        key={exp.id}
                                        className="w-1/2 border-r gap-4 border-b px-5 max-h-30 overflow-hidden py-4 last:border-b-0"
                                    >

                                        <View className="min-w-0 gap-y-2">
                                            <View className="flex-row items-start justify-between gap-4">
                                                <View className="min-w-0">
                                                    <Text className="text-lg font-semibold leading-none">
                                                        {exp.position}
                                                    </Text>
                                                    <Text className={cn("mt-1 text-sm", darkTheme ? "text-neutral-300" : "text-neutral-600")}>
                                                        {exp.company}
                                                    </Text>

                                                </View>
                                                <View className={cn("shrink-0 gap-y-1 items-end text-xs font-geistmono uppercase tracking-[0.16em] ")}>
                                                    <TextR style={[tw(cn("text-xs tracking-[0.2em] text-neutral-300 text-right", darkTheme ? "text-neutral-400" : "text-neutral-800")), {
                                                        fontFamily: "Geist",
                                                        letterSpacing: "0.2rem",
                                                    }]}>
                                                        {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                                                    </TextR>
                                                    {exp.location && (
                                                        <TextR style={[tw(cn("text-xs tracking-[0.2em] text-neutral-300 ", darkTheme ? "text-neutral-400" : "text-neutral-800")), {
                                                            fontFamily: "Geist",
                                                            letterSpacing: "0.2rem",
                                                        }]}>
                                                            {exp.location}
                                                        </TextR>
                                                    )}
                                                </View>
                                            </View>

                                            <Text className={cn("line-clamp-2 wrap-break-word text-sm leading-6", darkTheme ? "text-neutral-300" : "text-neutral-700")} >
                                                {exp.description}
                                            </Text>
                                        </View>
                                    </View>
                                ))}
                                {
                                    (experience.length % 2 === 1) && (
                                        <View className="w-1/2 h-28">
                                            <Svg style={tw(cn("w-full"))} preserveAspectRatio='none' viewBox={'0 0 400 200'}>
                                                {Array.from({ length: 100 }).map((_, i) => (
                                                    <Line
                                                        key={i}
                                                        x1={i * 12 - 200}
                                                        y1={208}
                                                        x2={i * 12}
                                                        y2={-8}
                                                        stroke="#525252"
                                                        strokeWidth={projects.length === 1 ? 0.24 : 0.3}
                                                    />
                                                ))}
                                            </Svg>
                                        </View>
                                    )
                                }
                            </View>
                        </View>
                    </>
                )}




                {/* Projects Section */}
                {projects.length > 0 && (
                    <>
                        <View className="border-b">
                            <Heading className="my-4 ml-5">
                                Projects
                            </Heading>
                            <View className="flex flex-row flex-wrap bg-black/20">
                                {projects.map((project, idx) => (
                                    <ViewR
                                        key={project.id}
                                        style={tw(cn("w-1/3 flex flex-row min-h-40 flex-col gap-1 pl-5 pr-3 py-4",
                                            "border-t",
                                            darkTheme ? "border-neutral-800" : "border-neutral-300",
                                            (idx === 0 || idx === 1 || idx === 3 || idx === 4) && "border-r",
                                        ))}
                                    >
                                        <View className="flex flex-row items-start justify-between gap-3 mb-1">
                                            <Text className="text-lg font-semibold leading-none">
                                                {project.name}
                                            </Text>
                                            {project.link && (
                                                <Link
                                                    src={project.link}
                                                    style={[tw(cn("shrink-0 px-2 py-1 font-geistmono text-[8px] uppercase", darkTheme ? "text-neutral-300" : "text-neutral-700",)),
                                                    {
                                                        textDecoration: "none",
                                                        letterSpacing: "0.18rem",
                                                        fontFamily: "GeistMono",
                                                    }
                                                    ]}
                                                >
                                                    View
                                                </Link>
                                            )}
                                        </View>
                                        <Text className={cn("min-h-16 text-sm leading-5", darkTheme ? "text-neutral-300" : "text-neutral-700")} >
                                            {project.description}
                                        </Text>
                                        {project.technologies.length > 0 && (
                                            <View className="mt-auto flex flex-row flex-wrap gap-2">
                                                {project.technologies.slice(0, 3).map((tech, idx) => (
                                                    <View
                                                        key={idx}
                                                        className={cn("border",
                                                            darkTheme ? "bg-black" : "bg-neutral-100"
                                                        )}
                                                    >
                                                        <TextR style={[tw(cn("font-geistmono text-[9px] px-1.5 py-1 uppercase", darkTheme ? "text-neutral-300" : "text-neutral-700")),
                                                        {
                                                            letterSpacing: "0.05rem",
                                                            fontFamily: "GeistMono",
                                                        }
                                                        ]}>{tech}</TextR>
                                                    </View>
                                                ))}
                                            </View>
                                        )}
                                    </ViewR>
                                ))}

                                {projects.length > 0 && (
                                    projects.length % 3 !== 0
                                ) && (
                                        <ViewR style={[tw(cn("border-t", darkTheme ? "border-neutral-800" : "border-neutral-300"
                                        )), {
                                            width: projects.length === 1 ? "66.66%" : projects.length === 2 ? "33.33%" : projects.length === 4 ? "66.66%" : "33.33%",
                                        }]} >
                                            <Svg height="120" width="100%" preserveAspectRatio='none' viewBox={projects.length === 1 ? '0 0 400 200' : '0 0 250 200'}>
                                                {Array.from({ length: 100 }).map((_, i) => (
                                                    <Line
                                                        key={i}
                                                        x1={i * (projects.length === 1 ? 8 : 10) - 200} // single - 11
                                                        y1={208}
                                                        x2={i * (projects.length === 1 ? 8 : 10)} // single - 11
                                                        y2={-8}
                                                        stroke="#525252"
                                                        strokeWidth={projects.length === 1 ? 0.24 : 0.3}
                                                    />
                                                ))}
                                            </Svg>
                                        </ViewR>
                                    )}
                            </View>
                        </View>
                    </>
                )}

                {/* Skills and Languages */}
                {skills.length > 0 || languages.length > 0 ? (<View className="flex flex-row border-b">

                    {/* Skills Section */}
                    {skills.length > 0 && (
                        <>
                            <View className="w-1/2 border-r  py-4">
                                <Heading className="mb-3 ml-5">
                                    Skills
                                </Heading>
                                <View className="flex flex-row flex-wrap gap-x-3 gap-y-1.5 ml-5">
                                    {skills.map((skill, idx) => (
                                        <View
                                            key={idx}
                                        >
                                            <TextR style={[tw(cn("text-[8px] uppercase tracking-[0.16em]", darkTheme ? "text-white" : "text-black")),
                                            {
                                                letterSpacing: "0.16rem",
                                            }
                                            ]}>{skill}</TextR>
                                        </View>
                                    ))}
                                </View>
                            </View>
                        </>
                    )}

                    {/* Languages Section */}
                    {languages.length > 0 && (
                        <>
                            <View className="w-1/2 py-4">
                                <Heading className="mb-3 ml-5">
                                    Languages
                                </Heading>
                                <View className="flex flex-row flex-wrap gap-x-3 gap-y-1.5 ml-5">
                                    {languages.map((language, idx) => (
                                        <View key={idx} >
                                            <TextR style={[tw(cn("text-[8px] uppercase tracking-[0.16em]", darkTheme ? "text-white" : "text-black")),
                                            {
                                                letterSpacing: "0.16rem",
                                            }
                                            ]}>{language}</TextR>
                                        </View>
                                    ))}
                                </View>
                            </View>
                        </>
                    )}
                </View>) : null}


                {/* Education, Certificates, and Achievements */}
                {education.length > 0 || certificates.length > 0 || achievements.length > 0 ? (<View className="flex flex-row border-b">
                    {/* Education Section */}
                    {education.length > 0 && (
                        <View className="w-1/3 border-r p-5">
                            <Heading className="mb-4">
                                Education
                            </Heading>
                            <View className="gap-4">
                                {education.map((edu) => (
                                    <View key={edu.id} className="gap-0.5">
                                        <View className=" flex flex-row items-center justify-between gap-3">
                                            <Text className="text-sm font-semibold ">
                                                {edu.institution}
                                            </Text>
                                            <TextR style={[tw(cn("shrink-0 text-[8px] uppercase tracking-[0.16em] font-geistmono",
                                                darkTheme ? "text-neutral-300" : "text-neutral-800"
                                            )),
                                            {
                                                letterSpacing: "0.16rem",
                                                fontFamily: "GeistMono",
                                            }
                                            ]}>
                                                {edu.startDate} — {edu.current ? 'Present' : edu.endDate}
                                            </TextR>
                                        </View>
                                        <View className="flex flex-row items-center justify-between gap-3">

                                            <Text className={cn("text-xs leading-5", darkTheme ? "text-neutral-300" : "text-neutral-700")} >
                                                {edu.degree} - {edu.field}
                                            </Text>
                                            <TextR style={[tw(cn("shrink-0 text-[8px] uppercase tracking-[0.16em] font-geistmono",
                                                darkTheme ? "text-neutral-300" : "text-neutral-800"
                                            )),
                                            {
                                                letterSpacing: "0.16rem",
                                                fontFamily: "GeistMono",
                                            }
                                            ]}>
                                                {edu.gpa && `GPA: ${edu.gpa}`}
                                            </TextR>
                                        </View>
                                    </View>
                                ))}
                            </View>
                        </View>
                    )}

                    {/* Certificates Section */}
                    {certificates.length > 0 && (
                        <View className="w-1/3 border-r p-5">
                            <Heading className="mb-4">
                                Certificates
                            </Heading>
                            <View className="gap-4">
                                {certificates.map((cert) => (
                                    <View key={cert.id} className="gap-0.5">
                                        <View className="flex flex-row items-center justify-between gap-2">
                                            <Text className="text-sm font-semibold">
                                                {cert.name}
                                            </Text>
                                            <TextR style={[tw(cn("shrink-0 text-[8px] uppercase tracking-[0.16em] font-geistmono",
                                                darkTheme ? "text-neutral-300" : "text-neutral-800"
                                            )),
                                            {
                                                letterSpacing: "0.16rem",
                                                fontFamily: "GeistMono",
                                            }
                                            ]}>
                                                {cert.date}
                                            </TextR>
                                        </View>
                                        <Text className={cn("text-xs leading-5", darkTheme ? "text-neutral-300" : "text-neutral-700")} >
                                            {cert.issuer}
                                        </Text>

                                    </View>
                                ))}
                            </View>
                        </View>
                    )}

                    {/* Achievements Section */}
                    {achievements.length > 0 && (
                        <View className="w-1/3 p-5">
                            <Heading className="mb-4">
                                Achievements
                            </Heading>
                            <View className="gap-4">
                                {achievements.map((achievement) => (
                                    <View key={achievement.id} className="gap-0.5">
                                        <Text className="text-sm font-semibol">
                                            {achievement.title}
                                        </Text>
                                        <Text className={cn("text-xs leading-5", darkTheme ? "text-neutral-300" : "text-neutral-700")} >
                                            {achievement.description}
                                        </Text>
                                    </View>
                                ))}
                            </View>
                        </View>
                    )}

                </View>) : null}

                {/* Declaration Section */}
                {data.declaration?.show && data.declaration.declaration && (
                    <View className="border-b px-5 py-4">
                        <Heading className="mb-3">
                            Declaration
                        </Heading>
                        <Text className="text-sm leading-6 mb-3">
                            {data.declaration.declaration}
                        </Text>
                        {(data.declaration.dated || data.declaration.location) && (
                            <View className="flex-row justify-between items-center">
                                {data.declaration.location && (
                                    <TextR style={[tw(cn("text-[8px] uppercase tracking-[0.16em] font-geistmono",
                                        darkTheme ? "text-neutral-300" : "text-neutral-700"
                                    )),
                                    {
                                        letterSpacing: "0.16rem",
                                        fontFamily: "GeistMono",
                                    }
                                    ]}>
                                        Place: {data.declaration.location}
                                    </TextR>
                                )}
                                {data.declaration.dated && (
                                    <TextR style={[tw(cn("text-[8px] uppercase tracking-[0.16em] font-geistmono",
                                        darkTheme ? "text-neutral-300" : "text-neutral-700"
                                    )),
                                    {
                                        letterSpacing: "0.16rem",
                                        fontFamily: "GeistMono",
                                    }
                                    ]}>
                                        Date: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                                    </TextR>
                                )}
                            </View>
                        )}
                    </View>
                )}

                {
                    (data.declaration?.show && !data?.declaration?.show) &&
                    (experience.length !== 0 || projects.length !== 0) &&
                    (skills.length !== 0 || languages.length !== 0) &&
                    (certificates.length !== 0 || achievements.length !== 0 || education.length !== 0) &&
                    (summary && summary.trim() !== "") && (
                        <ViewR style={tw(cn("flex-1 relative",
                        ))} >
                            <Svg preserveAspectRatio='none' viewBox='0 0 600 200' style={tw(cn("h-full w-full absolute top-0 left-0"))}>
                                {Array.from({ length: 100 }).map((_, i) => (
                                    <Line
                                        key={i}
                                        x1={i * 8 - 200}
                                        y1={208}
                                        x2={i * 8}
                                        y2={-8}
                                        stroke="#525252"
                                        strokeWidth={0.24}
                                    />
                                ))}
                            </Svg>
                        </ViewR>
                    )
                }
            </Page>
        </Document>
    )
}

const View = ({ children, className }: { children: React.ReactNode, className?: string }) => (
    <ViewR style={tw(cn("flex flex-col", darkTheme ? "border-neutral-800" : "border-neutral-300", className))}>
        {children}
    </ViewR>
)

const Text = ({ children, className, font }: { children: React.ReactNode, className?: string, font?: string }) => (
    <TextR style={[tw(cn("text-sm ", darkTheme ? "text-white" : "text-black", className)),
    {
        fontFamily: font || "Geist",
    }
    ]}>
        {children}
    </TextR>
);

const Heading = ({ children, className }: { children: React.ReactNode, className?: string }) => (
    <TextR style={[tw(cn("text-sm uppercase tracking-wider mb-2", darkTheme ? "text-neutral-200" : "text-neutral-800", className)),
    {
        letterSpacing: "0.05rem",
        fontFamily: "GeistMono",
    }
    ]}>
        {children}
    </TextR>
);

const SocialLink = ({ url, children, className }: { url: string, children: React.ReactNode, className?: string }) => (
    <Link
        href={url}
        src={url}
        style={[tw(cn("relative border-r px-2 py-0.5  font-geistmono text-[8px] uppercase tracking-[0.18em] transition-colors ", darkTheme ? "text-white border-neutral-800" : "text-black border-neutral-300", className)),
        {
            textDecoration: "none",
            letterSpacing: "0.1rem",
            fontFamily: "GeistMono",
        }
        ]}
    >
        <TextR style={tw(cn("mt-1"))}>{children}</TextR>
    </Link>
);

export default VercelPdf