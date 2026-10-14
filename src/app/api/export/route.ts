import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET() {
  try {
    const brand = await prisma.brand.findFirst({
      include: {
        officialAssets: true,
      },
    });

    const findings = await prisma.finding.findMany({
      include: {
        riskSignals: true,
      },
      orderBy: { riskScore: 'desc' },
    });

    const investigations = await prisma.investigation.findMany({
      include: {
        evidence: true,
        analystNotes: true,
        auditLogs: true,
      },
    });

    const auditLogs = await prisma.auditLog.findMany({
      orderBy: { timestamp: 'desc' },
      take: 100,
    });

    const totalFindings = findings.length;
    const criticalFlags = findings.filter(f => f.riskLevel === 'critical').length;
    const highFlags = findings.filter(f => f.riskLevel === 'high').length;
    const confirmedCount = findings.filter(f => f.status === 'confirmed').length;
    const excludedCount = findings.filter(f => f.riskScore === 0).length;

    const exportPayload = {
      threatlensVersion: '2.0.0-PRO',
      exportTimestamp: new Date().toISOString(),
      reportMetadata: {
        organization: brand?.name || 'ThreatLens Customer',
        complianceStandard: 'SOC2 Type II / NIST CSF Risk Assessment',
        evaluatorNotes: 'Official hackathon evaluation snapshot for ThreatLens DRP Platform',
      },
      metrics: {
        totalMonitoredFindings: totalFindings,
        criticalThreats: criticalFlags,
        highThreats: highFlags,
        confirmedIncidents: confirmedCount,
        baselineExclusions: excludedCount,
      },
      brandProfileBaseline: {
        brandName: brand?.name,
        industry: brand?.industry,
        officialAssets: brand?.officialAssets.map(a => ({
          type: a.type,
          platform: a.platform,
          value: a.value,
          verified: a.verified,
        })),
        monitoredKeywords: brand?.keywords ? JSON.parse(brand.keywords) : [],
        aliases: brand?.aliases ? JSON.parse(brand.aliases) : [],
      },
      findings: findings.map(f => ({
        id: f.id,
        displayName: f.displayName,
        type: f.type,
        platform: f.platform,
        riskScore: f.riskScore,
        riskLevel: f.riskLevel,
        status: f.status,
        description: f.description,
        sourceUrl: f.sourceUrl,
        signals: f.riskSignals.map(s => ({
          type: s.signalType,
          description: s.description,
          weight: s.weight,
        })),
      })),
      investigations: investigations.map(inv => ({
        caseNumber: inv.caseNumber,
        title: inv.title,
        severity: inv.severity,
        status: inv.status,
        evidenceCount: inv.evidence.length,
        notesCount: inv.analystNotes.length,
      })),
      auditTrail: auditLogs.map(l => ({
        timestamp: l.timestamp,
        action: l.action,
        entityType: l.entityType,
        entityId: l.entityId,
        details: l.details ? JSON.parse(l.details) : null,
      })),
    };

    return new NextResponse(JSON.stringify(exportPayload, null, 2), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="ThreatLens-Audit-Export-${new Date().toISOString().split('T')[0]}.json"`,
      },
    });
  } catch (error) {
    console.error('Export error:', error);
    return NextResponse.json({ error: 'Failed to generate audit export' }, { status: 500 });
  }
}
