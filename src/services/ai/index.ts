// ==========================================
// AI 模块 —— 统一导出入口
// ==========================================

// ── 类型 ──
export type { Message, AIProvider, Character, CharacterState, AIConfig } from "./types";
export { createMessageId, createUserMessage, createAssistantMessage } from "./types";

// ── 配置 ──
export { setAIConfig, getAIConfig, isAIConfigured, getSystemPrompt, registerPromptGetter } from "./config";

// ── Provider ──
export { OpenAICompatibleProvider } from "./provider";

// ── 聊天 ──
export {
  chatHistory, unansweredCount,
  pushUserMessage, pushAssistantMessage,
  getContextMessages, getFullHistory,
  clearHistory, deleteMessage,
  initWelcome, incrementUnanswered, resetUnanswered,
} from "./chat";

// ── 服务 ──
export { AIService } from "./service";
export { CharacterService } from "./character";
export { MemoryService } from "./memory";
export type { MemoryEntry } from "./memory";

// ==========================================
// sendMessage / initChat
// ==========================================
import { getSystemPrompt } from "./config";
import { OpenAICompatibleProvider } from "./provider";
import { AIService } from "./service";
import { CharacterService } from "./character";
import { chatHistory, pushUserMessage, pushAssistantMessage, getContextMessages, initWelcome, resetUnanswered } from "./chat";
import { isAIGenerating, setAIGenerating } from "@/services/cooldown";
import { createLogger } from "@/services/logger";

const log = createLogger("Chat");

let aiServiceInstance: AIService | null = null;

function getAIService(): AIService {
  if (!aiServiceInstance) aiServiceInstance = new AIService(new OpenAICompatibleProvider());
  return aiServiceInstance;
}

export async function initChat(welcomeText?: string): Promise<void> {
  log.info("当前人格:", CharacterService.current().name);
  if (welcomeText) initWelcome(welcomeText);
}

export async function sendMessage(text: string): Promise<string> {
  // 并发锁：避免与窗口监控的 generateActiveMessage 同时请求 AI
  if (isAIGenerating()) {
    log.warn("AI 生成中，拒绝用户消息并发请求");
    return "（糖糖正在想事情，等一下再发哦～）";
  }
  pushUserMessage(text);
  resetUnanswered();
  setAIGenerating(true);
  try {
    const context = getContextMessages();
    const systemPrompt = getSystemPrompt();
    const reply = await getAIService().generateReply(context, systemPrompt, text);
    pushAssistantMessage(reply);
    return reply;
  } catch (e) {
    log.error("sendMessage 失败", e instanceof Error ? e : undefined);
    const fallback = "（唔…信号不太好，等会儿再试试？）";
    pushAssistantMessage(fallback);
    return fallback;
  } finally {
    setAIGenerating(false);
  }
}

if (import.meta.hot) {
  import.meta.hot.accept(() => {
    log.info("聊天模块 HMR 完成，人格:", CharacterService.current().name);
  });
}
