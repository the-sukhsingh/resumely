# Agent Tools

This directory contains all the tools/functions used by the AI agent to interact with the Resume Matcher & Editor system.

## Tool Categories

### 1. Resume Tools (`resume-tools.ts`)
- **get_resume**: Fetch resume data by ID
- **update_section**: Update specific resume sections
- **rewrite_bullet**: Modify individual bullet points

### 2. Job Description Tools (`jd-tools.ts`)
- **parseJobDescription**: Extract structured data from JD text
- **extractKeywords**: Identify important keywords
- **analyzeJobRequirements**: Break down requirements and qualifications

### 3. Matching Tools (`matching-tools.ts`)
- **calculateMatchScore**: Score resume-JD compatibility
- **identifyGaps**: Find missing skills and keywords
- **atsChecker**: Verify ATS compatibility

### 4. AI Enhancement Tools (`ai-tools.ts`)
- **generateSummary**: Create/improve resume summary
- **improveBulletPoint**: Enhance bullet points
- **quantifyImpact**: Add metrics to achievements
- **injectKeywords**: Naturally integrate keywords
- **suggestProjects**: Recommend relevant projects

### 5. Version Management Tools (`version-tools.ts`)
- **createResumeVersion**: Clone master for specific job
- **listResumeVersions**: View all versions
- **duplicateVersion**: Copy existing version
- **deleteVersion**: Remove version
- **syncFromMaster**: Update version from master

### 6. Utility Tools (`utility-tools.ts`)
- **exportResume**: Generate PDF/DOCX/JSON/TXT
- **visitExternalSource**: Scrape LinkedIn/GitHub/Portfolio
- **askClarifyingQuestions**: Generate questions to fill gaps

## Usage

```typescript
import { getResume, calculateMatchScore, generateSummary } from '@/lib/agent-tools';

// Fetch resume
const resume = await getResume('resume-id');

// Calculate match
const score = await calculateMatchScore(resume, jobDescription);

// Generate summary
const summary = await generateSummary(resume, 'Backend Engineer');
```

## Integration with LLM

The `AGENT_TOOLS` array in `index.ts` provides tool definitions for the LLM to understand available functions and their parameters.
