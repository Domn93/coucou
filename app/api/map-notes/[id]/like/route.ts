// 作者: Maqingze
// 地图笔记点赞切换 API

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'

// POST /api/map-notes/[id]/like — 切换点赞状态
export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession()
  const userId = (session?.user as { id?: string })?.id

  if (!userId) {
    return NextResponse.json({ error: '请先登录' }, { status: 401 })
  }

  const { id: noteId } = await params

  const existing = await prisma.mapNoteLike.findUnique({
    where: { noteId_userId: { noteId, userId } },
  })

  if (existing) {
    // 已点赞 → 取消
    await prisma.mapNoteLike.delete({ where: { id: existing.id } })
    return NextResponse.json({ liked: false })
  } else {
    // 未点赞 → 点赞
    await prisma.mapNoteLike.create({ data: { noteId, userId } })
    return NextResponse.json({ liked: true })
  }
}
