import Link from 'next/link'

// 作者: Maqingze
// 屏幕 8 — 活动搜索

const ChevronLeft = ({ size = 20, color = '#1A1A1A' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6" />
  </svg>
)
const SearchIcon = ({ size = 16, color = '#9CA3AF' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
)
const X = ({ size = 16, color = '#9CA3AF' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
)
const Clock = ({ size = 14, color = '#9CA3AF' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
  </svg>
)

// 历史搜索
const history = ['奥森跑步', '德州扑克', '望京饭局', '周末展览']
// 分类
const categories = ['全部', '运动 🏃', '饭局 🍜', '打牌 🃏', '展览 🖼', '音乐 🎵', '闲逛 🚶']
// 搜索结果
const results = [
  { avatar: '#14B8A6', name: '运动达人Lisa', tag: '🏃 运动', tagColor: '#14B8A6', tagBg: '#14B8A620', title: '奥森公园傍晚跑步约伴', dist: '步行12分钟', time: '今晚 18:00', people: '2/6 人' },
  { avatar: '#8B5CF6', name: '小明同学', tag: '🃏 打牌', tagColor: '#8B5CF6', tagBg: '#8B5CF620', title: '三缺一！望京 SOHO 德州', dist: '步行5分钟', time: '30分钟后', people: '3/4 人' },
  { avatar: '#F472B6', name: '吃货小王', tag: '🍜 饭局', tagColor: '#F472B6', tagBg: '#F472B620', title: '新开的川菜馆谁来尝尝', dist: '步行8分钟', time: '今晚 19:00', people: '1/4 人' },
]

export default function SearchPage() {
  return (
    <div style={{ width: 375, minHeight: 812, backgroundColor: '#FFFFFF', display: 'flex', flexDirection: 'column', margin: '0 auto', overflow: 'hidden' }}>
      {/* 顶部搜索栏 */}
      <div style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
        <Link href="/plaza" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 36, height: 36, borderRadius: 18, backgroundColor: '#F4F4F5', textDecoration: 'none', flexShrink: 0 }}>
          <ChevronLeft />
        </Link>
        <div style={{ flex: 1, height: 44, borderRadius: 22, backgroundColor: '#F4F4F5', display: 'flex', alignItems: 'center', padding: '0 14px', gap: 8 }}>
          <SearchIcon />
          <span style={{ flex: 1, color: '#1A1A1A', fontFamily: "'DM Sans', sans-serif", fontSize: 14 }}>奥森跑步</span>
          <div style={{ width: 20, height: 20, borderRadius: 10, backgroundColor: '#D1D5DB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <X size={11} color="#FFFFFF" />
          </div>
        </div>
        <span style={{ color: '#8B5CF6', fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 600, flexShrink: 0 }}>搜索</span>
      </div>

      {/* 分类横滑 */}
      <div style={{ display: 'flex', gap: 8, padding: '4px 16px 12px 16px', overflowX: 'auto', flexShrink: 0 }}>
        {categories.map((c, i) => (
          <div key={i} style={{
            padding: '7px 14px', borderRadius: 100, flexShrink: 0,
            backgroundColor: i === 0 ? '#8B5CF6' : '#F4F4F5',
          }}>
            <span style={{ color: i === 0 ? '#FFFFFF' : '#6B7280', fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 600 }}>{c}</span>
          </div>
        ))}
      </div>

      {/* 搜索历史 */}
      <div style={{ padding: '0 16px 16px 16px', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
          <span style={{ color: '#1A1A1A', fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 600 }}>搜索历史</span>
          <span style={{ color: '#9CA3AF', fontFamily: "'DM Sans', sans-serif", fontSize: 12 }}>清空</span>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {history.map((h, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 12px', borderRadius: 100, backgroundColor: '#F4F4F5' }}>
              <Clock />
              <span style={{ color: '#6B7280', fontFamily: "'DM Sans', sans-serif", fontSize: 13 }}>{h}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 分割线 + 结果标题 */}
      <div style={{ height: 6, backgroundColor: '#F4F4F5', flexShrink: 0 }} />
      <div style={{ padding: '16px 16px 8px 16px', flexShrink: 0 }}>
        <span style={{ color: '#1A1A1A', fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 600 }}>附近结果 · 3个</span>
      </div>

      {/* 搜索结果 */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10, padding: '0 16px 24px 16px', overflowY: 'auto' }}>
        {results.map((card, i) => (
          <Link href="/activity" key={i} style={{ textDecoration: 'none' }}>
            <div style={{ borderRadius: 18, backgroundColor: '#F4F4F5', padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 30, height: 30, borderRadius: '50%', backgroundColor: card.avatar }} />
                  <span style={{ color: '#1A1A1A', fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 600 }}>{card.name}</span>
                </div>
                <div style={{ padding: '4px 10px', borderRadius: 12, backgroundColor: card.tagBg }}>
                  <span style={{ color: card.tagColor, fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 600 }}>{card.tag}</span>
                </div>
              </div>
              <span style={{ color: '#1A1A1A', fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 15, fontWeight: 700 }}>{card.title}</span>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ color: '#6B7280', fontFamily: "'DM Sans', sans-serif", fontSize: 12 }}>📍 {card.dist}</span>
                  <span style={{ color: '#F472B6', fontFamily: "'DM Sans', sans-serif", fontSize: 12 }}>⏰ {card.time}</span>
                </div>
                <span style={{ color: '#6B7280', fontFamily: "'DM Sans', sans-serif", fontSize: 12 }}>{card.people}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
