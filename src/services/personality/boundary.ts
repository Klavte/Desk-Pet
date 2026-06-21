// ==========================================
// 人格界限系统 —— 根据交互状态控制角色语气深度
// 不修改人格卡，不修改 AI 逻辑，独立模块
// ==========================================

import { createLogger } from "@/services/logger"
import type { BoundaryInfo } from "./types"

const log = createLogger("Boundary")

/** 界限等级（2=表层, 3-4=中层, 5+=深层） */
let level = 2

export function getBoundaryLevel(): number {
  return level
}

export function setBoundaryLevel(v: number): void {
  level = Math.max(2, v)
}

export function incrementBoundary(): void {
  level++
}

export function resetBoundary(): void {
  level = 2
}

/** 获取境界信息（供外部使用） */
export function getBoundaryInfo(): BoundaryInfo {
  if (level <= 3) return { label: "表层", level }
  if (level <= 4) return { label: "中层", level }
  return { label: "深层", level }
}

// ── 暴露到 window 方便 F12 调试 ──
if (typeof window !== "undefined") {
  if (!(window as any).__boundary) {
    (window as any).__boundary = {}
  }
  ;(window as any).__boundary.get = getBoundaryLevel
  ;(window as any).__boundary.set = setBoundaryLevel
  ;(window as any).__boundary.inc = incrementBoundary
  ;(window as any).__boundary.reset = resetBoundary
  ;(window as any).__boundary.info = getBoundaryInfo
}
