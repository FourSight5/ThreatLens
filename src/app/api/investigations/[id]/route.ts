import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const investigation = await prisma.investigation.findUnique({
      where: { id },
      include: {
        findings: {
          include: { riskSignals: true },
        },
        evidence: {
          orderBy: { collectedAt: 'desc' },
        },
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
    });

    if (!investigation) {
      return NextResponse.json({ error: 'Investigation not found' }, { status: 404 });
    }

    return NextResponse.json({ investigation });
  } catch (error) {
    console.error('Error fetching investigation:', error);
    return NextResponse.json({ error: 'Failed to fetch investigation' }, { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { status, severity, title, description } = body;

    const data: Record<string, unknown> = {};
    if (status) data.status = status;
    if (severity) data.severity = severity;
    if (title) data.title = title;
    if (description !== undefined) data.description = description;

    const updated = await prisma.investigation.update({
      where: { id },
      data,
    });

    await prisma.auditLog.create({
      data: {
        action: 'investigation_updated',
        entityType: 'investigation',
        entityId: id,
        investigationId: id,
        details: JSON.stringify(data),
      },
    });

    return NextResponse.json({ success: true, investigation: updated });
  } catch (error) {
    console.error('Error updating investigation:', error);
    return NextResponse.json({ error: 'Failed to update investigation' }, { status: 500 });
  }
}
