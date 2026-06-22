// ==========================================
// Agent 主动消息引擎 —— 窗口监控触发 AI 主动搭话
// 轻量直调 Provider（不走 Agent Loop，参照 765e59e 实现）
// ==========================================

import { isCoolingDown, isAIGenerating, setAIGenerating } from "@/services/cooldown"
import { windowMonitorConfig } from "@/services/config"
import { createLogger } from "@/services/logger"
import { OpenAICompatibleProvider } from "./provider"
import { AIService } from "./service"
import { createUserMessage } from "./types"
import { getSystemPrompt } from "@/services/personality"
import { processTrigger } from "@/services/window"

const log = createLogger("Active")

interface PageContext {
  title: string
  content: string
  timestamp: number
}

let lastContentHash = ""
let lastTriggerTime = 0

function hash(str: string): string {
  let h = 0
  for (let i = 0; i < Math.min(str.length, 500); i++) {
    h = ((h << 5) - h) + str.charCodeAt(i)
    h |= 0
  }
  return h.toString(36)
}

export async function generateActiveMessage(ctx: PageContext): Promise<string | null> {
  if (isCoolingDown()) { log.debug("全局冷却中，跳过"); return null }

  const contentHash = hash(ctx.title + ctx.content.substring(0, 200))
  if (contentHash === lastContentHash && Date.now() - lastTriggerTime < windowMonitorConfig.samePageCooldownSeconds * 1000) {
    log.debug("同页面冷却中")
    return null
  }
  if (isAIGenerating()) { log.debug("已有 AI 请求进行中"); return null }

  setAIGenerating(true)
  lastContentHash = contentHash
  lastTriggerTime = Date.now()

  try {
    log.info("调用 AI（主动搭话）| 窗口:", ctx.title.substring(0, 40))

    // 参照 765e59e: 直调 Provider + getSystemPrompt，不走 Agent Loop
    const ai = new AIService(new OpenAICompatibleProvider())
    const fullPersona = getSystemPrompt()
    const userMsg = createUserMessage(
      `主人正在使用: ${ctx.title}`,
    )
    const reply = await ai.generateReply([userMsg], fullPersona)

    log.info("AI 回复:", reply)
    const trimmed = reply.trim()
    if (trimmed) {
      processTrigger({ source: "ai", message: trimmed })
    }
    return trimmed || null
  } catch (e) {
    log.error("AI 失败", e instanceof Error ? e : undefined)
    return null
  } finally {
    setAIGenerating(false)
  }
}

// ── F12 调试 ──
if (typeof window !== "undefined") {
  (window as any).__testAI = async (title?: string) => {
    const { pushAssistantMessage } = await import("./chat")
    const msg = await generateActiveMessage({ title: title || "哔哩哔哩", content: title || "", timestamp: Date.now() })
    if (msg) pushAssistantMessage(msg)
    return msg
  }
  log.info("__testAI('标题') 就绪")
}