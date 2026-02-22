/**
 * 自动化截图测试脚本
 * 作者: Maqingze
 * 用法: npx tsx scripts/screenshot-test.ts
 * 会对所有页面截图并保存到 .test-screenshots/ 目录
 */

import { chromium } from 'playwright'
import fs from 'fs'
import path from 'path'

const BASE_URL = 'http://localhost:3000'
const OUTPUT_DIR = path.join(process.cwd(), '.test-screenshots')

// 所有待测页面配置
const pages = [
  { name: '01-启动页',        path: '/',                          desc: '品牌启动页' },
  { name: '02-实时广场-正常',  path: '/plaza',                     desc: '广场正常态（卡片列表）' },
  { name: '03-AI对话',        path: '/ai',                        desc: 'AI 助手对话页' },
  { name: '04-活动详情',       path: '/activity',                  desc: '活动详情页' },
  { name: '05-临时聊天',       path: '/chat',                      desc: '活动群聊页' },
  { name: '06-个人中心',       path: '/profile',                   desc: '我的主页' },
  { name: '07-发起活动',       path: '/create',                    desc: '发起活动表单' },
  { name: '08-活动搜索',       path: '/search',                    desc: '活动搜索页' },
  { name: '09-兴趣选择',       path: '/onboarding/interests',      desc: 'Onboarding 兴趣标签' },
  { name: '10-设置昵称',       path: '/onboarding/setup',          desc: 'Onboarding 昵称设置' },
  { name: '13-活动回顾',       path: '/activity/review',           desc: 'AI 生成活动回顾' },
  { name: '14-他人主页',       path: '/user/test-user-id',         desc: '其他用户公开主页' },
  { name: '15-通知中心',       path: '/notifications',             desc: '通知列表页' },
]

// 广场空态和骨架屏需要客户端切换状态，通过注入 JS 实现
const plazaVariants = [
  { name: '11-广场空态',    state: 'empty',   desc: '广场无活动空状态' },
  { name: '12-广场骨架屏',  state: 'loading', desc: '广场加载骨架屏' },
]

// 颜色工具
const GREEN = '\x1b[32m'
const RED   = '\x1b[31m'
const YELLOW = '\x1b[33m'
const CYAN  = '\x1b[36m'
const RESET = '\x1b[0m'

interface TestResult {
  name: string
  success: boolean
  file?: string
  error?: string
  durationMs: number
}

async function main() {
  // 准备输出目录
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true })
  } else {
    // 清空旧截图
    fs.readdirSync(OUTPUT_DIR).forEach(f => fs.unlinkSync(path.join(OUTPUT_DIR, f)))
  }

  console.log(`\n${CYAN}========================================`)
  console.log('  Coucou 页面自动化截图测试')
  console.log(`========================================${RESET}\n`)

  // 先检查 dev server 是否已启动
  try {
    const res = await fetch(BASE_URL)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
  } catch {
    console.error(`${RED}✗ 无法连接到 ${BASE_URL}`)
    console.error(`  请先运行: npm run dev${RESET}\n`)
    process.exit(1)
  }

  const browser = await chromium.launch()
  const results: TestResult[] = []

  try {
    // 测试普通页面
    for (const page of pages) {
      const t0 = Date.now()
      const context = await browser.newContext({ viewport: { width: 430, height: 900 } })
      const browserPage = await context.newPage()
      try {
        await browserPage.goto(`${BASE_URL}${page.path}`, { waitUntil: 'networkidle', timeout: 10000 })

        // 等待字体和图片加载
        await browserPage.waitForTimeout(600)

        // 截取 375x812 的移动设备区域
        const fileName = `${page.name}.png`
        const filePath = path.join(OUTPUT_DIR, fileName)

        // 找到页面容器并截图
        const container = browserPage.locator('div').first()
        await browserPage.screenshot({
          path: filePath,
          clip: { x: 0, y: 0, width: 430, height: 900 },
        })

        results.push({ name: page.name, success: true, file: fileName, durationMs: Date.now() - t0 })
        console.log(`${GREEN}✓${RESET} ${page.name.padEnd(20)} ${YELLOW}${page.desc}${RESET}  ${Date.now() - t0}ms`)
      } catch (err) {
        results.push({ name: page.name, success: false, error: String(err), durationMs: Date.now() - t0 })
        console.log(`${RED}✗ ${page.name.padEnd(20)} ${String(err).slice(0, 60)}${RESET}`)
      } finally {
        await context.close()
      }
    }

    // 测试广场的空态和骨架屏（通过点击切换按钮）
    for (const variant of plazaVariants) {
      const t0 = Date.now()
      const context = await browser.newContext({ viewport: { width: 430, height: 900 } })
      const browserPage = await context.newPage()
      try {
        await browserPage.goto(`${BASE_URL}/plaza`, { waitUntil: 'networkidle', timeout: 10000 })
        await browserPage.waitForTimeout(300)

        // 点击对应的切换按钮
        const label = variant.state === 'empty' ? '空态' : '加载中'
        await browserPage.getByText(label).click()
        await browserPage.waitForTimeout(500)

        const fileName = `${variant.name}.png`
        const filePath = path.join(OUTPUT_DIR, fileName)
        await browserPage.screenshot({
          path: filePath,
          clip: { x: 0, y: 0, width: 430, height: 900 },
        })

        results.push({ name: variant.name, success: true, file: fileName, durationMs: Date.now() - t0 })
        console.log(`${GREEN}✓${RESET} ${variant.name.padEnd(20)} ${YELLOW}${variant.desc}${RESET}  ${Date.now() - t0}ms`)
      } catch (err) {
        results.push({ name: variant.name, success: false, error: String(err), durationMs: Date.now() - t0 })
        console.log(`${RED}✗ ${variant.name.padEnd(20)} ${String(err).slice(0, 60)}${RESET}`)
      } finally {
        await context.close()
      }
    }

  } finally {
    await browser.close()
  }

  // 汇总报告
  const passed = results.filter(r => r.success).length
  const failed = results.filter(r => !r.success).length
  const total  = results.length
  const totalMs = results.reduce((s, r) => s + r.durationMs, 0)

  console.log(`\n${CYAN}========================================`)
  console.log('  测试结果汇总')
  console.log(`========================================${RESET}`)
  console.log(`${GREEN}通过: ${passed}/${total}${RESET}   ${failed > 0 ? `${RED}失败: ${failed}${RESET}` : ''}`)
  console.log(`总耗时: ${(totalMs / 1000).toFixed(1)}s`)
  console.log(`截图保存至: ${CYAN}${OUTPUT_DIR}${RESET}`)

  if (failed > 0) {
    console.log(`\n${RED}失败页面:`)
    results.filter(r => !r.success).forEach(r => {
      console.log(`  - ${r.name}: ${r.error}`)
    })
    console.log(RESET)
    process.exit(1)
  }

  console.log(`\n${GREEN}所有页面截图完成！用 Finder 打开查看:${RESET}`)
  console.log(`open ${OUTPUT_DIR}\n`)
}

main()
