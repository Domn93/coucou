import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const result = await prisma.$queryRaw`SELECT 1 as ok`
    const userCount = await prisma.user.count()
    return NextResponse.json({ ok: true, result, userCount })
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 })
  }
}
