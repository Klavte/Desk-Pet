<script setup lang="ts">
import { ref, onMounted } from "vue";
import { getCurrentWebviewWindow } from "@tauri-apps/api/webviewWindow";
import { listen } from "@tauri-apps/api/event";
import TitleBar from "./components/TitleBar.vue";
import StreamView from "./components/StreamView.vue";
import ChatPanel from "./components/ChatPanel.vue";

const WIN_W = 960;
const WIN_H = 600;
const RATIO = WIN_W / WIN_H;

const streamRef = ref<InstanceType<typeof StreamView> | null>(null);

function onChatSend(text: string) {
  const t = text.toLowerCase();
  if (t.includes("smile")) streamRef.value?.setExpression("smile");
  if (t.includes("su") || t.includes("素")) streamRef.value?.setExpression("su");
  if (t.includes("sleep") || t.includes("困")) streamRef.value?.setExpression("sleepy");
  if (t.includes("superchat")) streamRef.value?.setExpression("superchat");
}

onMounted(async () => {
  const win = getCurrentWebviewWindow();
  try {
    await win.setSize({ width: WIN_W, height: WIN_H });
    await listen("tauri://resize", async () => {
      const s = await win.innerSize();
      const nh = Math.round(s.width / RATIO);
      if (Math.abs(nh - s.height) > 3) {
        await win.setSize({ width: s.width, height: nh });
      }
    });
  } catch {}
});
</script>

<template>
  <div id="root">
    <TitleBar :height="30" title="配信中" />
    <div id="body">
      <div id="stream-col">
        <img id="bg" src="/assets/windows/operation_base.png" alt="" />
        <StreamView ref="streamRef" />
      </div>
      <ChatPanel @send="onChatSend" />
    </div>
  </div>
</template>

<style>
@font-face {
  font-family: "zpix";
  src: url("/assets/fonts/zpix.ttf") format("truetype");
}
@font-face {
  font-family: "pixel-mplus";
  src: url("/assets/fonts/PixelMplus10-Regular.ttf") format("truetype");
}
* { margin: 0; padding: 0; box-sizing: border-box; }
html, body, #app {
  width: 100%; height: 100%; overflow: hidden;
  font-family: "zpix", "pixel-mplus", sans-serif;
}
#root {
  width: 100%; height: 100%;
  display: flex; flex-direction: column;
  overflow: hidden;
  background: #fce4ec;
}
#body {
  flex: 1;
  display: flex;
  overflow: hidden;
}
#stream-col {
  flex: 1;
  position: relative;
  display: flex;
  overflow: hidden;
}
#bg {
  position: absolute;
  width: 100%; height: 100%;
  object-fit: fill;
  pointer-events: none;
  z-index: 0;
}
</style>