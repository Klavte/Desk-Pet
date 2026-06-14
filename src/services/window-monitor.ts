// ==========================================
// 窗口停留计时 + 统一冷却触发
// ==========================================

import { invoke } from "@tauri-apps/api/core";
import { isCoolingDown, isAIGenerating, triggerCooldown, setCooldown, getCooldownSeconds } from "./cooldown";

const STAY_SECONDS = 60;
const SETTLE_MS = 2000;
const COOLDOWN_SECONDS = 1800;
export const SAME_PAGE_COOLDOWN_SECONDS = 6000;

let currentWindowTitle = "";
let stayStartTime = 0;
let pendingTitle = "";
let pendingTime = 0;

setCooldown(COOLDOWN_SECONDS);

export interface TriggerResult {
  source: "regex" | "ai";
  message: string;
}

export function checkWindowTiming(title: string): boolean {
  if (title !== currentWindowTitle) {
    // 窗口切换或初次检测
    if (title !== pendingTitle) {
      pendingTitle = title;
      pendingTime = Date.now();
      console.log("[计时] 新窗口:", title.substring(0, 40), "→ 等待", SETTLE_MS / 1000 + "s 稳定");
      return false;
    }
    // 同一待定窗口，检查稳定期
    const settleElapsed = (Date.now() - pendingTime) / 1000;
    if (settleElapsed >= SETTLE_MS / 1000) {
      console.log("[计时] 窗口稳定:", pendingTitle.substring(0, 40));
      currentWindowTitle = pendingTitle;
      stayStartTime = Date.now();
      pendingTitle = "";
    } else {
      console.log("[计时] 待稳定:", pendingTitle.substring(0, 40), "→", settleElapsed.toFixed(1) + "s / " + SETTLE_MS / 1000 + "s");
    }
    return false;
  }

  // 同一窗口持续停留
  const elapsed = (Date.now() - stayStartTime) / 1000;
  console.log("[计时] 停留:", currentWindowTitle.substring(0, 40), "|", elapsed.toFixed(1) + "s /", STAY_SECONDS + "s");
  if (elapsed < STAY_SECONDS) return false;
  if (isCoolingDown()) { console.log("[计时] 冷却中，跳过"); return false; }
  if (isAIGenerating()) { console.log("[计时] AI 生成中，跳过"); return false; }
  stayStartTime = Date.now();
  return true;
}

export function processTrigger(result: TriggerResult): void {
  triggerCooldown();
  const s = getCooldownSeconds();
  invoke("pause_monitor", { durationMs: s * 1000 }).catch(() => {});
  setTimeout(() => invoke("resume_monitor").catch(() => {}), s * 1000 + 2000);
  console.log("[触发] source:", result.source, "→ 全局冷却:", s + "s");
}
