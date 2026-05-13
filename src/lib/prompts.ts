// Language code to full name mapping
export const LANGUAGE_NAMES: Record<string, string> = {
  en: 'English',
  es: 'Spanish',
  zh: 'Chinese (Simplified)',
  ja: 'Japanese',
  pt: 'Brazilian Portuguese',
};

export function getLanguageName(code: string): string {
  return LANGUAGE_NAMES[code] || 'English';
}

const RESUME_SCHEMA_EXAMPLE = `{
  "personalInfo": {
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1-555-0100",
    "location": "San Francisco, CA",
    "website": "https://johndoe.dev",
    "linkedin": "linkedin.com/in/johndoe",
    "github": "github.com/johndoe"
  },
  "summary": "Experienced software engineer with 5+ years...",
  "experience": [
    {
      "id": "1",
      "company": "Tech Corp",
      "position": "Senior Software Engineer",
      "location": "San Francisco, CA",
      "startDate": "Jan 2020",
      "endDate": "Present",
      "current": true,
      "bullets": [
        "Led development of microservices architecture",
        "Improved system performance by 40%"
      ]
    }
  ],
  "education": [
    {
      "id": "1",
      "institution": "University of California",
      "degree": "B.S. Computer Science",
      "field": "Computer Science",
      "location": "Berkeley, CA",
      "startDate": "2014",
      "endDate": "2018",
      "gpa": "3.8"
    }
  ],
  "skills": [
    {
      "category": "Technical Skills",
      "items": ["Python", "JavaScript", "AWS", "Docker"]
    }
  ],
  "projects": [
    {
      "id": "1",
      "name": "Open Source Tool",
      "description": "Built CLI tool with 1000+ GitHub stars",
      "technologies": ["Python", "Rust"],
      "link": "github.com/tool",
      "bullets": [
        "Built CLI tool with 1000+ GitHub stars",
        "Used by 50+ companies worldwide"
      ]
    }
  ]
}`;

export const getParseResumePrompt = (resumeText: string): string => {
  return `Parse this resume into JSON. Output ONLY the JSON object, no other text.

Map content to standard sections when possible. 

Example output format:
${RESUME_SCHEMA_EXAMPLE}

Rules:
- Use "" for missing text fields, [] for missing arrays, null for optional fields
- Number IDs starting from 1
- Format dates preserving the original precision. Keep months when present: "Jan 2020 - Dec 2023", "May 2021 - Present". Use "YYYY - YYYY" only when the source has no months.
- Preserve the original section name as a descriptive key
- Normalize date separators: "2020-2021" → "2020 - 2021", "Current"/"Ongoing" → "Present". Do NOT discard months.
- For ambiguous dates like "3 years experience", infer approximate years from context or use "~YYYY"
- Flag overlapping dates (concurrent roles) by preserving both, don't merge

Resume to parse:
${resumeText}`;
};

export const getExtractKeywordsPrompt = (jobDescription: string): string => {
  return `Extract job requirements as JSON. Output ONLY the JSON object, no other text.

Example format:
{
  "required_skills": ["Python", "AWS"],
  "preferred_skills": ["Kubernetes"],
  "experience_requirements": ["5+ years"],
  "education_requirements": ["Bachelor's in CS"],
  "key_responsibilities": ["Lead team"],
  "keywords": ["microservices", "agile"],
  "experience_years": 5,
  "seniority_level": "senior"
}

Extract numeric years (e.g., "5+ years" → 5) and infer seniority level.

Job description:
${jobDescription}`;
};

function buildTruthfulnessRules(rule7: string): string {
  return `CRITICAL TRUTHFULNESS RULES - NEVER VIOLATE:
1. DO NOT add any skill, tool, technology, or certification that is not explicitly mentioned in the original resume
2. DO NOT invent numeric achievements (e.g., "increased by 30%") unless they exist in original
3. DO NOT add company names, product names, or technical terms not in the original
4. DO NOT upgrade experience level (e.g., "Junior" -> "Senior")
5. DO NOT add languages, frameworks, or platforms the candidate hasn't used
6. DO NOT extend employment dates or change timelines. Copy date ranges exactly as they appear, including months.
7. ${rule7}
8. Preserve factual accuracy - only use information provided by the candidate
9. NEVER remove existing skills, certifications, languages, or awards. You may reorder by relevance, but every original item must remain.

Violation of these rules could cause serious problems for the candidate in job interviews.`;
}

const CRITICAL_TRUTHFULNESS_RULES = {
  nudge: buildTruthfulnessRules("DO NOT add new bullet points or content - only rephrase existing content"),
  keywords: buildTruthfulnessRules("You may rephrase existing bullet points to include keywords, but do NOT add new bullet points"),
  full: buildTruthfulnessRules("You may expand existing bullet points or add new ones that elaborate on existing work, but DO NOT invent entirely new responsibilities"),
};

export const getImproveResumePromptNudge = (
  jobDescription: string,
  jobKeywords: string,
  originalResume: string,
  outputLanguage: string
): string => {
  return `Lightly nudge this resume toward the job description. Output ONLY the JSON object, no other text.

${CRITICAL_TRUTHFULNESS_RULES.nudge}

IMPORTANT: Generate ALL text content (summary, descriptions, skills) in ${outputLanguage}.
Do NOT include personalInfo in your output - it will be preserved from the original resume.

Rules:
- Make minimal, conservative edits only where there is a clear existing match
- Do NOT change the candidate's role, industry, or seniority level
- Do NOT introduce new tools, technologies, or certifications not already present
- Do NOT add new bullet points or sections
- Preserve original bullet count and ordering within each section
- Keep proper nouns (names, company names, locations) unchanged
- Copy the dates EXACTLY as they appear in the original resume. Do not shorten, reformat, or drop months.
- If the resume is non-technical, do NOT add technical jargon
- Do NOT use em dash ("—") anywhere in the writing/output, even if it exists, remove it

Job Description:
${jobDescription}

Keywords to emphasize (only if already supported by resume content):
${jobKeywords}

Original Resume:
${originalResume}

Output in this JSON format:
${RESUME_SCHEMA_EXAMPLE}`;
};

export const getKeywordInjectionPrompt = (
  keywordsToInject: string,
  currentResume: string,
  masterResume: string,
  jobDescription: string
): string => {
  return `Inject the following keywords into this resume where they can be naturally and TRUTHFULLY incorporated.

CRITICAL RULES:
1. Only add keywords where the master resume provides supporting evidence
2. Do NOT add skills, technologies, or certifications not in the master resume
3. Rephrase existing bullet points to include keywords - do not invent new content
4. Maintain the exact same JSON structure
5. Do not use em-dashes (—) or their variants (---, --)

Keywords to inject (only if supported by master resume):
${keywordsToInject}

Current tailored resume:
${currentResume}

Master resume (source of truth):
${masterResume}

Job description context:
${jobDescription}

Output the complete resume JSON with keywords naturally integrated. Return ONLY valid JSON.`;
};

export const getAnalyzeResumePrompt = (resumeJson: string, outputLanguage: string): string => {
  return `You are a professional resume analyst. Analyze this resume to identify items in Experience and Projects sections that have weak, vague, or incomplete descriptions.

IMPORTANT: Generate ALL output text (questions, placeholders, summaries, weakness reasons) in ${outputLanguage}.

RESUME DATA (JSON):
${resumeJson}

WEAK DESCRIPTION INDICATORS:
1. Generic phrases: "responsible for", "worked on", "helped with", "assisted in", "involved in"
2. Missing metrics/impact: No numbers, percentages, dollar amounts, or measurable outcomes
3. Unclear scope: Vague about team size, project scale, user count, or responsibilities
4. No technologies/tools: Missing specific tech stack, tools, or methodologies used
5. Passive voice without ownership: Not clear what the candidate personally accomplished
6. Too brief: Single short bullet that doesn't explain the work

TASK:
1. Review each Experience and Project item's description bullets
2. Identify items that would benefit from more detail
3. Generate a MAXIMUM of 6 questions total across ALL items (not per item)
4. Prioritize the most impactful questions that will yield the best improvements
5. If multiple items need enhancement, distribute questions wisely (e.g., 2-3 per item)
6. Questions should help extract: metrics, technologies, scope, impact, and specific contributions

OUTPUT FORMAT (JSON only, no other text):
{
  "items_to_enrich": [ ... ],
  "questions": [ ... ],
  "analysis_summary": "Brief summary"
}`;
};
