// ==========================================
// 窗口监听 —— 接收 Rust 事件，触发 AI / 表情响应
// ==========================================

import { type Ref } from "vue";
import { listen } from "@tauri-apps/api/event";
import { pushAssistantMessage, incrementUnanswered } from "@/services/ai";
import { checkWindowTiming } from "./monitor";
import { generateActiveMessage } from "./active-context";
import { playNotificationByBoundary } from "@/services/audio/registry";
import { windowMonitorConfig, notificationConfig } from "@/services/config";
import { createLogger } from "@/services/logger";
import type { StreamViewRef } from "@/services/command-handler";

const log = createLogger("WinLis");

interface WindowChangePayload {
  title: string;
  content: string;
  is_pet_visible: boolean;
}

export async function sendToastNotification(body: string): Promise<void> {
  // 1. 尝试 tauri-plugin-notification（macOS 需代码签名才能正常工作）
  try {
    const { sendNotification, isPermissionGranted, requestPermission } = await import("@tauri-apps/plugin-notification");
    let granted = await isPermissionGranted();
    if (!granted) {
      const r = await requestPermission();
      granted = r === "granted";
      log.debug("通知权限请求:", r);
    }
    if (granted) {
      sendNotification({ title: "糖糖", body });
      log.info("系统通知已发送:", body.substring(0, 30));
      return;
    } else {
      log.warn("通知权限未授予");
    }
  } catch (e) {
    log.warn("tauri-plugin-notification 不可用, 尝试 fallback", e instanceof Error ? e.message : "");
  }

  // 2. macOS fallback: osascript display notification（无需代码签名）
  try {
    const { invoke } = await import("@tauri-apps/api/core");
    await invoke("send_osx_notification", { title: "糖糖", body });
    log.info("系统通知已发送(osascript):", body.substring(0, 30));
  } catch (e) {
    log.error("所有通知方式均失败", e instanceof Error ? e : undefined);
  }
}

export async function initWindowListener(
  streamRef: Ref<StreamViewRef | null>,
  winSize: Ref<{ w: number; h: number }>,
): Promise<() => void> {
  const cleanups: (() => void)[] = [];

  try {
    const unlisten = await listen<WindowChangePayload>("window-changed", (event) => {
      if (!windowMonitorConfig.enabled) return;
      const { title, content, is_pet_visible } = event.payload;
      log.debug("窗口:", (title || "(空)").substring(0, 60));
      if (!checkWindowTiming(title)) return;

      generateActiveMessage({ title, content: content || title, timestamp: Date.now() }).then((reply) => {
        if (reply) {
          pushAssistantMessage(reply);
          incrementUnanswered();
          streamRef.value?.setExpression("smile");
          playNotificationByBoundary();
          // 桌宠收回（隐藏）时发送系统通知
          if (notificationConfig.enabled && !is_pet_visible) sendToastNotification(reply);
        }
      });
    });
    cleanups.push(unlisten);
    log.info("AI 窗口监控已启动");
  } catch (e) { log.error("监听启动失败", e instanceof Error ? e : undefined); }

  const observer = new ResizeObserver(() => { winSize.value = { w: window.innerWidth, h: window.innerHeight }; });
  observer.observe(document.body);
  cleanups.push(() => observer.disconnect());

  return () => { for (const c of cleanups) try { c(); } catch {} };
}
