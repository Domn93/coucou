'use client'

// 作者: Maqingze
// 登录页 — 手机号 + 验证码两步登录

import { useState, useEffect, useRef } from 'react'
import { signIn, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

// 手机号格式校验
const isValidPhone = (phone: string) => /^1[3-9]\d{9}$/.test(phone)

export default function LoginPage() {
  const router = useRouter()
  const { data: session, status } = useSession()

  const [step, setStep] = useState<'phone' | 'code'>('phone')
  const [phone, setPhone] = useState('')
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  // 发送倒计时
  const [countdown, setCountdown] = useState(0)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // 已登录则直接跳转
  useEffect(() => {
    if (status === 'authenticated') {
      const user = session?.user as { isNewUser?: boolean } | undefined
      router.replace(user?.isNewUser ? '/onboarding/setup' : '/plaza')
    }
  }, [status, session, router])

  // 倒计时清理
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [])

  // 开始60秒倒计时
  function startCountdown() {
    setCountdown(60)
    timerRef.current = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current!)
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  // 发送验证码
  async function handleSendCode() {
    setError('')
    if (!isValidPhone(phone)) {
      setError('请输入正确的11位手机号')
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/auth/send-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || '发送失败，请重试')
        return
      }
      setStep('code')
      startCountdown()
    } catch {
      setError('网络异常，请重试')
    } finally {
      setLoading(false)
    }
  }

  // 验证码登录
  async function handleVerify() {
    setError('')
    if (code.length !== 6) {
      setError('请输入6位验证码')
      return
    }
    setLoading(true)
    try {
      const result = await signIn('phone', {
        phone,
        code,
        redirect: false,
      })
      if (result?.error) {
        setError('验证码错误或已过期，请重新获取')
      }
      // 登录成功会触发 useEffect 跳转
    } catch {
      setError('登录失败，请重试')
    } finally {
      setLoading(false)
    }
  }

  if (status === 'loading') {
    return (
      <div style={{ width: '100%', minHeight: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#FAFAFA' }}>
        <div style={{ width: 32, height: 32, border: '3px solid #E5E7EB', borderTopColor: '#8B5CF6', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      </div>
    )
  }

  return (
    <main style={{
      width: '100%',
      minHeight: '100dvh',
      background: 'linear-gradient(180deg, #7C3AED 0%, #8B5CF6 40%, #A78BFA 70%, #C4B5FD 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 24,
      padding: 'max(48px, env(safe-area-inset-top)) 24px calc(48px + env(safe-area-inset-bottom))',
      overflowY: 'auto',
    }}>
      {/* Logo区 */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
        <div style={{ width: 72, height: 72, borderRadius: 36, backgroundColor: '#FFFFFF33', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ color: '#FFFFFF', fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 16, fontWeight: 800 }}>CouCou</span>
        </div>
        <h1 style={{ color: '#FFFFFF', fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 28, fontWeight: 700, margin: 0 }}>
          凑凑 CouCou
        </h1>
        <p style={{ color: '#FFFFFFCC', fontFamily: "'DM Sans', sans-serif", fontSize: 15, margin: 0 }}>
          凑个局，就现在
        </p>
      </div>

      {/* 登录表单卡片 */}
      <div style={{
        width: '100%',
        backgroundColor: '#FFFFFF',
        borderRadius: 24,
        padding: '28px 24px',
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
      }}>
        <h2 style={{ color: '#1A1A1A', fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 20, fontWeight: 700, margin: 0 }}>
          {step === 'phone' ? '手机号登录' : '输入验证码'}
        </h2>
        <p style={{ color: '#6B7280', fontFamily: "'DM Sans', sans-serif", fontSize: 14, margin: 0 }}>
          {step === 'phone' ? '未注册的手机号将自动创建账号' : `验证码已发送至 ${phone}`}
        </p>

        {/* 手机号输入 */}
        {step === 'phone' && (
          <div style={{ display: 'flex', alignItems: 'center', borderRadius: 14, backgroundColor: '#F4F4F5', padding: '0 16px', gap: 8 }}>
            <span style={{ color: '#6B7280', fontFamily: "'DM Sans', sans-serif", fontSize: 15, whiteSpace: 'nowrap' }}>+86</span>
            <div style={{ width: 1, height: 20, backgroundColor: '#E5E7EB' }} />
            <input
              type="tel"
              value={phone}
              onChange={e => setPhone(e.target.value.replace(/\D/g, '').slice(0, 11))}
              onKeyDown={e => e.key === 'Enter' && handleSendCode()}
              placeholder="请输入手机号"
              style={{
                flex: 1, border: 'none', outline: 'none', backgroundColor: 'transparent',
                padding: '14px 0', fontSize: 16, fontFamily: "'DM Sans', sans-serif", color: '#1A1A1A',
              }}
            />
          </div>
        )}

        {/* 验证码输入 */}
        {step === 'code' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <input
              type="text"
              inputMode="numeric"
              value={code}
              onChange={e => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              onKeyDown={e => e.key === 'Enter' && handleVerify()}
              placeholder="请输入6位验证码"
              autoFocus
              style={{
                borderRadius: 14, backgroundColor: '#F4F4F5', padding: '14px 16px',
                border: 'none', outline: 'none', fontSize: 24, fontFamily: "'DM Sans', sans-serif",
                color: '#1A1A1A', letterSpacing: 8, textAlign: 'center',
              }}
            />
            {/* 重新发送 */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span
                style={{ color: '#6B7280', fontFamily: "'DM Sans', sans-serif", fontSize: 13, cursor: 'pointer' }}
                onClick={() => { setStep('phone'); setCode(''); setError('') }}
              >
                更换手机号
              </span>
              <span
                onClick={countdown === 0 ? handleSendCode : undefined}
                style={{
                  color: countdown > 0 ? '#9CA3AF' : '#8B5CF6',
                  fontFamily: "'DM Sans', sans-serif", fontSize: 13,
                  cursor: countdown > 0 ? 'not-allowed' : 'pointer',
                  fontWeight: 600,
                }}
              >
                {countdown > 0 ? `${countdown}s 后重发` : '重新发送'}
              </span>
            </div>
          </div>
        )}

        {/* 错误提示 */}
        {error && (
          <div style={{ borderRadius: 10, backgroundColor: '#FEF2F2', padding: '10px 14px' }}>
            <span style={{ color: '#EF4444', fontFamily: "'DM Sans', sans-serif", fontSize: 13 }}>{error}</span>
          </div>
        )}

        {/* 主按钮 */}
        <div
          onClick={!loading ? (step === 'phone' ? handleSendCode : handleVerify) : undefined}
          style={{
            borderRadius: 100,
            backgroundColor: loading ? '#C4B5FD' : '#8B5CF6',
            padding: '16px 0',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: loading ? 'not-allowed' : 'pointer',
            marginTop: 4,
          }}
        >
          <span style={{ color: '#FFFFFF', fontFamily: "'DM Sans', sans-serif", fontSize: 16, fontWeight: 700 }}>
            {loading ? '处理中...' : (step === 'phone' ? '获取验证码' : '登录 / 注册')}
          </span>
        </div>
      </div>

      {/* 底部提示 */}
      <p style={{ color: '#FFFFFF88', fontFamily: "'DM Sans', sans-serif", fontSize: 12, margin: 0, textAlign: 'center', lineHeight: 1.6 }}>
        登录即同意凑凑《用户协议》和《隐私政策》
      </p>
    </main>
  )
}
