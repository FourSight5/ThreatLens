import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function POST() {
  try {
    // 1. Clean existing records
    await prisma.auditLog.deleteMany();
    await prisma.analystNote.deleteMany();
    await prisma.evidence.deleteMany();
    await prisma.riskSignal.deleteMany();
    await prisma.finding.deleteMany();
    await prisma.investigation.deleteMany();
    await prisma.officialAsset.deleteMany();
    await prisma.brand.deleteMany();
    await prisma.user.deleteMany();
    await prisma.integrationConfig.deleteMany();
    await prisma.workspaceSettings.deleteMany();

    // 2. Default Analyst User
    const analyst = await prisma.user.create({
      data: {
        id: 'usr_analyst_sarah',
        email: 'sarah.chen@threatlens.io',
        name: 'Sarah Chen (Lead Analyst)',
        passwordHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
        role: 'admin',
      },
    });

    // 3. Workspace Settings
    await prisma.workspaceSettings.create({
      data: {
        id: 'default',
        name: 'ThreatLens Global Threat Operations',
        demoMode: true,
        defaultThreshold: 50,
        aiProvider: 'openai',
      },
    });

    // 4. Default Brand Profile
    const brand = await prisma.brand.create({
      data: {
        id: 'brand_threatlens',
        name: 'ThreatLens',
        description: 'Next-generation Digital Risk Protection & Brand Defense Platform',
        industry: 'Cybersecurity & Digital Risk Protection',
        website: 'https://threatlens.io',
        logoUrl: '/threatlens-mark.svg',
        keywords: JSON.stringify([
          'threatlens',
          'threat lens',
          'tlens',
          'threatlens guard',
          'threatlens support',
          'threatlens authenticator',
        ]),
        aliases: JSON.stringify([
          'ThreatLens Security Inc.',
          'ThreatLens Corp',
          'ThreatLens Systems',
        ]),
        isDemo: true,
      },
    });

    // 5. Official Assets Baseline
    const officialAssetsData = [
      { brandId: brand.id, type: 'domain', platform: null, value: 'threatlens.io', verified: true },
      { brandId: brand.id, type: 'domain', platform: null, value: 'https://threatlens.io', verified: true },
      { brandId: brand.id, type: 'domain', platform: null, value: 'threatlens-corp.com', verified: true },
      { brandId: brand.id, type: 'domain', platform: null, value: 'threatlens.app', verified: true },
      { brandId: brand.id, type: 'social_handle', platform: 'x', value: '@threatlens', verified: true },
      { brandId: brand.id, type: 'social_handle', platform: 'linkedin', value: 'threatlens-security', verified: true },
      { brandId: brand.id, type: 'social_handle', platform: 'instagram', value: '@threatlens_official', verified: true },
      { brandId: brand.id, type: 'social_handle', platform: 'telegram', value: '@threatlens_announcements', verified: true },
      { brandId: brand.id, type: 'social_handle', platform: 'youtube', value: '@threatlens_sec', verified: true },
      { brandId: brand.id, type: 'app_package', platform: 'google_play', value: 'com.threatlens.authenticator', verified: true },
      { brandId: brand.id, type: 'app_package', platform: 'app_store', value: 'com.threatlens.ios.guard', verified: true },
      { brandId: brand.id, type: 'vip_roster', platform: null, value: 'Sarah Chen (CEO)', verified: true },
      { brandId: brand.id, type: 'vip_roster', platform: null, value: 'Alex Rivera (CTO)', verified: true },
      { brandId: brand.id, type: 'vip_roster', platform: null, value: 'Marcus Vance (CISO)', verified: true },
    ];

    for (const asset of officialAssetsData) {
      await prisma.officialAsset.create({ data: asset });
    }

    // 6. Threat Findings
    const finding1 = await prisma.finding.create({
      data: {
        id: 'fnd_soc_001',
        brandId: brand.id,
        type: 'social_profile',
        platform: 'x',
        handle: '@threatlens_support_bot',
        displayName: 'ThreatLens 24/7 Support Bot',
        sourceUrl: 'https://x.com/threatlens_support_bot',
        description: 'Unauthorized account mimicking official support handle. Bio instructs users to DM wallet keys and master credentials for ticket resolution.',
        riskScore: 88,
        riskLevel: 'high',
        status: 'new',
        isDemo: true,
        metadata: JSON.stringify({
          handle: '@threatlens_support_bot',
          followers: 142,
          bio: 'Official 24/7 ThreatLens Resolution Bot. DM here for login issues and urgent ticket verification.',
          flaggedContent: "Pinned tweet: 'Having login issues? Submit your master pass to our agent via DM for instant recovery.'",
          observedDate: 'Observed 2h ago',
        }),
        riskSignals: {
          create: [
            { signalType: 'lure_keyword', description: "Brand name stem with 'support' and 'bot' lure keywords", weight: 30, isPositive: false },
            { signalType: 'follower_anomaly', description: 'Low follower count (142) with customer-service persona anomaly', weight: 20, isPositive: false },
            { signalType: 'credential_harvesting', description: 'Bio contains direct credential/key extraction request lure', weight: 25, isPositive: false },
            { signalType: 'unverified_status', description: 'Unverified third-party account claiming official status', weight: 13, isPositive: false },
          ],
        },
      },
    });

    const finding2 = await prisma.finding.create({
      data: {
        id: 'fnd_soc_002',
        brandId: brand.id,
        type: 'social_profile',
        platform: 'linkedin',
        handle: 'sarah-chen-threatlens-invest',
        displayName: 'Sarah Chen (ThreatLens Executive)',
        sourceUrl: 'https://linkedin.com/in/sarah-chen-threatlens-invest',
        description: 'Lookalike executive profile targeting company partners with unauthorized private equity and token fundraising inquiries.',
        riskScore: 82,
        riskLevel: 'high',
        status: 'confirmed',
        isDemo: true,
        metadata: JSON.stringify({
          handle: 'sarah-chen-threatlens-invest',
          followers: 48,
          bio: 'Chief Executive Officer at ThreatLens Inc. Connecting with strategic early-stage cybersecurity angel investors.',
          flaggedContent: "Outreach message: 'We are opening a private seed allocation for enterprise security partners. Click here to verify credentials.'",
          observedDate: 'Observed 5h ago',
        }),
        riskSignals: {
          create: [
            { signalType: 'vip_impersonation', description: "VIP Executive Name ('Sarah Chen') match against monitored executive roster", weight: 30, isPositive: false },
            { signalType: 'financial_lure', description: 'Fundraising and private allocation solicitation in direct outreach', weight: 25, isPositive: false },
            { signalType: 'profile_recency', description: 'Incomplete work history with newly created LinkedIn account', weight: 15, isPositive: false },
            { signalType: 'authority_mimicry', description: 'High syntactic similarity to monitored executive persona', weight: 12, isPositive: false },
          ],
        },
      },
    });

    const finding3 = await prisma.finding.create({
      data: {
        id: 'fnd_soc_003',
        brandId: brand.id,
        type: 'social_profile',
        platform: 'instagram',
        handle: '@threatlens_promo_rewards',
        displayName: 'ThreatLens Community Airdrop',
        sourceUrl: 'https://instagram.com/threatlens_promo_rewards',
        description: 'Counterfeit promotional giveaway profile with bio link directing to credential-harvesting phishing site.',
        riskScore: 91,
        riskLevel: 'critical',
        status: 'new',
        isDemo: true,
        metadata: JSON.stringify({
          handle: '@threatlens_promo_rewards',
          followers: 1205,
          bio: 'Official ThreatLens Security token drop! Connect your Web3 wallet or SSO login at bit.ly/tlens-airdrop to claim.',
          flaggedContent: "Carousel post: 'Celebrating $20M Series A! Claim your commemorative security token now.'",
          observedDate: 'Observed 1d ago',
        }),
        riskSignals: {
          create: [
            { signalType: 'promotional_cue', description: "Promotional incentive lure keywords ('airdrop', 'rewards', 'bonus')", weight: 25, isPositive: false },
            { signalType: 'shortened_redirect', description: 'Bio contains shortened URL (bit.ly) redirecting off-platform to unverified landing page', weight: 30, isPositive: false },
            { signalType: 'brand_asset_theft', description: 'Counterfeit corporate mark and vector logo used without authorization', weight: 20, isPositive: false },
            { signalType: 'handle_variation', description: 'Lookalike handle variation of official brand Instagram asset', weight: 16, isPositive: false },
          ],
        },
      },
    });

    const finding4 = await prisma.finding.create({
      data: {
        id: 'fnd_app_001',
        brandId: brand.id,
        type: 'app_listing',
        platform: 'google_play',
        displayName: 'ThreatLens Login & 2FA Helper',
        sourceUrl: 'https://play.google.com/store/apps/details?id=com.threatlens.login.helper',
        description: 'Trojanized 2FA utility on Google Play using ThreatLens brand marks and requesting SMS and accessibility interception permissions.',
        riskScore: 85,
        riskLevel: 'high',
        status: 'confirmed',
        isDemo: true,
        metadata: JSON.stringify({
          packageId: 'com.threatlens.login.helper',
          publisher: 'ThreatLens Dev Studio',
          downloads: '5,000+',
          store: 'Google Play',
          permissions: ['android.permission.RECEIVE_SMS', 'android.permission.BIND_ACCESSIBILITY_SERVICE', 'android.permission.READ_CONTACTS'],
          observedDate: 'Observed 12h ago',
        }),
        riskSignals: {
          create: [
            { signalType: 'namespace_squatting', description: "Package identifier namespace squatting: 'com.threatlens.*'", weight: 30, isPositive: false },
            { signalType: 'trojan_modifier', description: "Trojanized utility descriptor: 'Helper'", weight: 25, isPositive: false },
            { signalType: 'publisher_mismatch', description: "Developer name ('ThreatLens Dev Studio') mismatch against legal entity ('ThreatLens Security Inc.')", weight: 15, isPositive: false },
            { signalType: 'dangerous_permissions', description: 'Predatory permissions: Accessibility service binding and SMS interception', weight: 15, isPositive: false },
          ],
        },
      },
    });

    const finding5 = await prisma.finding.create({
      data: {
        id: 'fnd_app_002',
        brandId: brand.id,
        type: 'app_listing',
        platform: 'third_party',
        displayName: 'ThreatLens Guard Pro Mod APK',
        sourceUrl: 'https://apkpure-mirror.net/app/com.threatlens.guard.mod',
        description: 'Sideloaded modded APK distributed on third-party download portal containing malicious code injection and spyware payloads.',
        riskScore: 94,
        riskLevel: 'critical',
        status: 'new',
        isDemo: true,
        metadata: JSON.stringify({
          packageId: 'com.threatlens.guard.mod',
          publisher: 'Anonymous Modder / DarkNexus',
          store: 'APK Mirror (Third-Party)',
          downloads: '23,400',
          permissions: ['SYSTEM_ALERT_WINDOW', 'ACCESS_FINE_LOCATION', 'RECORD_AUDIO'],
          observedDate: 'Observed 8h ago',
        }),
        riskSignals: {
          create: [
            { signalType: 'sideloaded_format', description: 'Non-store sideloaded APK mirror distribution format', weight: 20, isPositive: false },
            { signalType: 'trojan_modifier', description: "Trojanized descriptors: 'Mod' and 'Pro' attached to brand root", weight: 25, isPositive: false },
            { signalType: 'namespace_clone', description: "Cloned official bundle namespace: 'com.threatlens.guard.*'", weight: 30, isPositive: false },
            { signalType: 'invasive_telemetry', description: 'Predatory payload permissions: System alert window overlay and ambient audio recording', weight: 19, isPositive: false },
          ],
        },
      },
    });

    const finding6 = await prisma.finding.create({
      data: {
        id: 'fnd_dom_001',
        brandId: brand.id,
        type: 'domain',
        platform: 'web',
        displayName: 'threatlens-login-secure.com',
        sourceUrl: 'https://threatlens-login-secure.com',
        description: 'Counterfeit SSO login portal mimicking ThreatLens enterprise dashboard with credential harvester and reverse proxy.',
        riskScore: 89,
        riskLevel: 'high',
        status: 'confirmed',
        isDemo: true,
        metadata: JSON.stringify({
          domain: 'threatlens-login-secure.com',
          registrar: 'NameCheap Inc.',
          sslIssuer: "Let's Encrypt Authority",
          ip: '185.220.101.5',
          observedDate: 'Observed 1d ago',
        }),
        riskSignals: {
          create: [
            { signalType: 'keyword_pattern', description: 'Monitored brand keyword pattern present in root domain label', weight: 20, isPositive: false },
            { signalType: 'sso_auth_lure', description: "Credential & SSO authentication lures: 'login', 'secure'", weight: 25, isPositive: false },
            { signalType: 'deceptive_hyphen', description: 'Deceptive multi-hyphenation structure (2 hyphens) simulating corporate portal', weight: 15, isPositive: false },
            { signalType: 'bulletproof_host', description: 'Hosting infrastructure flagged on threat intelligence feed', weight: 29, isPositive: false },
          ],
        },
      },
    });

    const finding7 = await prisma.finding.create({
      data: {
        id: 'fnd_dom_002',
        brandId: brand.id,
        type: 'domain',
        platform: 'web',
        displayName: 'threatl3ns.io',
        sourceUrl: 'https://threatl3ns.io',
        description: "Leetspeak homoglyph substitution replacing 'e' with numeral '3' redirecting to malicious software dropper.",
        riskScore: 76,
        riskLevel: 'high',
        status: 'new',
        isDemo: true,
        metadata: JSON.stringify({
          domain: 'threatl3ns.io',
          homoglyph: '3 -> e (leetspeak)',
          levenshteinDistance: 1,
          observedDate: 'Observed 3d ago',
        }),
        riskSignals: {
          create: [
            { signalType: 'homoglyph_substitution', description: "Homoglyph leetspeak character swap detected ('3' for 'e')", weight: 35, isPositive: false },
            { signalType: 'low_edit_distance', description: 'Levenshtein edit distance = 1 against primary authoritative domain threatlens.io', weight: 25, isPositive: false },
            { signalType: 'active_mx', description: 'Active mail exchange records configured with spoofed SPF policy', weight: 16, isPositive: false },
          ],
        },
      },
    });

    await prisma.finding.create({
      data: {
        id: 'fnd_dom_003',
        brandId: brand.id,
        type: 'domain',
        platform: 'web',
        displayName: 'threatlens.io',
        sourceUrl: 'https://threatlens.io',
        description: 'Official primary enterprise domain. Authoritative corporate web portal.',
        riskScore: 0,
        riskLevel: 'low',
        status: 'reviewed',
        isDemo: true,
        metadata: JSON.stringify({
          domain: 'threatlens.io',
          verifiedBaseline: true,
          exclusionReason: 'Exact match with registered official corporate domain',
        }),
        riskSignals: {
          create: [
            { signalType: 'baseline_exclusion', description: 'EXCLUDED BEFORE THREAT SCORING: Exact match with registered official asset', weight: 100, isPositive: true },
          ],
        },
      },
    });

    // 7. Investigations
    await prisma.investigation.create({
      data: {
        id: 'inv_case_001',
        caseNumber: 'TL-2026-081',
        title: 'VIP Impersonation & Executive Phishing Campaign on LinkedIn',
        description: 'Active threat actor impersonating CEO Sarah Chen on LinkedIn to target enterprise partners with fraudulent seed investment agreements.',
        brandId: brand.id,
        severity: 'high',
        status: 'under_review',
        assigneeId: analyst.id,
        isDemo: true,
        findings: { connect: [{ id: finding2.id }] },
        evidence: {
          create: [
            {
              type: 'social_profile',
              source: 'https://linkedin.com/in/sarah-chen-threatlens-invest',
              description: 'LinkedIn Impersonator Profile Header & Private Outreach Logs',
              content: JSON.stringify({ handle: 'sarah-chen-threatlens-invest', claim: 'CEO at ThreatLens' }),
              contentHash: '8f434346648f6b96df89dda901c5176b10a6d83961dd3c1ac88b59b2dc327aa4',
            },
          ],
        },
        analystNotes: {
          create: [
            { authorId: analyst.id, content: 'Initial intake completed. Profile reported to LinkedIn Trust & Safety under Ticket #LI-892144.' },
          ],
        },
      },
    });

    await prisma.investigation.create({
      data: {
        id: 'inv_case_002',
        caseNumber: 'TL-2026-082',
        title: 'Trojanized Mobile 2FA Apps with Predatory SMS Interception',
        description: 'Coordinated rogue application distribution on Google Play and third-party mirrors attempting 2FA token exfiltration.',
        brandId: brand.id,
        severity: 'critical',
        status: 'confirmed_suspicious',
        assigneeId: analyst.id,
        isDemo: true,
        findings: { connect: [{ id: finding4.id }, { id: finding5.id }] },
        evidence: {
          create: [
            {
              type: 'app_package',
              source: 'Google Play Store & APK Mirror',
              description: 'Static APK Decompilation & Permission Manifest Analysis',
              content: JSON.stringify({ packages: ['com.threatlens.login.helper', 'com.threatlens.guard.mod'] }),
              contentHash: 'b94d27b9934d3e08a52e52d7da7dabfac484efe37a5380ee9088f7ace2efcde9',
            },
          ],
        },
        analystNotes: {
          create: [
            { authorId: analyst.id, content: 'Urgent takedown filed with Google Play Developer Integrity team.' },
          ],
        },
      },
    });

    await prisma.investigation.create({
      data: {
        id: 'inv_case_003',
        caseNumber: 'TL-2026-083',
        title: 'Counterfeit SSO & Typosquat Domain Cluster',
        description: 'Phishing domain network harvesting enterprise credentials using lookalike authentication forms and Let\'s Encrypt certificates.',
        brandId: brand.id,
        severity: 'high',
        status: 'confirmed_suspicious',
        assigneeId: analyst.id,
        isDemo: true,
        findings: { connect: [{ id: finding6.id }, { id: finding7.id }] },
      },
    });

    // 8. Integrations
    await prisma.integrationConfig.createMany({
      data: [
        {
          provider: 'virustotal',
          name: 'VirusTotal Intelligence API',
          purpose: 'File & URL reputation lookups, malware scanning and domain threat scores',
          isEnabled: true,
          status: 'configured',
          config: JSON.stringify({ endpoint: 'https://www.virustotal.com/api/v3' }),
        },
        {
          provider: 'openai',
          name: 'ThreatLens AI Copilot (GPT-4o)',
          purpose: 'Explainable heuristic synthesis, threat narrative generation, and takedown drafting',
          isEnabled: true,
          status: 'connected',
          config: JSON.stringify({ model: 'gpt-4o-mini' }),
        },
      ],
    });

    await prisma.auditLog.create({
      data: {
        action: 'database_reset',
        entityType: 'system',
        entityId: 'default',
        details: JSON.stringify({ message: 'ThreatLens database reset to default demo baseline' }),
      },
    });

    return NextResponse.json({ success: true, message: 'Database reset to demo state successfully' });
  } catch (error) {
    console.error('Error resetting database:', error);
    return NextResponse.json({ error: 'Failed to reset database' }, { status: 500 });
  }
}
