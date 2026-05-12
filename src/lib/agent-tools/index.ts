// Types
export * from './types';

// Resume Tools
export {
  getResume,
  updateSection,
  rewriteBullet,
} from './resume-tools';

// Job Description Tools
export {
  parseJobDescription,
  extractKeywords,
  analyzeJobRequirements,
} from './jd-tools';

// Matching Tools
export {
  calculateMatchScore,
  identifyGaps,
  atsChecker,
} from './matching-tools';

// AI Enhancement Tools
export {
  generateSummary,
  improveBulletPoint,
  quantifyImpact,
  injectKeywords,
  suggestProjects,
} from './ai-tools';

// Version Management Tools
export {
  createResumeVersion,
  listResumeVersions,
  duplicateVersion,
  deleteVersion,
  syncFromMaster,
} from './version-tools';

// Utility Tools
export {
  exportResume,
  visitExternalSource,
  askClarifyingQuestions,
} from './utility-tools';

// Tool definitions for LLM
export const AGENT_TOOLS = [
  {
    name: 'get_resume',
    description: 'Retrieve a resume by ID',
    parameters: {
      resumeId: { type: 'string', required: true },
    },
  },
  {
    name: 'update_section',
    description: 'Update a specific section of the resume',
    parameters: {
      resumeId: { type: 'string', required: true },
      section: { type: 'string', required: true },
      data: { type: 'object', required: true },
    },
  },
  {
    name: 'rewrite_bullet',
    description: 'Rewrite a specific bullet point in experience or project',
    parameters: {
      resumeId: { type: 'string', required: true },
      sectionType: { type: 'string', required: true },
      itemId: { type: 'string', required: true },
      bulletIndex: { type: 'number', required: true },
      newText: { type: 'string', required: true },
    },
  },
  {
    name: 'parse_job_description',
    description: 'Parse and extract structured data from job description text',
    parameters: {
      jdText: { type: 'string', required: true },
    },
  },
  {
    name: 'calculate_match_score',
    description: 'Calculate how well a resume matches a job description',
    parameters: {
      resume: { type: 'object', required: true },
      jobDescription: { type: 'object', required: true },
    },
  },
  {
    name: 'identify_gaps',
    description: 'Identify missing skills and keywords between resume and JD',
    parameters: {
      resume: { type: 'object', required: true },
      jobDescription: { type: 'object', required: true },
    },
  },
  {
    name: 'ats_checker',
    description: 'Check resume for ATS compatibility',
    parameters: {
      resume: { type: 'object', required: true },
    },
  },
  {
    name: 'generate_summary',
    description: 'Generate or improve resume summary',
    parameters: {
      resume: { type: 'object', required: true },
      targetRole: { type: 'string', required: false },
    },
  },
  {
    name: 'improve_bullet_point',
    description: 'Improve a single bullet point with AI',
    parameters: {
      bulletText: { type: 'string', required: true },
      context: { type: 'object', required: true },
    },
  },
  {
    name: 'quantify_impact',
    description: 'Add quantifiable metrics to a bullet point',
    parameters: {
      bulletText: { type: 'string', required: true },
    },
  },
  {
    name: 'inject_keywords',
    description: 'Naturally inject keywords into text',
    parameters: {
      text: { type: 'string', required: true },
      keywords: { type: 'array', required: true },
    },
  },
  {
    name: 'suggest_projects',
    description: 'Suggest relevant projects for target role',
    parameters: {
      resume: { type: 'object', required: true },
      targetRole: { type: 'string', required: true },
    },
  },
  {
    name: 'create_resume_version',
    description: 'Create a new tailored version from master resume',
    parameters: {
      masterResumeId: { type: 'string', required: true },
      jobDescriptionId: { type: 'string', required: true },
      versionName: { type: 'string', required: true },
    },
  },
  {
    name: 'list_resume_versions',
    description: 'List all versions of a master resume',
    parameters: {
      masterResumeId: { type: 'string', required: true },
    },
  },
  {
    name: 'export_resume',
    description: 'Export resume in specified format',
    parameters: {
      resumeId: { type: 'string', required: true },
      format: { type: 'string', required: true },
    },
  },
  {
    name: 'visit_external_source',
    description: 'Extract information from LinkedIn, GitHub, or portfolio',
    parameters: {
      sourceType: { type: 'string', required: true },
      url: { type: 'string', required: true },
    },
  },
  {
    name: 'ask_clarifying_questions',
    description: 'Generate questions to fill gaps in resume',
    parameters: {
      resume: { type: 'object', required: true },
      context: { type: 'string', required: true },
    },
  },
];
