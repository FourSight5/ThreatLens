import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { content } = body;

    if (!content || !content.trim()) {
      return NextResponse.json({ error: 'Note content cannot be empty' }, { status: 400 });
    }

    const analyst = await prisma.user.findFirst();
    if (!analyst) {
      return NextResponse.json({ error: 'No active analyst user' }, { status: 500 });
    }

    const note = await prisma.analystNote.create({
      data: {
        investigationId: id,
        authorId: analyst.id,
        content: content.trim(),
      },
      include: {
        author: {
          select: { name: true, email: true },
        },
      },
    });

    await prisma.auditLog.create({
      data: {
        userId: analyst.id,
        action: 'note_added',
        entityType: 'analyst_note',
        entityId: note.id,
        investigationId: id,
        details: JSON.stringify({ noteSnippet: content.slice(0, 100) }),
      },
    });

    return NextResponse.json({ success: true, note });
  } catch (error) {
    console.error('Error adding note:', error);
    return NextResponse.json({ error: 'Failed to add analyst note' }, { status: 500 });
  }
}
