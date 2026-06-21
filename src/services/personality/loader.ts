// ==========================================
// 人格卡加载器 —— Vite ?raw 构建时嵌入，解析 frontmatter
// 所有人格卡在此注册，支持 HMR 热更新
// ==========================================

import type { PersonalityCard } from "./types"
import { createLogger } from "@/services/logger"

const log = createLogger("Persona")

// ── 原始导入（Vite ?raw，编译时替换为文件内容）──
import angelkawaiiRaw from "./cards/angelkawaii.md?raw"
import ameRaw from "./cards/ame.md?raw"
import pchanRaw from "./cards/pchan.md?raw"

// ── 内置人格卡路径映射 ──
const BUILTIN_CARDS: Record<string, string> = {
  angelkawaii: angelkawaiiRaw,
  ame: ameRaw,
  pchan: pchanRaw,
}

// ── YAML frontmatter 解析 ──
interface Frontmatter {
  id: string
  name: string
  description: string
}

function parseFrontmatter(raw: string): { meta: Frontmatter; body: string } {
  const match = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/)
  if (!match) {
    // 无 frontmatter：当做纯 prompt
    return {
      meta: { id: "unknown", name: "Unknown", description: "" },
      body: raw.trim(),
    }
  }
  const yamlBlock = match[1]
  const body = match[2].trim()
  const meta: Frontmatter = { id: "", name: "", description: "" }

  for (const line of yamlBlock.split("\n")) {
    const kv = line.match(/^(\w+):\s*(.+)$/)
    if (kv) {
      const key = kv[1].trim()
      const val = kv[2].trim().replace(/^["']|["']$/g, "")
      if (key === "id") meta.id = val
      else if (key === "name") meta.name = val
      else if (key === "description") meta.description = val
    }
  }
  return { meta, body }
}

// ── 提取首次消息 ──
function extractFirstMessage(prompt: string): string {
  const match = prompt.match(/#\s*首次消息\n([\s\S]*?)(?=\n#|\n*$)/)
  return match ? match[1].trim() : ""
}

// ── 加载所有人格卡 ──
let cards: PersonalityCard[] = []

function loadAll(): PersonalityCard[] {
  const result: PersonalityCard[] = []
  for (const [id, raw] of Object.entries(BUILTIN_CARDS)) {
    const { meta, body } = parseFrontmatter(raw)
    result.push({
      id: meta.id || id,
      name: meta.name || id,
      description: meta.description || "",
      prompt: body,
      firstMessage: extractFirstMessage(body),
    })
  }
  return result
}

/** 初始化人格卡（模块加载时自动执行） */
export function initCards(): void {
  cards = loadAll()
  log.info(`已加载 ${cards.length} 个人格卡:`, cards.map(c => c.id).join(", "))
}

/** 获取所有人格卡 */
export function getCards(): PersonalityCard[] {
  return cards
}

/** 按 ID 获取人格卡 */
export function getCard(id: string): PersonalityCard | undefined {
  return cards.find(c => c.id === id)
}

// ── 启动时初始化 ──
initCards()

// ── HMR 热更新 ──
if (import.meta.hot) {
  import.meta.hot.accept(() => {
    cards = loadAll()
    log.info("人格卡已热更新:", cards.map(c => c.id).join(", "))
  })
}
