/**
 * Helper utilities for extracting company domains and generating high-resolution favicon URLs.
 */

// Known tech companies and services mapped to their canonical domains.
export const KNOWN_COMPANY_DOMAINS: Record<string, string> = {
  google: 'google.com',
  alphabet: 'abc.xyz',
  microsoft: 'microsoft.com',
  apple: 'apple.com',
  amazon: 'amazon.com',
  meta: 'meta.com',
  facebook: 'meta.com',
  netflix: 'netflix.com',
  uber: 'uber.com',
  lyft: 'lyft.com',
  airbnb: 'airbnb.com',
  stripe: 'stripe.com',
  figma: 'figma.com',
  vercel: 'vercel.com',
  linear: 'linear.app',
  notion: 'notion.so',
  slack: 'slack.com',
  spotify: 'spotify.com',
  twitter: 'x.com',
  x: 'x.com',
  github: 'github.com',
  gitlab: 'gitlab.com',
  openai: 'openai.com',
  anthropic: 'anthropic.com',
  scale: 'scale.com',
  'scale ai': 'scale.com',
  ramp: 'ramp.com',
  brex: 'brex.com',
  datadog: 'datadoghq.com',
  cloudflare: 'cloudflare.com',
  supabase: 'supabase.com',
  convex: 'convex.dev',
  retool: 'retool.com',
  pinterest: 'pinterest.com',
  reddit: 'reddit.com',
  dropbox: 'dropbox.com',
  canva: 'canva.com',
  shopify: 'shopify.com',
  atlassian: 'atlassian.com',
  hubspot: 'hubspot.com',
  salesforce: 'salesforce.com',
  coinbase: 'coinbase.com',
  robinhood: 'robinhood.com',
  plaid: 'plaid.com',
  cursor: 'cursor.com',
  replit: 'replit.com',
  postman: 'postman.com',
  zoom: 'zoom.us',
  adobe: 'adobe.com',
  nvidia: 'nvidia.com',
  intel: 'intel.com',
  amd: 'amd.com',
  ibm: 'ibm.com',
  oracle: 'oracle.com',
  palantir: 'palantir.com',
  snowflake: 'snowflake.com',
  mongodb: 'mongodb.com',
  twilio: 'twilio.com',
  deel: 'deel.com',
  remote: 'remote.com',
  gusto: 'gusto.com',
  rippling: 'rippling.com',
  duolingo: 'duolingo.com',
  bytedance: 'bytedance.com',
  tiktok: 'tiktok.com',
  snapchat: 'snap.com',
  snap: 'snap.com',
  instacart: 'instacart.com',
  doorstep: 'doordash.com',
  doordash: 'doordash.com',
};

// ATS and job aggregator domains that host postings for third-party companies.
export const ATS_DOMAINS = new Set([
  'greenhouse.io',
  'boards.greenhouse.io',
  'lever.co',
  'jobs.lever.co',
  'ashbyhq.com',
  'jobs.ashbyhq.com',
  'myworkdayjobs.com',
  'workday.com',
  'bamboohr.com',
  'recruitee.com',
  'smartrecruiters.com',
  'jobvite.com',
  'workable.com',
  'icims.com',
  'applytojob.com',
  'linkedin.com',
  'indeed.com',
  'glassdoor.com',
  'wellfound.com',
  'angel.co',
  'handshake.com',
  'ziprecruiter.com',
]);

/**
 * Extracts a clean domain (e.g. "stripe.com") from a URL string.
 */
export function extractDomainFromUrl(rawUrl?: string | null): string | null {
  if (!rawUrl || typeof rawUrl !== 'string') return null;
  const trimmed = rawUrl.trim();
  if (!trimmed) return null;

  try {
    const withProto = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
    const parsed = new URL(withProto);
    let host = parsed.hostname.toLowerCase();
    if (host.startsWith('www.')) {
      host = host.slice(4);
    }
    return host || null;
  } catch {
    return null;
  }
}

/**
 * Normalizes a company name into a domain candidate or looks it up in known registry.
 */
export function normalizeCompanyNameToDomain(companyName?: string | null): string | null {
  if (!companyName || typeof companyName !== 'string') return null;
  const raw = companyName.trim().toLowerCase();
  if (!raw || raw === 'company' || raw === 'unknown') return null;

  // Direct lookup in known companies
  if (KNOWN_COMPANY_DOMAINS[raw]) {
    return KNOWN_COMPANY_DOMAINS[raw];
  }

  // Strip corporate suffixes (Inc, LLC, Ltd, Corp, Tech, Technologies, etc.)
  const stripped = raw
    .replace(/\b(inc|llc|ltd|corp|corporation|technologies|tech|gmbh|co|holdings|group)\b\.?/gi, '')
    .trim();

  if (KNOWN_COMPANY_DOMAINS[stripped]) {
    return KNOWN_COMPANY_DOMAINS[stripped];
  }

  // Convert to clean alphanumeric slug
  const slug = stripped.replace(/[^a-z0-9-]/g, '');
  if (!slug || slug.length < 2) return null;

  return `${slug}.com`;
}

/**
 * Resolves the primary domain for a job given its company name, companyUrl, and jobUrl.
 */
export function getCompanyDomain(
  company?: string | null,
  companyUrl?: string | null,
  jobUrl?: string | null
): string | null {
  // 1. Explicit company URL takes top priority
  if (companyUrl) {
    const fromCompanyUrl = extractDomainFromUrl(companyUrl);
    if (fromCompanyUrl) return fromCompanyUrl;
  }

  // 2. Check if jobUrl is from the direct company site (not an ATS)
  if (jobUrl) {
    const fromJobUrl = extractDomainFromUrl(jobUrl);
    if (fromJobUrl) {
      const isAts = Array.from(ATS_DOMAINS).some(
        (ats) => fromJobUrl === ats || fromJobUrl.endsWith(`.${ats}`)
      );
      if (!isAts) {
        return fromJobUrl;
      }
    }
  }

  // 3. Fallback to deriving from company name
  if (company) {
    const fromName = normalizeCompanyNameToDomain(company);
    if (fromName) return fromName;
  }

  // 4. Fallback to jobUrl domain even if ATS
  if (jobUrl) {
    return extractDomainFromUrl(jobUrl);
  }

  return null;
}

/**
 * Generates Google Favicon CDN URL for a domain (high resolution 128x128).
 */
export function getFaviconUrl(domain: string, size: number = 128): string {
  return `https://www.google.com/s2/favicons?domain=${encodeURIComponent(domain)}&sz=${size}`;
}
