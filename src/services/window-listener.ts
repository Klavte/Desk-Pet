// ==========================================
// Window Listener
// App.vue event listening: window focus + resize
// Returns cleanup function for onUnmounted
// ==========================================

import { type Ref } from "vue";
import { listen } from "@tauri-apps/api/event";
import { invoke } from "@tauri-apps/api/core";
import { pushAssistantMessage } from "@/features/chat";
import { checkWindow } from "./window-monitor";
import type { StreamViewRef } from "./command-handler";

/**
 * 检测前台窗口与桌宠是否在不同显示器
 */
async function areMonitorsDifferent(): Promise<boolean> {
  try {
    return await invoke<boolean>("are_monitors_different");
  } catch {
    return false;
  }
}

/**
 * 发送系统通知（Toast）
 */
async function sendToastNotification(body: string): Promise<void> {
  try {
    const { sendNotification, isPermissionGranted, requestPermission } = await import(
      "@tauri-apps/plugin-notification"
    );
    let granted = await isPermissionGranted();
    if (!granted) {
      const result = await requestPermission();
      granted = result === "granted";
    }
    if (granted) {
      sendNotification({ title: "糖糖", body });
    }
  } catch {
    // 通知失败不影响主流程
  }
}

// ==========================================
// 测试接口（F12 Console）
// ==========================================
if (typeof window !== "undefined") {
  (window as any).__testMonitor = async () => {
    const result = await areMonitorsDifferent();
    console.log("[测试] are_monitors_different:", result);
    return result;
  };
  console.log("[测试] __testMonitor() 就绪");
}

/**
 * Initialize window event listeners and ResizeObserver.
 * Returns a cleanup function for resource release.
 */
export async function initWindowListener(
  streamRef: Ref<StreamViewRef | null>,
  winSize: Ref<{ w: number; h: number }>,
): Promise<() => void> {
  const cleanups: (() => void)[] = [];

  // 1) Window focus change listener
  try {
    const unlisten = await listen<string>("window-changed", (event) => {
      const reply = checkWindow(event.payload);
      if (reply) {
        pushAssistantMessage(reply);
        streamRef.value?.setExpression("smile");

        // 跨显示器检测 → Toast 通知
        areMonitorsDifferent().then((needNotify) => {
          if (needNotify) {
            sendToastNotification(reply);
          }
        });
      }
    });
    cleanups.push(unlisten);
  } catch {
    // Listener failure does not block the app
  }

  // 2) Window resize observer
  const observer = new ResizeObserver(() => {
    winSize.value = { w: window.innerWidth, h: window.innerHeight };
  });
  observer.observe(document.body);
  cleanups.push(() => observer.disconnect());

  // Return cleanup function
  return () => {
    for (const cleanup of cleanups) {
      try { cleanup(); } catch { /* ignore cleanup errors */ }
    }
  };
}
