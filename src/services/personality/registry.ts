// ==========================================
// 人格注册表 —— 激活/切换/提示生成
// 人格系统不参与 Agent 执行，只影响 Prompt 生成
// ==========================================

import type { PersonalityCard } from "./types"
import { getCards, getCard } from "./loader"
import { aiConfig, personalityConfig } from "@/services/config"
import { getBoundaryLevel } from "./boundary"
import { createLogger } from "@/services/logger"

const log = createLogger("Registry")

// ── 状态 ──
let activeId: string | null = null
let enabled = true

/** 初始化：从配置恢复激活状态（由 App.vue onMounted 调用） */
export function initRegistry(): void {
  enabled = personalityConfig.enabled
  const configuredId = personalityConfig.active

  if (!enabled) {
    activeId = null
    log.info("人格系统已禁用，使用默认人格")
    return
  }

  if (configuredId) {
    const card = getCard(configuredId)
    if (card) {
      activeId = configuredId
      log.info("已激活人格:", card.name, "| ID:", configuredId)
      return
    }
    log.warn("配置的人格不存在:", configuredId)
  }

  // 默认激活第一个
  const cards = getCards()
  if (cards.length > 0) {
    activeId = cards[0].id
    log.info("默认人格:", cards[0].name)
  }
}

/** 列出所有已注册人格 */
export function listPersonalities(): PersonalityCard[] {
  return getCards()
}

/** 获取当前激活的人格卡（null = 使用默认人格） */
export function getActiveCard(): PersonalityCard | null {
  if (!enabled || !activeId) return null
  return getCard(activeId) ?? null
}

/** 切换人格 */
export function switchPersonality(id: string | null): boolean {
  if (id === null) {
    activeId = null
    log.info("已关闭人格，使用默认人格")
    return true
  }
  const card = getCard(id)
  if (!card) {
    log.warn("人格不存在:", id)
    return false
  }
  activeId = id
  log.info("已切换人格:", card.name)
  return true
}

/** 是否启用人格系统 */
export function isPersonalityEnabled(): boolean {
  return enabled
}

/** 启用/禁用人格系统 */
export function setPersonalityEnabled(v: boolean): void {
  enabled = v
  log.info("人格系统:", v ? "已启用" : "已禁用（使用默认人格）")
}

// ── Prompt 生成 ──

/**
 * 获取当前 System Prompt
 * 人格启用 → 返回人格卡提示词（含边界信息）
 * 人格禁用 → 返回 CONFIG 默认人格提示词
 */
export function getSystemPrompt(unansweredCount?: number): string {
  // 禁用或无激活人格 → 默认
  if (!enabled || !activeId) {
    return aiConfig.defaultSystemPrompt
  }

  const card = getCard(activeId)
  if (!card) return aiConfig.defaultSystemPrompt

  // 拼合提示词 + 当前边界等级提示
  const boundaryLevel = getBoundaryLevel()
  let boundaryHint = ""
  if (boundaryLevel >= 5) {
    boundaryHint = `\n\n[当前互动状态: 长时间未回复，越界等级 ${boundaryLevel}/深层病娇]`
  } else if (boundaryLevel >= 4) {
    boundaryHint = `\n\n[当前互动状态: 略久未回复，越界等级 ${boundaryLevel}/中层]`
  }
  // 表层 (≤3) 不加额外提示

  return card.prompt + boundaryHint
}

// ── 暴露到 window 方便 F12 调试 ──
if (typeof window !== "undefined") {
  (window as any).__personality = {
    list: listPersonalities,
    active: getActiveCard,
    switch: switchPersonality,
    enabled: isPersonalityEnabled,
    setEnabled: setPersonalityEnabled,
    prompt: getSystemPrompt,
  }
}
