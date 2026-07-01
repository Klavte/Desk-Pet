# PRD — 可配置静态资源管理系统 v2

> 状态: Draft | 日期: 2026-07-01

---

## 零、核心原则

> **统一配置，拆箱即用**
> 1. 所有配置统一在 `CONFIG.yaml`，不分拆多个 manifest 文件
> 2. 内置角色/主题/字体作为默认配置随包发布，用户开箱即用
> 3. 设置页面按功能域分 Tab，与 CONFIG.yaml 结构一一对应
> 4. 用户自定义角色/主题通过设置页导入，自动追加到 CONFIG 覆盖层

---

## 一、CONFIG.yaml 结构重组

按 6 大功能域划分，现有字段归位，新增字段标注 `[NEW]`：

```yaml
# ==========================================
# 糖糖桌宠 全局配置
# ==========================================

# ══════════════════════════════════════════
# 1. 通用设置 (General)
# ══════════════════════════════════════════
general:
  # 模式
  mode:
    assistant: false

  # 弹窗行为
  popup:
    mode: cursor              # cursor | fixed
    autoPopupOnMessage: false # 收到消息自动弹出
    defaultSize: { w: 730, h: 450 }

  # 快捷键
  shortcut:
    key: "P"
    macModifiers: ["Control", "Command"]
    winModifiers: ["Control", "Alt"]

  # 日志
  logging:
    level: info               # debug | info | warn | error

  # 桌面后端
  desktop:
    pollingIntervalMs: 3000
    pauseExtraMs: 5000
    waitTimeoutMs: 5000

# ══════════════════════════════════════════
# 2. AI 设置 (AI)
# ══════════════════════════════════════════
ai:
  provider: deepseek
  endpoint: https://api.deepseek.com
  apiKey: ""
  requireApiKey: true
  model: deepseek-chat
  contextMaxTokens: 16000

  # 默认人格
  defaultSystemPrompt: "你叫糖糖..."

  # 思考强度
  thinking:
    effort: auto              # auto | low | medium | high
    budget:
      low: 1000
      medium: 4000
      high: 16000

  # 人格系统 (原 personality section 迁移进来)
  personality:
    enabled: true
    active: angelkawaii
    cards:
      - { id: angelkawaii, name: KAngel, path: cards/angelkawaii.md, description: "甜蜜活泼+病娇" }
      - { id: ame, name: Ame, path: cards/ame.md, description: "冷静管家型" }
      - { id: pchan, name: P酱, path: cards/pchan.md, description: "慵懒电竞少女" }

  # 核心 Loop
  loop:
    maxRetry: 3
    maxToolCallsPerTurn: 5
    toolTimeoutMs: 30000
    turnTimeoutMs: 120000
    streamEnabled: true
    contextCompactAt: 0.95

  # 记忆
  memory:
    maxEntries: 200

  # 并发锁
  lock:
    safetyTimeoutMs: 30000

  # 窗口监控（主动搭话）
  windowMonitor:
    enabled: true
    staySeconds: 60
    settleMs: 2000
    cooldownSeconds: 5000
    samePageCooldownSeconds: 7800
    defaultCooldownMs: 12000
    resumeExtraMs: 2000

  # 安全
  safety:
    mode: tell_me             # just_do_it | tell_me | let_me_tk
    sessionTrustEnabled: true

# ══════════════════════════════════════════
# 3. 工具配置 (Tools)
# ══════════════════════════════════════════
tools:
  bash:
    enabled: true
    whitelist: ["ls", "cat", "grep", "find", ...]

  file:
    enabled: true
    writeEnabled: false

  mcp:
    enabled: false
    servers: []
    builtin:
      filesystem:
        enabled: true
        command: npx
        args: ["-y", "@modelcontextprotocol/server-filesystem", "/"]
      brave-search:
        enabled: false
        command: npx
        args: ["-y", "@anthropic/mcp-brave-search"]
        env: { BRAVE_API_KEY: "" }
      playwright: { enabled: true, command: npx, args: ["-y", "@anthropic/mcp-playwright"] }
      git: { enabled: false, command: npx, args: ["-y", "@anthropic/mcp-git", "/"] }
      github: { enabled: false, command: npx, args: ["-y", "@anthropic/mcp-github"], env: { GITHUB_PERSONAL_ACCESS_TOKEN: "" } }

  skill:
    enabled: false
    skills: []

# ══════════════════════════════════════════
# 4. 声音设置 (Sound) [NEW section]
# ══════════════════════════════════════════
sound:
  enabled: true
  volume: 0.8

  # 事件→音效映射
  events:
    popin: "popin_default"        # 弹出
    popout: "whistle"             # 收回
    send: "send_default"          # 发送消息
    receive: "receive_default"    # 收到回复
    startup: "startup_jingle"     # 启动
    expression_smile: ""          # 空=使用角色默认
    expression_sleepy: ""
    # ... 更多事件

# ══════════════════════════════════════════
# 5. 外观与主题 (Appearance) [NEW section]
# ══════════════════════════════════════════
appearance:
  activeCharacter: "cho"        # 当前角色 ID
  activeTheme: "default"        # 当前主题 ID

  # ── 主题定义 ──
  themes:
    default:
      name: "糖糖粉"
      colors:
        bg: "#fce4ec"
        border: "#a01a5a"
        borderGradient: ["#fccdd9", "#f7a8c4", "#c4276f", "#a01a5a"]
        text: "#333333"
        accent: "#c4276f"
        chatBg: "#fce4ec"
        divider: "#e8a0b0"
        settingsBg: "#3e1a2e"
        settingsCard: "#2a1020"
      fonts:
        ui: "zpix"                # 界面字体
        chat: "zpix"              # 聊天字体
        size: 14
        lineHeight: 1.6
      shield:
        enabled: false            # 台座开关
        image: ""                 # 自定义台座图

    dark:                         # [NEW] 内置暗色主题
      name: "暗夜紫"
      colors:
        bg: "#1a1025"
        border: "#7a3a6a"
        borderGradient: ["#4a2050", "#5a3070", "#8a4a8a", "#7a3a6a"]
        text: "#e0d0e8"
        accent: "#c06aaf"
        chatBg: "#1a1025"
        divider: "#5a3a6a"
        settingsBg: "#1a1025"
        settingsCard: "#251530"
      fonts:
        ui: "zpix"
        chat: "zpix"
        size: 14
        lineHeight: 1.6
      shield:
        enabled: false

  # ── 角色定义 ──
  characters:
    # --- 内置角色：糖糖 (CTJ素材) ---
    cho:
      name: "糖糖"
      builtin: true              # 内置标记，不可删除
      scale: 1.0
      scaleMode: pixelated       # pixelated | smooth
      body: "/assets/characters/cho/body.png"

      animations:                # 动画定义
        idle:
          loop: true
          frames:
            - { f: "frames/idle_000.png", d: 5000 }
            - { f: "frames/idle_001.png", d: 250 }
        smile:
          loop: false
          frames:
            - { f: "frames/smile_001.png", d: 100 }
            - { f: "frames/smile_002.png", d: 100 }
            - { f: "frames/smile_003.png", d: 100 }
            - { f: "frames/smile_004.png", d: 100 }
            - { f: "frames/smile_005.png", d: 100 }
            - { f: "frames/smile_006.png", d: 100 }
            - { f: "frames/smile_007.png", d: 300 }
        # ... 其余动画 (angry, sleepy, chu, h, superchat, gaoo, business1,
        #     hera1, hera2, hera3, grgr1, grgr2, grgr3, grgr4, come, kakoyoku, ha, you)

      # 表情关键词映射
      expressions:
        - { kw: ["smile", "开心", "哈哈"], anim: "smile" }
        - { kw: ["sleep", "困", "晚安"], anim: "sleepy" }
        - { kw: ["angry", "生气", "滚"], anim: "angry" }
        - { kw: ["love", "喜欢", "chu", "亲"], anim: "chu" }
        - { kw: ["superchat", "sc"], anim: "superchat" }
        - { kw: ["gaoo", "嗷呜"], anim: "gaoo" }
        - { kw: ["business", "办公"], anim: "business1" }
        - { kw: ["you", "你"], anim: "you" }

      # 内置动画（CSS驱动，不需要素材）
      builtinAnimations:
        - breathing
        - bounce
        - shake
        - wave
        - float
        - tilt

    # --- 默认角色（无素材 fallback）---
    default:
      name: "默认"
      builtin: true
      scaleMode: smooth
      body: "/assets/characters/default/body.png"
      animations:
        idle:
          loop: true
          frames:
            - { f: "body.png", d: 3000 }
      expressions: []
      builtinAnimations:
        - breathing
        - bounce
        - shake
        - wave
        - blink
        - float
        - tilt
```

---

## 二、设置页面分 Tab 重构

现有 SettingsPanel 拆为带侧边导航的 Tab 结构：

### Tab 内容分配

| Tab | 内容 | 对应 CONFIG 路径 |
|-----|------|-----------------|
| **🏠 通用** | 模式切换、弹窗位置、弹窗大小、快捷键、日志级别、桌面轮询 | `general.*` |
| **🤖 AI** | 端点/密钥/模型、思考强度、人格选择、默认人格 prompt、记忆、窗口监控、并发锁、安全策略 | `ai.*` |
| **🔧 工具** | Bash 白名单、文件写开关、MCP 开关/列表/内置、Skill 开关/列表 | `tools.*` |
| **🔊 声音** | 音量、事件→音效映射表、试听按钮、导入音效文件 | `sound.*` |
| **🎨 主题** | 主题选择、角色选择、**角色管理**（导入/预览/编辑）、主题颜色编辑、字体选择、台座开关 | `appearance.*` |

### 🎨 主题 Tab 详情

```
┌─ 主题 ──────────────────────────────────────┐
│                                              │
│  ┌─ 角色选择 ───────────────────────────┐   │
│  │ 当前角色: [糖糖 ▼]                    │   │
│  │                                       │   │
│  │ 已安装角色:                            │   │
│  │ ┌──────┐ ┌──────┐ ┌──────────────┐   │   │
│  │ │ 🎭糖糖 │ │ 🎭默认 │ │ ＋ 导入角色  │   │   │
│  │ │ 内置   │ │ 内置   │ │ (拖入图片)   │   │   │
│  │ └──────┘ └──────┘ └──────────────┘   │   │
│  │                                       │   │
│  │ [角色预览区]  → 可在此预览idle动画     │   │
│  └───────────────────────────────────────┘   │
│                                              │
│  ┌─ 主题选择 ───────────────────────────┐   │
│  │ 当前主题: [糖糖粉 ▼]                  │   │
│  │                                       │   │
│  │ ┌──────────┐ ┌──────────┐            │   │
│  │ │ 🎀 糖糖粉 │ │ 🌙 暗夜紫 │            │   │
│  │ └──────────┘ └──────────┘            │   │
│  └───────────────────────────────────────┘   │
│                                              │
│  ┌─ 主题编辑器 ─────────────────────────┐   │
│  │ 背景色: [#fce4ec] [取色器]            │   │
│  │ 边框色: [#a01a5a] [取色器]            │   │
│  │ ... 其他颜色 ...                      │   │
│  │                                       │   │
│  │ 界面字体: [zpix ▼]                    │   │
│  │ 聊天字体: [zpix ▼]                    │   │
│  │ 字号: [14]                            │   │
│  │                                       │   │
│  │ 台座: ☐ 启用   图片: [选择文件]       │   │
│  │                                       │   │
│  │ [恢复默认] [导出主题] [导入主题]       │   │
│  └───────────────────────────────────────┘   │
└──────────────────────────────────────────────┘
```

---

## 三、角色导入流水线

```
流程：

  用户点击 "+ 导入角色"
       │
       ▼
  ┌─────────────────────┐
  │ 弹出导入对话框       │
  │                      │
  │ ○ 单张图片           │ ← 拖入/选择 PNG
  │    → 自动创建角色包   │   使用全部 7 个 builtin 动画
  │                      │
  │ ○ 多张序列帧         │ ← 拖入/选择 N 张 PNG
  │    → 智能分组识别     │   按文件名模式拆分为动画
  │                      │
  │ ○ 角色包 (.zip)      │ ← 含 frames/ + 配置导出
  │    → 解压导入         │   高级用户/社区分享
  │                      │
  │ [输入角色名称: ______] │
  │ [预览区域]            │
  │            [确认导入] │
  └─────────────────────┘
       │
       ▼
  后台处理：
    1. 图片复制到 {AppData}/desk-pet/characters/{name}/
    2. 自动缩放到 512px（保持比例，透明边距裁剪）
    3. 单图→注册 7 个 builtin 动画
    4. 多图→智能分组（按文件名模式）+ 自动生成 frames
    5. 追加到 CONFIG 覆盖层 appearance.characters.{name}
    6. 刷新角色列表 → 即时可用
```

### 智能帧识别（多图导入）

```
用户上传的文件名：
  mychar_idle_000.png      → 自动识别 "idle" 动画 × 2帧
  mychar_idle_001.png
  mychar_happy_000.png     → 自动识别 "happy" 动画 × 2帧
  mychar_happy_001.png

识别规则：
  1. 去掉共同前缀 → 得到 "前缀_表情_序号"
  2. 按表情分组 → 每组内按序号排序
  3. 默认每帧 duration=120ms → 用户可调整
```

---

## 四、资源目录分层

```
# 内置资源（git 追踪，随安装包发布）
public/assets/
├── characters/
│   ├── cho/                     ← 糖糖完整素材 (1.7MB, 109帧)
│   └── default/                 ← 默认单图 (几KB)
├── fonts/                       ← 3个字体现有位置不动
│   ├── zpix.ttf
│   ├── PixelMplus10-Regular.ttf
│   └── PixelMplus10-Bold.ttf
└── ui/                          ← UI素材（原windows/Fromtemd/jine/photo）
    ├── windows/
    ├── Fromtemd/
    ├── jine/
    └── photo/

# 用户资源（Tauri AppData，非 git）
{AppData}/desk-pet/
├── characters/                  ← 用户导入的角色
│   └── my-character/
│       ├── body.png
│       └── frames/
└── user-overrides.yaml          ← CONFIG 覆盖持久化
```

---

## 五、加载机制

```
启动流程：

  CONFIG.yaml (默认值)
       │
       ├── CONFIG-DEV.yaml 存在 → 覆盖默认值
       │
       ├── user-overrides.yaml 存在 → 再覆盖一层
       │                               (设置页保存的内容)
       │
       ▼
  config.ts → 解析为类型化对象
       │
       ├── appearance.characters → CharacterLoader
       │     ├── builtin: true → 从 public/assets/characters/ 加载
       │     └── builtin: false → 从 {AppData}/desk-pet/characters/ 加载
       │
       ├── appearance.themes → ThemeEngine
       │     └── 注入 CSS 变量到 #root
       │
       └── appearance.activeCharacter → AnimationPlayer
             ├── 读取角色 animations 定义
             ├── 懒加载帧（启动只加载 idle 首帧）
             └── builtinAnimations → 注册 CSS Transform 动画

懒加载策略：
  - 启动只加载 idle 第一帧 + body.png（通常 <100KB）
  - 首次播放某动画时才加载其帧
  - 帧缓存上限 (256MB) → LRU 淘汰
  - 切换动画时预加载下 2 个可能的动画
```

### CSS 变量注入

所有颜色/字体从 CONFIG 注入：

```css
#root {
  --color-bg:            #fce4ec;
  --color-border:        #a01a5a;
  --color-border-gradient: #fccdd9, #f7a8c4, #c4276f, #a01a5a;
  --color-text:          #333;
  --color-accent:        #c4276f;
  --color-chat-bg:       #fce4ec;
  --color-divider:       #e8a0b0;
  --color-settings-bg:   #3e1a2e;
  --color-settings-card: #2a1020;
  --font-ui:             "zpix";
  --font-chat:           "zpix";
  --font-size:           14px;
  --font-line-height:    1.6;
}
```

`global.css` 中所有硬编码颜色替换为 `var(--color-bg)` 等 CSS 变量引用。

---

## 六、内置动画引擎（7种 CSS Transform 动画）

| 动画名 | CSS 实现 | 用途 |
|--------|----------|------|
| `breathing` | `scale(1) → scale(1.03) → scale(1)` | idle 微动 |
| `bounce` | `translateY(0) → translateY(-8px) → translateY(0)` | 高兴 |
| `shake` | `rotate(0) → rotate(3deg) → rotate(-3deg)` | 摇头 |
| `wave` | `rotate` on pseudo-element | 挥手 |
| `blink` | `clip-path`/opacity 切换 | 眨眼 |
| `float` | `translateX+Y` 椭圆轨迹 | 悬浮 |
| `tilt` | `rotate(-5deg)` 单次 | 歪头 |

内置动画**不需要任何素材**，在单张 body PNG 上直接生效。

---

## 七、实施分期

| Phase | 内容 | 改动文件 |
|-------|------|----------|
| **P1** | CONFIG.yaml 结构重组 + config.ts 适配 | `CONFIG.yaml`, `config.ts` |
| **P2** | 设置页 Tab 化重构（不新增功能，只整理布局） | `SettingsPanel.vue` |
| **P3** | 动画系统配置驱动重构 | `animation.ts` → `CharacterLoader`, `AnimationPlayer` |
| **P4** | 内置动画引擎 + CSS变量主题系统 | 新建 `builtin-anim.ts`, `global.css` 重构 |
| **P5** | 角色导入功能 + 主题编辑器 | 新建 `CharacterImport.vue`, `ThemeEditor.vue` |

---

## 八、与现有架构的兼容

| 现有文件 | 变化 |
|----------|------|
| `animation.ts` | 不再硬编码，改为从 `appearance.characters[active].animations` 读取 |
| `expressions.ts` | 不再硬编码，改为从 `appearance.characters[active].expressions` 读取 |
| `global.css` | 所有硬编码颜色替换为 `var(--color-*)` |
| `fonts.css` | 不变，保持 `@font-face` 声明 |
| `StreamView.vue` | 适配配置驱动，shield 改为可配置 |
| `SettingsPanel.vue` | 拆分为 Tab 布局 + 新增角色/主题管理 UI |
| `config.ts` | 新增 `appearance.*` 和 `sound.*` 配置项 |
| 静态资源目录 | `ctj/` → `characters/cho/`，`windows/` → `ui/windows/` 等 |
