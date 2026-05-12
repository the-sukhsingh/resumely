"use client"
import React from 'react'
import { Document, Page, Text as TextR, View as ViewR, Image, Font, Link } from "@react-pdf/renderer";
import { createTw } from "react-pdf-tailwind";
import { cn } from "@/lib/utils";
import { ResumeData } from '@/types/resume';
import { CORMORANT_GARAMOND_FONT, MONTSERRAT_FONT, LEAGUE_SPARTAN_FONT } from '@/constants/pdf-fonts';

// Register fonts
Font.register({
  family: "Montserrat",
  fonts: MONTSERRAT_FONT,
});

Font.register({
  family: "CormorantGaramond",
  fonts: CORMORANT_GARAMOND_FONT,
});

Font.register({
  family: "League Spartan",
  fonts: LEAGUE_SPARTAN_FONT,
})

const tw = createTw({
  theme: {
    fontFamily: {
      default: ["Montserrat"],
      cormorant: ["CormorantGaramond"],
      "league-spartan": ["League Spartan"],
    },
    extend: {
      colors: {
        background: "#e8e4d8d6",
      },
      fontSize: {
        "2xs": "0.625rem",
        "3xs": "0.5rem",
      },
    },
  },
});




const DesignerPdf: React.FC<{ data: ResumeData }> = ({ data }) => {

  const {
    personalInfo,
    achievements,
    certifications,
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
      <Page size="A4" style={tw(cn("text-sm text-black bg-[#e8e4d8d6] px-12 py-6"))}>
        {/* Header */}
        <View className="mb-8">
          <TextR style={[tw(cn("text-8xl text-center font-bold mb-4 tracking-tight leading-none scale-y-125")), {
            fontFamily: "CormorantGaramond",
            lineHeight: 1,
            letterSpacing: "-0.05rem",
          }]}>
            {personalInfo.fullName || "Morgan Maxwell"}
          </TextR>
          <ViewR style={[tw(cn("flex-row justify-between items-center text-xs uppercase tracking-wider ")), {
            fontFamily: "League Spartan"
          }]}>
            <Text className="text-[8px]">{personalInfo.headline || ""}</Text>
            {social.website && (<Link src={String(url) || "/editor"} style={[tw(cn("text-black text-[8px]")), {
              textDecoration: "none"
            }]} >{
                url.hostname
              } </Link>)}
          </ViewR>
        </View>

        {/* Main Content Grid */}
        <View className="flex-row gap-8 mb-8">
          {/* Left Column - Summary */}
          <View className="w-1/3 justify-center items-center">
            <Text className="text-xs leading-relaxed text-justify">
              {summary}
            </Text>
          </View>

          {/* Center Column - Photo */}
          <View className="w-1/3 flex justify-center">

            <View
              className="w-48 h-48 overflow-hidden flex items-center justify-center rounded-lg"
            >
              {personalInfo.image && (<Image
                src={personalInfo.image || ""}
                style={tw(cn("w-full h-full object-cover "))}
              />)}
            </View>
          </View>

          {/* Right Column - Contact */}
          <View className="w-1/3 text-xs gap-2 justify-center">

            {social.email && (
              <View className="py-2 border-b border-black">
                <Text className=" font-semibold mb-1" font="League Spartan">EMAIL</Text>
                <Link src={`mailto:${social.email}`} style={[tw(cn("text-black")), {
                  textDecoration: "none"
                }]} >
                  <Text>{social.email}</Text>
                </Link>
              </View>
            )}
            {personalInfo.phone && (
              <View className="py-2 border-b border-black">
                <Text className="font-semibold mb-1" font="League Spartan">PHONE</Text>
                <Link src={`tel:${personalInfo.phone}`} style={[tw(cn("text-black")), {
                  textDecoration: "none"
                }]} >
                  <Text>{personalInfo.phone}</Text>
                </Link>
              </View>
            )}
            {
              (personalInfo.location || personalInfo.country) && (
                <View className="">
                  <Text className="font-semibold mb-1" font="League Spartan">ADDRESS</Text>
                  <Text>{personalInfo.location}, {personalInfo.country} </Text>
                </View>
              )}
          </View>
        </View>

        {/* Work Experience */}
        {experience.length > 0 && (
          <View className="mb-8">
            <Heading>WORK EXPERIENCE</Heading>
            <View className="grid grid-cols-3 gap-6">
              {experience.map((exp, idx) => (
                <View key={exp.id} className="text-xs font-montserrat">
                  <Text className="font-league-spartan font-semibold uppercase text-sm mb-1" font='League Spartan'>
                    {exp.company} | {exp.position}
                  </Text>
                  <Text className='mb-2'>{exp.startDate}-{exp.current ? 'Present' : exp.endDate}</Text>
                  <View className="text-justify leading-relaxed">
                    {exp.description || "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam pharetra in lorem at laoreet."}
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}



        {/* Projects */}
        {projects.length > 0 && (
          <View className="mb-8">
            <Heading>PROJECTS</Heading>
            <View className="flex-row flex-wrap gap-y-6">
              {projects.map((proj, idx) => (
                <View key={proj.id} className={cn("w-1/3 text-xs px-3 ",
                  idx === 0 && "pl-0 ",
                  idx === 2 && "pr-0 ",
                  idx === 3 && "pl-0 ",
                  idx === 5 && "pr-0 "
                )}>
                  <Link href={proj.link ? proj.link : "/editor"} style={[tw(cn("text-sm mb-1")), {
                    textDecoration: "none",
                    fontFamily: "League Spartan"
                  }]}>
                    <Text className="font-semibold text-black uppercase " font="League Spartan">{proj.name}</Text>
                  </Link>
                  <Text className="italic mb-1">{proj.technologies.join(" ")}</Text>
                  <Text className="leading-relaxed">
                    {proj.description || "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam pharetra in lorem at laoreet."}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}



        {/* Bottom Grid - Languages, Skills, Education */}
        <View className="flex-row gap-8 mb-8">
          {/* Languages */}
          {
            languages.length > 0 && (
              <View className='w-1/3'>
                <Heading>LANGUAGES</Heading>
                <View className="gap-2 text-sm ">
                  {languages.map((lang, idx) => (
                    <View key={idx} className="items-start justify-start">
                      <TextR key={idx} style={[tw(cn("relative")), {
                        fontFamily: "Montserrat"
                      }]}>{lang}</TextR>
                    </View>
                  ))
                  }
                </View>
              </View>
            )}

          {/* Skills */}
          {skills.length > 0 && (
            <View className='w-1/3'>
              <Heading>SKILLS</Heading>
              <View className="gap-2 text-sm ">
                {skills.map((skill, idx) => (
                  <ViewR key={idx} style={[tw(cn("relative")), {
                    fontFamily: "Montserrat"
                  }]}>
                    <ViewR style={tw(cn("w-1.5 h-1.5 bg-black rounded-full absolute left-[-10px] top-[5px]"))} />
                    <TextR>{skill}</TextR>
                  </ViewR>
                ))
                }
              </View>
            </View>
          )}

          {/* Education */}
          {education.length > 0 && (

            <View className='w-1/3'>
              <Heading>EDUCATION</Heading>
              <View className="gap-3 text-xs ">
                {education.map((edu) => (
                  <View key={edu.id} className="flex-row justify-between">
                    <View className=''>
                      <Text className="text-sm uppercase font-semibold">{edu.institution}</Text>
                      <Text className="text-xs">{edu.degree} - {edu.field}</Text>
                    </View>
                    <Text font="League Spartan">{edu.startDate}-{edu.current ? 'Present' : edu.endDate}</Text>
                  </View>
                ))
                }
              </View>
            </View>
          )}
        </View>



        {/* Achievements and certifications */}
        <View className="flex-row gap-4">
          {/* Achievements */}
          {achievements.length > 0 && (
            <View className='w-1/3'>
              <Heading>ACHIEVEMENTS</Heading>
              <View className="text-xs gap-2 ">
                {achievements.map((achievement) => (
                  <View key={achievement.id}>
                    <Text className="text-sm font-semibold uppercase" font="League Spartan">{achievement.title}</Text>
                    <Text className="leading-relaxed">{achievement.description}</Text>
                  </View>
                ))
                }
              </View>
            </View>
          )}


          {/* certifications */}
          {certifications.length > 0 && (

            <View className="w-2/3 relative">
              <Heading>certifications</Heading>
              <View className="flex-row flex-wrap gap-y-3">
                {certifications.map((cert) => (
                  <View key={cert.id} className="text-xs w-1/3">
                    <Text className="text-sm font-semibold uppercase mb-1" font="League Spartan">{cert.name}</Text>
                    <Text className="italic mb-2">{cert.date}</Text>
                    <Text className="leading-relaxed">
                      {cert.issuer || "Lorem ipsum dolor sit amet, consectetur adipiscing elit."}
                    </Text>
                  </View>
                ))}

              </View>
            </View>
          )}
        </View>


      </Page>
    </Document>
  )
}


const View = ({ children, className, font }: { children: React.ReactNode, className?: string, font?: string }) => (
  <ViewR style={[tw(cn("flex flex-col", className)), {
    fontFamily: font || "Montserrat",
  }]}>
    {children}
  </ViewR>
)

const Text = ({ children, className, font }: { children: React.ReactNode, className?: string, font?: string }) => (
  <TextR style={[tw(cn("text-sm text-left", className)), {
    fontFamily: font || "Montserrat",
  }]}>
    {children}
  </TextR>
);

const Heading = ({ children, className }: { children: React.ReactNode, className?: string }) => (
  <TextR style={[tw(cn("text-2xl font-semibold mb-3 tracking-tighter", className)), {
    fontFamily: "CormorantGaramond",
    lineHeight: 1,
  }]}>{children}</TextR>

);

export default DesignerPdf