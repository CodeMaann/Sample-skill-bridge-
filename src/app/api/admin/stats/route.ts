import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const totalUsers = await prisma.user.count();
    const totalRoadmaps = await prisma.roadmap.count();
    
    const trendingRolesRaw = await prisma.roadmap.groupBy({
      by: ['targetRole'],
      _count: {
        targetRole: true,
      },
      orderBy: {
        _count: {
          targetRole: 'desc',
        },
      },
      take: 5,
    });

    const trendingRoles = trendingRolesRaw.map(role => ({
      role: role.targetRole,
      count: role._count.targetRole
    }));

    return NextResponse.json({ totalUsers, totalRoadmaps, trendingRoles });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
