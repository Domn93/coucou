// 作者: Maqingze
// 发送手机验证码 API — 生成6位码存库，调用腾讯云SMS发送

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// 生成6位随机数字验证码
function generateCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

// 调用腾讯云SMS发送短信
async function sendSms(phone: string, code: string): Promise<void> {
  const secretId = process.env.TENCENT_SECRET_ID
  const secretKey = process.env.TENCENT_SECRET_KEY
  const appId = process.env.TENCENT_SMS_APP_ID
  const signName = process.env.TENCENT_SMS_SIGN
  const templateId = process.env.TENCENT_SMS_TEMPLATE_ID

  // 未配置短信服务时，开发模式直接打印（方便本地测试）
  if (!secretId || !secretKey || !appId) {
    console.log(`[DEV] 验证码发送 -> 手机号: ${phone}, 验证码: ${code}`)
    return
  }

  // 腾讯云SMS v3 签名请求
  const endpoint = 'sms.tencentcloudapi.com'
  const service = 'sms'
  const action = 'SendSms'
  const version = '2021-01-11'
  const timestamp = Math.floor(Date.now() / 1000)
  const date = new Date(timestamp * 1000).toISOString().split('T')[0]

  const payload = JSON.stringify({
    SmsSdkAppId: appId,
    SignName: signName,
    TemplateId: templateId,
    TemplateParamSet: [code],
    PhoneNumberSet: [`+86${phone}`],
  })

  // 计算签名
  const algorithm = 'TC3-HMAC-SHA256'
  const encoder = new TextEncoder()
  const key = await crypto.subtle.importKey('raw', encoder.encode(`TC3${secretKey}`), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign'])

  async function hmacSha256(keyMaterial: CryptoKey | ArrayBuffer, data: string): Promise<Uint8Array> {
    const k = keyMaterial instanceof CryptoKey ? keyMaterial : await crypto.subtle.importKey('raw', keyMaterial, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign'])
    const sig = await crypto.subtle.sign('HMAC', k, encoder.encode(data))
    return new Uint8Array(sig)
  }

  async function sha256Hex(data: string): Promise<string> {
    const buf = await crypto.subtle.digest('SHA-256', encoder.encode(data))
    return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('')
  }

  const hashedPayload = await sha256Hex(payload)
  const canonicalRequest = `POST\n/\n\ncontent-type:application/json; charset=utf-8\nhost:${endpoint}\n\ncontent-type;host\n${hashedPayload}`
  const credentialScope = `${date}/${service}/tc3_request`
  const hashedCanonical = await sha256Hex(canonicalRequest)
  const stringToSign = `${algorithm}\n${timestamp}\n${credentialScope}\n${hashedCanonical}`

  const dateKey = await hmacSha256(key, date)
  const serviceKey = await hmacSha256(dateKey.buffer as ArrayBuffer, service)
  const signingKey = await hmacSha256(serviceKey.buffer as ArrayBuffer, 'tc3_request')
  const signatureBytes = await hmacSha256(signingKey.buffer as ArrayBuffer, stringToSign)
  const signature = Array.from(signatureBytes).map(b => b.toString(16).padStart(2, '0')).join('')

  const authorization = `${algorithm} Credential=${secretId}/${credentialScope}, SignedHeaders=content-type;host, Signature=${signature}`

  const res = await fetch(`https://${endpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      Host: endpoint,
      'X-TC-Action': action,
      'X-TC-Version': version,
      'X-TC-Timestamp': String(timestamp),
      Authorization: authorization,
    },
    body: payload,
  })

  const result = await res.json()
  if (result.Response?.Error) {
    throw new Error(`腾讯云SMS错误: ${result.Response.Error.Message}`)
  }
}

// POST /api/auth/send-code
export async function POST(request: NextRequest) {
  try {
    const { phone } = await request.json()

    // 手机号格式校验（11位中国大陆手机号）
    if (!phone || !/^1[3-9]\d{9}$/.test(phone)) {
      return NextResponse.json({ error: '请输入正确的手机号' }, { status: 400 })
    }

    // 开发后门：直接提示使用 000000 跳过短信验证（SMS 服务未接入时使用）
    if (!process.env.TENCENT_SECRET_ID) {
      console.log(`[DEV] SMS未配置，使用后门验证码 000000 登录手机号: ${phone}`)
      return NextResponse.json({ success: true, message: '验证码已发送（开发模式：请输入 000000）' })
    }

    // 限流：1分钟内同一手机号只能发1次
    const recentCode = await prisma.verificationCode.findFirst({
      where: {
        phone,
        createdAt: { gte: new Date(Date.now() - 60 * 1000) },
      },
      orderBy: { createdAt: 'desc' },
    })

    if (recentCode) {
      return NextResponse.json({ error: '发送频率过快，请1分钟后再试' }, { status: 429 })
    }

    const code = generateCode()
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000) // 5分钟后过期

    // 存入数据库
    await prisma.verificationCode.create({
      data: { phone, code, expiresAt },
    })

    // 发送短信
    await sendSms(phone, code)

    return NextResponse.json({ success: true, message: '验证码已发送' })
  } catch (error) {
    console.error('send-code error:', error)
    return NextResponse.json({ error: '发送失败，请重试' }, { status: 500 })
  }
}
