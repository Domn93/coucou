// 作者: Maqingze
// Prisma v7 配置文件 — 用于 db push / migrate 等 CLI 操作
import { defineConfig } from 'prisma/config'
import { PrismaPg } from '@prisma/adapter-pg'

export default defineConfig({
  schema: './prisma/schema.prisma',
  datasource: {
    url: process.env.DATABASE_URL!,
  },
})
