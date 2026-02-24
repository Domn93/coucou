// 作者: Maqingze
// NextAuth 认证路由 — 支持 GitHub OAuth（开发期）+ 凭证登录（演示用）

import NextAuth from 'next-auth'
import GithubProvider from 'next-auth/providers/github'
import CredentialsProvider from 'next-auth/providers/credentials'
import { prisma } from '@/lib/prisma'


const handler = NextAuth({
  providers: [
    // GitHub OAuth（需要在 .env.local 配置 GITHUB_ID 和 GITHUB_SECRET）
    ...(process.env.GITHUB_ID && process.env.GITHUB_SECRET
      ? [
          GithubProvider({
            clientId: process.env.GITHUB_ID,
            clientSecret: process.env.GITHUB_SECRET,
          }),
        ]
      : []),

    // 凭证登录（开发演示用，用 email 直接登录）
    CredentialsProvider({
      name: '演示登录',
      credentials: {
        email: { label: '邮箱', type: 'email', placeholder: 'demo@coucou.app' },
        name: { label: '昵称', type: 'text', placeholder: '你的昵称' },
      },
      async authorize(credentials) {
        if (!credentials?.email) return null

        // 查找或创建用户
        let user = await prisma.user.findUnique({
          where: { email: credentials.email },
        })

        if (!user) {
          user = await prisma.user.create({
            data: {
              email: credentials.email,
              name: credentials.name || credentials.email.split('@')[0],
              rating: 5.0,
              eventCount: 0,
            },
          })
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.avatar,
        }
      },
    }),
  ],

  callbacks: {
    // 将数据库用户 id 写入 token
    async jwt({ token, user, account }) {
      if (user) {
        token.userId = user.id
      }
      // GitHub OAuth：首次登录时同步用户到数据库
      if (account?.provider === 'github' && user?.email) {
        let dbUser = await prisma.user.findUnique({
          where: { email: user.email },
        })
        if (!dbUser) {
          dbUser = await prisma.user.create({
            data: {
              email: user.email!,
              name: user.name || 'GitHub User',
              avatar: user.image || undefined,
              rating: 5.0,
              eventCount: 0,
            },
          })
        }
        token.userId = dbUser.id
      }
      return token
    },
    // 将 userId 暴露给 session
    async session({ session, token }) {
      if (token.userId && session.user) {
        (session.user as { id?: string }).id = token.userId as string
      }
      return session
    },
  },

  pages: {
    signIn: '/onboarding/setup',
  },

  session: {
    strategy: 'jwt',
  },

  secret: process.env.NEXTAUTH_SECRET,
})

export { handler as GET, handler as POST }
