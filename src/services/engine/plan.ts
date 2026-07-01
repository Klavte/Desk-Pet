// ==========================================
// 核心引擎 —— Plan 步骤（助手模式复杂任务预判拆解）
// LLM 驱动：复杂度门禁 → 轻量模型调用 → 步骤注入上下文
// ==========================================

import { modeConfig } from "@/services/config"
import { createLogger } from "@/services/logger"

const log = createLogger("Plan")

/** 复杂度门禁：消息长度 > 80 字 或 包含行动导向关键词 */
const COMPLEXITY_GATE = /整理|分析|重构|优化|部署|迁移|批量|全部|所有|递归|遍历|搜索并|帮我|写|创建|修改|删除/

/** Plan 步骤结果 */
export interface PlanResult {
  triggered: boolean
  steps: string[]
  hint: string
}

/**
 * LLM 驱动的任务规划。
 * 仅助手模式生效；通过门禁的复杂任务将调用 LLM 快速拆解。
 * 失败静默跳过，不阻塞主流程。
 */
export async function planStep(userText: string): Promise<PlanResult> {
  if (!modeConfig.assistant) {
    return { triggered: false, steps: [], hint: "" }
  }

  // 复杂度门禁（消息 > 80 字 或 包含复杂关键词）
  if (userText.length < 80 && !COMPLEXITY_GATE.test(userText)) {
    return { triggered: false, steps: [], hint: "" }
  }

  try {
    const { OpenAICompatibleProvider } = await import("@/services/agent/provider")
    const provider = new OpenAICompatibleProvider()

    const response = await provider.generateReply({
      messages: [{
        id: "plan-user",
        role: "user" as const,
        text: `请将以下任务拆解为 3-5 个具体执行步骤。每行一个步骤，格式: "N. 步骤描述"。只输出步骤列表，不要其他内容。\n\n任务: ${userText}`,
        timestamp: Date.now(),
      }],
      systemPrompt: "你是一个任务规划助手。将复杂任务拆解为清晰可执行的步骤。",
      thinkingEffort: "low",
      streamEnabled: false,
    })

    const steps = response.text
      .split("\n")
      .map(line => line.trim())
      .filter(line => /^\d+[\.\)、)\s]/.test(line))
      .slice(0, 5)

    if (steps.length === 0) {
      log.debug("Plan LLM 未返回有效步骤")
      return { triggered: false, steps: [], hint: "" }
    }

    const hint = `\n\n[任务规划]\n请按以下步骤执行:\n${steps.join("\n")}\n\n完成每步后根据结果决定下一步。`

    log.info("Plan 触发:", steps.length, "步", "|", userText.substring(0, 40))
    return { triggered: true, steps, hint }
  } catch (e) {
    log.warn("Plan LLM 调用失败，跳过规划:", e instanceof Error ? e.message : String(e))
    return { triggered: false, steps: [], hint: "" }
  }
}
