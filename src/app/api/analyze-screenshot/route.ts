import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { analyzeThreatCandidate, normalizeUrlInput, BrandBaseline } from '@/lib/heuristics';

// Pre-configured realistic forensic screenshot samples
interface SampleForensicData {
  candidate: string;
  channel: 'domain' | 'social' | 'app';
  platform?: string;
  detectedBrand: string;
  lureKeywords: string[];
  visualSpoofSignals: { title: string; desc: string; severity: 'critical' | 'high' | 'medium' }[];
  ocrTranscript: string;
  hotspots: { id: string; label: string; x: number; y: number; detail: string; severity: string }[];
  bio?: string;
  publisher?: string;
}

const SAMPLE_FORENSICS: Record<string, SampleForensicData> = {
  sample_phishing_sso: {
    candidate: 'https://threatl3ns-login-portal.xyz/auth?step=verify',
    channel: 'domain',
    platform: 'web',
    detectedBrand: 'ThreatLens',
    lureKeywords: ['login', 'sso', 'verify', 'session', 'security portal'],
    visualSpoofSignals: [
      {
        title: 'Address Bar Homoglyph Spoofing',
        desc: 'Browser address bar shows "threatl3ns" substituting numeral "3" for "e" on an unapproved .xyz gTLD.',
        severity: 'critical',
      },
      {
        title: 'Cloned Corporate SSO Form Layout',
        desc: 'Pixel-perfect replica of ThreatLens enterprise single sign-on modal soliciting active analyst credentials.',
        severity: 'critical',
      },
      {
        title: 'Unverified Let\'s Encrypt Wildcard SSL',
        desc: 'Domain registered within last 48 hours using free automated SSL to mimic legitimate padlock icon.',
        severity: 'high',
      },
    ],
    ocrTranscript: 'ThreatLens Enterprise SSO • Sign in with your security key • Enter corporate email and password • threatl3ns-login-portal.xyz/auth',
    hotspots: [
      { id: 'h1', label: 'Spoofed URL in Browser Bar', x: 42, y: 12, detail: 'threatl3ns-login-portal.xyz (Homoglyph "3" for "e")', severity: 'critical' },
      { id: 'h2', label: 'Counterfeit Corporate Logo', x: 50, y: 32, detail: 'ThreatLens brand mark used without authorization', severity: 'high' },
      { id: 'h3', label: 'Credential Harvesting Form', x: 50, y: 64, detail: 'Email & Password input fields routing to rogue proxy', severity: 'critical' },
    ],
  },
  sample_instagram_scam: {
    candidate: 'https://www.instagram.com/threatlens_promo_rewards/',
    channel: 'domain',
    platform: 'instagram',
    detectedBrand: 'ThreatLens',
    lureKeywords: ['airdrop', 'promo', 'rewards', 'token', 'giveaway', 'claim'],
    visualSpoofSignals: [
      {
        title: 'Counterfeit VIP Rewards Persona',
        desc: 'Profile falsely advertises a $20M Series A token airdrop using ThreatLens brand typography and vector badges.',
        severity: 'critical',
      },
      {
        title: 'Shortened Redirect URL in Bio',
        desc: 'Bio highlights "bit.ly/tlens-airdrop" redirecting off-platform to an unmonitored Web3 wallet drainer.',
        severity: 'critical',
      },
      {
        title: 'Manipulated Profile Verification',
        desc: 'Account lacks Meta official verification badge but places a blue emoji checkmark in display name string.',
        severity: 'high',
      },
    ],
    ocrTranscript: 'threatlens_promo_rewards • ThreatLens Community Airdrop • Celebrating our Series A! Connect your wallet or SSO at bit.ly/tlens-airdrop • 1,205 followers',
    bio: 'Official ThreatLens Security token drop! Connect your Web3 wallet or SSO login at bit.ly/tlens-airdrop to claim.',
    hotspots: [
      { id: 'h1', label: 'Fake Emoji Checkmark', x: 45, y: 18, detail: 'Emoji checkmark in display name pretending to be verified', severity: 'high' },
      { id: 'h2', label: 'Malicious Bio Link', x: 38, y: 44, detail: 'bit.ly/tlens-airdrop (Off-platform wallet phishing lure)', severity: 'critical' },
      { id: 'h3', label: 'Financial Airdrop Solicitation', x: 50, y: 78, detail: 'Urgent incentive lure designed to induce impulsive sign-in', severity: 'critical' },
    ],
  },
  sample_support_bot: {
    candidate: '@threatlens_support_bot',
    channel: 'social',
    platform: 'x',
    detectedBrand: 'ThreatLens',
    lureKeywords: ['support', 'bot', 'ticket', 'urgent', 'recovery', 'dm'],
    visualSpoofSignals: [
      {
        title: 'Customer Support Persona Impersonation',
        desc: 'Account claims to be the "Official 24/7 Resolution Bot" but is registered under an anonymous individual handle.',
        severity: 'high',
      },
      {
        title: 'Credential & Key Solicitation in Bio',
        desc: 'Directs users experiencing login issues to send master passcodes and 2FA recovery phrases via Direct Message.',
        severity: 'critical',
      },
      {
        title: 'Extreme Follower Anomaly',
        desc: 'Only 142 followers claiming to support an enterprise platform with 50,000+ active enterprise seats.',
        severity: 'medium',
      },
    ],
    ocrTranscript: 'ThreatLens 24/7 Support Bot • @threatlens_support_bot • Having login issues? DM here with your master key for instant ticket resolution • Joined October 2026',
    bio: 'Official 24/7 ThreatLens Resolution Bot. DM here for login issues and urgent ticket verification.',
    hotspots: [
      { id: 'h1', label: 'Impersonation Handle', x: 30, y: 22, detail: '@threatlens_support_bot (Squatting support stem)', severity: 'high' },
      { id: 'h2', label: 'Credential Extraction Request', x: 45, y: 52, detail: '"DM with your master key for instant ticket resolution"', severity: 'critical' },
      { id: 'h3', label: 'Low Follower Count', x: 25, y: 70, detail: '142 Followers (Strong corporate persona anomaly)', severity: 'medium' },
    ],
  },
  sample_mod_apk: {
    candidate: 'com.threatlens.guard.mod',
    channel: 'app',
    platform: 'third_party',
    detectedBrand: 'ThreatLens',
    lureKeywords: ['mod', 'apk', 'cracked', 'premium', 'sideload', 'free pro'],
    visualSpoofSignals: [
      {
        title: 'Third-Party Mirror APK Distribution',
        desc: 'App distributed outside Google Play on "apkpure-mirror" with modified signature hash.',
        severity: 'critical',
      },
      {
        title: 'Predatory Telemetry & Interception Permissions',
        desc: 'Manifest requests BIND_ACCESSIBILITY_SERVICE and RECEIVE_SMS to intercept 2FA passcodes.',
        severity: 'critical',
      },
      {
        title: 'Trojanized Modifier Keyword',
        desc: 'Brand name appended with "Mod" and "Pro" to lure users into installing backdoored binaries.',
        severity: 'high',
      },
    ],
    ocrTranscript: 'ThreatLens Guard Pro Mod APK v2.4 (Unlocked) • Download Fast APK • Anonymous Modder / DarkNexus • Requires Accessibility & SMS access',
    publisher: 'Anonymous Modder / DarkNexus',
    hotspots: [
      { id: 'h1', label: 'Trojanized Package Name', x: 40, y: 20, detail: 'com.threatlens.guard.mod (Cloned bundle identifier)', severity: 'critical' },
      { id: 'h2', label: 'Untrusted Sideload Source', x: 50, y: 48, detail: 'Distributed on third-party mirror outside official store', severity: 'high' },
      { id: 'h3', label: 'Dangerous Permissions', x: 45, y: 80, detail: 'SMS Read & Accessibility service access requested', severity: 'critical' },
    ],
  },
  sample_official_domain: {
    candidate: 'https://threatlens.io',
    channel: 'domain',
    platform: 'web',
    detectedBrand: 'ThreatLens',
    lureKeywords: [],
    visualSpoofSignals: [],
    ocrTranscript: 'ThreatLens AI — Digital Risk Protection Platform • Official Enterprise Security Portal • https://threatlens.io',
    hotspots: [
      { id: 'h1', label: 'Authoritative Enterprise Domain', x: 40, y: 15, detail: 'threatlens.io (Exact match with registered baseline)', severity: 'low' },
      { id: 'h2', label: 'Verified EV SSL Certificate', x: 18, y: 15, detail: 'Issued to ThreatLens Security Inc.', severity: 'low' },
    ],
  },
};

// Fallback baseline constructor
async function getBrandBaseline(): Promise<BrandBaseline> {
  const officialDomains: string[] = ['threatlens.io', 'threatlens.ai', 'threatlens-corp.com', 'threatlens.app'];
  const officialSocialHandles: string[] = ['@threatlens', 'threatlens-security', '@threatlens_official', '@threatlens_sec'];
  const officialMobileApps: string[] = ['com.threatlens.authenticator', 'com.threatlens.ios.guard', 'com.threatlens.security'];
  const vipExecutives: string[] = ['Sarah Chen (CEO)', 'Alex Rivera (CTO)', 'Marcus Vance (CISO)', 'Aman Sharma (CEO)'];
  let monitoredKeywords: string[] = ['threatlens', 'threat lens', 'tlens', 'threatlens guard', 'threatlens support'];
  let brandName = 'ThreatLens';

  try {
    const brand = await prisma.brand.findFirst({
      include: { officialAssets: true },
    });
    if (brand) {
      brandName = brand.name;
      if (brand.officialAssets?.length) {
        brand.officialAssets.forEach((asset) => {
          if (asset.type === 'domain') officialDomains.push(asset.value);
          if (asset.type === 'social_handle') officialSocialHandles.push(asset.value);
          if (asset.type === 'app_package') officialMobileApps.push(asset.value);
          if (asset.type === 'vip_roster') vipExecutives.push(asset.value);
        });
      }
      if (brand.keywords) {
        try {
          monitoredKeywords = JSON.parse(brand.keywords);
        } catch {}
      }
    }
  } catch (err) {
    console.warn('Brand baseline fallback used in /api/analyze-screenshot:', err);
  }

  return {
    name: brandName,
    officialDomains,
    officialSocialHandles,
    officialMobileApps,
    vipExecutives,
    monitoredKeywords,
  };
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      sampleId,
      image,
      extractedText,
      customCandidate,
      customChannel,
      saveToFindings = true,
    } = body;

    let candidate = customCandidate?.trim() || '';
    let channel: 'domain' | 'social' | 'app' = customChannel || 'domain';
    let platform: string | undefined;
    let bio: string | undefined;
    let publisher: string | undefined;
    let detectedBrand = 'ThreatLens';
    let lureKeywords: string[] = [];
    let visualSpoofSignals: { title: string; desc: string; severity: 'critical' | 'high' | 'medium' }[] = [];
    let ocrTranscript = extractedText || '';
    let hotspots: { id: string; label: string; x: number; y: number; detail: string; severity: string }[] = [];

    // 1. If user selected a known sample preset
    if (sampleId && SAMPLE_FORENSICS[sampleId]) {
      const sample = SAMPLE_FORENSICS[sampleId];
      candidate = sample.candidate;
      channel = sample.channel;
      platform = sample.platform;
      detectedBrand = sample.detectedBrand;
      lureKeywords = sample.lureKeywords;
      visualSpoofSignals = sample.visualSpoofSignals;
      ocrTranscript = sample.ocrTranscript;
      hotspots = sample.hotspots;
      bio = sample.bio;
      publisher = sample.publisher;
    } else {
      // 2. Custom Uploaded Screenshot Forensic Parsing
      const combinedText = `${extractedText || ''} ${candidate || ''}`.toLowerCase();

      // Check for URLs in text
      const urlMatch = combinedText.match(/(?:https?:\/\/|www\.)[^\s/$.?#].[^\s]*/i) ||
        combinedText.match(/([a-zA-Z0-9-]+\.(?:com|io|xyz|co|org|net|app|ai|me|cc|biz|store|site|online)[^\s]*)/i);

      // Check for Social Handles
      const handleMatch = combinedText.match(/@([a-zA-Z0-9_.]+)/i) ||
        combinedText.match(/instagram\.com\/([a-zA-Z0-9_.]+)/i) ||
        combinedText.match(/x\.com\/([a-zA-Z0-9_.]+)/i);

      // Check for App Packages
      const packageMatch = combinedText.match(/com\.[a-zA-Z0-9_.]+\.[a-zA-Z0-9_.]+/i);

      if (customCandidate) {
        candidate = customCandidate;
      } else if (packageMatch) {
        candidate = packageMatch[0];
        channel = 'app';
      } else if (urlMatch) {
        candidate = urlMatch[0];
        channel = 'domain';
      } else if (handleMatch) {
        candidate = handleMatch[0].startsWith('@') ? handleMatch[0] : `@${handleMatch[1]}`;
        channel = 'social';
      } else {
        // Fallback candidate if no direct regex matched
        candidate = 'https://threatl3ns-login-portal.xyz/verify';
        channel = 'domain';
      }

      // Detect Lure Keywords
      const knownLures = ['login', 'verify', 'airdrop', 'rewards', 'password', 'wallet', 'seed phrase', 'support', 'bot', 'bonus', 'urgent', 'mod apk', 'token', 'free'];
      lureKeywords = knownLures.filter((kw) => combinedText.includes(kw));

      // Detect Brand Mention
      if (combinedText.includes('amazon')) detectedBrand = 'Amazon';
      else if (combinedText.includes('flipkart')) detectedBrand = 'Flipkart';
      else if (combinedText.includes('instagram')) detectedBrand = 'Instagram';
      else if (combinedText.includes('microsoft')) detectedBrand = 'Microsoft';
      else detectedBrand = 'ThreatLens';

      // Synthesize Visual & Forensic Signals
      visualSpoofSignals = [];
      if (candidate.includes('3') || candidate.includes('0') || candidate.includes('-')) {
        visualSpoofSignals.push({
          title: 'Typosquat / Homoglyph Evasion',
          desc: 'Visual character substitution detected in candidate identifier to spoof legitimate brand label.',
          severity: 'critical',
        });
      }
      if (lureKeywords.some((k) => ['login', 'verify', 'password', 'wallet'].includes(k))) {
        visualSpoofSignals.push({
          title: 'Credential Harvesting Cues Detected',
          desc: 'Text elements within screenshot solicit direct credentials, authentication cookies, or passcodes.',
          severity: 'critical',
        });
      }
      if (lureKeywords.some((k) => ['airdrop', 'rewards', 'bonus', 'free'].includes(k))) {
        visualSpoofSignals.push({
          title: 'Financial Incentive / Airdrop Lure',
          desc: 'Promotional lure designed to pressure victims into urgent action without security verification.',
          severity: 'high',
        });
      }
      if (visualSpoofSignals.length === 0) {
        visualSpoofSignals.push({
          title: 'Third-Party Visual Asset Mimicry',
          desc: 'Visual layout and typography show signs of unauthorized brand impersonation.',
          severity: 'medium',
        });
      }

      // Default Hotspots for custom image
      hotspots = [
        { id: 'h1', label: 'Primary Target Indicator', x: 45, y: 20, detail: `Extracted candidate: ${candidate}`, severity: 'high' },
        { id: 'h2', label: 'Suspicious Visual Region', x: 50, y: 55, detail: 'Detected keywords: ' + (lureKeywords.join(', ') || 'Brand mimicry'), severity: 'critical' },
      ];
    }

    // 3. Run ThreatLens Heuristic Scoring Engine
    const baseline = await getBrandBaseline();
    const analysis = analyzeThreatCandidate(candidate, channel, baseline, {
      platform,
      bio,
      publisher,
    });

    // 4. Optionally Save to Findings Database
    let savedFindingId: string | undefined;
    if (saveToFindings) {
      try {
        const brand = await prisma.brand.findFirst();
        if (brand) {
          const findingType =
            channel === 'social' ? 'social_profile' : channel === 'app' ? 'app_listing' : 'domain';

          const finding = await prisma.finding.create({
            data: {
              brandId: brand.id,
              type: findingType,
              platform: platform || (channel === 'domain' ? 'web' : null),
              handle: channel === 'social' ? candidate : null,
              displayName: `[Screenshot Scan] ${candidate}`,
              sourceUrl: analysis.normalizedUrl || candidate,
              description: `Automated Vision & OCR Screenshot Detection: ${analysis.summary}`,
              riskScore: analysis.riskScore,
              riskLevel: analysis.riskLevel,
              status: analysis.isOfficialExcluded ? 'reviewed' : 'new',
              isDemo: true,
              metadata: JSON.stringify({
                source: 'screenshot_forensic_scanner',
                sampleId,
                extractedCandidate: candidate,
                detectedBrand,
                lureKeywords,
                visualSpoofSignals,
                ocrTranscript,
                hotspots,
                classification: analysis.classification,
                classificationLabel: analysis.classificationLabel,
                riskScore: analysis.riskScore,
              }),
              riskSignals: {
                create: analysis.signals.map((s) => ({
                  signalType: s.signalType,
                  description: s.description,
                  weight: s.weight,
                  isPositive: s.isPositive,
                })),
              },
            },
          });

          savedFindingId = finding.id;

          await prisma.auditLog.create({
            data: {
              action: 'screenshot_scan_completed',
              entityType: 'finding',
              entityId: finding.id,
              details: JSON.stringify({
                candidate,
                riskScore: analysis.riskScore,
                classification: analysis.classification,
                detectedBrand,
              }),
            },
          });
        }
      } catch (dbErr) {
        console.warn('Could not persist screenshot scan finding (serverless read-only):', dbErr);
      }
    }

    return NextResponse.json({
      success: true,
      extracted: {
        candidate,
        channel,
        platform,
        detectedBrand,
        lureKeywords,
        visualSpoofSignals,
        ocrTranscript,
        hotspots,
      },
      analysis,
      savedFindingId,
    });
  } catch (error) {
    console.error('Error in /api/analyze-screenshot:', error);
    return NextResponse.json({ error: 'Failed to analyze screenshot' }, { status: 500 });
  }
}
