const ChevronLeft = ({ size = 24, color = '#1A1A1A' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6" />
  </svg>
)
const Mic = ({ size = 20, color = '#FFFFFF' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" /><path d="M19 10v2a7 7 0 0 1-14 0v-2" /><line x1="12" y1="19" x2="12" y2="23" /><line x1="8" y1="23" x2="16" y2="23" />
  </svg>
)

// 推荐活动小卡片
const miniCards = [
  { dot: '#8B5CF6', title: '🃏 德州扑克 · 步行5分钟', sub: '3/4人 · 30分钟后' },
  { dot: '#14B8A6', title: '🏃 奥森跑步 · 步行12分钟', sub: '2/6人 · 1小时后' },
  { dot: '#F472B6', title: '🍜 川菜饭局 · 步行8分钟', sub: '1/4人 · 今晚7点' },
]

export default function AIPage() {
  return (
    <div style={{ width: 375, height: 812, backgroundColor: '#FFFFFF', display: 'flex', flexDirection: 'column', margin: '0 auto', overflow: 'hidden' }}>
      {/* header */}
      <div style={{ height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px', flexShrink: 0 }}>
        <ChevronLeft size={24} color="#1A1A1A" />
        <span style={{ color: '#1A1A1A', fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 18, fontWeight: 700 }}>AI 助手</span>
        <div style={{ width: 24, height: 24 }} />
      </div>

      {/* chatArea */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 16, padding: '16px 16px 0 16px', overflowY: 'auto' }}>
        {/* AI Row 1 */}
        <div style={{ display: 'flex', gap: 8, width: '100%' }}>
          <div style={{ width: 32, height: 32, borderRadius: '50%', backgroundColor: '#8B5CF6', flexShrink: 0 }} />
          <div style={{ borderRadius: '4px 18px 18px 18px', backgroundColor: '#F4F4F5', padding: 14, width: 260 }}>
            <p style={{ color: '#1A1A1A', fontFamily: "'DM Sans', sans-serif", fontSize: 14, lineHeight: 1.5, margin: 0 }}>
              嗨！我是凑凑 AI 助手 👋 有什么我可以帮你的吗？
            </p>
          </div>
        </div>

        {/* User Row */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
          <div style={{ borderRadius: '18px 4px 18px 18px', backgroundColor: '#8B5CF6', padding: 14, width: 180 }}>
            <p style={{ color: '#FFFFFF', fontFamily: "'DM Sans', sans-serif", fontSize: 14, lineHeight: 1.5, margin: 0 }}>
              我好无聊，附近有什么好玩的吗
            </p>
          </div>
        </div>

        {/* AI Row 2 - 推荐卡片 */}
        <div style={{ display: 'flex', gap: 8, width: '100%' }}>
          <div style={{ width: 32, height: 32, borderRadius: '50%', backgroundColor: '#8B5CF6', flexShrink: 0 }} />
          <div style={{ borderRadius: '4px 18px 18px 18px', backgroundColor: '#F4F4F5', padding: 14, display: 'flex', flexDirection: 'column', gap: 12, width: 280 }}>
            <p style={{ color: '#1A1A1A', fontFamily: "'DM Sans', sans-serif", fontSize: 14, lineHeight: 1.5, margin: 0 }}>
              发现你附近有 3 个热门活动，看看感兴趣的：
            </p>
            {miniCards.map((mc, i) => (
              <div key={i} style={{ borderRadius: 12, backgroundColor: '#FFFFFF', padding: 10, display: 'flex', alignItems: 'center', gap: 10, width: '100%' }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: mc.dot, flexShrink: 0 }} />
                <div style={{ display: 'flex', flexDirection: 'column', gap: 2, flex: 1 }}>
                  <span style={{ color: '#1A1A1A', fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 600 }}>{mc.title}</span>
                  <span style={{ color: '#9CA3AF', fontFamily: "'DM Sans', sans-serif", fontSize: 11 }}>{mc.sub}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* inputBar */}
      <div style={{ height: 64, display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px', backgroundColor: '#FFFFFF', borderTop: '1px solid #F4F4F5', flexShrink: 0 }}>
        <div style={{ flex: 1, height: 44, borderRadius: 22, backgroundColor: '#F4F4F5', display: 'flex', alignItems: 'center', padding: '0 16px' }}>
          <span style={{ color: '#9CA3AF', fontFamily: "'DM Sans', sans-serif", fontSize: 14 }}>说点什么...</span>
        </div>
        <div style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: '#8B5CF6', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Mic size={20} color="#FFFFFF" />
        </div>
      </div>
    </div>
  )
}
