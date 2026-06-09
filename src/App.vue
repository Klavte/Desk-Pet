<script setup lang="ts">
import { ref, onMounted } from "vue";
import { getCurrentWebviewWindow } from "@tauri-apps/api/webviewWindow";
import TitleBar from "./components/TitleBar.vue";
import StreamView from "./components/StreamView.vue";
import ChatPanel from "./components/ChatPanel.vue";

const WIN_W = 454;
const WIN_H = 283;

const winSize = ref({ w: 0, h: 0 });
const streamRef = ref<InstanceType<typeof StreamView> | null>(null);

function onChatSend(text: string) {
  const t = text.toLowerCase();
  if (t.includes("smile")) streamRef.value?.setExpression("smile");
  if (t.includes("su") || t.includes("素")) streamRef.value?.setExpression("su");
  if (t.includes("sleep") || t.includes("困")) streamRef.value?.setExpression("sleepy");
}

onMounted(() => {
  new ResizeObserver(() => {
    winSize.value = { w: window.innerWidth, h: window.innerHeight };
  }).observe(document.body);
  winSize.value = { w: WIN_W, h: WIN_H };
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
    <div id="debug">{{ winSize.w }} × {{ winSize.h }}</div>
  </div>
</template>

<style>
@font-face { font-family: "zpix"; src: url("/assets/fonts/zpix.ttf") format("truetype"); }
@font-face { font-family: "pixel-mplus"; src: url("/assets/fonts/PixelMplus10-Regular.ttf") format("truetype"); }
* { margin: 0; padding: 0; box-sizing: border-box; }
html, body, #app { width: 100%; height: 100%; overflow: hidden; font-family: "zpix", "pixel-mplus", sans-serif; }
#root { width: 100%; height: 100%; display: flex; flex-direction: column; overflow: hidden; background: #fce4ec; }
#body { flex: 1; display: flex; overflow: hidden; }
#stream-col { flex: 1; position: relative; display: flex; overflow: hidden; }
#bg { position: absolute; width: 100%; height: 100%; object-fit: fill; pointer-events: none; z-index: 0; }
#debug { position: absolute; bottom: 4px; left: 8px; background: rgba(0,0,0,0.7); color: #0f0; padding: 2px 8px; font-size: 11px; border-radius: 4px; z-index: 999; pointer-events: none; }
</style>