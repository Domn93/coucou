// 活动详情页面
export default function ActivityPage() {
  return (
    <div className="min-h-screen bg-white">
      <header className="bg-white border-b p-4 flex justify-between items-center">
        <button>←</button>
        <h1 className="font-display font-bold">活动详情</h1>
        <button>↗</button>
      </header>

      <main className="p-4 space-y-4">
        {/* TODO: 活动详情内容 */}
        <p className="text-center text-gray-400 py-8">开发中...</p>
      </main>

      <footer className="fixed bottom-0 left-0 right-0 bg-white border-t p-4">
        <button className="w-full py-3 rounded-full bg-purple-600 text-white font-bold">
          凑一个 ✨
        </button>
      </footer>
    </div>
  )
}
