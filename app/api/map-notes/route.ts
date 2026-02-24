// 作者: Maqingze
// 地图笔记 API — GET 查询附近笔记，POST 创建笔记

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'

// 经纬度范围换算为度数偏移量（粗略估算）
function metersToDegreeDelta(meters: number) {
  const latDelta = meters / 111000
  const lngDelta = meters / 85000 // 中国纬度约 85km/度
  return { latDelta, lngDelta }
}

// GET /api/map-notes?lat=&lng=&radius=2000
export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const lat = parseFloat(searchParams.get('lat') || '')
  const lng = parseFloat(searchParams.get('lng') || '')
  const radius = parseFloat(searchParams.get('radius') || '2000')

  if (isNaN(lat) || isNaN(lng)) {
    return NextResponse.json({ error: '缺少 lat/lng 参数' }, { status: 400 })
  }

  const { latDelta, lngDelta } = metersToDegreeDelta(radius)

  // 获取当前登录用户（可选，用于判断是否已点赞）
  const session = await getServerSession()
  const userId = (session?.user as { id?: string })?.id

  const notes = await prisma.mapNote.findMany({
    where: {
      latitude: { gte: lat - latDelta, lte: lat + latDelta },
      longitude: { gte: lng - lngDelta, lte: lng + lngDelta },
    },
    include: {
      author: { select: { id: true, name: true, avatar: true } },
      likes: { select: { userId: true } },
      activity: { select: { id: true, title: true } },
    },
    orderBy: { createdAt: 'desc' },
    take: 50,
  })

  const result = notes.map((note) => ({
    id: note.id,
    content: note.content,
    images: note.images,
    tags: note.tags,
    latitude: note.latitude,
    longitude: note.longitude,
    createdAt: note.createdAt,
    author: note.author,
    activity: note.activity,
    likesCount: note.likes.length,
    liked: userId ? note.likes.some((l: { userId: string }) => l.userId === userId) : false,
  }))

  return NextResponse.json({ notes: result })
}

// POST /api/map-notes
export async function POST(req: NextRequest) {
  const session = await getServerSession()
  const userId = (session?.user as { id?: string })?.id

  if (!userId) {
    return NextResponse.json({ error: '请先登录' }, { status: 401 })
  }

  const body = await req.json()
  const { content, latitude, longitude, tags, activityId } = body

  if (!content || typeof latitude !== 'number' || typeof longitude !== 'number') {
    return NextResponse.json({ error: '缺少必填字段' }, { status: 400 })
  }

  const note = await prisma.mapNote.create({
    data: {
      content,
      latitude,
      longitude,
      tags: tags || [],
      authorId: userId,
      activityId: activityId || null,
    },
    include: {
      author: { select: { id: true, name: true, avatar: true } },
    },
  })

  return NextResponse.json({ note }, { status: 201 })
}
