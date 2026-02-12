import Link from 'next/link'

export default function Home() {
  return (
    <main
      style={{
        width: 375,
        height: 812,
        background: 'linear-gradient(180deg, #7C3AED 0%, #8B5CF6 40%, #A78BFA 70%, #C4B5FD 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 40,
        overflow: 'hidden',
        margin: '0 auto',
      }}
    >
      {/* topSpace - 不可见占位 */}
      <div style={{ height: 120, width: 1, opacity: 0 }} />

      {/* logoWrap */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 16,
        }}
      >
        {/* logoInner - 圆形 Logo */}
        <div
          style={{
            width: 88,
            height: 88,
            borderRadius: 44,
            backgroundColor: '#FFFFFF33',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <span
            style={{
              color: '#FFFFFF',
              fontFamily: "'Bricolage Grotesque', sans-serif",
              fontSize: 18,
              fontWeight: 800,
            }}
          >
            CouCou
          </span>
        </div>

        {/* brandName */}
        <h1
          style={{
            color: '#FFFFFF',
            fontFamily: "'Bricolage Grotesque', sans-serif",
            fontSize: 36,
            fontWeight: 700,
            margin: 0,
          }}
        >
          凑凑 CouCou
        </h1>

        {/* slogan */}
        <p
          style={{
            color: '#FFFFFFCC',
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 18,
            fontWeight: 500,
            margin: 0,
          }}
        >
          凑个局，就现在
        </p>

        {/* descText */}
        <p
          style={{
            color: '#FFFFFF99',
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 14,
            fontWeight: 400,
            margin: 0,
          }}
        >
          AI 驱动的实时活动互助社交平台
        </p>
      </div>

      {/* btnWrap */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 16,
          width: '100%',
          padding: '0 40px',
        }}
      >
        {/* btn - 主按钮 */}
        <Link
          href="/plaza"
          style={{
            width: '100%',
            height: 56,
            borderRadius: 100,
            backgroundColor: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            textDecoration: 'none',
          }}
        >
          <span
            style={{
              color: '#8B5CF6',
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 18,
              fontWeight: 700,
            }}
          >
            开始探索
          </span>
          {/* lucide arrow-right */}
          <svg
            width={20}
            height={20}
            viewBox="0 0 24 24"
            fill="none"
            stroke="#8B5CF6"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </Link>

        {/* subText */}
        <p
          style={{
            color: '#FFFFFF88',
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 13,
            fontWeight: 400,
            margin: 0,
          }}
        >
          发现你身边正在发生的有趣活动
        </p>
      </div>
    </main>
  )
}
