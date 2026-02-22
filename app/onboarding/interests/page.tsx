import Link from 'next/link'

// 作者: Maqingze
// 屏幕 9 — Onboarding 兴趣选择

// 9 个兴趣标签
const interests = [
  { emoji: '🏃', label: '运动', selected: true },
  { emoji: '🍜', label: '饭局', selected: true },
  { emoji: '🃏', label: '打牌', selected: false },
  { emoji: '🚶', label: '闲逛', selected: true },
  { emoji: '🖼', label: '展览', selected: false },
  { emoji: '🎵', label: '音乐', selected: false },
  { emoji: '🌳', label: '户外', selected: true },
  { emoji: '📚', label: '读书', selected: false },
  { emoji: '🎲', label: '桌游', selected: false },
]

export default function OnboardingInterestsPage() {
  return (
    <div style={{ width: 375, minHeight: 812, backgroundColor: '#FFFFFF', display: 'flex', flexDirection: 'column', margin: '0 auto' }}>
      {/* 进度条 + 跳过 */}
      <div style={{ padding: '20px 20px 0 20px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ flex: 1, height: 4, borderRadius: 2, backgroundColor: '#F4F4F5', marginRight: 8, overflow: 'hidden' }}>
            <div style={{ width: '50%', height: '100%', borderRadius: 2, backgroundColor: '#8B5CF6' }} />
          </div>
          <span style={{ color: '#9CA3AF', fontFamily: "'DM Sans', sans-serif", fontSize: 12 }}>1/2</span>
          <Link href="/plaza" style={{ marginLeft: 16, textDecoration: 'none' }}>
            <span style={{ color: '#9CA3AF', fontFamily: "'DM Sans', sans-serif", fontSize: 14 }}>跳过</span>
          </Link>
        </div>
      </div>

      {/* 大标题区 */}
      <div style={{ padding: '32px 20px 24px 20px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        <span style={{ color: '#1A1A1A', fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 28, fontWeight: 800, lineHeight: '1.2' }}>你喜欢哪类活动？</span>
        <span style={{ color: '#9CA3AF', fontFamily: "'DM Sans', sans-serif", fontSize: 14 }}>选择你感兴趣的类型，我们帮你发现附近的同好</span>
      </div>

      {/* 兴趣标签网格 */}
      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, padding: '0 20px' }}>
        {interests.map((item, i) => (
          <div key={i} style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            gap: 8, padding: '20px 0', borderRadius: 20,
            backgroundColor: item.selected ? '#8B5CF6' : '#F4F4F5',
            border: item.selected ? 'none' : '1.5px solid #E5E7EB',
          }}>
            <span style={{ fontSize: 28 }}>{item.emoji}</span>
            <span style={{
              color: item.selected ? '#FFFFFF' : '#1A1A1A',
              fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 600,
            }}>{item.label}</span>
          </div>
        ))}
      </div>

      {/* 底部已选提示 + 按钮 */}
      <div style={{ padding: '24px 20px 40px 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ color: '#9CA3AF', fontFamily: "'DM Sans', sans-serif", fontSize: 13 }}>已选 </span>
          <span style={{ color: '#8B5CF6', fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 700 }}> 4 </span>
          <span style={{ color: '#9CA3AF', fontFamily: "'DM Sans', sans-serif", fontSize: 13 }}>个兴趣</span>
        </div>
        <Link href="/onboarding/setup" style={{ textDecoration: 'none' }}>
          <div style={{ borderRadius: 100, backgroundColor: '#8B5CF6', padding: '16px 0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: '#FFFFFF', fontFamily: "'DM Sans', sans-serif", fontSize: 16, fontWeight: 700 }}>下一步 →</span>
          </div>
        </Link>
      </div>
    </div>
  )
}
