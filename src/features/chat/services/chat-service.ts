import { reactive, ref } from "vue";
import type { Message } from "../types/message";
import { createUserMessage, createAssistantMessage } from "../types/message";

// ==========================================
// 上下文管理常量
// ==========================================

/** 发送给模型的最大上下文消息条数 */
const MAX_CONTEXT_MESSAGES = 20;

// ==========================================
// 响应式聊天记录
// ==========================================
export const chatHistory = reactive<Message[]>([]);

/** 初始化欢迎消息 */
export function initWelcome(text: string): void {
  if (chatHistory.length === 0) {
    chatHistory.push(createAssistantMessage(text));
  }
}

// ==========================================
// 未回复状态追踪
// ==========================================

const UNANSWERED_STORAGE_KEY = "deskpet_unanswered";

/** 加载持久化值 */
function loadUnanswered(): number {
  try {
    const raw = localStorage.getItem(UNANSWERED_STORAGE_KEY);
    const val = raw ? parseInt(raw, 10) : 0;
    return Number.isFinite(val) && val >= 0 ? val : 0;
  } catch {
    return 0;
  }
}

/** 保存到 localStorage */
function saveUnanswered(count: number): void {
  try { localStorage.setItem(UNANSWERED_STORAGE_KEY, String(count)); } catch {}
}

/** 主动消息未回复计数（响应式 + 持久化） */
export const unansweredCount = ref(loadUnanswered());

/** 主动消息发送成功后调用 */
export function incrementUnanswered(): void {
  unansweredCount.value += 1;
  saveUnanswered(unansweredCount.value);
}

/** 用户发送消息时调用 */
export function resetUnanswered(): void {
  if (unansweredCount.value !== 0) {
    unansweredCount.value = 0;
    saveUnanswered(0);
  }
}

// ==========================================
// 消息管理
// ==========================================

/** 添加用户消息 */
export function pushUserMessage(text: string): Message {
  const msg = createUserMessage(text);
  chatHistory.push(msg);
  return msg;
}

/** 添加 AI 消息 */
export function pushAssistantMessage(text: string): Message {
  const msg = createAssistantMessage(text);
  chatHistory.push(msg);
  return msg;
}

/** 获取用于发送给模型的裁剪上下文（最近 N 条） */
export function getContextMessages(): Message[] {
  return chatHistory.slice(-MAX_CONTEXT_MESSAGES);
}

/** 获取完整聊天记录 */
export function getFullHistory(): Message[] {
  return [...chatHistory];
}

/** 清空聊天记录 */
export function clearHistory(): void {
  chatHistory.splice(0, chatHistory.length);
}

/** 删除指定消息 */
export function deleteMessage(id: string): boolean {
  const idx = chatHistory.findIndex((m) => m.id === id);
  if (idx === -1) return false;
  chatHistory.splice(idx, 1);
  return true;
}
