// ==========================================
// 人格模块 —— 类型定义
// ==========================================

/** 人格卡元数据（从 markdown frontmatter 解析） */
export interface PersonalityCard {
  /** 唯一标识 */
  id: string
  /** 显示名称 */
  name: string
  /** 简短描述 */
  description: string
  /** 原始 prompt 内容（不含 frontmatter） */
  prompt: string
  /** 首次消息（角色打招呼） */
  firstMessage: string
}

/** 人格注册表状态 */
export interface PersonalityState {
  /** 当前激活的人格 ID，null 表示使用默认人格 */
  activeId: string | null
  /** 是否启用人格系统 */
  enabled: boolean
}

/** 人格界限层级 */
export type BoundaryLevel = "surface" | "middle" | "deep"

/** 运行时人格界限（根据未回复计数 + 人格卡定义） */
export interface BoundaryInfo {
  /** 层级标签 */
  label: string
  /** 数字等级 */
  level: number
}
