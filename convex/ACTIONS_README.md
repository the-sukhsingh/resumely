# Convex Actions - Agent Tools

All agent tools are implemented as Convex actions for seamless integration with the backend.

## 📁 File Structure

```
convex/
├── resumeActions.ts          # Resume CRUD operations
├── jdActions.ts              # Job description parsing
├── matchingActions.ts        # Resume-JD matching & scoring
├── aiActions.ts              # AI enhancements
├── versionActions.ts         # Version management
├── utilityActions.ts         # Export & external sources
├── masterResumesInternal.ts  # Internal mutations for master resumes
└── resumeVersionsInternal.ts # Internal mutations for versions
```

## 🔧 Actions Overview

### Resume Actions (`resumeActions.ts`)

**getResume**
```typescript
args: { resumeId: Id<"masterResumes"> }
returns: Resume object
```

**updateSection**
```typescript
args: {
  resumeId: Id<"masterResumes">,
  section: string,
  data: any
}
returns: Updated Resume
```

**rewriteBullet**
```typescript
args: {
  resumeId: Id<"masterResumes">,
  sectionType: "experience" | "projects",
  itemId: string,
  bulletIndex: number,
  newText: string
}
returns: Updated Resume
```

---

### Job Description Actions (`jdActions.ts`)

**parseJobDescription**
```typescript
args: { jdText: string }
returns: {
  title: string,
  company: string,
  skills: string[],
  responsibilities: string[],
  keywords: string[]
}
```

**extractKeywords**
```typescript
args: { jdText: string }
returns: string[]
```

**analyzeJobRequirements**
```typescript
args: { jdText: string }
returns: {
  requiredSkills: string[],
  preferredSkills: string[],
  responsibilities: string[],
  qualifications: string[]
}
```

---

### Matching Actions (`matchingActions.ts`)

**calculateMatchScore**
```typescript
args: {
  resume: Resume,
  jobDescription: JobDescription
}
returns: {
  overall: number,
  skillsMatch: number,
  experienceMatch: number,
  keywordMatch: number,
  suggestions: string[]
}
```

**identifyGaps**
```typescript
args: {
  resume: Resume,
  jobDescription: JobDescription
}
returns: {
  missingSkills: string[],
  missingKeywords: string[],
  suggestions: string[]
}
```

**atsChecker**
```typescript
args: { resume: Resume }
returns: {
  score: number,
  issues: string[],
  recommendations: string[]
}
```

---

### AI Actions (`aiActions.ts`)

**generateSummary**
```typescript
args: {
  resume: Resume,
  targetRole?: string
}
returns: string (summary text)
```

**improveBulletPoint**
```typescript
args: {
  bulletText: string,
  context: { role: string, company: string }
}
returns: string (improved bullet)
```

**quantifyImpact**
```typescript
args: { bulletText: string }
returns: string (quantified bullet)
```

**injectKeywords**
```typescript
args: {
  text: string,
  keywords: string[]
}
returns: string (enhanced text)
```

**suggestProjects**
```typescript
args: {
  resume: Resume,
  targetRole: string
}
returns: Array<{
  name: string,
  description: string,
  technologies: string[]
}>
```

---

### Version Actions (`versionActions.ts`)

**createResumeVersion**
```typescript
args: {
  masterResumeId: Id<"masterResumes">,
  jobDescriptionId: Id<"jobDescriptions">,
  versionName: string
}
returns: {
  versionId: Id<"resumeVersions">,
  resume: Resume
}
```

**listResumeVersions**
```typescript
args: { masterResumeId: Id<"masterResumes"> }
returns: Array<{
  id: string,
  name: string,
  jobTitle: string,
  createdAt: string,
  matchScore?: number
}>
```

**duplicateVersion**
```typescript
args: {
  versionId: Id<"resumeVersions">,
  newName: string
}
returns: Id<"resumeVersions">
```

**deleteVersion**
```typescript
args: { versionId: Id<"resumeVersions"> }
returns: void
```

**syncFromMaster**
```typescript
args: {
  versionId: Id<"resumeVersions">,
  sections: string[]
}
returns: Resume (updated version)
```

---

### Utility Actions (`utilityActions.ts`)

**exportResume**
```typescript
args: {
  resumeId: Id<"resumeVersions">,
  format: "pdf" | "docx" | "json" | "txt"
}
returns: {
  url: string,
  filename: string
}
```

**visitExternalSource**
```typescript
args: {
  sourceType: "linkedin" | "github" | "portfolio",
  url: string
}
returns: {
  data: any,
  extractedInfo: {
    skills?: string[],
    projects?: Array<{ name: string, description: string }>,
    experience?: Array<{ company: string, role: string, description: string }>
  }
}
```

**askClarifyingQuestions**
```typescript
args: {
  resume: Resume,
  context: string
}
returns: string[] (array of questions)
```

---

## 🔐 Environment Variables

Add to `.env.local`:

```bash
GEMINI_API_KEY=your_gemini_api_key
NEXT_PUBLIC_CONVEX_URL=your_convex_url
```

Get your Gemini API key from: https://aistudio.google.com/app/apikey

---

## 🚀 Usage from Client

```typescript
import { useAction } from "convex/react";
import { api } from "@/convex/_generated/api";

function MyComponent() {
  const generateSummary = useAction(api.aiActions.generateSummary);
  
  const handleGenerate = async () => {
    const summary = await generateSummary({
      resume: myResume,
      targetRole: "Backend Engineer"
    });
  };
}
```

---

## 🧠 LLM Integration

All AI actions use **Google Gemini 2.0 Flash**. The model supports:
- JSON mode for structured outputs
- Fast response times
- Free tier available

You can replace with:
- OpenAI GPT-4
- Anthropic Claude
- AWS Bedrock
- Local LLMs

Just update the fetch calls in the action files.

---

## 📝 Notes

- Actions run on Convex servers (not client-side)
- Internal mutations are used for database updates
- All actions are type-safe with Convex validators
- LLM calls are made server-side for security
