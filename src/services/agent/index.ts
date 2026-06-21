// ==========================================
// Agent 模块 —— 统一导出入口
// ==========================================

// ── 类型 ──
export type { Message, AIProvider } from "./types"
export { createMessageId, createUserMessage, createAssistantMessage } from "./types"

// ── Provider ──
export { OpenAICompatibleProvider } from "./provider"

// ── Service ──
export { AIService } from "./service"

// ── 聊天 ──
export {
  chatHistory, unansweredCount,
  pushUserMessage, pushAssistantMessage,
  getContextMessages, getFullHistory,
  clearHistory, deleteMessage,
  initWelcome, incrementUnanswered, resetUnanswered,
} from "./chat"

// ── 记忆 ──
export { MemoryService } from "./memory"
export type { MemoryEntry } from "./memory"

// ── Agent 运行器 ──
export { sendMessage, initChat } from "./runner"

// ── 主动消息 ──
export { generateActiveMessage } from "./active"
