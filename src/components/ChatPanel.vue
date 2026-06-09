<script setup lang="ts">
import { ref, nextTick, onMounted } from "vue";
import { chatHistory, sendMessage } from "../services/chat";

const emit = defineEmits<{ send: [text: string] }>();
const input = ref("");
const el = ref<HTMLElement | null>(null);

function scroll() {
  nextTick(() => {
    if (el.value) el.value.scrollTop = el.value.scrollHeight;
  });
}
async function send() {
  const t = input.value.trim();
  if (!t) return;
  input.value = "";
  emit("send", t);
  await sendMessage(t);
  scroll();
}
function key(e: KeyboardEvent) {
  if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); }
}
onMounted(scroll);
</script>

<template>
  <div id="chat">
    <img class="cbg" src="/assets/windows/tinder_match.png" alt="" />
    <div id="ch-head">ライブチャット</div>
    <div id="ch-msgs" ref="el">
      <div v-for="(m, i) in chatHistory" :key="i" class="cm" :class="m.role">
        <span class="cn">{{ m.role === "assistant" ? "糖糖" : "あなた" }}</span>
        <span class="ct">{{ m.text }}</span>
      </div>
    </div>
    <div id="ch-foot">
      <input v-model="input" placeholder="メッセージ..." @keydown="key" />
      <button @click="send" :disabled="!input.trim()">送信</button>
    </div>
  </div>
</template>

<style scoped>
#chat {
  width: 100%; height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
  background: #3e1a2e;
}
.cbg {
  position: absolute;
  width: 100%; height: 100%;
  object-fit: cover;
  pointer-events: none;
  z-index: 0;
  opacity: 0.15;
}
#ch-head {
  font-family: "pixel-mplus-bold", "zpix", "pixel-mplus", sans-serif;
  position: relative;
  z-index: 1;
  padding: 6px 8px;
  font-size: 11px;
  color: #f0a0c0;
  background: #4a2540;
  border-bottom: 1px solid #5a3050;
  flex-shrink: 0;
  text-align: center;
  letter-spacing: 2px;
}
#ch-msgs {
  position: relative;
  z-index: 1;
  flex: 1;
  overflow-y: auto;
  padding: 8px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.cm { display: flex; flex-direction: column; gap: 1px; font-size: 10px; line-height: 1.4; }
.cm.user { align-items: flex-end; }
.cm.assistant { align-items: flex-start; }
.cn { font-size: 9px; color: #f0a0c0; }
.cm.user .cn { color: #90d0ff; }
.ct { color: #f0e0f0; word-break: break-word; padding: 4px 8px; border-radius: 12px; max-width: 95%; font-size: 10px; }
.cm.user .ct { background: #6a3050; }
.cm.assistant .ct { background: #4a2540; }
#ch-foot {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px;
  background: #4a2540;
  border-top: 1px solid #5a3050;
  flex-shrink: 0;
}
#ch-foot input {
  flex: 1;
  background: #3e1a2e;
  border: 1px solid #6a4060;
  border-radius: 16px;
  padding: 5px 10px;
  color: #f0e0f0;
  font-size: 10px;
  font-family: inherit;
  outline: none;
}
#ch-foot input:focus { border-color: #c4276f; }
#ch-foot input::placeholder { color: #8a6080; }
#ch-foot button {
  padding: 5px 12px;
  background: #c4276f;
  color: #fff;
  border: none;
  border-radius: 16px;
  cursor: pointer;
  font-size: 10px;
  font-family: inherit;
  flex-shrink: 0;
}
#ch-foot button:hover { background: #e84a8a; }
#ch-foot button:disabled { background: #5a3050; color: #8a6080; cursor: default; }
#ch-msgs::-webkit-scrollbar { width: 4px; }
#ch-msgs::-webkit-scrollbar-thumb { background: #6a4060; border-radius: 2px; }
</style>