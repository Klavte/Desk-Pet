// ==========================================
// 窗口监控模块 —— 统一导出
// ==========================================

export { initWindowListener } from "./listener"
export { checkWindowTiming, processTrigger } from "./monitor"
export type { TriggerResult } from "./monitor"

// active-context 已迁移至 agent/active.ts
// 此处保留重导出以兼容旧引用
export { generateActiveMessage } from "@/services/agent"
