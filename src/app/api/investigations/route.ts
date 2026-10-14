import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET() {
  try {
    const investigations = await prisma.investigation.findMany({
      include: {
        findings: {
          include: { riskSignals: true },
        },
        evidence: true,
        analystNotes: {
          include: { author: { select: { name: true, email: true } } },
          orderBy: { createdAt: 'desc' },
        },
        auditLogs: {
          orderBy: { timestamp: 'desc' },
        },
        assignee: {
          select: { id: true, name: true, email: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ investigations });
  } catch (error) {
    console.error('Error fetching investigations:', error);
    return NextResponse.json({ investigations: [], error: 'Failed to fetch investigations' });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, description, severity, findingIds } = body;

    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    const brand = await prisma.brand.findFirst();
    const analyst = await prisma.user.findFirst();

    if (!brand) {
      return NextResponse.json({ error: 'Brand not found' }, { status: 404 });
    }

    const caseCount = await prisma.investigation.count();
    const caseNumber = `TL-2026-${String(caseCount + 84).padStart(3, '0')}`;

    const investigation = await prisma.investigation.create({
      data: {
        caseNumber,
        title,
        description: description || null,
        brandId: brand.id,
        severity: severity || 'medium',
        status: 'under_review',
        assigneeId: analyst ? analyst.id : null,
        isDemo: true,
        findings: findingIds && findingIds.length > 0
          ? {
              connect: findingIds.map((id: string) => ({ id })),
            }
          : undefined,
      },
      include: {
        findings: true,
        evidence: true,
        analystNotes: true,
      },
    });

    await prisma.auditLog.create({
      data: {
        userId: analyst?.id,
        action: 'investigation_created',
        entityType: 'investigation',
        entityId: investigation.id,
        investigationId: investigation.id,
        details: JSON.stringify({ caseNumber, title, severity }),
      },
    });

    return NextResponse.json({ success: true, investigation });
  } catch (error) {
    console.error('Error creating investigation:', error);
    return NextResponse.json({ error: 'Failed to create investigation' }, { status: 500 });
  }
}
