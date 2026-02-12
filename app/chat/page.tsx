// 临时聊天组页面
export default function ChatPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <header className="bg-white border-b p-4 flex justify-between items-center">
        <button>←</button>
        <div className="text-center">
          <h1 className="font-display font-bold">德州扑克局</h1>
          <p className="text-sm text-gray-500">4 人参与</p>
        </div>
        <button>⋯</button>
      </header>

      <div className="bg-purple-50 px-4 py-3 text-center text-sm text-purple-600">
        🟢 活动进行中 · 30分钟后开始
      </div>

      <main className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* TODO: 聊天消息列表 */}
        <p className="text-center text-gray-400 py-8">开发中...</p>
      </main>

      <footer className="bg-white border-t p-4 space-y-3">
        <button className="mx-auto px-6 py-2 rounded-full border-2 border-teal-500 text-teal-600 font-bold text-sm">
          📍 我已到达
        </button>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="发送消息..."
            className="flex-1 px-4 py-2 rounded-full bg-gray-100"
          />
          <button className="w-10 h-10 rounded-full bg-purple-600 text-white flex items-center justify-center">
            ✈️
          </button>
        </div>
      </footer>
    </div>
  )
}
