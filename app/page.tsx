import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-8 p-6 bg-gradient-to-b from-purple-400 to-purple-600">
      <div className="text-center gap-4 flex flex-col items-center">
        <div className="w-20 h-20 rounded-full bg-white/30 flex items-center justify-center">
          <span className="text-white font-display font-bold text-lg">CouCou</span>
        </div>
        <h1 className="text-5xl font-display font-bold text-white">凑凑 CouCou</h1>
        <p className="text-xl font-display text-white/80">凑个局，就现在</p>
        <p className="text-sm text-white/60">AI 驱动的实时活动互助社交平台</p>
      </div>

      <Link
        href="/plaza"
        className="px-8 py-4 rounded-full bg-white text-purple-600 font-body font-bold text-lg hover:shadow-lg transition flex items-center gap-2"
      >
        开始探索 →
      </Link>

      <p className="text-xs text-white/50 text-center">发现你身边正在发生的有趣活动</p>
    </main>
  )
}
