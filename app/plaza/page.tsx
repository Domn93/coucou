// 实时广场页面
export default function PlazaPage() {
  return (
    <div className="min-h-screen bg-white">
      <header className="bg-white border-b">
        {/* 位置 + 通知 */}
      </header>

      <main className="p-4">
        {/* 搜索栏 */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="附近有什么好玩的..."
            className="w-full px-4 py-3 rounded-2xl bg-gray-100 text-gray-900 placeholder-gray-500"
          />
        </div>

        {/* 活动卡片流 */}
        <div className="space-y-4">
          {/* TODO: 加载活动卡片列表 */}
          <p className="text-center text-gray-400 py-8">加载中...</p>
        </div>
      </main>

      {/* Tab Bar */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around py-3">
        {/* TODO: Tab 导航项 */}
      </nav>
    </div>
  )
}
