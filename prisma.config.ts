// 作者: Maqingze
// Prisma v7 配置文件 — 用于 db push / migrate 等 CLI 操作
// 使用直连地址（DIRECT_URL），不走 pooler
import { defineConfig } from 'prisma/config'

export default defineConfig({
  schema: './prisma/schema.prisma',
  datasource: {
    url: process.env.DIRECT_URL ?? process.env.DATABASE_URL!,
  },
})
