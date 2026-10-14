import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET() {
  try {
    const logs = await prisma.auditLog.findMany({
      take: 50,
      orderBy: { timestamp: 'desc' },
      include: {
        user: { select: { name: true, email: true } },
      },
    });

    const parsedLogs = logs.map(l => ({
      ...l,
      details: l.details ? JSON.parse(l.details) : null,
    }));

    return NextResponse.json({ logs: parsedLogs });
  } catch (error) {
    console.error('Error fetching audit logs:', error);
    return NextResponse.json({ logs: [], error: 'Failed to fetch audit logs' });
  }
}
