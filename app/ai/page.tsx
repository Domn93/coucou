// AI 对话页面
export default function AIPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <header className="bg-white border-b p-4">
        <h1 className="font-display text-lg font-bold">AI 助手</h1>
      </header>

      <main className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* TODO: 聊天消息列表 */}
        <p className="text-center text-gray-400 py-8">开发中...</p>
      </main>

      <footer className="bg-white border-t p-4">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="说点什么..."
            className="flex-1 px-4 py-2 rounded-full bg-gray-100"
          />
          <button className="w-10 h-10 rounded-full bg-purple-600 text-white flex items-center justify-center">
            🎤
          </button>
        </div>
      </footer>
    </div>
  )
}
