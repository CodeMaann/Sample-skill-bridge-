import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, currentSkillset, targetRole, roadmapData } = body;

    if (!userId || !currentSkillset || !targetRole || !roadmapData) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // First, ensure the user exists in our DB (they might have just logged in via Firebase)
    // In a real app, we'd sync Firebase users to Prisma on signup. We'll do a quick check/upsert here.
    // For this prototype, we assume the user was saved during login, but we'll use connect.
    // Actually, to be safe, we'll just create the roadmap. If the user doesn't exist, it will throw.
    // Let's upsert the user just in case, using a dummy email if we only have userId.
    // Wait, we should just rely on the user existing from Phase 1 login.
    
    const roadmap = await prisma.roadmap.create({
      data: {
        userId,
        currentSkillset,
        targetRole,
        roadmapData,
      },
    });

    return NextResponse.json(roadmap);
  } catch (error) {
    console.error('Error saving roadmap:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
