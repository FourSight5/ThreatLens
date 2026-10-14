import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type');
    const platform = searchParams.get('platform');
    const riskLevel = searchParams.get('riskLevel');
    const status = searchParams.get('status');
    const search = searchParams.get('search');

    const where: Record<string, unknown> = {};

    if (type && type !== 'all') where.type = type;
    if (platform && platform !== 'all') where.platform = platform;
    if (riskLevel && riskLevel !== 'all') where.riskLevel = riskLevel;
    if (status && status !== 'all') where.status = status;
    if (search) {
      where.OR = [
        { displayName: { contains: search } },
        { handle: { contains: search } },
        { description: { contains: search } },
        { sourceUrl: { contains: search } },
      ];
    }

    const findings = await prisma.finding.findMany({
      where,
      include: {
        riskSignals: true,
        investigations: {
          select: { id: true, caseNumber: true, status: true },
        },
      },
      orderBy: [{ riskScore: 'desc' }, { createdAt: 'desc' }],
    });

    const parsedFindings = findings.map(f => ({
      ...f,
      metadata: f.metadata ? JSON.parse(f.metadata) : null,
    }));

    return NextResponse.json({ findings: parsedFindings });
  } catch (error) {
    console.error('Error fetching findings:', error);
    return NextResponse.json({ error: 'Failed to fetch findings' }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json({ error: 'ID and status are required' }, { status: 400 });
    }

    const finding = await prisma.finding.update({
      where: { id },
      data: { status },
      include: { riskSignals: true },
    });

    // Record audit log
    await prisma.auditLog.create({
      data: {
        action: 'finding_status_updated',
        entityType: 'finding',
        entityId: id,
        details: JSON.stringify({ newStatus: status, displayName: finding.displayName }),
      },
    });

    return NextResponse.json({ success: true, finding });
  } catch (error) {
    console.error('Error updating finding status:', error);
    return NextResponse.json({ error: 'Failed to update finding' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { type, platform, handle, displayName, sourceUrl, description, riskScore, riskLevel, metadata, signals } = body;

    const brand = await prisma.brand.findFirst();
    if (!brand) {
      return NextResponse.json({ error: 'Brand not found' }, { status: 404 });
    }

    const finding = await prisma.finding.create({
      data: {
        brandId: brand.id,
        type: type || 'social_profile',
        platform: platform || null,
        handle: handle || null,
        displayName: displayName || handle || 'Unknown Threat Candidate',
        sourceUrl: sourceUrl || null,
        description: description || null,
        riskScore: riskScore ?? 50,
        riskLevel: riskLevel || 'medium',
        status: 'new',
        isDemo: true,
        metadata: metadata ? JSON.stringify(metadata) : null,
        riskSignals: signals && Array.isArray(signals)
          ? {
              create: signals.map((s: { signalType: string; description: string; weight: number; isPositive: boolean }) => ({
                signalType: s.signalType,
                description: s.description,
                weight: s.weight,
                isPositive: s.isPositive ?? false,
              })),
            }
          : undefined,
      },
      include: { riskSignals: true },
    });

    await prisma.auditLog.create({
      data: {
        action: 'finding_ingested',
        entityType: 'finding',
        entityId: finding.id,
        details: JSON.stringify({ displayName: finding.displayName, riskScore: finding.riskScore }),
      },
    });

    return NextResponse.json({ success: true, finding });
  } catch (error) {
    console.error('Error creating finding:', error);
    return NextResponse.json({ error: 'Failed to create finding' }, { status: 500 });
  }
}
