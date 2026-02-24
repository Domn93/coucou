import Link from 'next/link'

// 作者: Maqingze
// 屏幕 10 — Onboarding 设置昵称

const ChevronRight = ({ size = 18, color = '#9CA3AF' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6" />
  </svg>
)

export default function OnboardingSetupPage() {
  return (
    <div style={{ width: '100%', minHeight: '100dvh', backgroundColor: '#FFFFFF', display: 'flex', flexDirection: 'column', margin: '0 auto' }}>
      {/* 进度条（已完成） */}
      <div style={{ padding: 'max(20px, env(safe-area-inset-top)) 20px 0 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ flex: 1, height: 4, borderRadius: 2, backgroundColor: '#8B5CF6' }} />
          <span style={{ color: '#8B5CF6', fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 600 }}>2/2</span>
        </div>
      </div>

      {/* 大标题区 */}
      <div style={{ padding: '32px 20px 32px 20px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        <span style={{ color: '#1A1A1A', fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 28, fontWeight: 800, lineHeight: '1.2' }}>告诉大家你是谁</span>
        <span style={{ color: '#9CA3AF', fontFamily: "'DM Sans', sans-serif", fontSize: 14 }}>设置昵称，让大家认识你</span>
      </div>

      {/* 头像上传占位 */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, padding: '0 20px 28px 20px' }}>
        <div style={{ width: 88, height: 88, borderRadius: 44, backgroundColor: '#F4F4F5', border: '2px dashed #D1D5DB', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
          <span style={{ fontSize: 24 }}>📷</span>
        </div>
        <span style={{ color: '#9CA3AF', fontFamily: "'DM Sans', sans-serif", fontSize: 12 }}>点击上传头像</span>
      </div>

      {/* 昵称输入框 */}
      <div style={{ padding: '0 20px 20px 20px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        <span style={{ color: '#1A1A1A', fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 600 }}>昵称</span>
        <div style={{ borderRadius: 14, backgroundColor: '#F4F4F5', padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ color: '#9CA3AF', fontFamily: "'DM Sans', sans-serif", fontSize: 15 }}>给自己起个好听的名字...</span>
          <span style={{ color: '#D1D5DB', fontFamily: "'DM Sans', sans-serif", fontSize: 12 }}>0/20</span>
        </div>
      </div>

      {/* 位置权限卡片 */}
      <div style={{ margin: '0 20px', borderRadius: 20, backgroundColor: '#F9F5FF', border: '1.5px solid #DDD6FE', padding: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: '#8B5CF620', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: 22 }}>📍</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <span style={{ color: '#1A1A1A', fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 700 }}>开启位置权限</span>
              <span style={{ color: '#9CA3AF', fontFamily: "'DM Sans', sans-serif", fontSize: 12 }}>发现附近真实活动</span>
            </div>
          </div>
          <ChevronRight />
        </div>
      </div>

      {/* 底部按钮 */}
      <div style={{ flex: 1 }} />
      <div style={{ padding: '24px 20px calc(24px + env(safe-area-inset-bottom)) 20px' }}>
        <Link href="/plaza" style={{ textDecoration: 'none' }}>
          <div style={{ borderRadius: 100, backgroundColor: '#8B5CF6', padding: '16px 0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: '#FFFFFF', fontFamily: "'DM Sans', sans-serif", fontSize: 16, fontWeight: 700 }}>✦ 开始探索</span>
          </div>
        </Link>
      </div>
    </div>
  )
}
