'use client'

// 作者: Maqingze
// 客户端Session提供者包装器

import { SessionProvider } from 'next-auth/react'

export default function Providers({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>
}
