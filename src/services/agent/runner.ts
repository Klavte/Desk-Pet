// ==========================================
// Agent 运行器 —— sendMessage / initChat
// Agent 核心执行逻辑：接收用户消息 → 调用 AI → 返回回复
// 人格模块只影响 Prompt 生成，不参与 Agent 执行
// ==========================================

import { getSystemPrompt, getActiveCard } from "@/services/personality"
import { AIService } from "./service"
import { OpenAICompatibleProvider } from "./provider"
import {
  chatHistory, unansweredCount,
  pushUserMessage, pushAssistantMessage,
  getContextMessages, initWelcome, resetUnanswered,
} from "./chat"
import { isAIGenerating, setAIGenerating } from "@/services/cooldown"
import { createLogger } from "@/services/logger"

const log = createLogger("Agent")

let aiServiceInstance: AIService | null = null

function getAIService(): AIService {
  if (!aiServiceInstance) aiServiceInstance = new AIService(new OpenAICompatibleProvider())
  return aiServiceInstance
}

/** 初始化聊天 */
export async function initChat(welcomeText?: string): Promise<void> {
  const card = getActiveCard()
  if (card) {
    log.info("当前人格:", card.name, "| ID:", card.id)
  } else {
    log.info("当前人格: 默认")
  }

  if (welcomeText) {
    initWelcome(welcomeText)
  } else if (card?.firstMessage) {
    initWelcome(card.firstMessage)
  }
}

/** 发送用户消息并获取 AI 回复 */
export async function sendMessage(text: string): Promise<string> {
  // 并发锁：避免与窗口监控的 generateActiveMessage 同时请求 AI
  if (isAIGenerating()) {
    log.warn("AI 生成中，拒绝用户消息并发请求")
    return "（糖糖正在想事情，等一下再发哦～）"
  }

  pushUserMessage(text)
  resetUnanswered()
  setAIGenerating(true)

  try {
    const context = getContextMessages()
    const systemPrompt = getSystemPrompt(unansweredCount.value)
    const reply = await getAIService().generateReply(context, systemPrompt)
    pushAssistantMessage(reply)
    return reply
  } catch (e) {
    log.error("sendMessage 失败", e instanceof Error ? e : undefined)
    const fallback = "（唔…信号不太好，等会儿再试试？）"
    pushAssistantMessage(fallback)
    return fallback
  } finally {
    setAIGenerating(false)
  }
}

// ── HMR ──
if (import.meta.hot) {
  import.meta.hot.accept(() => {
    log.info("Agent 内核 HMR 完成")
  })
}
