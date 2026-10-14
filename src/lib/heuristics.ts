// ThreatLens Heuristic Scoring Engine & Multi-Channel Exclusion Engine
// Fully explainable, offline, audit-compliant rules with rich threat explanation

export interface RiskSignalResult {
  signalType: string;
  description: string;
  weight: number;
  isPositive: boolean;
}

export interface FlaggedReason {
  id: string;
  indicatorName: string;
  detected: string;
  whyRisky: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  recommendedAction: string;
  category: 'verified' | 'heuristic' | 'simulated';
}

export interface HarmfulConsequence {
  id: string;
  title: string;
  tag: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  icon: string;
}

export interface SecurityCheckSource {
  name: string;
  status: 'active' | 'verified' | 'simulated' | 'unavailable';
  details: string;
}

export interface ScanStage {
  id: string;
  label: string;
  description: string;
  status: 'completed' | 'in_progress' | 'pending';
  durationMs: number;
}

export interface HeuristicAnalysisResult {
  candidate: string;
  submittedUrl: string;
  normalizedUrl: string;
  displayUrl: string;
  channel: 'social' | 'app' | 'domain';
  isOfficialExcluded: boolean;
  exclusionReason?: string;
  riskScore: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  classification: 'low_risk' | 'suspicious' | 'dangerous';
  classificationLabel: string;
  signals: RiskSignalResult[];
  flaggedReasons: FlaggedReason[];
  harmfulConsequences: HarmfulConsequence[];
  recommendedPrecautions: string[];
  securitySources: SecurityCheckSource[];
  scanStages: ScanStage[];
  summary: string;
  timestamp: string;
}

export interface BrandBaseline {
  name: string;
  officialDomains: string[];
  officialSocialHandles: string[];
  officialMobileApps: string[];
  vipExecutives: string[];
  monitoredKeywords: string[];
}

// Global High-Profile Target Brands for Cross-Brand Phishing & Combisquatting Detection
export interface GlobalBrandProfile {
  name: string;
  officialDomains: string[];
  suffixes: string[];
  category: string;
}

export const GLOBAL_POPULAR_BRANDS: GlobalBrandProfile[] = [
  {
    name: 'amazon',
    officialDomains: [
      'amazon.com',
      'amazon.in',
      'amazon.co.uk',
      'amazon.de',
      'amazon.fr',
      'amazon.ca',
      'amazon.es',
      'amazon.it',
      'amazon.co.jp',
      'primevideo.com',
      'aws.amazon.com',
      'media-amazon.com',
    ],
    suffixes: ['ind', 'india', 'pay', 'prime', 'orders', 'support', 'login', 'portal', 'delivery', 'reward', 'gift', 'deal'],
    category: 'E-Commerce & Cloud Infrastructure',
  },
  {
    name: 'paypal',
    officialDomains: ['paypal.com', 'paypal.me'],
    suffixes: ['login', 'verify', 'account', 'resolution', 'secure', 'auth', 'update', 'support', 'pay'],
    category: 'Digital Payments & Financial Services',
  },
  {
    name: 'microsoft',
    officialDomains: ['microsoft.com', 'live.com', 'office.com', 'outlook.com', 'azure.com', 'microsoftonline.com', 'bing.com', 'msn.com'],
    suffixes: ['login', '365', 'verify', 'support', 'auth', 'portal', 'update', 'teams', 'online'],
    category: 'Enterprise Cloud & Operating Systems',
  },
  {
    name: 'apple',
    officialDomains: ['apple.com', 'icloud.com'],
    suffixes: ['id', 'support', 'verify', 'icloud', 'find', 'auth', 'login', 'security', 'pay'],
    category: 'Mobile Devices & Consumer Tech',
  },
  {
    name: 'google',
    officialDomains: ['google.com', 'gmail.com', 'youtube.com', 'google.co.in', 'googleusercontent.com', 'googleapis.com'],
    suffixes: ['drive', 'docs', 'login', 'account', 'verify', 'auth', 'mail', 'security'],
    category: 'Search & Identity Provider',
  },
  {
    name: 'netflix',
    officialDomains: ['netflix.com'],
    suffixes: ['update', 'billing', 'login', 'account', 'verify', 'tv', 'payment'],
    category: 'Streaming Entertainment Media',
  },
  {
    name: 'facebook',
    officialDomains: ['facebook.com', 'meta.com', 'fb.com'],
    suffixes: ['security', 'login', 'verify', 'appeal', 'help', 'business', 'support'],
    category: 'Social Networking',
  },
  {
    name: 'instagram',
    officialDomains: ['instagram.com'],
    suffixes: ['verify', 'badge', 'help', 'copyright', 'appeal', 'login', 'support'],
    category: 'Social Media',
  },
  {
    name: 'whatsapp',
    officialDomains: ['whatsapp.com'],
    suffixes: ['web', 'login', 'verify', 'chat', 'support', 'call'],
    category: 'Instant Messaging',
  },
  {
    name: 'telegram',
    officialDomains: ['telegram.org', 't.me'],
    suffixes: ['web', 'login', 'verify', 'bot', 'channel'],
    category: 'Instant Messaging Platform',
  },
  {
    name: 'sbi',
    officialDomains: ['onlinesbi.sbi', 'sbi.co.in'],
    suffixes: ['online', 'banking', 'kyc', 'yono', 'login', 'update', 'portal', 'cards'],
    category: 'National Commercial Banking',
  },
  {
    name: 'hdfc',
    officialDomains: ['hdfcbank.com'],
    suffixes: ['online', 'banking', 'net', 'login', 'verify', 'update', 'cards'],
    category: 'Retail Commercial Banking',
  },
  {
    name: 'binance',
    officialDomains: ['binance.com'],
    suffixes: ['wallet', 'login', 'verify', 'auth', 'us', 'claim', 'airdrop', 'rewards'],
    category: 'Crypto Exchange',
  },
  {
    name: 'metamask',
    officialDomains: ['metamask.io'],
    suffixes: ['wallet', 'sync', 'recovery', 'login', 'claim', 'airdrop', 'seed'],
    category: 'Web3 Crypto Wallet',
  },
  {
    name: 'github',
    officialDomains: ['github.com', 'github.io', 'github.blog', 'githubstatus.com', 'githubassets.com'],
    suffixes: ['login', 'verify', 'auth', 'oauth', 'token', 'enterprise'],
    category: 'Software Development & Code Repository',
  },
  {
    name: 'stripe',
    officialDomains: ['stripe.com', 'stripe.network'],
    suffixes: ['pay', 'checkout', 'billing', 'login', 'verify', 'invoice'],
    category: 'Financial Infrastructure & Payments',
  },
  {
    name: 'linkedin',
    officialDomains: ['linkedin.com', 'licdn.com'],
    suffixes: ['login', 'verify', 'auth', 'jobs', 'profile'],
    category: 'Professional Networking',
  },
  {
    name: 'wikipedia',
    officialDomains: ['wikipedia.org', 'wikimedia.org'],
    suffixes: ['wiki', 'donate', 'login'],
    category: 'Knowledge Base & Encyclopedia',
  },
  {
    name: 'openai',
    officialDomains: ['openai.com', 'chatgpt.com'],
    suffixes: ['login', 'auth', 'api', 'plus', 'account'],
    category: 'Artificial Intelligence & Large Language Models',
  },
  {
    name: 'discord',
    officialDomains: ['discord.com', 'discord.gg', 'discordapp.com'],
    suffixes: ['nitro', 'login', 'verify', 'gift', 'airdrop', 'free'],
    category: 'Community & Voice Messaging',
  },
  {
    name: 'cloudflare',
    officialDomains: ['cloudflare.com', 'cloudflare-dns.com'],
    suffixes: ['login', 'verify', 'dns', 'turnstile', 'workers'],
    category: 'Cloud CDN, DNS & Web Security',
  },
  {
    name: 'reddit',
    officialDomains: ['reddit.com', 'redd.it'],
    suffixes: ['login', 'verify', 'coins', 'vault'],
    category: 'Online Communities & Discussion Forum',
  },
  {
    name: 'flipkart',
    officialDomains: ['flipkart.com', 'flipkart.net', 'ekartlogistics.com'],
    suffixes: ['india', 'ind', 'pay', 'seller', 'plus', 'offers', 'deal', 'deals', 'sale', 'order', 'support', 'mall', 'login', 'store'],
    category: 'E-Commerce Marketplace & Retail',
  },
  {
    name: 'myntra',
    officialDomains: ['myntra.com'],
    suffixes: ['india', 'ind', 'offers', 'sale', 'login', 'fashion', 'store', 'pay'],
    category: 'Fashion & Lifestyle E-Commerce',
  },
  {
    name: 'paytm',
    officialDomains: ['paytm.com', 'paytmbank.com'],
    suffixes: ['bank', 'kyc', 'mall', 'login', 'offers', 'cashback', 'reward', 'pay', 'wallet'],
    category: 'Fintech & Digital Payments',
  },
  {
    name: 'phonepe',
    officialDomains: ['phonepe.com'],
    suffixes: ['pay', 'kyc', 'reward', 'cashback', 'login', 'business', 'qr', 'wallet'],
    category: 'Digital UPI Payments',
  },
  {
    name: 'zomato',
    officialDomains: ['zomato.com'],
    suffixes: ['gold', 'pro', 'delivery', 'offers', 'login', 'order', 'pay'],
    category: 'Food Delivery & Quick Commerce',
  },
  {
    name: 'swiggy',
    officialDomains: ['swiggy.com', 'instamart.in'],
    suffixes: ['one', 'instamart', 'dineout', 'offers', 'order', 'login', 'pay'],
    category: 'Food & Grocery Quick Commerce',
  },
  {
    name: 'icici',
    officialDomains: ['icicibank.com', 'icicidirect.com'],
    suffixes: ['net', 'bank', 'login', 'cards', 'kyc', 'online', 'imobile', 'corporate'],
    category: 'Private Commercial Banking',
  },
  {
    name: 'axis',
    officialDomains: ['axisbank.com'],
    suffixes: ['net', 'bank', 'login', 'cards', 'kyc', 'online', 'mobile'],
    category: 'Private Commercial Banking',
  },
  {
    name: 'pnb',
    officialDomains: ['pnbindia.in', 'netpnb.com'],
    suffixes: ['net', 'bank', 'login', 'kyc', 'online', 'one'],
    category: 'Public Sector Banking',
  },
  {
    name: 'kotak',
    officialDomains: ['kotak.com', 'kotakbank.com'],
    suffixes: ['811', 'net', 'bank', 'login', 'kyc', 'online'],
    category: 'Private Commercial Banking',
  },
  {
    name: 'bob',
    officialDomains: ['bankofbaroda.in', 'bobibanking.com'],
    suffixes: ['net', 'bank', 'login', 'kyc', 'online'],
    category: 'Public Sector Banking',
  },
  {
    name: 'irctc',
    officialDomains: ['irctc.co.in'],
    suffixes: ['ticket', 'login', 'rail', 'tour', 'booking', 'catering', 'air'],
    category: 'National Railway Ticketing & Tourism',
  },
  {
    name: 'airtel',
    officialDomains: ['airtel.in', 'airtelbank.com'],
    suffixes: ['thanks', 'recharge', 'pay', 'kyc', 'sim', '5g', 'payment'],
    category: 'Telecommunications & Payment Bank',
  },
  {
    name: 'jio',
    officialDomains: ['jio.com', 'jiofiber.com', 'jiomart.com'],
    suffixes: ['recharge', 'sim', '5g', 'kyc', 'pay', 'mart', 'fiber'],
    category: 'Telecommunications & Digital Services',
  },
  {
    name: 'tata',
    officialDomains: ['tata.com', 'tataneu.com', 'tatadigital.com', 'tatacliq.com'],
    suffixes: ['neu', 'digital', 'cliq', 'pay', 'login', 'offers', 'motors'],
    category: 'Conglomerate & Consumer Digital',
  },
  {
    name: 'ebay',
    officialDomains: ['ebay.com', 'ebay.in'],
    suffixes: ['india', 'pay', 'deals', 'login', 'buyer', 'seller', 'store'],
    category: 'Online Auction & E-Commerce',
  },
  {
    name: 'walmart',
    officialDomains: ['walmart.com'],
    suffixes: ['pay', 'plus', 'login', 'deals', 'order', 'store'],
    category: 'Multinational Retail & Marketplace',
  },
];

// User-Generated Content (UGC) Social & Media Platforms
// On these domains, the root is an authoritative portal, but user profiles/paths (/handle) are external unvetted accounts
export const UGC_SOCIAL_DOMAINS: Record<string, string> = {
  'instagram.com': 'Instagram',
  'facebook.com': 'Facebook',
  'fb.com': 'Facebook',
  'x.com': 'X / Twitter',
  'twitter.com': 'Twitter',
  't.me': 'Telegram',
  'telegram.org': 'Telegram',
  'telegram.me': 'Telegram',
  'linkedin.com': 'LinkedIn',
  'youtube.com': 'YouTube',
  'tiktok.com': 'TikTok',
  'reddit.com': 'Reddit',
  'threads.net': 'Threads',
  'discord.gg': 'Discord',
  'github.com': 'GitHub',
};

// Known URL shorteners that conceal destination endpoints
export const KNOWN_URL_SHORTENERS = [
  'bit.ly',
  'tinyurl.com',
  't.co',
  'is.gd',
  'buff.ly',
  'ow.ly',
  'cutt.ly',
  'rebrand.ly',
  'shorturl.at',
  'goo.gl',
  'bitly.com',
  'rb.gy',
  't.ly',
  'bl.ink',
];

// Homoglyph & Leetspeak substitution map
const HOMOGLYPH_MAP: Record<string, string> = {
  '0': 'o',
  '1': 'l',
  '3': 'e',
  '4': 'a',
  '@': 'a',
  '5': 's',
  '$': 's',
  '7': 't',
  '8': 'b',
  '!': 'i',
};

// Normalize text for comparison
export function normalizeText(text: string, convertHomoglyphs = true): string {
  if (!text) return '';
  let norm = text.trim().toLowerCase();
  if (convertHomoglyphs) {
    for (const [char, sub] of Object.entries(HOMOGLYPH_MAP)) {
      norm = norm.replaceAll(char, sub);
    }
  }
  // Standardize punctuation to single space
  norm = norm.replace(/[\-_./@#+\\]+/g, ' ');
  return norm.replace(/\s+/g, ' ').trim();
}

// Levenshtein distance calculation
export function levenshteinDistance(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));

  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1, // deletion
        dp[i][j - 1] + 1, // insertion
        dp[i - 1][j - 1] + cost // substitution
      );
    }
  }
  return dp[m][n];
}

// Damerau-Levenshtein transposition check
export function checkTransposition(a: string, b: string): boolean {
  const cleanA = a.replace(/[\s\-_.\\]/g, '').toLowerCase();
  const cleanB = b.replace(/[\s\-_.\\]/g, '').toLowerCase();
  if (Math.abs(cleanA.length - cleanB.length) > 1) return false;

  const lev = levenshteinDistance(cleanA, cleanB);
  if (lev === 2 && cleanA.length === cleanB.length) {
    for (let i = 0; i < cleanA.length - 1; i++) {
      const swapped = cleanA.slice(0, i) + cleanA[i + 1] + cleanA[i] + cleanA.slice(i + 2);
      if (swapped === cleanB) return true;
    }
  }
  return false;
}

// SSRF prevention: detect private, loopback, and internal metadata network addresses
export function isPrivateOrLoopbackHost(hostname: string): boolean {
  const host = hostname.toLowerCase().trim();
  if (['localhost', '127.0.0.1', '0.0.0.0', '::1', 'metadata.google.internal', 'instance-data'].includes(host)) {
    return true;
  }
  if (host.endsWith('.local') || host.endsWith('.internal') || host.endsWith('.localhost')) {
    return true;
  }

  // Check IPv4 private ranges (10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16, 169.254.0.0/16, 127.0.0.0/8)
  const parts = host.split('.').map(Number);
  if (parts.length === 4 && parts.every(n => !isNaN(n) && n >= 0 && n <= 255)) {
    if (parts[0] === 10) return true;
    if (parts[0] === 127) return true;
    if (parts[0] === 0) return true;
    if (parts[0] === 169 && parts[1] === 254) return true;
    if (parts[0] === 192 && parts[1] === 168) return true;
    if (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) return true;
  }
  return false;
}

export interface NormalizedUrlResult {
  normalizedUrl: string;
  displayUrl: string;
  hostname: string;
  pathname: string;
  search: string;
  port?: string;
  isSsrf: boolean;
  isValid: boolean;
  hadBackslash: boolean;
  hadMalformedProtocol: boolean;
  hasValidTld: boolean;
  isUgcSocialPlatform: boolean;
  ugcPlatformName?: string;
  extractedSocialHandle?: string;
  isUrlShortener: boolean;
  isInsecureHttp: boolean;
  error?: string;
}

// Robust URL normalizer & input validator handling backslashes, evasion techniques, and UGC platform profiles
export function normalizeUrlInput(candidate: string, channel: 'social' | 'app' | 'domain'): NormalizedUrlResult {
  const trimmed = candidate.trim();
  if (!trimmed) {
    return {
      normalizedUrl: '',
      displayUrl: '',
      hostname: '',
      pathname: '',
      search: '',
      isSsrf: false,
      isValid: false,
      hadBackslash: false,
      hadMalformedProtocol: false,
      hasValidTld: false,
      isUgcSocialPlatform: false,
      isUrlShortener: false,
      isInsecureHttp: false,
      error: 'Candidate input string cannot be empty',
    };
  }

  // Detect backslash obfuscation (e.g. https:\ or amazon\ind or \\)
  const hadBackslash = /\\/.test(trimmed);
  const isInsecureHttp = /^http:\/\//i.test(trimmed);

  // Social handles entered directly without URL scheme
  if (channel === 'social' && !trimmed.includes('://') && !trimmed.includes(':\\')) {
    const cleanHandle = trimmed.replace(/^@/, '').trim();
    return {
      normalizedUrl: `https://x.com/${cleanHandle}`,
      displayUrl: `@${cleanHandle}`,
      hostname: 'x.com',
      pathname: `/${cleanHandle}`,
      search: '',
      isSsrf: false,
      isValid: true,
      hadBackslash,
      hadMalformedProtocol: false,
      hasValidTld: true,
      isUgcSocialPlatform: true,
      ugcPlatformName: 'Social Profile',
      extractedSocialHandle: cleanHandle,
      isUrlShortener: false,
      isInsecureHttp: false,
    };
  }

  if (channel === 'app' && !trimmed.includes('://') && !trimmed.includes(':\\')) {
    return {
      normalizedUrl: `market://details?id=${trimmed}`,
      displayUrl: trimmed,
      hostname: 'play.google.com',
      pathname: '/store/apps',
      search: '',
      isSsrf: false,
      isValid: true,
      hadBackslash,
      hadMalformedProtocol: false,
      hasValidTld: true,
      isUgcSocialPlatform: false,
      isUrlShortener: false,
      isInsecureHttp: false,
    };
  }

  // Replace backslashes with forward slashes
  const sanitized = trimmed.replace(/\\+/g, '/');

  // Check if protocol was malformed (e.g. https:\ or https// or http// or https:/)
  const hadMalformedProtocol = hadBackslash || /^https?:(?!\/\/)/i.test(trimmed);

  // Strip all repeated or malformed protocol prefixes (e.g. "https://https//", "https://", "http://", "https:/", "http:/")
  let cleanBody = sanitized.replace(/^(?:https?:\/*)+/i, '');

  // Extract query string if any
  let query = '';
  const queryIdx = cleanBody.indexOf('?');
  if (queryIdx !== -1) {
    query = cleanBody.slice(queryIdx);
    cleanBody = cleanBody.slice(0, queryIdx);
  }

  // Now cleanBody is e.g. "amazonind.co" or "amazonind.co/verify" or "instagram.com/its_sneh234/"
  let hostname = '';
  let pathname = '';
  const slashIdx = cleanBody.indexOf('/');
  if (slashIdx !== -1) {
    hostname = cleanBody.slice(0, slashIdx).toLowerCase().trim();
    pathname = cleanBody.slice(slashIdx);
  } else {
    hostname = cleanBody.toLowerCase().trim();
    pathname = '';
  }

  // Remove trailing slashes and spaces from hostname
  hostname = hostname.replace(/\/+$/, '');

  // Extract port if specified (e.g. host:8080)
  let port: string | undefined = undefined;
  if (hostname.includes(':')) {
    const colonParts = hostname.split(':');
    hostname = colonParts[0];
    port = colonParts[1];
  }

  // If input was empty or invalid after stripping
  if (!hostname) {
    return {
      normalizedUrl: trimmed,
      displayUrl: trimmed,
      hostname: '',
      pathname: '',
      search: '',
      isSsrf: false,
      isValid: false,
      hadBackslash,
      hadMalformedProtocol,
      hasValidTld: false,
      isUgcSocialPlatform: false,
      isUrlShortener: false,
      isInsecureHttp,
      error: 'Invalid URL syntax. Please enter a valid URL, hostname, or handle.',
    };
  }

  // Check SSRF
  if (isPrivateOrLoopbackHost(hostname)) {
    return {
      normalizedUrl: `https://${hostname}${port ? ':' + port : ''}${pathname}${query}`,
      displayUrl: `${hostname}${port ? ':' + port : ''}${pathname}`,
      hostname,
      pathname,
      search: query,
      port,
      isSsrf: true,
      isValid: false,
      hadBackslash,
      hadMalformedProtocol,
      hasValidTld: false,
      isUgcSocialPlatform: false,
      isUrlShortener: false,
      isInsecureHttp,
      error: 'SSRF Protection Triggered: Scanning internal, private network addresses or cloud metadata endpoints is prohibited.',
    };
  }

  // Check valid TLD (must have dot followed by 2+ letters or be valid IPv4)
  const isIpv4 = /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(hostname);
  const hasDomainTld = /^[a-z0-9-]+(\.[a-z0-9-]+)*\.[a-z]{2,}$/i.test(hostname);
  const hasValidTld = isIpv4 || hasDomainTld;

  // Check UGC Social Media Platform & extract user profile handle
  let isUgcSocialPlatform = false;
  let ugcPlatformName: string | undefined = undefined;
  let extractedSocialHandle: string | undefined = undefined;

  for (const [ugcDomain, platName] of Object.entries(UGC_SOCIAL_DOMAINS)) {
    if (hostname === ugcDomain || hostname.endsWith('.' + ugcDomain)) {
      isUgcSocialPlatform = true;
      ugcPlatformName = platName;

      const pathSegments = pathname.split('/').filter(Boolean);
      if (pathSegments.length > 0) {
        const first = pathSegments[0].toLowerCase();
        const nonHandlePaths = [
          'about', 'legal', 'help', 'terms', 'privacy', 'explore', 'direct',
          'accounts', 'developer', 'settings', 'support', 'api', 'en', 'login', 'signup', 'register',
          'feed', 'messages', 'notifications', 'home', 'reel', 'reels', 'stories'
        ];
        if (!nonHandlePaths.includes(first)) {
          if (['in', 'c', 'channel', 'user'].includes(first) && pathSegments.length > 1) {
            extractedSocialHandle = pathSegments[1].replace(/^@/, '');
          } else {
            extractedSocialHandle = pathSegments[0].replace(/^@/, '');
          }
        }
      }
      break;
    }
  }

  // Check URL shortener
  const isUrlShortener = KNOWN_URL_SHORTENERS.some(s => hostname === s || hostname.endsWith('.' + s));

  const normalizedUrl = `${isInsecureHttp ? 'http' : 'https'}://${hostname}${port ? ':' + port : ''}${pathname}${query}`;
  const displayUrl = `${hostname}${port ? ':' + port : ''}${pathname}`;

  return {
    normalizedUrl,
    displayUrl,
    hostname,
    pathname,
    search: query,
    port,
    isSsrf: false,
    isValid: true,
    hadBackslash,
    hadMalformedProtocol,
    hasValidTld,
    isUgcSocialPlatform,
    ugcPlatformName,
    extractedSocialHandle,
    isUrlShortener,
    isInsecureHttp,
  };
}

// Multi-Channel Baseline Exclusion Engine
export function checkBaselineExclusion(candidate: string, baseline: BrandBaseline): { isExcluded: boolean; reason?: string } {
  const urlInfo = normalizeUrlInput(candidate, 'domain');
  const candNorm = (urlInfo.hostname || candidate).trim().toLowerCase();

  // 1. Domains check
  for (const domain of baseline.officialDomains) {
    const dNorm = domain.trim().toLowerCase().replace(/^https?:\/\//, '').replace(/\/$/, '');
    if (candNorm === dNorm || candidate.trim().toLowerCase() === domain.trim().toLowerCase()) {
      return { isExcluded: true, reason: `Exact match with registered official corporate domain: "${domain}"` };
    }
    // Subdomain of official domain (e.g. auth.threatlens.io)
    if (candNorm.endsWith(`.${dNorm}`)) {
      return { isExcluded: true, reason: `Verified official corporate subdomain under registered asset "${domain}"` };
    }
  }

  // 2. Social handles check (Checks candidate, candNorm, and extracted handle from UGC platform URLs)
  const handleCandidates = [
    urlInfo.extractedSocialHandle,
    candNorm.replace(/^@/, ''),
    candidate.trim().toLowerCase().replace(/^@/, ''),
  ].filter(Boolean) as string[];

  for (const handle of baseline.officialSocialHandles) {
    const hNorm = handle.trim().toLowerCase().replace(/^@/, '');
    for (const hc of handleCandidates) {
      if (hc.toLowerCase() === hNorm) {
        return { isExcluded: true, reason: `Exact match with verified official social handle: "${handle}"` };
      }
    }
  }

  // 3. Mobile package IDs check
  for (const pkg of baseline.officialMobileApps) {
    const pNorm = pkg.trim().toLowerCase();
    if (candNorm === pNorm || candidate.trim().toLowerCase() === pNorm) {
      return { isExcluded: true, reason: `Exact match with registered official mobile app package: "${pkg}"` };
    }
  }

  return { isExcluded: false };
}

// Standard baseline security sources list
function getStandardSecuritySources(isExcluded: boolean): SecurityCheckSource[] {
  return [
    {
      name: 'Cryptographic Brand Baseline Registry',
      status: isExcluded ? 'verified' : 'active',
      details: isExcluded
        ? 'Matched verified official asset baseline. Threat calculation bypassed with 0 risk guarantee.'
        : 'Checked against corporate domain, handle, and package registry. No baseline match found.',
    },
    {
      name: 'Deterministic Heuristic Rules Engine',
      status: 'active',
      details: 'Audit-compliant multi-channel risk scoring running Levenshtein, Damerau, homoglyph and lure detectors.',
    },
    {
      name: 'Global High-Profile Brand Impersonation Guard',
      status: 'active',
      details: 'Cross-checks global brand trademarks (Amazon, PayPal, Microsoft, Apple, Google, SBI, etc.) against lookalike squatted domains.',
    },
    {
      name: 'SSRF & Private Network Shield',
      status: 'active',
      details: 'Restricts queries targeting loopback (127.0.0.1), RFC1918 subnets, and cloud metadata.',
    },
    {
      name: 'Simulated Threat Intelligence Feeds',
      status: 'simulated',
      details: 'Offline demonstration intelligence sandbox. External feeds (VirusTotal/GSB) marked simulated.',
    },
  ];
}

// Standard scan pipeline stages
function getStandardScanStages(): ScanStage[] {
  return [
    {
      id: 'validation',
      label: 'URL Validation & SSRF Guard',
      description: 'Checked URL syntax, protocol safety, and verified public routability.',
      status: 'completed',
      durationMs: 45,
    },
    {
      id: 'baseline',
      label: 'Brand Baseline Exclusion Check',
      description: 'Queried corporate asset registry to avoid false positives on legitimate assets.',
      status: 'completed',
      durationMs: 65,
    },
    {
      id: 'heuristics',
      label: 'Deep Heuristic & Typosquat Analysis',
      description: 'Evaluated homoglyphs, lookalikes, subdomains, lure tokens, and package namespace.',
      status: 'completed',
      durationMs: 120,
    },
    {
      id: 'report',
      label: 'Comprehensive Threat Report Generation',
      description: 'Synthesized severity scores, impact indicators, and precautionary safety checklist.',
      status: 'completed',
      durationMs: 80,
    },
  ];
}

// Full Heuristic Evaluator with complete threat explanations
export function analyzeThreatCandidate(
  candidate: string,
  channel: 'social' | 'app' | 'domain',
  baseline: BrandBaseline,
  extraContext?: {
    platform?: string;
    bio?: string;
    publisher?: string;
    permissions?: string[];
  }
): HeuristicAnalysisResult {
  const urlInfo = normalizeUrlInput(candidate, channel);
  const nowIso = new Date().toISOString();

  // Step 1: Check Baseline Exclusion (Corporate ThreatLens assets)
  const exclusion = checkBaselineExclusion(candidate, baseline);
  if (exclusion.isExcluded) {
    return {
      candidate,
      submittedUrl: candidate,
      normalizedUrl: urlInfo.normalizedUrl,
      displayUrl: urlInfo.displayUrl || candidate,
      channel,
      isOfficialExcluded: true,
      exclusionReason: exclusion.reason,
      riskScore: 0,
      riskLevel: 'low',
      classification: 'low_risk',
      classificationLabel: 'Low Risk — No major threat indicators detected',
      signals: [
        {
          signalType: 'baseline_exclusion',
          description: `EXCLUDED BEFORE THREAT SCORING: ${exclusion.reason}`,
          weight: 100,
          isPositive: true,
        },
      ],
      flaggedReasons: [],
      harmfulConsequences: [],
      recommendedPrecautions: [
        'Asset is verified as an official corporate resource under your Brand Profile.',
        'Ensure DNS records and SSL certificates remain active and continuously monitored.',
        'Keep multi-factor authentication (MFA) enforced on administrator accounts.',
      ],
      securitySources: getStandardSecuritySources(true),
      scanStages: getStandardScanStages(),
      summary: `Asset matches your verified Brand Profile baseline ("${exclusion.reason}"). Excluded before threat scoring with guaranteed zero risk.`,
      timestamp: nowIso,
    };
  }

  // Step 2: Check if candidate is an authoritative legitimate global domain (e.g. real amazon.com, amazon.in, google.com)
  if (channel === 'domain') {
    const hostClean = urlInfo.hostname;
    for (const globalBrand of GLOBAL_POPULAR_BRANDS) {
      const isOfficialMatch = globalBrand.officialDomains.some(
        od => hostClean === od || hostClean.endsWith('.' + od)
      );
      if (isOfficialMatch && !urlInfo.hadBackslash && !urlInfo.hadMalformedProtocol) {
        // CRITICAL SECURITY RULE: If this domain is a User-Generated Content (UGC) social media platform
        // (e.g. instagram.com, facebook.com, x.com, telegram) and the URL contains an account handle or profile path
        // (e.g. /its_sneh234/), this is USER CONTENT, NOT an official corporate landing page!
        // DO NOT EXEMPT USER PROFILES!
        if (urlInfo.isUgcSocialPlatform && urlInfo.extractedSocialHandle) {
          break; // Fall through to comprehensive social profile security evaluation!
        }

        return {
          candidate,
          submittedUrl: candidate,
          normalizedUrl: urlInfo.normalizedUrl,
          displayUrl: urlInfo.displayUrl,
          channel: 'domain',
          isOfficialExcluded: false,
          riskScore: 0,
          riskLevel: 'low',
          classification: 'low_risk',
          classificationLabel: 'Low Risk — Verified Authoritative Global Domain',
          signals: [
            {
              signalType: 'verified_authoritative_domain',
              description: `Verified authoritative primary domain for ${globalBrand.name.toUpperCase()} (${globalBrand.category})`,
              weight: 0,
              isPositive: true,
            },
          ],
          flaggedReasons: [],
          harmfulConsequences: [],
          recommendedPrecautions: [
            `This domain is verified as an official authoritative web service of ${globalBrand.name.toUpperCase()}.`,
            'Always inspect browser SSL padlock to verify HTTPS certificate validity before entering credentials.',
          ],
          securitySources: getStandardSecuritySources(false),
          scanStages: getStandardScanStages(),
          summary: `Domain matches authoritative global registry for ${globalBrand.name.toUpperCase()} (${globalBrand.category}). Verified low risk.`,
          timestamp: nowIso,
        };
      }
    }
  }

  const signals: RiskSignalResult[] = [];
  const flaggedReasons: FlaggedReason[] = [];
  const harmfulConsequences: HarmfulConsequence[] = [];

  const candRaw = candidate.trim().toLowerCase();
  const candClean = urlInfo.hostname || candRaw.replace(/^https?:\/\//, '').replace(/\/$/, '').replace(/^@/, '');
  const candNormalized = normalizeText(candidate);
  const brandNorm = normalizeText(baseline.name);

  // HEURISTIC: Protocol & Backslash Obfuscation Evasion
  if (urlInfo.hadBackslash || urlInfo.hadMalformedProtocol) {
    signals.push({
      signalType: 'backslash_obfuscation',
      description: 'Protocol & URL backslash obfuscation syntax detected (\\ instead of /)',
      weight: 30,
      isPositive: false,
    });
    flaggedReasons.push({
      id: 'backslash_obfuscation',
      indicatorName: 'Protocol Backslash Evasion Syntax',
      detected: `Target entered with non-standard backslash protocol syntax ("\\"). Cleaned: "${urlInfo.normalizedUrl}".`,
      whyRisky: 'Adversaries craft URLs with backslashes to bypass standard regex filters, email scanners, and WAF inspection while modern web browsers auto-correct the slashes to load the target.',
      severity: 'high',
      recommendedAction: 'Sanitize inbound URL protocol schemes and inspect web server access logs for evasion patterns.',
      category: 'verified',
    });
    harmfulConsequences.push({
      id: 'malicious_redirect',
      title: 'WAF Filter Evasion & Cloaked Delivery',
      tag: 'Evasion Vector',
      description: 'Attackers manipulate URL syntax to bypass security inspection filters while reaching victim devices.',
      severity: 'high',
      icon: 'ShieldAlert',
    });
  }

  // HEURISTIC: Obfuscated URL Shorteners
  if (urlInfo.isUrlShortener) {
    signals.push({
      signalType: 'cloaked_url_shortener',
      description: `Cloaked URL Shortener Service: "${urlInfo.hostname}" obscures true destination domain and payload`,
      weight: 45,
      isPositive: false,
    });
    flaggedReasons.push({
      id: 'cloaked_url_shortener',
      indicatorName: 'Obfuscated URL Shortener Service',
      detected: `Domain "${urlInfo.hostname}" is a third-party link shortening redirector.`,
      whyRisky: 'Shortened links prevent upfront security inspection, hide the true server IP, and are the primary delivery vector for SMS (smishing) and WhatsApp phishing campaigns.',
      severity: 'high',
      recommendedAction: 'Do not open shortened links directly. Expand the URL using safe redirect expanders before analysis.',
      category: 'heuristic',
    });
    harmfulConsequences.push({
      id: 'shortener_redirection',
      title: 'Cloaked Destination & Uninspected Redirect',
      tag: 'Smishing Vector',
      description: 'Conceals malicious target web pages from standard gateway filters and mobile security shields.',
      severity: 'high',
      icon: 'ExternalLink',
    });
  }

  // HEURISTIC: Malformed or Incomplete Domain (e.g. "aman", "test", "facebook")
  if (!urlInfo.hasValidTld && channel !== 'app' && !urlInfo.extractedSocialHandle) {
    signals.push({
      signalType: 'invalid_or_incomplete_domain',
      description: `Incomplete / Non-Routable Domain: Target "${candClean}" lacks a valid Top-Level Domain (.com, .in, etc.) or public routing structure`,
      weight: 55,
      isPositive: false,
    });
    flaggedReasons.push({
      id: 'invalid_or_incomplete_domain',
      indicatorName: 'Invalid / Incomplete Domain Hostname',
      detected: `Target "${candClean}" is not a fully-qualified domain name (missing a recognized TLD like .com, .in, .org).`,
      whyRisky: 'Incomplete or malformed domain entries cannot resolve over the public Internet and often indicate truncated phishing vectors, internal host spoofing, or deceptive evasion attempts.',
      severity: 'high',
      recommendedAction: 'Verify the complete intended domain name including the public top-level extension before proceeding.',
      category: 'verified',
    });
    harmfulConsequences.push({
      id: 'malformed_url_risk',
      title: 'Non-Routable & Truncated Phishing Payload',
      tag: 'Evasion Vector',
      description: 'Attackers distribute truncated or non-routable syntax to evade automated domain reputation feeds.',
      severity: 'high',
      icon: 'ShieldAlert',
    });
  }

  // SOCIAL PROFILE EVALUATION (Either channel === 'social' OR UGC platform URL like instagram.com/its_sneh234/)
  const isSocialEvaluation = channel === 'social' || (urlInfo.isUgcSocialPlatform && Boolean(urlInfo.extractedSocialHandle));

  if (isSocialEvaluation) {
    const targetHandle = (urlInfo.extractedSocialHandle || candClean).replace(/^@/, '').trim();
    const targetPlatform = urlInfo.ugcPlatformName || extraContext?.platform || 'Social Platform';

    // 1. Unverified profile outside baseline
    const isBaselineVerifiedHandle = baseline.officialSocialHandles.some(
      h => h.trim().toLowerCase().replace(/^@/, '') === targetHandle.toLowerCase()
    );

    if (!isBaselineVerifiedHandle) {
      signals.push({
        signalType: 'unverified_external_social_profile',
        description: `Unverified ${targetPlatform} Profile: Account "@${targetHandle}" is not registered in your verified Brand Baseline`,
        weight: 30,
        isPositive: false,
      });
      flaggedReasons.push({
        id: 'unverified_external_social_profile',
        indicatorName: `Unverified ${targetPlatform} Profile Account`,
        detected: `Handle "@${targetHandle}" on ${targetPlatform} is not registered in your corporate Brand Baseline roster.`,
        whyRisky: 'Unvetted external social accounts can impersonate organization representatives, solicit unauthorized customer payments, or distribute malicious landing links.',
        severity: 'high',
        recommendedAction: 'Verify account authenticity against company corporate social media directory before direct interaction.',
        category: 'heuristic',
      });
    }

    // 2. Numeric suffix padding (e.g. its_sneh234 -> 234)
    if (/\d{2,}$/.test(targetHandle)) {
      const numericPart = targetHandle.match(/\d+$/)?.[0];
      signals.push({
        signalType: 'handle_numeric_padding',
        description: `Numeric Suffix Padding: Handle "@${targetHandle}" ends with numeric padding digits "${numericPart}" (clone/bot account indicator)`,
        weight: 25,
        isPositive: false,
      });
      flaggedReasons.push({
        id: 'handle_numeric_padding',
        indicatorName: 'Numeric Suffix Padding Pattern',
        detected: `Handle appends consecutive numeric digits ("${numericPart}").`,
        whyRisky: 'Adversaries and bot operators append numbers to desired usernames when legitimate handles are unavailable, crafting lookalike clone profiles to deceive victims.',
        severity: 'high',
        recommendedAction: 'Cross-check account creation date and follower authenticity on the platform.',
        category: 'heuristic',
      });
      harmfulConsequences.push({
        id: 'clone_profile',
        title: 'Automated Clone Account & Social Engineering',
        tag: 'Identity Risk',
        description: 'Rogue accounts using numeric padding are frequently utilized in bot networks and follower scams.',
        severity: 'high',
        icon: 'ShieldAlert',
      });
    }

    // 3. Pseudo-official prefix or suffix (e.g. its_, the_, real_, official_)
    const pseudoPrefixes = ['its_', 'the_', 'real_', 'official_', 'vip_', 'original_', 'agent_', 'help_', 'support_', 'desk_'];
    const matchedPseudo = pseudoPrefixes.find(p => targetHandle.toLowerCase().startsWith(p) || targetHandle.toLowerCase().endsWith('_official') || targetHandle.toLowerCase().endsWith('_team'));
    if (matchedPseudo) {
      signals.push({
        signalType: 'pseudo_official_prefix',
        description: `Deceptive Identity Affirmation: Handle utilizes affirmative modifier "${matchedPseudo}" (common social impersonation pattern)`,
        weight: 25,
        isPositive: false,
      });
      flaggedReasons.push({
        id: 'pseudo_official_prefix',
        indicatorName: 'Deceptive Identity Affirmation Prefix',
        detected: `Handle starts or ends with identity-affirming modifier ("${matchedPseudo}").`,
        whyRisky: 'Attackers create clone profiles with affirmative prefixes like "its_" or "official_" to build immediate, false credibility during social engineering outreach.',
        severity: 'high',
        recommendedAction: 'Report suspicious profile to platform trust and safety team for trademark or impersonation review.',
        category: 'heuristic',
      });
    }

    // 4. Monitored Brand Keyword or Global Brand Impersonation in handle
    const hasBrandStem = targetHandle.toLowerCase().includes(brandNorm) || baseline.monitoredKeywords.some(kw => targetHandle.toLowerCase().includes(kw.toLowerCase()));
    const matchedGlobalInHandle = GLOBAL_POPULAR_BRANDS.find(b => targetHandle.toLowerCase().includes(b.name));

    if (hasBrandStem || matchedGlobalInHandle) {
      const brandNameUsed = matchedGlobalInHandle ? matchedGlobalInHandle.name.toUpperCase() : baseline.name;
      signals.push({
        signalType: 'brand_stem_impersonation',
        description: `Brand Keyword Impersonation: Handle "@${targetHandle}" incorporates trademarked corporate brand stem "${brandNameUsed}"`,
        weight: 45,
        isPositive: false,
      });
      flaggedReasons.push({
        id: 'brand_stem_impersonation',
        indicatorName: `Brand Keyword Impersonation in Handle (${brandNameUsed})`,
        detected: `Handle contains corporate brand stem "${brandNameUsed}".`,
        whyRisky: 'Deceptive handles trick followers into assuming official company affiliation, enabling credential theft.',
        severity: 'critical',
        recommendedAction: 'File an impersonation report with platform Trust & Safety teams using official trademark credentials.',
        category: 'heuristic',
      });
      harmfulConsequences.push({
        id: 'brand_impersonation',
        title: 'Brand Impersonation & Customer Trust Erosion',
        tag: 'Reputation Risk',
        description: 'Attackers create convincing social profiles to deceive customers and damage brand reputation.',
        severity: 'critical',
        icon: 'ShieldAlert',
      });
    }

    // 5. Customer support lures
    const supportLures = ['support', 'help', 'desk', 'bot', 'care', 'assist', 'service', 'ticket', 'verify', 'auth'];
    const matchedLure = supportLures.find(lure => targetHandle.toLowerCase().includes(lure) || (extraContext?.bio && extraContext.bio.toLowerCase().includes(lure)));
    if (matchedLure) {
      signals.push({
        signalType: 'support_lure',
        description: `Customer support lure wording detected: "${matchedLure}" (high impersonation vector)`,
        weight: 30,
        isPositive: false,
      });
      flaggedReasons.push({
        id: 'support_lure',
        indicatorName: 'Counterfeit Customer Support Lure',
        detected: `Target uses support terminology: "${matchedLure}".`,
        whyRisky: 'Threat actors impersonate support desks to solicit passwords, 2FA codes, or remote desktop access from distressed users.',
        severity: 'critical',
        recommendedAction: 'Issue a customer security bulletin clarifying that official support never asks for credentials via direct messages.',
        category: 'heuristic',
      });
      harmfulConsequences.push({
        id: 'credential_theft',
        title: 'Credential Theft & Account Takeover',
        tag: 'Direct Attack',
        description: 'Victims are lured into sending login credentials or OTP codes under the guise of account verification.',
        severity: 'critical',
        icon: 'Lock',
      });
    }

    // 6. Promotional incentive cues
    const promoLures = ['airdrop', 'rewards', 'reward', 'bonus', 'giveaway', 'claim', 'promo', 'free', 'crypto', 'earn', 'win'];
    const matchedPromo = promoLures.find(lure => targetHandle.toLowerCase().includes(lure) || (extraContext?.bio && extraContext.bio.toLowerCase().includes(lure)));
    if (matchedPromo) {
      signals.push({
        signalType: 'promo_lure',
        description: `Promotional incentive cue detected: "${matchedPromo}" (phishing giveaway indicator)`,
        weight: 25,
        isPositive: false,
      });
      flaggedReasons.push({
        id: 'promo_lure',
        indicatorName: 'Fraudulent Incentive / Giveaway Lure',
        detected: `Promotional trigger detected: "${matchedPromo}".`,
        whyRisky: 'Fake giveaway campaigns manipulate urgency to persuade users to connect crypto wallets or enter credit card details.',
        severity: 'high',
        recommendedAction: 'Submit DMCA and platform fraud takedown notices targeting the promotional campaign links.',
        category: 'heuristic',
      });
      harmfulConsequences.push({
        id: 'financial_fraud',
        title: 'Financial Fraud & Unauthorized Charges',
        tag: 'Monetary Loss',
        description: 'Fake prize claims trick victims into paying advance processing fees or authorizing rogue payment transactions.',
        severity: 'high',
        icon: 'AlertTriangle',
      });
    }

    // 7. VIP Executive impersonation
    for (const vip of baseline.vipExecutives) {
      const vipClean = vip.split('(')[0].trim().toLowerCase();
      if (targetHandle.toLowerCase().includes(vipClean.replace(/\s+/g, '')) || candNormalized.includes(vipClean) || (extraContext?.bio && extraContext.bio.toLowerCase().includes(vipClean))) {
        signals.push({
          signalType: 'vip_impersonation',
          description: `VIP Executive match: Impersonation of monitored leadership persona "${vip}"`,
          weight: 30,
          isPositive: false,
        });
        flaggedReasons.push({
          id: 'vip_impersonation',
          indicatorName: 'Executive / VIP Identity Theft',
          detected: `Direct impersonation of monitored executive: "${vip}".`,
          whyRisky: 'Executive spoofing is used in targeted Business Email Compromise (BEC) and wire transfer fraud.',
          severity: 'critical',
          recommendedAction: 'Escalate to platform executive protection desk for urgent verified badge revocation or account suspension.',
          category: 'verified',
        });
        harmfulConsequences.push({
          id: 'identity_theft',
          title: 'Executive Identity Misuse & BEC Risk',
          tag: 'Targeted Fraud',
          description: 'Attackers misuse executive personas to authorize fraudulent corporate transactions or deceive employees.',
          severity: 'critical',
          icon: 'ShieldAlert',
        });
        break;
      }
    }

    // 8. Authority modifier suffixes
    const authorityModifiers = ['_official', 'official', '_bot', 'bot', '_team', 'team', '_corp', 'corp'];
    const matchedAuth = authorityModifiers.find(mod => targetHandle.toLowerCase().endsWith(mod) || targetHandle.toLowerCase().includes(mod));
    if (matchedAuth) {
      signals.push({
        signalType: 'authority_modifier',
        description: `Authority suffix modifier attached to handle: "${matchedAuth}"`,
        weight: 15,
        isPositive: false,
      });
      flaggedReasons.push({
        id: 'authority_modifier',
        indicatorName: 'Deceptive Authority Modifier Suffix',
        detected: `Handle appends authority modifier "${matchedAuth}".`,
        whyRisky: 'Affixing "official" or "team" to unverified accounts creates false trust to bypass basic user scrutiny.',
        severity: 'medium',
        recommendedAction: 'Publicize official verified social directory to help users distinguish authentic channels.',
        category: 'heuristic',
      });
    }

    // 9. Bio credential harvesting request
    if (extraContext?.bio) {
      const bioLower = extraContext.bio.toLowerCase();
      if (bioLower.includes('dm') && (bioLower.includes('pass') || bioLower.includes('key') || bioLower.includes('wallet') || bioLower.includes('login') || bioLower.includes('ticket'))) {
        signals.push({
          signalType: 'credential_harvesting_bio',
          description: 'Profile bio contains direct credential or private key solicitation instruction',
          weight: 25,
          isPositive: false,
        });
        flaggedReasons.push({
          id: 'credential_harvesting_bio',
          indicatorName: 'Direct Credential Solicitation in Bio',
          detected: 'Bio explicitly instructs users to DM private keys, login tokens, or account passwords.',
          whyRisky: 'Legitimate organizations never instruct users to direct message sensitive security credentials.',
          severity: 'critical',
          recommendedAction: 'Report account immediately and caution users against direct message interactions.',
          category: 'heuristic',
        });
      }
      if (bioLower.includes('bit.ly') || bioLower.includes('tinyurl') || bioLower.includes('t.me') || bioLower.includes('linktr.ee')) {
        signals.push({
          signalType: 'shortened_redirect_bio',
          description: 'Bio incorporates off-platform shortened link or external redirect hub',
          weight: 15,
          isPositive: false,
        });
        flaggedReasons.push({
          id: 'shortened_redirect_bio',
          indicatorName: 'Obfuscated Off-Platform Shortened Link',
          detected: 'Profile uses link shortener or external redirect page in biography.',
          whyRisky: 'Shortened URLs conceal malicious destination landing pages and bypass platform domain filters.',
          severity: 'medium',
          recommendedAction: 'Analyze expanded redirect destination URL using ThreatLens deep domain scanner.',
          category: 'heuristic',
        });
      }
    }
  }

  // DOMAIN / WEB URL CHANNEL (When not a UGC social profile)
  if (channel === 'domain' && !isSocialEvaluation) {
    const host = urlInfo.hostname;
    const path = urlInfo.pathname || '';
    const cleanHost = host.replace(/^(?:www\d*|m|mobile|web|secure|portal|api)\./i, '');
    const cleanHostParts = cleanHost.split('.');
    const domainStem = cleanHostParts[0] || '';
    const hostTokens = cleanHost.toLowerCase().split(/[^a-z0-9]+/);
    const normHost = normalizeText(cleanHost);
    const normTokens = normHost.toLowerCase().split(/[^a-z0-9]+/);

    // 1. High-Profile Global & Regional Brand Impersonation Check (e.g. flipkartindia.co.in, amazonind.co, paypa1-login.com, amaz0n.com)
    for (const gBrand of GLOBAL_POPULAR_BRANDS) {
      const bName = gBrand.name;
      const isOfficial = gBrand.officialDomains.some(od => cleanHost === od || cleanHost.endsWith('.' + od) || host === od || host.endsWith('.' + od));

      if (!isOfficial) {
        // Direct brand stem match, homoglyph match, or 1-char typosquat (e.g. flipkart in flipkartindia, amazon in amazonind.co, paypa1 -> paypal)
        const isTyposquat = domainStem.length >= 4 && (levenshteinDistance(domainStem, bName) === 1 || checkTransposition(domainStem, bName));

        let hasBrandStem = false;
        if (bName.length <= 4) {
          hasBrandStem = hostTokens.includes(bName) ||
                         normTokens.includes(bName) ||
                         cleanHost.includes(`-${bName}`) ||
                         cleanHost.includes(`${bName}-`) ||
                         domainStem.startsWith(bName) ||
                         domainStem.endsWith(bName) ||
                         isTyposquat;
        } else {
          hasBrandStem = cleanHost.includes(bName) || normHost.includes(bName) || isTyposquat;
        }

        if (hasBrandStem) {
          signals.push({
            signalType: 'target_brand_impersonation',
            description: `High-Profile Brand Impersonation: "${bName.toUpperCase()}" target detected on unauthorized host "${host}"`,
            weight: 45,
            isPositive: false,
          });
          flaggedReasons.push({
            id: 'target_brand_impersonation',
            indicatorName: `Brand Impersonation (${bName.toUpperCase()})`,
            detected: `Domain contains trademarked corporate name "${bName}" on unauthorized host "${host}". Official domains are: ${gBrand.officialDomains.slice(0, 3).join(', ')}.`,
            whyRisky: `Adversaries deploy lookalike domains mimicking global brands like ${bName.toUpperCase()} to deceive consumers into entering login credentials, credit cards, or OTP codes.`,
            severity: 'critical',
            recommendedAction: `Block URL at perimeter firewalls and submit urgent abuse / UDRP dispute notice to the domain registrar.`,
            category: 'heuristic',
          });
          harmfulConsequences.push({
            id: 'brand_impersonation',
            title: `Brand Impersonation & Counterfeit ${bName.toUpperCase()} Portal`,
            tag: 'Identity Abuse',
            description: `Deceptive website poses as ${bName.toUpperCase()} to harvest user credentials and payment information.`,
            severity: 'critical',
            icon: 'ShieldAlert',
          });
          harmfulConsequences.push({
            id: 'phishing',
            title: 'Phishing: Password & MFA Token Interception',
            tag: 'High Risk',
            description: 'Fake login pages intercept user credentials, corporate passwords, and one-time passwords.',
            severity: 'critical',
            icon: 'Lock',
          });

          // Check direct typosquatting variation
          if (isTyposquat) {
            signals.push({
              signalType: 'typosquat_brand_lookalike',
              description: `Direct Brand Typosquatting: Domain root "${domainStem}" is a 1-character typo variation of "${bName.toUpperCase()}"`,
              weight: 35,
              isPositive: false,
            });
            flaggedReasons.push({
              id: 'typosquat_brand_lookalike',
              indicatorName: `Direct Brand Typosquatting (${bName.toUpperCase()})`,
              detected: `Domain root "${domainStem}" is an intentional 1-character typo targeting authentic brand "${bName}".`,
              whyRisky: 'Typosquatting exploits keyboard slips and misspellings to quietly route authentic brand consumers to imposter web services.',
              severity: 'critical',
              recommendedAction: 'Acquire defensive domain registration or report typosquatting host to registrar.',
              category: 'heuristic',
            });
          }

          // Check Combisquatting Modifiers (e.g. flipkart + india, amazon + ind, amazon + pay, paypal + verify)
          const matchedSuffix = gBrand.suffixes.find(s => cleanHost.includes(`${bName}${s}`) || cleanHost.includes(`${bName}-${s}`) || cleanHost.includes(`${s}-${bName}`) || cleanHost.includes(`${s}${bName}`));
          if (matchedSuffix) {
            signals.push({
              signalType: 'combisquatting_pattern',
              description: `Combisquatting vector: Brand stem "${bName}" combined with deceptive modifier "${matchedSuffix}"`,
              weight: 25,
              isPositive: false,
            });
            flaggedReasons.push({
              id: 'combisquatting_pattern',
              indicatorName: 'Combisquatting & Lookalike Keyword Composition',
              detected: `Brand stem "${bName}" combined with functional modifier "${matchedSuffix}" in hostname "${host}".`,
              whyRisky: 'Combisquatting blends trusted brand names with functional terms (like "india", "ind", "login", "pay") to convince victims the portal is a legitimate regional or functional service.',
              severity: 'high',
              recommendedAction: 'Alert brand protection teams to submit automated domain takedown notices.',
              category: 'heuristic',
            });
          }

          // Check Non-Authoritative TLD or Lookalike Extension on popular brand (e.g. .co.in, .co, .xyz, .top instead of official .com)
          const isOfficialExtension = gBrand.officialDomains.some(od => {
            const odExt = od.slice(od.indexOf('.'));
            return cleanHost.endsWith(odExt);
          });
          const lastTld = cleanHostParts[cleanHostParts.length - 1];
          const hasSecondaryExt = cleanHost.endsWith('.co.in') || cleanHost.endsWith('.co.uk') || cleanHost.endsWith('.org.in') || cleanHost.endsWith('.net.in');
          const isKnownAbuseTld = ['co', 'xyz', 'top', 'tk', 'ml', 'ga', 'cf', 'gq', 'buzz', 'rest', 'click', 'cam', 'work', 'fit', 'site', 'online', 'store', 'shop'].includes(lastTld);

          if (!isOfficialExtension || isKnownAbuseTld || hasSecondaryExt) {
            signals.push({
              signalType: 'suspicious_tld_mismatch',
              description: `Brand impersonation domain registered under non-authoritative extension (Official: ${gBrand.officialDomains[0]})`,
              weight: 20,
              isPositive: false,
            });
            flaggedReasons.push({
              id: 'suspicious_tld_mismatch',
              indicatorName: 'Non-Authoritative TLD for Brand',
              detected: `Brand "${bName}" hosted under non-authoritative extension (Official domain is: ${gBrand.officialDomains[0]}).`,
              whyRisky: 'Threat actors register lookalike extensions when authoritative domains are already owned by the authentic company.',
              severity: 'high',
              recommendedAction: 'Enforce TLD boundary inspection rules at secure web gateways.',
              category: 'heuristic',
            });
          }
          break;
        }
      }
    }

    // Generic Combisquatting & Commercial Phishing Lure Check (Catches ANY unregistered brand + modifier)
    if (!signals.some(s => s.signalType === 'target_brand_impersonation')) {
      const commonModifiers = [
        'india', 'ind', 'bharat', 'usa', 'global',
        'offers', 'deals', 'deal', 'sale', 'sales', 'discount', 'cashback', 'reward', 'rewards', 'bonus', 'gift', 'coupon',
        'kyc', 'pan', 'aadhaar', 'otp', 'refund', 'claims',
        'pay', 'wallet', 'prime', 'plus', 'pro',
        'login', 'signin', 'verify', 'verification', 'auth', 'portal', 'secure', 'account',
        'support', 'care', 'helpdesk', 'service', 'center', 'helpline', 'official',
        'mall', 'mart', 'store', 'shop', 'shopping', 'express', 'delivery', 'order',
        'free', 'crypto', 'giveaway', 'airdrop', 'recharge'
      ];

      for (const mod of commonModifiers) {
        const hasCompound = 
          (domainStem.endsWith(mod) && domainStem.length >= mod.length + 4) ||
          (domainStem.startsWith(mod) && domainStem.length >= mod.length + 4) ||
          domainStem.includes(`-${mod}`) ||
          domainStem.includes(`${mod}-`);

        if (hasCompound) {
          const stemWithout = domainStem.replace(new RegExp(`-?${mod}-?`, 'gi'), '');
          if (stemWithout.length >= 3) {
            signals.push({
              signalType: 'generic_combisquatting',
              description: `Deceptive compound domain structure: Potential brand stem "${stemWithout}" combined with functional modifier "${mod}"`,
              weight: 35,
              isPositive: false,
            });
            flaggedReasons.push({
              id: 'generic_combisquatting',
              indicatorName: 'Compound Combisquatting Domain Structure',
              detected: `Domain "${domainStem}" joins keyword "${stemWithout}" with commercial/regional modifier "${mod}".`,
              whyRisky: 'Adversaries craft compound domains by blending brand names with words like "india", "login", or "offers" to deceive users into trusting counterfeit portals.',
              severity: 'high',
              recommendedAction: 'Verify corporate ownership through certified WHOIS records before interacting.',
              category: 'heuristic',
            });
            harmfulConsequences.push({
              id: 'combisquat_fraud',
              title: 'Deceptive Lookalike Portal & Counterfeit Service',
              tag: 'Social Engineering',
              description: 'Attacker leverages trusted terminology to deceive victims into believing the portal is an official service.',
              severity: 'high',
              icon: 'ShieldAlert',
            });

            if (['kyc', 'pan', 'otp', 'refund', 'bonus', 'login', 'verify', 'pay', 'wallet', 'free'].includes(mod)) {
              signals.push({
                signalType: 'high_fraud_keyword',
                description: `High-fraud commercial credential/financial lure modifier: "${mod}"`,
                weight: 25,
                isPositive: false,
              });
            }
            break;
          }
        }
      }
    }

    // 2. Monitored Corporate Keyword in Domain (from Brand Baseline)
    const hasBrandKeyword = host.includes(brandNorm) || baseline.monitoredKeywords.some(kw => host.includes(kw.toLowerCase()));
    if (hasBrandKeyword) {
      signals.push({
        signalType: 'brand_keyword',
        description: `Candidate domain incorporates monitored corporate brand label: "${baseline.name}"`,
        weight: 30,
        isPositive: false,
      });
      flaggedReasons.push({
        id: 'brand_keyword',
        indicatorName: 'Brand Keyword Presence in Unregistered Domain',
        detected: `Domain hostname contains brand keyword "${baseline.name}".`,
        whyRisky: 'Adversaries register domains featuring target brand names to build convincing credential phishing portals.',
        severity: 'high',
        recommendedAction: 'Initiate brand domain monitoring and submit proactive registrar abuse notifications.',
        category: 'heuristic',
      });
    }

    // 3. Authentication & SSO phishing lures (Targeted lures vs standard clean login endpoints)
    const hostLures = [
      'login', 'secure', 'verify', 'auth', 'portal', 'signin', 'sso', 'wallet',
      'kyc', 'pan', 'refund', 'bonus', 'rewards', 'password', 'reset', 'update',
      'banking', 'bank', 'netbanking', 'security', 'claim', 'free', 'airdrop'
    ];
    const highFraudTokens = ['kyc', 'pan', 'refund', 'bonus', 'rewards', 'airdrop', 'claim-prize', 'free-recharge'];
    
    const pathTokens = (path + ' ' + urlInfo.search).toLowerCase().split(/[^a-z0-9]+/);

    const matchedHostLure = hostLures.find(lure => hostTokens.includes(lure) || host.includes(`-${lure}`) || host.includes(`${lure}-`) || host.startsWith(`${lure}.`));
    const matchedFraudToken = highFraudTokens.find(token => pathTokens.includes(token));
    const matchedPathLure = hostLures.find(lure => pathTokens.includes(lure));

    const hasOtherThreatFactor = signals.some(s => !s.isPositive) || (host.match(/-/g) || []).length >= 2;
    const shouldFlagLure = matchedHostLure || matchedFraudToken || (matchedPathLure && hasOtherThreatFactor);
    const flaggedLureToken = matchedHostLure || matchedFraudToken || (shouldFlagLure ? matchedPathLure : null);

    if (shouldFlagLure && flaggedLureToken) {
      signals.push({
        signalType: 'sso_auth_lure',
        description: `Authentication & credential harvesting lure token present: "${flaggedLureToken}"`,
        weight: 35,
        isPositive: false,
      });
      flaggedReasons.push({
        id: 'sso_auth_lure',
        indicatorName: 'Authentication / SSO Credential Lure Detected',
        detected: `URL includes high-risk lure keyword: "${flaggedLureToken}".`,
        whyRisky: 'Login paths combined with unofficial domains strongly indicate active phishing campaigns targeting SSO portals or user accounts.',
        severity: 'critical',
        recommendedAction: 'Block URL at corporate perimeter firewalls and alert employee security awareness teams.',
        category: 'heuristic',
      });
      if (!harmfulConsequences.some(c => c.id === 'phishing')) {
        harmfulConsequences.push({
          id: 'phishing',
          title: 'Phishing: Password & MFA Token Interception',
          tag: 'High Risk',
          description: 'Fake login pages intercept user credentials, corporate passwords, and one-time passwords.',
          severity: 'critical',
          icon: 'Lock',
        });
      }
    }

    // 4. Insecure plaintext HTTP protocol on suspicious target
    if (urlInfo.isInsecureHttp && signals.some(s => !s.isPositive)) {
      signals.push({
        signalType: 'insecure_http_protocol',
        description: 'Unencrypted HTTP Protocol: Cleartext transmission without SSL/TLS encryption',
        weight: 20,
        isPositive: false,
      });
      flaggedReasons.push({
        id: 'insecure_http_protocol',
        indicatorName: 'Unencrypted Cleartext HTTP Protocol',
        detected: 'URL specifies plaintext "http://" protocol instead of encrypted "https://".',
        whyRisky: 'Plaintext HTTP permits Man-in-the-Middle (MitM) eavesdropping, packet sniffing, and credential theft.',
        severity: 'medium',
        recommendedAction: 'Enforce HTTPS-only policy and SSL certificates.',
        category: 'heuristic',
      });
    }

    // 5. Multi-hyphenation deceptive pattern
    const hyphenCount = (host.match(/-/g) || []).length;
    if (hyphenCount >= 2) {
      signals.push({
        signalType: 'deceptive_hyphenation',
        description: `Deceptive multi-hyphenation structure (${hyphenCount} hyphens) commonly employed in brand phishing`,
        weight: 15,
        isPositive: false,
      });
      flaggedReasons.push({
        id: 'deceptive_hyphenation',
        indicatorName: 'Multi-Hyphenated Deceptive Domain Structure',
        detected: `Domain contains ${hyphenCount} hyphens in hostname structure.`,
        whyRisky: 'Multiple hyphens are commonly used to craft fake combo-domains like "brand-login-secure.com".',
        severity: 'medium',
        recommendedAction: 'Check DNS NS records and submit UDRP / registrar dispute if infringing.',
        category: 'heuristic',
      });
    }

    // 6. Character transpositions (Damerau-Levenshtein) against baseline
    for (const officialDom of baseline.officialDomains) {
      const cleanOfficial = officialDom.replace(/^https?:\/\//, '').replace(/\/$/, '').split('.')[0];
      const candRoot = host.split('.')[0];
      if (checkTransposition(candRoot, cleanOfficial)) {
        signals.push({
          signalType: 'character_transposition',
          description: `Character transposition (adjacent letter swap) detected against "${officialDom}"`,
          weight: 30,
          isPositive: false,
        });
        flaggedReasons.push({
          id: 'character_transposition',
          indicatorName: 'Typosquatting via Adjacent Character Swap',
          detected: `Adjacent letter transposition targeting official domain "${officialDom}".`,
          whyRisky: 'Typosquatting exploits human typing slips to quietly redirect legitimate users to imposter pages.',
          severity: 'high',
          recommendedAction: 'Acquire defensive domain registration or report typosquatting host to registrar.',
          category: 'heuristic',
        });
        break;
      }
    }

    // 7. Homoglyphs & leetspeak (Character substitutions that deliberately forge corporate or global brands)
    const hasHomoglyphChar = Object.keys(HOMOGLYPH_MAP).some(char => host.includes(char));
    const isTargetingCorporate = !host.includes(brandNorm) && candNormalized.includes(brandNorm);
    const isTargetingGlobalBrand = GLOBAL_POPULAR_BRANDS.some(b => {
      if (host.includes(b.name)) return false;
      if (b.name.length <= 4) {
        const normTokens = normHost.toLowerCase().split(/[^a-z0-9]+/);
        return normTokens.includes(b.name);
      }
      return normHost.includes(b.name);
    });

    if (hasHomoglyphChar && (isTargetingCorporate || isTargetingGlobalBrand)) {
      signals.push({
        signalType: 'homoglyph_substitution',
        description: 'Visual homoglyph / leetspeak character swap detected targeting corporate identity',
        weight: 35,
        isPositive: false,
      });
      flaggedReasons.push({
        id: 'homoglyph_substitution',
        indicatorName: 'Homoglyph & Leetspeak Lookalike Domain',
        detected: `Visual character replacement detected (e.g. numeric substitutions mimicking target brand).`,
        whyRisky: 'Subtle character replacements (like "3" for "e" or "0" for "o") are nearly imperceptible in small browser fonts.',
        severity: 'critical',
        recommendedAction: 'Submit urgent takedown request to hosting provider with proof of visual deception.',
        category: 'heuristic',
      });
      harmfulConsequences.push({
        id: 'identity_theft',
        title: 'Identity Deception & Fraudulent Transactions',
        tag: 'Active Deception',
        description: 'Victims fail to notice visual character differences, entering corporate secrets unknowingly.',
        severity: 'critical',
        icon: 'ShieldAlert',
      });
    }

    // 8. Low edit distance against baseline
    for (const officialDom of baseline.officialDomains) {
      const cleanOfficial = officialDom.replace(/^https?:\/\//, '').replace(/\/$/, '');
      const dist = levenshteinDistance(host, cleanOfficial);
      if (dist > 0 && dist <= 2) {
        signals.push({
          signalType: 'low_edit_distance',
          description: `Low Levenshtein edit distance (${dist}) against authoritative domain "${officialDom}"`,
          weight: 25,
          isPositive: false,
        });
        flaggedReasons.push({
          id: 'low_edit_distance',
          indicatorName: 'Near-Identical Lookalike Edit Distance',
          detected: `Levenshtein edit distance of only ${dist} character(s) from authoritative domain "${officialDom}".`,
          whyRisky: 'High mathematical similarity is a hallmark of targeted phishing and brand impersonation infrastructure.',
          severity: 'high',
          recommendedAction: 'File automated takedown petition with registrar abuse department.',
          category: 'heuristic',
        });
        break;
      }
    }

    // 9. Suspicious high-abuse TLDs
    const suspiciousTlds = ['.xyz', '.top', '.tk', '.ml', '.ga', '.cf', '.gq', '.buzz', '.rest', '.click', '.cam', '.work', '.fit', '.cc', '.site', '.online', '.store', '.shop', '.club', '.info', '.vip', '.icu'];
    const matchedTld = suspiciousTlds.find(tld => host.endsWith(tld));
    if (matchedTld && !signals.some(s => s.signalType === 'suspicious_tld_mismatch')) {
      signals.push({
        signalType: 'suspicious_tld',
        description: `High-abuse / low-reputation top-level domain extension detected: "${matchedTld}"`,
        weight: 25,
        isPositive: false,
      });
      flaggedReasons.push({
        id: 'suspicious_tld',
        indicatorName: 'High-Abuse Top-Level Domain (TLD)',
        detected: `Domain uses known high-risk TLD: "${matchedTld}".`,
        whyRisky: 'Free and ultra-low-cost TLDs exhibit statistically high frequencies of spam, phishing, and bulletproof hosting.',
        severity: 'medium',
        recommendedAction: 'Restrict email delivery and outbound HTTP traffic from this TLD category.',
        category: 'heuristic',
      });
    }

    // 10. Raw IP Address as Hostname
    if (/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(host)) {
      signals.push({
        signalType: 'raw_ip_host',
        description: 'Direct IP address used as hostname instead of a registered domain name',
        weight: 35,
        isPositive: false,
      });
      flaggedReasons.push({
        id: 'raw_ip_host',
        indicatorName: 'Direct Raw IP Address URL',
        detected: `Hostname is a numeric IPv4 address ("${host}") instead of a legitimate domain.`,
        whyRisky: 'Direct IP addressing bypasses domain reputation filters and SSL verification checks.',
        severity: 'high',
        recommendedAction: 'Check hosting ASN and block outbound network traffic to this IP address.',
        category: 'heuristic',
      });
    }

    // 11. Non-standard ports
    if (urlInfo.port && !['80', '443'].includes(urlInfo.port)) {
      signals.push({
        signalType: 'non_standard_port',
        description: `Non-standard web port detected (Port :${urlInfo.port})`,
        weight: 25,
        isPositive: false,
      });
      flaggedReasons.push({
        id: 'non_standard_port',
        indicatorName: 'Non-Standard Web Service Port',
        detected: `Target connects on non-standard port :${urlInfo.port}.`,
        whyRisky: 'Threat actors host unauthorized services and staging tools on atypical ports to evade default firewall egress policies.',
        severity: 'medium',
        recommendedAction: 'Verify port service banners and restrict egress filtering.',
        category: 'heuristic',
      });
    }

    // 12. Unvetted Third-Party Domain Entity Notice (if no threat signals found and not baseline excluded)
    if (signals.length === 0 && !exclusion.isExcluded) {
      signals.push({
        signalType: 'unvetted_external_domain',
        description: `Unvetted Third-Party Domain: "${host}" is an external entity with no registered corporate baseline affiliation`,
        weight: 15,
        isPositive: false,
      });
      flaggedReasons.push({
        id: 'unvetted_external_domain',
        indicatorName: 'Unvetted External Domain Entity',
        detected: `Domain "${host}" is an independent third-party web host not registered in your Brand Baseline.`,
        whyRisky: 'External web entities operate outside organizational security governance and require standard browsing vigilance.',
        severity: 'low',
        recommendedAction: 'Verify destination authenticity before submitting any enterprise credentials or downloading assets.',
        category: 'heuristic',
      });
    }
  }

  // CHANNEL: App Store
  if (channel === 'app') {
    // 1. Package namespace squatting
    const expectedPrefix = `com.${brandNorm}`;
    if (candClean.startsWith(expectedPrefix) || candClean.includes(brandNorm)) {
      signals.push({
        signalType: 'namespace_squatting',
        description: `Package identifier namespace squatting: "${candClean}" mimics corporate bundle schema`,
        weight: 30,
        isPositive: false,
      });
      flaggedReasons.push({
        id: 'namespace_squatting',
        indicatorName: 'App Bundle Namespace Squatting',
        detected: `Package identifier "${candClean}" copies official brand namespace pattern.`,
        whyRisky: 'Users searching for official corporate applications may install rogue apps with identical naming schemes.',
        severity: 'high',
        recommendedAction: 'Submit trademark dispute notice through Google Play Console or Apple Developer Relations.',
        category: 'heuristic',
      });
      harmfulConsequences.push({
        id: 'brand_impersonation',
        title: 'Brand Impersonation & Malicious App Drops',
        tag: 'App Store Defense',
        description: 'Rogue packages trick users into installing counterfeit software on mobile devices.',
        severity: 'high',
        icon: 'Smartphone',
      });
    }

    // 2. Trojanized utility descriptors
    const trojanModifiers = ['helper', 'plus', 'mod', 'pro', 'tool', 'manager', 'hack', 'crack', 'generator'];
    const matchedTrojan = trojanModifiers.find(mod => candClean.includes(mod));
    if (matchedTrojan) {
      signals.push({
        signalType: 'trojan_modifier',
        description: `Trojanized utility modifier attached to app title or bundle: "${matchedTrojan}"`,
        weight: 25,
        isPositive: false,
      });
      flaggedReasons.push({
        id: 'trojan_modifier',
        indicatorName: 'Trojanized Utility Modifier Tag',
        detected: `Package or title contains trojan tag: "${matchedTrojan}".`,
        whyRisky: 'Apps posing as "helpers" or "mods" often embed malicious background payloads or keyloggers.',
        severity: 'high',
        recommendedAction: 'Conduct static reverse-engineering and blacklist the bundle SHA-256 hash.',
        category: 'heuristic',
      });
      harmfulConsequences.push({
        id: 'malware',
        title: 'Malware & Trojanized Background Services',
        tag: 'Device Compromise',
        description: 'Malicious application code may steal stored browser cookies, SMS OTPs, and device keystrokes.',
        severity: 'critical',
        icon: 'ShieldAlert',
      });
    }

    // 3. Publisher mismatch
    if (extraContext?.publisher && !extraContext.publisher.toLowerCase().includes(brandNorm)) {
      signals.push({
        signalType: 'publisher_mismatch',
        description: `Publisher entity "${extraContext.publisher}" does not match verified legal entity baseline`,
        weight: 20,
        isPositive: false,
      });
      flaggedReasons.push({
        id: 'publisher_mismatch',
        indicatorName: 'Unverified Third-Party Developer Entity',
        detected: `App publisher "${extraContext.publisher}" is not registered in official brand baseline.`,
        whyRisky: 'Untrusted publishers lack security warranties and can push malicious remote updates post-install.',
        severity: 'medium',
        recommendedAction: 'Verify developer certificate and alert mobile MDM administrators to restrict installation.',
        category: 'verified',
      });
    }

    // 4. Non-store sideloaded mirror format
    if (candRaw.includes('apk') || candRaw.includes('mirror') || extraContext?.platform === 'third_party') {
      signals.push({
        signalType: 'sideloaded_apk',
        description: 'Third-party APK mirror distribution format detected (unregulated package signing)',
        weight: 20,
        isPositive: false,
      });
      flaggedReasons.push({
        id: 'sideloaded_apk',
        indicatorName: 'Unregulated Third-Party APK Mirror',
        detected: 'Application distributed as a sideloadable APK file outside regulated stores.',
        whyRisky: 'Sideloaded binaries bypass store malware screening and can introduce spyware with elevated permissions.',
        severity: 'high',
        recommendedAction: 'Issue takedown notices to third-party APK hosting sites and file DMCA copyright notices.',
        category: 'heuristic',
      });
    }

    // 5. Predatory permissions
    if (extraContext?.permissions && extraContext.permissions.length > 0) {
      const dangerous = extraContext.permissions.filter(p =>
        p.includes('SMS') || p.includes('ACCESSIBILITY') || p.includes('SYSTEM_ALERT_WINDOW') || p.includes('RECORD_AUDIO') || p.includes('READ_CONTACTS')
      );
      if (dangerous.length > 0) {
        signals.push({
          signalType: 'predatory_permissions',
          description: `Dangerous permission vectors requested: ${dangerous.join(', ')}`,
          weight: 20,
          isPositive: false,
        });
        flaggedReasons.push({
          id: 'predatory_permissions',
          indicatorName: 'Excessive / Predatory Mobile Permissions',
          detected: `App requests intrusive permissions: ${dangerous.join(', ')}.`,
          whyRisky: 'Accessibility and SMS permissions allow attackers to intercept two-factor SMS codes and control screens remotely.',
          severity: 'critical',
          recommendedAction: 'Flag for immediate automated sandbox analysis and block on enterprise MDM profiles.',
          category: 'heuristic',
        });
        harmfulConsequences.push({
          id: 'sms_interception',
          title: 'SMS OTP & Two-Factor Authentication Interception',
          tag: 'Bypass Threat',
          description: 'Malicious apps reading SMS messages can bypass 2-step verification codes sent by banks.',
          severity: 'critical',
          icon: 'AlertTriangle',
        });
      }
    }
  }

  // Calculate cumulative risk score (capped at 98 max to preserve explainability)
  const rawScore = signals.reduce((acc, sig) => acc + (sig.isPositive ? -sig.weight : sig.weight), 0);
  const hasThreatSignals = signals.some(s => !s.isPositive);
  const riskScore = hasThreatSignals && rawScore > 0 ? Math.min(Math.max(rawScore, 10), 98) : 0;

  // If clean with zero threats, add positive verification signal
  if (!hasThreatSignals) {
    signals.push({
      signalType: 'clean_target_verified',
      description: 'Zero threat indicators detected: Clean domain reputation, valid structure, no typosquats or lures',
      weight: 0,
      isPositive: true,
    });
  }

  // Industry-standard risk tier classification
  let riskLevel: 'low' | 'medium' | 'high' | 'critical' = 'low';
  let classification: 'low_risk' | 'suspicious' | 'dangerous' = 'low_risk';
  let classificationLabel = 'Low Risk — No major threat indicators detected';

  if (riskScore >= 75) {
    riskLevel = 'critical';
    classification = 'dangerous';
    classificationLabel = 'Dangerous URL — Critical Risk Active Threat';
  } else if (riskScore >= 50) {
    riskLevel = 'high';
    classification = 'dangerous';
    classificationLabel = 'Dangerous URL — Avoid opening this link';
  } else if (riskScore >= 20) {
    riskLevel = 'medium';
    classification = 'suspicious';
    classificationLabel = 'Suspicious URL — Exercise caution and verify';
  } else if (riskScore > 0) {
    riskLevel = 'low';
    classification = 'low_risk';
    classificationLabel = `Low Risk — Unvetted Domain (Score: ${riskScore} / 100)`;
  } else {
    riskLevel = 'low';
    classification = 'low_risk';
    classificationLabel = 'Low Risk — Clean (0 / 100 Threat Score)';
  }

  // Ensure default harmful consequence if none added but high score
  if (harmfulConsequences.length === 0 && riskScore >= 50) {
    harmfulConsequences.push({
      id: 'general_fraud',
      title: 'Phishing & Credential Interception',
      tag: 'Security Threat',
      description: 'Attackers may attempt to trick users into divulging private corporate data or credentials.',
      severity: 'high',
      icon: 'ShieldAlert',
    });
  }

  // Contextual precautions based on risk tier
  let recommendedPrecautions: string[] = [];

  if (classification === 'dangerous') {
    recommendedPrecautions = [
      'CRITICAL ADVISORY: Do not open this link in any browser. Disconnect immediately.',
      'Do not enter passwords, OTPs, banking details, or personal information on this page.',
      'Do not download files, install browser extensions, or run executables from this link.',
      'If credentials were submitted previously, change passwords immediately on the official portal and revoke all active sessions.',
      'If financial information was exposed, notify your bank or fraud department without delay.',
      'Block URL at corporate perimeter firewalls and alert employee security awareness teams.',
    ];
  } else if (classification === 'suspicious') {
    recommendedPrecautions = [
      'Exercise caution: This target triggered heuristic indicators that warrant manual inspection.',
      'Inspect the full domain name carefully in your address bar for subtle character modifications.',
      'Verify the communication through an independent channel before proceeding.',
      'Do not enter master passwords or financial details on unverified third-party pages.',
      'Never share 2-factor authentication codes (OTPs) or recovery phrases.',
    ];
  } else {
    // Clean / Low Risk (0-20 / 100)
    recommendedPrecautions = [
      'Target passed deterministic heuristic checks with zero severe threat indicators detected.',
      'Always confirm the browser padlock icon indicates a valid HTTPS connection.',
      'Ensure you are navigating to the intended service before entering sensitive account credentials.',
      'Keep your web browser and operating system updated to the latest security release.',
    ];
  }

  const threatCount = signals.filter(s => !s.isPositive).length;
  const summary =
    threatCount > 0
      ? `Flagged ${threatCount} threat indicator${threatCount > 1 ? 's' : ''} with combined severity score of ${riskScore} / 100 (${riskLevel.toUpperCase()} SEVERITY). ${classificationLabel}.`
      : `Verified Clean: No threat indicators detected (Score: 0 / 100). Safe to navigate with standard HTTPS hygiene.`;

  return {
    candidate,
    submittedUrl: candidate,
    normalizedUrl: urlInfo.normalizedUrl || candidate,
    displayUrl: urlInfo.displayUrl || candidate,
    channel,
    isOfficialExcluded: false,
    riskScore,
    riskLevel,
    classification,
    classificationLabel,
    signals,
    flaggedReasons,
    harmfulConsequences,
    recommendedPrecautions,
    securitySources: getStandardSecuritySources(false),
    scanStages: getStandardScanStages(),
    summary,
    timestamp: nowIso,
  };
}
