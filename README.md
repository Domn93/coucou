# 凑凑 CouCou - AI 驱动的实时活动互助社交平台

一款革新性的 P2P 实时活动互助社交应用，通过"聊天即发布"的设计理念，消除传统表单，让用户通过自然语言与 AI 对话即可发起、发现和参与附近活动。

## 📱 主要功能

- **实时广场流** - 发现身边正在进行的各类活动（打牌、运动、饭局、闲逛等）
- **AI 智能助手** - 聊天式交互，AI 推荐符合兴趣的活动
- **活动详情** - 查看发起人信息、参与者、时间倒计时、地理位置
- **临时聊天组** - 加入活动后与其他参与者实时沟通协调

## 🛠️ 技术栈

### 前端
- **Next.js 14** - React 全栈框架，支持 Vercel 一键部署
- **TypeScript** - 类型安全开发
- **TailwindCSS** - 原子化 CSS 框架
- **Supabase JS Client** - 数据库和实时通信客户端

### 后端 & 数据库
- **Next.js API Routes** - 轻量级 Serverless 后端
- **Prisma ORM** - 类型安全的数据库操作
- **Supabase PostgreSQL** - 云托管关系型数据库
- **Supabase Realtime** - WebSocket 实时推送

### 认证 & 部署
- **NextAuth.js** - OAuth 认证方案
- **Vercel** - 自动化部署（git push 即发版）

## 📂 项目结构

```
coucou/
├── app/                        # Next.js App Router
│   ├── api/
│   │   ├── activities/        # 活动 CRUD API
│   │   ├── chat/[roomId]/    # 聊天消息 API
│   │   └── ai/               # AI 对话 API
│   ├── plaza/page.tsx        # 实时广场页面
│   ├── activity/page.tsx     # 活动详情页面
│   ├── chat/page.tsx         # 临时聊天组页面
│   ├── ai/page.tsx           # AI 对话页面
│   ├── layout.tsx            # 根布局
│   ├── page.tsx              # 启动页面
│   └── globals.css           # 全局样式
├── lib/
│   ├── supabase.ts          # Supabase 客户端
│   └── types/
│       └── index.ts         # TypeScript 类型定义
├── prisma/
│   └── schema.prisma        # 数据库模型定义
├── components/              # React 组件库（待实现）
├── hooks/                   # Custom Hooks（待实现）
├── public/                  # 静态资源
├── design/                  # UI 设计稿（.pen 格式）
├── .env.example            # 环境变量模板
├── package.json
├── tsconfig.json
├── next.config.js
├── tailwind.config.js
└── postcss.config.js
```

## 🚀 快速开始

### 前置要求
- Node.js 18+
- npm 或 yarn
- Supabase 账户
- GitHub 账户（用于 Vercel 部署）

### 本地开发

1. **克隆仓库并安装依赖**
```bash
cd coucou
npm install
```

2. **配置环境变量**
```bash
cp .env.example .env.local
# 填写你的 Supabase 凭证
```

3. **初始化数据库**
```bash
npm run db:push
```

4. **启动开发服务器**
```bash
npm run dev
```

访问 http://localhost:3000

### 数据库管理
```bash
# 打开 Prisma Studio（可视化数据库编辑器）
npm run db:studio
```

## 📋 数据模型

### User（用户）
- `id` - 唯一标识
- `email` - 邮箱（唯一）
- `name` - 昵称
- `avatar` - 头像 URL
- `rating` - 靠谱度评分（1-5）
- `eventCount` - 发起/参与的活动数

### Activity（活动）
- `id` - 唯一标识
- `title` - 活动标题
- `description` - 描述
- `category` - 分类（打牌/运动/饭局/闲逛）
- `location` - 位置描述
- `distance` - 距离文本
- `startTime` - 开始时间
- `maxParticipants` - 最大参与人数
- `initiatorId` - 发起人 ID

### ChatRoom & ChatMessage（聊天）
- 与活动一对一关联
- Supabase Realtime 推送消息

## 🔧 API 端点

### Activities（活动）
- `GET /api/activities` - 获取附近活动列表
- `POST /api/activities` - 创建新活动

### Chat（聊天）
- `GET /api/chat/[roomId]` - 获取聊天消息
- `POST /api/chat/[roomId]` - 发送消息

### AI（智能助手）
- `POST /api/ai/chat` - AI 对话

## 🎨 设计规范

- **主色**: 紫色 `#8B5CF6`
- **辅助色**: 粉色 `#F472B6`、青色 `#14B8A6`
- **圆角**: 卡片 20px、按钮 100px（pill 形）
- **字体**: Bricolage Grotesque（标题）、DM Sans（正文）
- **布局**: 响应式移动优先（适配 iOS/Android 主流机型，支持安全区）

## 📦 部署到 Vercel

1. **推送到 GitHub**
```bash
git remote add origin https://github.com/YOUR_USERNAME/coucou.git
git push -u origin main
```

2. **连接 Vercel**
   - 访问 [vercel.com](https://vercel.com)
   - 导入项目
   - 配置环境变量（NEXT_PUBLIC_SUPABASE_URL、DATABASE_URL 等）
   - 自动部署

3. **配置自定义域名**（可选）
   - Vercel 项目设置 → Domains
   - 添加你的域名

## 🧪 测试

```bash
# 类型检查
npm run type-check

# 生产构建
npm run build
npm start
```

## 📝 开发约定

- **分支策略**: `main`（生产） ← `dev`（开发）
- **Commit 规范**: `feat:`/`fix:`/`docs:`/`refactor:`/`test:` 开头
- **TypeScript**: 严格模式，禁用 `any`
- **代码风格**: ESLint + Prettier（待配置）

## 🤝 贡献指南

1. Fork 项目
2. 创建特性分支 (`git checkout -b feature/amazing-feature`)
3. Commit 变更 (`git commit -m 'feat: 添加新功能'`)
4. Push 到分支 (`git push origin feature/amazing-feature`)
5. 开启 Pull Request

## 📄 许可证

MIT License - see LICENSE file for details

## 👨‍💻 作者

- **Domn** - 全栈开发

---

**状态**: 🚧 开发中 | **最后更新**: 2026-02-12
