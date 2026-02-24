// 作者: Maqingze
// Prisma 客户端单例 — Prisma v7 + @prisma/adapter-pg
// 全局单例避免开发环境 hot-reload 时重复创建连接

import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'

// 全局类型扩展，用于保存单例
const globalForPrisma = global as unknown as { prisma: PrismaClient }

function createPrismaClient(): PrismaClient {
  const connectionString = process.env.DATABASE_URL
  if (!connectionString) {
    throw new Error('DATABASE_URL 环境变量未设置')
  }
  // Supabase 要求 SSL，pg.Pool 默认不开，需显式配置
  const pool = new Pool({
    connectionString,
    ssl: { rejectUnauthorized: false },
  })
  const adapter = new PrismaPg(pool)
  return new PrismaClient({ adapter })
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

// 开发环境下将实例挂到 global，避免热更新时重复实例化
if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}
