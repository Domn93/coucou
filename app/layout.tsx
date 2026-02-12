import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '凑凑 CouCou - 实时活动互助社交平台',
  description: 'AI 驱动的 P2P 实时活动互助社交平台',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body className="font-body">
        {children}
      </body>
    </html>
  )
}
