// ==========================================
// 人格界限状态 —— 兼容层
// 已迁移至 src/services/personality/boundary.ts
// ==========================================

import { getBoundaryInfo } from "@/services/personality"
import { createLogger } from "@/services/logger"

const log = createLogger("Boundary")

export {
  getBoundaryLevel,
  setBoundaryLevel,
  incrementBoundary,
  resetBoundary,
} from "@/services/personality"

/** 界限描述（兼容旧导出名） */
export function boundaryLabel(): string {
  return getBoundaryInfo().label
}

// ── F12 调试（保持兼容）──
if (typeof window !== "undefined") {
  // __boundary 已在 personality/boundary.ts 中注册，这里补 label
  if (!(window as any).__boundary) {
    (window as any).__boundary = {
      get: () => { const { getBoundaryLevel } = require("@/services/personality"); return getBoundaryLevel() },
      set: (n: number) => { const { setBoundaryLevel } = require("@/services/personality"); setBoundaryLevel(n) },
      inc: () => { const { incrementBoundary } = require("@/services/personality"); incrementBoundary() },
      reset: () => { const { resetBoundary } = require("@/services/personality"); resetBoundary() },
      label: boundaryLabel,
    }
  }
  ;(window as any).__boundary.label = boundaryLabel
  log.info("__boundary 就绪")
}
