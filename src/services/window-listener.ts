// ==========================================
// Window Listener
// App.vue event listening: window focus + resize
// Returns cleanup function for onUnmounted
// ==========================================

import { type Ref } from "vue";
import { listen } from "@tauri-apps/api/event";
import { pushAssistantMessage } from "@/features/chat";
import { checkWindow } from "./window-monitor";
import type { StreamViewRef } from "./command-handler";

interface WindowChangePayload {
  title: string;
  cross_monitor: boolean;
}

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
  } catch {}
}

if (typeof window !== "undefined") {
  (window as any).__testToast = async (msg?: string) => {
    const { sendNotification, isPermissionGranted, requestPermission } = await import(
      "@tauri-apps/plugin-notification"
    );
    let granted = await isPermissionGranted();
    if (!granted) {
      const result = await requestPermission();
      granted = result === "granted";
    }
    if (granted) {
      sendNotification({ title: "糖糖", body: msg || "这是一条测试通知" });
      console.log("[测试] Toast 已发送");
    } else {
      console.log("[测试] 通知权限未授予");
    }
  };
  console.log("[测试] __testToast('消息') 就绪");
}

export async function initWindowListener(
  streamRef: Ref<StreamViewRef | null>,
  winSize: Ref<{ w: number; h: number }>,
): Promise<() => void> {
  const cleanups: (() => void)[] = [];

  try {
    const unlisten = await listen<WindowChangePayload>("window-changed", (event) => {
      const reply = checkWindow(event.payload.title);
      if (reply) {
        pushAssistantMessage(reply);
        streamRef.value?.setExpression("smile");

        // 使用 Rust 侧同时采集的跨屏标志，消除竞态
        if (event.payload.cross_monitor) {
          sendToastNotification(reply);
        }
      }
    });
    cleanups.push(unlisten);
  } catch {}

  const observer = new ResizeObserver(() => {
    winSize.value = { w: window.innerWidth, h: window.innerHeight };
  });
  observer.observe(document.body);
  cleanups.push(() => observer.disconnect());

  return () => {
    for (const cleanup of cleanups) {
      try { cleanup(); } catch {}
    }
  };
}