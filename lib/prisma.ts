// 作者: Maqingze
// Prisma 客户端单例 — Prisma v7 + @prisma/adapter-pg
// 全局单例避免开发环境 hot-reload 时重复创建连接

import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

// 全局类型扩展，用于保存单例
const globalForPrisma = global as unknown as { prisma: PrismaClient }

function createPrismaClient(): PrismaClient {
  const connectionString = process.env.DATABASE_URL
  if (!connectionString) {
    throw new Error('DATABASE_URL 环境变量未设置')
  }
  // Vercel serverless 环境使用连接池模式，避免直连耗尽 Supabase 连接数
  const poolUrl = connectionString.replace(':5432/', ':6543/').replace('postgres?', 'postgres?pgbouncer=true&')
  const finalUrl = process.env.NODE_ENV === 'production' ? poolUrl : connectionString
  const adapter = new PrismaPg({ connectionString: finalUrl })
  return new PrismaClient({ adapter })
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

// 开发环境下将实例挂到 global，避免热更新时重复实例化
if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}
