import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET() {
  try {
    const brand = await prisma.brand.findFirst({
      include: {
        officialAssets: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!brand) {
      return NextResponse.json({
        brand: {
          id: 'brand_threatlens',
          name: 'ThreatLens',
          description: 'Next-generation Digital Risk Protection & Brand Defense Platform',
          industry: 'Cybersecurity & Digital Risk Protection',
          website: 'https://threatlens.io',
          logoUrl: '/threatlens-mark.svg',
          keywords: ['threatlens', 'threat lens', 'tlens', 'threatlens guard', 'threatlens support'],
          aliases: ['ThreatLens Security Inc.', 'ThreatLens Corp'],
          officialAssets: [
            { id: 'oa_1', brandId: 'brand_threatlens', type: 'domain', platform: null, value: 'threatlens.io', verified: true },
            { id: 'oa_2', brandId: 'brand_threatlens', type: 'domain', platform: null, value: 'https://threatlens.io', verified: true },
            { id: 'oa_3', brandId: 'brand_threatlens', type: 'social_handle', platform: 'x', value: '@threatlens', verified: true },
            { id: 'oa_4', brandId: 'brand_threatlens', type: 'social_handle', platform: 'linkedin', value: 'threatlens-security', verified: true },
          ],
        },
      });
    }

    return NextResponse.json({
      brand: {
        ...brand,
        keywords: brand.keywords ? JSON.parse(brand.keywords) : [],
        aliases: brand.aliases ? JSON.parse(brand.aliases) : [],
      },
    });
  } catch (error) {
    console.error('Error fetching brand:', error);
    return NextResponse.json({
      brand: {
        id: 'brand_threatlens',
        name: 'ThreatLens',
        description: 'Next-generation Digital Risk Protection & Brand Defense Platform',
        industry: 'Cybersecurity & Digital Risk Protection',
        website: 'https://threatlens.io',
        logoUrl: '/threatlens-mark.svg',
        keywords: ['threatlens', 'threat lens', 'tlens'],
        aliases: ['ThreatLens Security Inc.'],
        officialAssets: [
          { id: 'oa_1', brandId: 'brand_threatlens', type: 'domain', platform: null, value: 'threatlens.io', verified: true },
          { id: 'oa_2', brandId: 'brand_threatlens', type: 'social_handle', platform: 'x', value: '@threatlens', verified: true },
        ],
      },
    });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { type, platform, value } = body;

    if (!type || !value) {
      return NextResponse.json({ error: 'Type and value are required' }, { status: 400 });
    }

    const brand = await prisma.brand.findFirst();
    if (!brand) {
      return NextResponse.json({ error: 'Brand not found' }, { status: 404 });
    }

    const asset = await prisma.officialAsset.create({
      data: {
        brandId: brand.id,
        type,
        platform: platform || null,
        value: value.trim(),
        verified: true,
      },
    });

    // Record audit log
    await prisma.auditLog.create({
      data: {
        action: 'official_asset_added',
        entityType: 'official_asset',
        entityId: asset.id,
        details: JSON.stringify({ type, platform, value }),
      },
    });

    return NextResponse.json({ success: true, asset });
  } catch (error) {
    console.error('Error adding official asset:', error);
    return NextResponse.json({ error: 'Failed to add official asset' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const assetId = searchParams.get('id');

    if (!assetId) {
      return NextResponse.json({ error: 'Asset ID required' }, { status: 400 });
    }

    const asset = await prisma.officialAsset.delete({
      where: { id: assetId },
    });

    // Record audit log
    await prisma.auditLog.create({
      data: {
        action: 'official_asset_removed',
        entityType: 'official_asset',
        entityId: assetId,
        details: JSON.stringify({ deletedValue: asset.value, type: asset.type }),
      },
    });

    return NextResponse.json({ success: true, message: 'Asset removed from baseline' });
  } catch (error) {
    console.error('Error deleting official asset:', error);
    return NextResponse.json({ error: 'Failed to delete official asset' }, { status: 500 });
  }
}
