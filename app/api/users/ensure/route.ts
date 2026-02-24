// 作者: Maqingze
// 确保演示用户存在 API — POST /api/users/ensure
// 开发期用于创建或获取演示用户，待 NextAuth 接入后废弃

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'


export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, name, email } = body

    if (!email) {
      return NextResponse.json({ error: '缺少 email' }, { status: 400 })
    }

    const user = await prisma.user.upsert({
      where: { email },
      update: {},
      create: {
        id: id || undefined,
        email,
        name: name || email.split('@')[0],
        rating: 5.0,
        eventCount: 0,
      },
    })

    return NextResponse.json({ user })
  } catch (error) {
    console.error('POST /api/users/ensure error:', error)
    return NextResponse.json({ error: 'Failed to ensure user' }, { status: 500 })
  }
}
