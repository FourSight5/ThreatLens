import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { analyzeThreatCandidate, normalizeUrlInput, BrandBaseline } from '@/lib/heuristics';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { candidate, channel, platform, bio, publisher, permissions, saveToFindings } = body;

    if (!candidate || !channel) {
      return NextResponse.json({ error: 'Candidate string and channel are required' }, { status: 400 });
    }

    const trimmed = String(candidate).trim();
    if (!trimmed) {
      return NextResponse.json({ error: 'Candidate string cannot be empty' }, { status: 400 });
    }

    // SSRF Check and Normalization
    const urlCheck = normalizeUrlInput(trimmed, channel);
    if (urlCheck.isSsrf) {
      return NextResponse.json(
        {
          error: urlCheck.error || 'SSRF Protection: Requests to private, loopback, or cloud metadata network addresses are strictly prohibited.',
          isSsrf: true,
        },
        { status: 400 }
      );
    }

    const brand = await prisma.brand.findFirst({
      include: {
        officialAssets: true,
      },
    });

    if (!brand) {
      return NextResponse.json({ error: 'Brand baseline not configured' }, { status: 500 });
    }

    // Build baseline object
    const officialDomains: string[] = [];
    const officialSocialHandles: string[] = [];
    const officialMobileApps: string[] = [];
    const vipExecutives: string[] = [];

    brand.officialAssets.forEach((asset) => {
      if (asset.type === 'domain') officialDomains.push(asset.value);
      if (asset.type === 'social_handle') officialSocialHandles.push(asset.value);
      if (asset.type === 'app_package') officialMobileApps.push(asset.value);
      if (asset.type === 'vip_roster') vipExecutives.push(asset.value);
    });

    const monitoredKeywords = brand.keywords ? JSON.parse(brand.keywords) : [];

    const baseline: BrandBaseline = {
      name: brand.name,
      officialDomains,
      officialSocialHandles,
      officialMobileApps,
      vipExecutives,
      monitoredKeywords,
    };

    // Run heuristic engine
    const analysis = analyzeThreatCandidate(trimmed, channel, baseline, {
      platform,
      bio,
      publisher,
      permissions,
    });

    // Optionally save to database
    let savedFindingId: string | undefined;
    if (saveToFindings) {
      const findingType =
        channel === 'social' ? 'social_profile' : channel === 'app' ? 'app_listing' : 'domain';

      const finding = await prisma.finding.create({
        data: {
          brandId: brand.id,
          type: findingType,
          platform: platform || (channel === 'domain' ? 'web' : null),
          handle: channel === 'social' ? trimmed : null,
          displayName: trimmed,
          sourceUrl: analysis.normalizedUrl || (trimmed.startsWith('http') ? trimmed : `https://${trimmed}`),
          description: analysis.summary,
          riskScore: analysis.riskScore,
          riskLevel: analysis.riskLevel,
          status: analysis.isOfficialExcluded ? 'reviewed' : 'new',
          isDemo: true,
          metadata: JSON.stringify({
            evaluatedInput: trimmed,
            channel,
            platform,
            bio,
            publisher,
            permissions,
            normalizedUrl: analysis.normalizedUrl,
            displayUrl: analysis.displayUrl,
            classification: analysis.classification,
            classificationLabel: analysis.classificationLabel,
            exclusionReason: analysis.exclusionReason,
            flaggedReasons: analysis.flaggedReasons,
            harmfulConsequences: analysis.harmfulConsequences,
            recommendedPrecautions: analysis.recommendedPrecautions,
          }),
          riskSignals: {
            create: analysis.signals.map(s => ({
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
          action: 'scanner_finding_saved',
          entityType: 'finding',
          entityId: finding.id,
          details: JSON.stringify({
            candidate: trimmed,
            riskScore: analysis.riskScore,
            classification: analysis.classification,
            isExcluded: analysis.isOfficialExcluded,
          }),
        },
      });
    }

    return NextResponse.json({
      success: true,
      analysis,
      savedFindingId,
    });
  } catch (error) {
    console.error('Error during threat analysis:', error);
    return NextResponse.json({ error: 'Failed to execute threat analysis' }, { status: 500 });
  }
}
