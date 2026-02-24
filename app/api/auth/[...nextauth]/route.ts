// 作者: Maqingze
// NextAuth 认证路由 — 支持手机号验证码登录 + GitHub OAuth（开发期）

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

    // 手机号 + 验证码登录（主要方式）
    CredentialsProvider({
      id: 'phone',
      name: '手机号登录',
      credentials: {
        phone: { label: '手机号', type: 'tel' },
        code: { label: '验证码', type: 'text' },
      },
      async authorize(credentials) {
        if (!credentials?.phone || !credentials?.code) return null

        // 开发后门：000000 可绕过短信验证直接登录（SMS 服务未接入时使用）
        const isDevBypass = credentials.code === '000000' && !process.env.TENCENT_SECRET_ID
        console.log(`[AUTH] phone=${credentials.phone} isDevBypass=${isDevBypass}`)

        try {
          if (!isDevBypass) {
            // 查询有效验证码
            const record = await prisma.verificationCode.findFirst({
              where: {
                phone: credentials.phone,
                code: credentials.code,
                used: false,
                expiresAt: { gte: new Date() },
              },
              orderBy: { createdAt: 'desc' },
            })

            if (!record) {
              console.log('[AUTH] 验证码无效或已过期')
              return null
            }

            // 标记验证码已使用
            await prisma.verificationCode.update({
              where: { id: record.id },
              data: { used: true },
            })
          }

          // 查找或创建用户
          console.log('[AUTH] 开始查询用户...')
          let user = await prisma.user.findUnique({
            where: { phone: credentials.phone },
          })

          const isNewUser = !user
          if (!user) {
            user = await prisma.user.create({
              data: {
                phone: credentials.phone,
                name: `用户${credentials.phone.slice(-4)}`,
                rating: 5.0,
                eventCount: 0,
              },
            })
          }

          console.log(`[AUTH] 登录成功 userId=${user.id} isNewUser=${isNewUser}`)
          return {
            id: user.id,
            phone: user.phone,
            name: user.name,
            image: user.avatar,
            isNewUser,
          }
        } catch (err) {
          console.error('[AUTH] authorize 异常:', err)
          return null
        }
      },
    }),

    // 演示登录（兼容旧数据，后续可移除）
    CredentialsProvider({
      id: 'demo',
      name: '演示登录',
      credentials: {
        email: { label: '邮箱', type: 'email', placeholder: 'demo@coucou.app' },
        name: { label: '昵称', type: 'text', placeholder: '你的昵称' },
      },
      async authorize(credentials) {
        if (!credentials?.email) return null

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
        // 传递新用户标记
        if ((user as { isNewUser?: boolean }).isNewUser) {
          token.isNewUser = true
        }
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
          token.isNewUser = true
        }
        token.userId = dbUser.id
      }
      return token
    },
    // 将 userId 和 isNewUser 暴露给 session
    async session({ session, token }) {
      if (token.userId && session.user) {
        (session.user as { id?: string; isNewUser?: boolean }).id = token.userId as string
        if (token.isNewUser) {
          (session.user as { id?: string; isNewUser?: boolean }).isNewUser = true
        }
      }
      return session
    },
  },

  pages: {
    signIn: '/login',
  },

  session: {
    strategy: 'jwt',
  },

  secret: process.env.NEXTAUTH_SECRET,
})

export { handler as GET, handler as POST }
