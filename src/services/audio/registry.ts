// ==========================================
// 音效注册中心
// 所有音效在此定义，其他地方统一引用
// 设置页可预览全部音效并指定每个事件使用哪个音效
// ==========================================

import { getBoundaryLevel } from "./boundary";

// ── 共享 AudioContext ──
let sharedCtx: AudioContext | null = null;
let ctxResumePromise: Promise<void> | null = null;

/** 异步获取已就绪的 AudioContext（确保 resume 完成后再返回） */
async function getCtx(): Promise<AudioContext | null> {
  if (sharedCtx && sharedCtx.state !== "closed") {
    if (sharedCtx.state === "suspended") {
      if (!ctxResumePromise) ctxResumePromise = sharedCtx.resume().then(() => {}).catch(() => {});
      await ctxResumePromise;
      ctxResumePromise = null;
    }
    return sharedCtx;
  }
  try {
    sharedCtx = new AudioContext();
    if (sharedCtx.state === "suspended") {
      ctxResumePromise = sharedCtx.resume().then(() => {}).catch(() => {});
      await ctxResumePromise;
      ctxResumePromise = null;
    }
    return sharedCtx;
  } catch { return null; }
}

// ── 音效定义类型 ──
export interface SoundDef {
  id: string;
  name: string;
  play: () => Promise<void>;
}

// ── 音效库（所有可用音效）──
const soundLibrary: SoundDef[] = [
  // ── 关闭 ──
  {
    id: "none",
    name: "关闭",
    play: async () => {},
  },

  // ── 弹出音效：轻快双音上行 ──
  {
    id: "popup_up",
    name: "轻快上行",
    play: async () => {
      const ctx = await getCtx();
      if (!ctx) return;
      try {
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gain1 = ctx.createGain();
        const gain2 = ctx.createGain();
        osc1.type = "sine"; osc2.type = "sine";
        osc1.frequency.setValueAtTime(800, ctx.currentTime);
        osc1.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.10);
        osc2.frequency.setValueAtTime(1000, ctx.currentTime + 0.06);
        osc2.frequency.exponentialRampToValueAtTime(1600, ctx.currentTime + 0.18);
        gain1.gain.setValueAtTime(0.12, ctx.currentTime);
        gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
        gain2.gain.setValueAtTime(0.10, ctx.currentTime + 0.06);
        gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.20);
        osc1.connect(gain1); gain1.connect(ctx.destination);
        osc2.connect(gain2); gain2.connect(ctx.destination);
        osc1.start(ctx.currentTime); osc2.start(ctx.currentTime + 0.06);
        osc1.stop(ctx.currentTime + 0.12); osc2.stop(ctx.currentTime + 0.20);
      } catch {}
    },
  },

  // ── 收回音效：温柔下行 ──
  {
    id: "retract_down",
    name: "温柔下行",
    play: async () => {
      const ctx = await getCtx();
      if (!ctx) return;
      try {
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gain1 = ctx.createGain();
        const gain2 = ctx.createGain();
        osc1.type = "sine"; osc2.type = "sine";
        osc1.frequency.setValueAtTime(1400, ctx.currentTime);
        osc1.frequency.exponentialRampToValueAtTime(900, ctx.currentTime + 0.12);
        osc2.frequency.setValueAtTime(1100, ctx.currentTime + 0.06);
        osc2.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.20);
        gain1.gain.setValueAtTime(0.11, ctx.currentTime);
        gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.14);
        gain2.gain.setValueAtTime(0.09, ctx.currentTime + 0.06);
        gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.22);
        osc1.connect(gain1); gain1.connect(ctx.destination);
        osc2.connect(gain2); gain2.connect(ctx.destination);
        osc1.start(ctx.currentTime); osc2.start(ctx.currentTime + 0.06);
        osc1.stop(ctx.currentTime + 0.14); osc2.stop(ctx.currentTime + 0.22);
      } catch {}
    },
  },

  // ── 启动欢迎音效：温暖上行和弦 ──
  {
    id: "welcome_chord",
    name: "温暖和弦",
    play: async () => {
      const ctx = await getCtx();
      if (!ctx) return;
      try {
        const notes = [523, 659, 784, 1047]; // C5 E5 G5 C6
        notes.forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = "sine";
          osc.frequency.value = freq;
          const t = ctx.currentTime + i * 0.12;
          gain.gain.setValueAtTime(0.10, t);
          gain.gain.exponentialRampToValueAtTime(0.001, t + 0.30);
          osc.connect(gain); gain.connect(ctx.destination);
          osc.start(t); osc.stop(t + 0.30);
        });
      } catch {}
    },
  },

  // ── 发送消息音效：轻快短促 ──
  {
    id: "send_short",
    name: "短促上行",
    play: async () => {
      const ctx = await getCtx();
      if (!ctx) return;
      try {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(1200, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1600, ctx.currentTime + 0.06);
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
        osc.connect(gain); gain.connect(ctx.destination);
        osc.start(ctx.currentTime); osc.stop(ctx.currentTime + 0.08);
      } catch {}
    },
  },

  // ── 收到回复音效：柔和叮咚 ──
  {
    id: "reply_ding",
    name: "柔和叮咚",
    play: async () => {
      const ctx = await getCtx();
      if (!ctx) return;
      try {
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gain1 = ctx.createGain();
        const gain2 = ctx.createGain();
        osc1.type = "sine"; osc1.frequency.value = 880;
        osc2.type = "sine"; osc2.frequency.value = 1320;
        gain1.gain.setValueAtTime(0.10, ctx.currentTime);
        gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
        gain2.gain.setValueAtTime(0.08, ctx.currentTime + 0.10);
        gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.20);
        osc1.connect(gain1); gain1.connect(ctx.destination);
        osc2.connect(gain2); gain2.connect(ctx.destination);
        osc1.start(ctx.currentTime); osc2.start(ctx.currentTime + 0.10);
        osc1.stop(ctx.currentTime + 0.12); osc2.stop(ctx.currentTime + 0.22);
      } catch {}
    },
  },

  // ── 表层提示音：轻快双音 ──
  {
    id: "surface_light",
    name: "轻快提示",
    play: async () => {
      const ctx = await getCtx();
      if (!ctx) return;
      try {
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gain = ctx.createGain();
        osc1.type = "sine"; osc1.frequency.value = 1600;
        osc2.type = "sine"; osc2.frequency.value = 1800;
        gain.gain.setValueAtTime(0.14, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.16);
        osc1.connect(gain); osc2.connect(gain);
        gain.connect(ctx.destination);
        osc1.start(ctx.currentTime);
        osc2.start(ctx.currentTime + 0.08);
        osc1.stop(ctx.currentTime + 0.08);
        osc2.stop(ctx.currentTime + 0.16);
      } catch {}
    },
  },

  // ── 中层提示音：轻微颤音 ──
  {
    id: "middle_tremolo",
    name: "轻微颤音",
    play: async () => {
      const ctx = await getCtx();
      if (!ctx) return;
      try {
        const osc = ctx.createOscillator();
        const lfo = ctx.createOscillator();
        const lfoGain = ctx.createGain();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(1400, ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(1200, ctx.currentTime + 0.20);
        lfo.type = "sine"; lfo.frequency.value = 6;
        lfoGain.gain.value = 15;
        lfo.connect(lfoGain); lfoGain.connect(osc.frequency);
        gain.gain.setValueAtTime(0.16, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.20);
        osc.connect(gain); gain.connect(ctx.destination);
        lfo.start(ctx.currentTime); osc.start(ctx.currentTime);
        lfo.stop(ctx.currentTime + 0.21); osc.stop(ctx.currentTime + 0.21);
      } catch {}
    },
  },

  // ── 深层提示音：紊乱噪音 + 降调 ──
  {
    id: "deep_noise",
    name: "紊乱噪音",
    play: async () => {
      const ctx = await getCtx();
      if (!ctx) return;
      try {
        const osc = ctx.createOscillator();
        const lfo = ctx.createOscillator();
        const lfoGain = ctx.createGain();
        const gain = ctx.createGain();
        osc.type = "square";
        osc.frequency.setValueAtTime(900, ctx.currentTime);
        osc.frequency.setValueAtTime(700, ctx.currentTime + 0.08);
        osc.frequency.setValueAtTime(500, ctx.currentTime + 0.18);
        lfo.type = "sawtooth"; lfo.frequency.value = 10;
        lfoGain.gain.value = 25;
        lfo.connect(lfoGain); lfoGain.connect(osc.frequency);
        gain.gain.setValueAtTime(0.18, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
        osc.connect(gain); gain.connect(ctx.destination);
        lfo.start(ctx.currentTime); osc.start(ctx.currentTime);

        const buf = ctx.createBuffer(1, Math.ceil(ctx.sampleRate * 0.26), ctx.sampleRate);
        const data = buf.getChannelData(0);
        for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
        const noise = ctx.createBufferSource();
        noise.buffer = buf;
        const noiseGain = ctx.createGain();
        noiseGain.gain.setValueAtTime(0.04, ctx.currentTime);
        noiseGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
        noise.connect(noiseGain); noiseGain.connect(ctx.destination);
        noise.start(ctx.currentTime);

        lfo.stop(ctx.currentTime + 0.26); osc.stop(ctx.currentTime + 0.26); noise.stop(ctx.currentTime + 0.26);
      } catch {}
    },
  },

  // ══════════════════════════════════════════
  // 短音效 (4个, < 200ms)
  // ══════════════════════════════════════════

  // ── 电子弹跳：方波快速上跳 ──
  {
    id: "pop_short",
    name: "电子弹跳",
    play: async () => {
      const ctx = await getCtx();
      if (!ctx) return;
      try {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "square";
        osc.frequency.setValueAtTime(400, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(2400, ctx.currentTime + 0.06);
        gain.gain.setValueAtTime(0.10, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.10);
        osc.connect(gain); gain.connect(ctx.destination);
        osc.start(ctx.currentTime); osc.stop(ctx.currentTime + 0.10);
      } catch {}
    },
  },

  // ── 水滴：高音正弦快速衰减 ──
  {
    id: "drop_short",
    name: "水滴",
    play: async () => {
      const ctx = await getCtx();
      if (!ctx) return;
      try {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(2400, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.12);
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.14);
        osc.connect(gain); gain.connect(ctx.destination);
        osc.start(ctx.currentTime); osc.stop(ctx.currentTime + 0.14);
      } catch {}
    },
  },

  // ── 风铃：三角波双音清脆短响 ──
  {
    id: "chime_short",
    name: "风铃",
    play: async () => {
      const ctx = await getCtx();
      if (!ctx) return;
      try {
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gain = ctx.createGain();
        osc1.type = "triangle"; osc1.frequency.value = 1600;
        osc2.type = "triangle"; osc2.frequency.value = 2400;
        gain.gain.setValueAtTime(0.12, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.16);
        osc1.connect(gain); osc2.connect(gain);
        gain.connect(ctx.destination);
        osc1.start(ctx.currentTime); osc2.start(ctx.currentTime + 0.02);
        osc1.stop(ctx.currentTime + 0.16); osc2.stop(ctx.currentTime + 0.16);
      } catch {}
    },
  },

  // ── 咔哒：极短噪音 + 低频点击 ──
  {
    id: "tick_short",
    name: "咔哒",
    play: async () => {
      const ctx = await getCtx();
      if (!ctx) return;
      try {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(200, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(60, ctx.currentTime + 0.04);
        gain.gain.setValueAtTime(0.20, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
        osc.connect(gain); gain.connect(ctx.destination);
        osc.start(ctx.currentTime); osc.stop(ctx.currentTime + 0.05);
      } catch {}
    },
  },

  // ══════════════════════════════════════════
  // 中音效 (4个, 200-500ms)
  // ══════════════════════════════════════════

  // ── 琶音上行：4音依次升阶 ──
  {
    id: "arpeggio_mid",
    name: "琶音上行",
    play: async () => {
      const ctx = await getCtx();
      if (!ctx) return;
      try {
        const notes = [659, 784, 1047, 1319]; // E5 G5 C6 E6
        notes.forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = "sine";
          osc.frequency.value = freq;
          const t = ctx.currentTime + i * 0.08;
          gain.gain.setValueAtTime(0.09, t);
          gain.gain.exponentialRampToValueAtTime(0.001, t + 0.14);
          osc.connect(gain); gain.connect(ctx.destination);
          osc.start(t); osc.stop(t + 0.14);
        });
      } catch {}
    },
  },

  // ── 柔波：正弦波 + LFO 振幅调制 ──
  {
    id: "wave_mid",
    name: "柔波",
    play: async () => {
      const ctx = await getCtx();
      if (!ctx) return;
      try {
        const osc = ctx.createOscillator();
        const lfo = ctx.createOscillator();
        const lfoGain = ctx.createGain();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(800, ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(1000, ctx.currentTime + 0.20);
        lfo.type = "sine"; lfo.frequency.value = 5;
        lfoGain.gain.value = 0.3;
        lfo.connect(lfoGain); lfoGain.connect(gain.gain); // tremolo
        gain.gain.setValueAtTime(0.12, ctx.currentTime);
        gain.gain.setValueAtTime(0.12, ctx.currentTime + 0.30);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.40);
        osc.connect(gain); gain.connect(ctx.destination);
        lfo.start(ctx.currentTime); osc.start(ctx.currentTime);
        lfo.stop(ctx.currentTime + 0.42); osc.stop(ctx.currentTime + 0.42);
      } catch {}
    },
  },

  // ── 星尘：多高频粒子散射 ──
  {
    id: "sparkle_mid",
    name: "星尘",
    play: async () => {
      const ctx = await getCtx();
      if (!ctx) return;
      try {
        const baseFreqs = [2000, 2800, 3600, 4400, 5200];
        for (let i = 0; i < 8; i++) {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = "sine";
          osc.frequency.value = baseFreqs[i % baseFreqs.length] + Math.random() * 400;
          const t = ctx.currentTime + Math.random() * 0.20;
          gain.gain.setValueAtTime(0.04, t);
          gain.gain.exponentialRampToValueAtTime(0.001, t + 0.08 + Math.random() * 0.06);
          osc.connect(gain); gain.connect(ctx.destination);
          osc.start(t); osc.stop(t + 0.20);
        }
      } catch {}
    },
  },

  // ── 共鸣：五度和声长鸣 ──
  {
    id: "resonance_mid",
    name: "共鸣",
    play: async () => {
      const ctx = await getCtx();
      if (!ctx) return;
      try {
        const harmonics = [523, 784, 1047, 1319, 1568]; // C5 G5 C6 E6 G6
        harmonics.forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = i === 0 ? "sine" : "triangle";
          osc.frequency.value = freq;
          gain.gain.setValueAtTime(0.06 - i * 0.01, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.45);
          osc.connect(gain); gain.connect(ctx.destination);
          osc.start(ctx.currentTime); osc.stop(ctx.currentTime + 0.46);
        });
      } catch {}
    },
  },

  // ══════════════════════════════════════════
  // 长音效 (4个, 2-3秒)
  // ══════════════════════════════════════════

  // ── 风潮：和弦铺底，渐入渐出 ──
  {
    id: "wind_long",
    name: "风潮",
    play: async () => {
      const ctx = await getCtx();
      if (!ctx) return;
      try {
        const notes = [262, 330, 392, 523]; // C4 E4 G4 C5
        notes.forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = "sine";
          osc.frequency.value = freq;
          gain.gain.setValueAtTime(0.001, ctx.currentTime);
          gain.gain.linearRampToValueAtTime(0.06, ctx.currentTime + 0.6);
          gain.gain.setValueAtTime(0.06, ctx.currentTime + 1.8);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 2.5);
          osc.connect(gain); gain.connect(ctx.destination);
          osc.start(ctx.currentTime + i * 0.15);
          osc.stop(ctx.currentTime + 2.5);
        });
      } catch {}
    },
  },

  // ── 水晶：高频依次闪烁 ──
  {
    id: "crystal_long",
    name: "水晶",
    play: async () => {
      const ctx = await getCtx();
      if (!ctx) return;
      try {
        const notes = [1047, 1319, 1568, 1760, 2093, 2637]; // C6 E6 G6 A6 C7 E7
        notes.forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = "sine";
          osc.frequency.value = freq;
          const t = ctx.currentTime + i * 0.25;
          gain.gain.setValueAtTime(0.001, t);
          gain.gain.linearRampToValueAtTime(0.07, t + 0.06);
          gain.gain.exponentialRampToValueAtTime(0.001, t + 0.50);
          osc.connect(gain); gain.connect(ctx.destination);
          osc.start(t); osc.stop(t + 0.50);
        });
      } catch {}
    },
  },

  // ── 暖阳：锯齿波缓慢滤波扫频 ──
  {
    id: "warm_long",
    name: "暖阳",
    play: async () => {
      const ctx = await getCtx();
      if (!ctx) return;
      try {
        const osc = ctx.createOscillator();
        const filter = ctx.createBiquadFilter();
        const gain = ctx.createGain();
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(220, ctx.currentTime); // A3
        osc.frequency.linearRampToValueAtTime(330, ctx.currentTime + 1.2); // E4
        osc.frequency.linearRampToValueAtTime(220, ctx.currentTime + 2.2); // back to A3
        filter.type = "lowpass";
        filter.frequency.setValueAtTime(400, ctx.currentTime);
        filter.frequency.linearRampToValueAtTime(2000, ctx.currentTime + 1.0);
        filter.frequency.linearRampToValueAtTime(400, ctx.currentTime + 2.0);
        filter.Q.value = 2;
        gain.gain.setValueAtTime(0.001, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.08, ctx.currentTime + 0.3);
        gain.gain.setValueAtTime(0.08, ctx.currentTime + 1.8);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 2.3);
        osc.connect(filter); filter.connect(gain); gain.connect(ctx.destination);
        osc.start(ctx.currentTime); osc.stop(ctx.currentTime + 2.3);
      } catch {}
    },
  },

  // ── 余韵：多层泛音钟声衰减 ──
  {
    id: "bell_long",
    name: "余韵",
    play: async () => {
      const ctx = await getCtx();
      if (!ctx) return;
      try {
        const partials = [
          { f: 523, g: 0.12 },  // C5
          { f: 659, g: 0.06 },  // E5
          { f: 784, g: 0.05 },  // G5
          { f: 1047, g: 0.04 }, // C6
          { f: 1319, g: 0.03 }, // E6
          { f: 1568, g: 0.02 }, // G6
        ];
        partials.forEach(({ f, g }) => {
          const osc = ctx.createOscillator();
          const gainNode = ctx.createGain();
          osc.type = "sine";
          osc.frequency.value = f;
          gainNode.gain.setValueAtTime(g, ctx.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 2.8);
          osc.connect(gainNode); gainNode.connect(ctx.destination);
          osc.start(ctx.currentTime); osc.stop(ctx.currentTime + 2.8);
        });
      } catch {}
    },
  },

  // ══════════════════════════════════════════
  // 恐怖音效 (2短 + 2长)
  // ══════════════════════════════════════════

  // ── 惊悚短音：不协和小二度刺耳短促 ──
  {
    id: "horror_stab",
    name: "惊悚短音",
    play: async () => {
      const ctx = await getCtx();
      if (!ctx) return;
      try {
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gain = ctx.createGain();
        osc1.type = "square"; osc2.type = "square";
        osc1.frequency.setValueAtTime(440, ctx.currentTime); // A4
        osc1.frequency.exponentialRampToValueAtTime(830, ctx.currentTime + 0.08);
        osc2.frequency.setValueAtTime(466, ctx.currentTime); // A#4 (minor second)
        osc2.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.08);
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
        osc1.connect(gain); osc2.connect(gain);
        gain.connect(ctx.destination);
        osc1.start(ctx.currentTime); osc2.start(ctx.currentTime);
        osc1.stop(ctx.currentTime + 0.12); osc2.stop(ctx.currentTime + 0.12);
      } catch {}
    },
  },

  // ── 心跳：双低频脉冲 ──
  {
    id: "heartbeat",
    name: "心跳",
    play: async () => {
      const ctx = await getCtx();
      if (!ctx) return;
      try {
        [0, 0.18].forEach((offset) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = "sine";
          osc.frequency.setValueAtTime(80, ctx.currentTime + offset);
          osc.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + offset + 0.10);
          gain.gain.setValueAtTime(0.25, ctx.currentTime + offset);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + offset + 0.12);
          osc.connect(gain); gain.connect(ctx.destination);
          osc.start(ctx.currentTime + offset); osc.stop(ctx.currentTime + offset + 0.12);
        });
      } catch {}
    },
  },

  // ── 渐近恐惧：半音阶上升 + 噪声渐强 (2.5s) ──
  {
    id: "dread_rise",
    name: "渐近恐惧",
    play: async () => {
      const ctx = await getCtx();
      if (!ctx) return;
      try {
        // 半音上升序列
        const notes = [220, 233, 247, 262, 277, 294, 311, 330, 349, 370, 392, 415];
        notes.forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const gainNode = ctx.createGain();
          osc.type = "sawtooth";
          const t = ctx.currentTime + i * 0.20;
          osc.frequency.value = freq;
          gainNode.gain.setValueAtTime(0.001, t);
          gainNode.gain.linearRampToValueAtTime(0.04, t + 0.08);
          gainNode.gain.exponentialRampToValueAtTime(0.001, t + 0.22);
          osc.connect(gainNode); gainNode.connect(ctx.destination);
          osc.start(t); osc.stop(t + 0.22);
        });
        // 底噪渐强
        const buf = ctx.createBuffer(1, Math.ceil(ctx.sampleRate * 2.5), ctx.sampleRate);
        const data = buf.getChannelData(0);
        for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
        const noise = ctx.createBufferSource();
        noise.buffer = buf;
        const noiseGain = ctx.createGain();
        noiseGain.gain.setValueAtTime(0.001, ctx.currentTime);
        noiseGain.gain.linearRampToValueAtTime(0.08, ctx.currentTime + 1.8);
        noiseGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 2.5);
        noise.connect(noiseGain); noiseGain.connect(ctx.destination);
        noise.start(ctx.currentTime); noise.stop(ctx.currentTime + 2.5);
      } catch {}
    },
  },

  // ── 鬼魅低语：滤波调制+颤音+泛音飘忽 (2.8s) ──
  {
    id: "ghost_whisper",
    name: "鬼魅低语",
    play: async () => {
      const ctx = await getCtx();
      if (!ctx) return;
      try {
        // 基音+泛音，缓慢LFO调制
        const baseOsc = ctx.createOscillator();
        const lfo = ctx.createOscillator();
        const lfoGain = ctx.createGain();
        const filter = ctx.createBiquadFilter();
        const gain = ctx.createGain();
        baseOsc.type = "sine";
        baseOsc.frequency.setValueAtTime(330, ctx.currentTime); // E4
        lfo.type = "sine"; lfo.frequency.setValueAtTime(2, ctx.currentTime);
        lfo.frequency.linearRampToValueAtTime(0.5, ctx.currentTime + 2.0);
        lfoGain.gain.value = 15;
        lfo.connect(lfoGain); lfoGain.connect(baseOsc.frequency);
        filter.type = "lowpass";
        filter.frequency.setValueAtTime(800, ctx.currentTime);
        filter.frequency.linearRampToValueAtTime(200, ctx.currentTime + 2.2);
        filter.frequency.linearRampToValueAtTime(2000, ctx.currentTime + 2.6);
        filter.Q.value = 5;
        gain.gain.setValueAtTime(0.001, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.10, ctx.currentTime + 0.4);
        gain.gain.setValueAtTime(0.10, ctx.currentTime + 1.8);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 2.8);
        baseOsc.connect(filter); filter.connect(gain); gain.connect(ctx.destination);
        lfo.start(ctx.currentTime); baseOsc.start(ctx.currentTime);
        lfo.stop(ctx.currentTime + 2.8); baseOsc.stop(ctx.currentTime + 2.8);
        // 第二泛音飘忽
        const highOsc = ctx.createOscillator();
        const highGain = ctx.createGain();
        highOsc.type = "sine";
        highOsc.frequency.setValueAtTime(660, ctx.currentTime);
        highOsc.frequency.linearRampToValueAtTime(700, ctx.currentTime + 1.2);
        highOsc.frequency.linearRampToValueAtTime(600, ctx.currentTime + 2.0);
        highGain.gain.setValueAtTime(0.001, ctx.currentTime + 0.3);
        highGain.gain.linearRampToValueAtTime(0.05, ctx.currentTime + 0.6);
        highGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 2.5);
        highOsc.connect(highGain); highGain.connect(ctx.destination);
        highOsc.start(ctx.currentTime + 0.3); highOsc.stop(ctx.currentTime + 2.5);
      } catch {}
    },
  },

  // ══════════════════════════════════════════
  // 特色长音效 (4个, 2-3s)
  // ══════════════════════════════════════════

  // ── 宇宙飘浮：高音正弦缓慢飘移 + 泛音闪烁 (2.5s) ──
  {
    id: "cosmic_float",
    name: "宇宙飘浮",
    play: async () => {
      const ctx = await getCtx();
      if (!ctx) return;
      try {
        // 主音缓慢飘移
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(880, ctx.currentTime); // A5
        osc.frequency.linearRampToValueAtTime(920, ctx.currentTime + 1.0);
        osc.frequency.linearRampToValueAtTime(840, ctx.currentTime + 2.0);
        osc.frequency.linearRampToValueAtTime(880, ctx.currentTime + 2.5);
        gain.gain.setValueAtTime(0.001, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.08, ctx.currentTime + 0.3);
        gain.gain.setValueAtTime(0.08, ctx.currentTime + 1.5);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 2.5);
        osc.connect(gain); gain.connect(ctx.destination);
        osc.start(ctx.currentTime); osc.stop(ctx.currentTime + 2.5);
        // 泛音点缀
        [1319, 1760, 2093].forEach((f, i) => {
          const h = ctx.createOscillator();
          const g = ctx.createGain();
          h.type = "sine";
          h.frequency.value = f;
          const t = ctx.currentTime + 0.4 + i * 0.55;
          g.gain.setValueAtTime(0.001, t);
          g.gain.linearRampToValueAtTime(0.04, t + 0.05);
          g.gain.exponentialRampToValueAtTime(0.001, t + 0.40);
          h.connect(g); g.connect(ctx.destination);
          h.start(t); h.stop(t + 0.40);
        });
      } catch {}
    },
  },

  // ── 脉冲：节奏性包络脉冲 (2.0s) ──
  {
    id: "pulse_rhythm",
    name: "脉冲",
    play: async () => {
      const ctx = await getCtx();
      if (!ctx) return;
      try {
        // 低音脉冲序列
        const pattern = [0, 0.25, 0.55, 0.75, 1.05, 1.35, 1.55, 1.75];
        pattern.forEach((offset) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = "triangle";
          osc.frequency.setValueAtTime(110, ctx.currentTime + offset); // A2
          osc.frequency.exponentialRampToValueAtTime(55, ctx.currentTime + offset + 0.12);
          gain.gain.setValueAtTime(0.15, ctx.currentTime + offset);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + offset + 0.14);
          osc.connect(gain); gain.connect(ctx.destination);
          osc.start(ctx.currentTime + offset); osc.stop(ctx.currentTime + offset + 0.14);
        });
        // 高频叠音
        [0.25, 0.75, 1.35].forEach((offset) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = "square";
          osc.frequency.value = 440;
          gain.gain.setValueAtTime(0.03, ctx.currentTime + offset);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + offset + 0.06);
          osc.connect(gain); gain.connect(ctx.destination);
          osc.start(ctx.currentTime + offset); osc.stop(ctx.currentTime + offset + 0.06);
        });
      } catch {}
    },
  },

  // ── 雨滴：下行级联水珠效果 (2.2s) ──
  {
    id: "raindrop",
    name: "雨滴",
    play: async () => {
      const ctx = await getCtx();
      if (!ctx) return;
      try {
        const drops = [
          1200, 1050, 920, 780, 660,
          550, 460, 380, 310, 260,
          210, 170, 140, 110, 90,
        ];
        drops.forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = "sine";
          osc.frequency.value = freq;
          const t = ctx.currentTime + i * 0.14;
          gain.gain.setValueAtTime(0.10, t);
          gain.gain.exponentialRampToValueAtTime(0.001, t + 0.18);
          osc.connect(gain); gain.connect(ctx.destination);
          osc.start(t); osc.stop(t + 0.18);
        });
        // 底层氛围音
        const pad = ctx.createOscillator();
        const padGain = ctx.createGain();
        pad.type = "sine";
        pad.frequency.setValueAtTime(220, ctx.currentTime);
        pad.frequency.linearRampToValueAtTime(160, ctx.currentTime + 2.0);
        padGain.gain.setValueAtTime(0.001, ctx.currentTime);
        padGain.gain.linearRampToValueAtTime(0.06, ctx.currentTime + 0.3);
        padGain.gain.setValueAtTime(0.06, ctx.currentTime + 0.8);
        padGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 2.2);
        pad.connect(padGain); padGain.connect(ctx.destination);
        pad.start(ctx.currentTime); pad.stop(ctx.currentTime + 2.2);
      } catch {}
    },
  },

  // ── 八音盒：清脆三角波弹拨 + 机械回响 (2.8s) ──
  {
    id: "music_box",
    name: "八音盒",
    play: async () => {
      const ctx = await getCtx();
      if (!ctx) return;
      try {
        // 旋律片段: C6 D6 E6 G6 E6 D6 C6 A5
        const melody = [1047, 1175, 1319, 1568, 1319, 1175, 1047, 880];
        const times = [0, 0.32, 0.64, 1.0, 1.32, 1.64, 2.0, 2.32];
        melody.forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = "triangle";
          osc.frequency.value = freq;
          const t = ctx.currentTime + times[i];
          gain.gain.setValueAtTime(0.12, t);
          gain.gain.exponentialRampToValueAtTime(0.001, t + 0.28);
          osc.connect(gain); gain.connect(ctx.destination);
          osc.start(t); osc.stop(t + 0.28);
        });
        // 泛音机械回响
        const ring = ctx.createOscillator();
        const ringGain = ctx.createGain();
        ring.type = "sine";
        ring.frequency.value = 2093; // C7
        ringGain.gain.setValueAtTime(0.001, ctx.currentTime + 1.8);
        ringGain.gain.linearRampToValueAtTime(0.04, ctx.currentTime + 2.0);
        ringGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 2.8);
        ring.connect(ringGain); ringGain.connect(ctx.destination);
        ring.start(ctx.currentTime + 1.8); ring.stop(ctx.currentTime + 2.8);
      } catch {}
    },
  },

  // ══════════════════════════════════════════
  // 短提醒单音 (4个, 2-3s, 余韵风格泛音衰减)
  // ══════════════════════════════════════════

  // ── 金铎：C5 大钟轰鸣，低频泛音绵长 (2.8s) ──
  {
    id: "ping_low",
    name: "金铎",
    play: async () => {
      const ctx = await getCtx();
      if (!ctx) return;
      try {
        const partials = [
          { f: 262, g: 0.14, t: "sine" },   // C4 基音
          { f: 330, g: 0.06, t: "sine" },    // E4
          { f: 392, g: 0.05, t: "sine" },    // G4
          { f: 523, g: 0.07, t: "triangle" }, // C5 泛音用三角波增加质感
          { f: 659, g: 0.04, t: "sine" },
          { f: 784, g: 0.03, t: "triangle" },
          { f: 1047, g: 0.02, t: "sine" },
        ];
        partials.forEach(({ f, g, t }) => {
          const osc = ctx.createOscillator();
          const gainNode = ctx.createGain();
          osc.type = t as OscillatorType;
          osc.frequency.value = f;
          gainNode.gain.setValueAtTime(g, ctx.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 2.8);
          osc.connect(gainNode); gainNode.connect(ctx.destination);
          osc.start(ctx.currentTime); osc.stop(ctx.currentTime + 2.8);
        });
      } catch {}
    },
  },

  // ── 银铃：G5 风铃摇曳，高频飘散 (2.2s) ──
  {
    id: "ping_mid",
    name: "银铃",
    play: async () => {
      const ctx = await getCtx();
      if (!ctx) return;
      try {
        const partials = [
          { f: 784, g: 0.10, d: 0.00 },  // G5
          { f: 988, g: 0.05, d: 0.04 },  // B5 (微偏移)
          { f: 1175, g: 0.06, d: 0.08 }, // D6
          { f: 1480, g: 0.04, d: 0.03 }, // F#6
          { f: 1568, g: 0.05, d: 0.12 }, // G6
          { f: 1760, g: 0.03, d: 0.06 }, // A6
          { f: 1976, g: 0.02, d: 0.15 }, // B6
        ];
        partials.forEach(({ f, g, d }) => {
          const osc = ctx.createOscillator();
          const gainNode = ctx.createGain();
          osc.type = "sine";
          osc.frequency.value = f;
          const t = ctx.currentTime + d;
          gainNode.gain.setValueAtTime(0.001, t);
          gainNode.gain.linearRampToValueAtTime(g, t + 0.03);
          gainNode.gain.exponentialRampToValueAtTime(0.001, t + 2.0);
          osc.connect(gainNode); gainNode.connect(ctx.destination);
          osc.start(t); osc.stop(t + 2.0);
        });
      } catch {}
    },
  },

  // ── 玉磬：E6 清冽剔透，水晶质感 (2.5s) ──
  {
    id: "ping_crisp",
    name: "玉磬",
    play: async () => {
      const ctx = await getCtx();
      if (!ctx) return;
      try {
        const partials = [
          { f: 1319, g: 0.11 }, // E6
          { f: 1661, g: 0.06 }, // G#6
          { f: 1976, g: 0.05 }, // B6
          { f: 2637, g: 0.04 }, // E7
          { f: 3322, g: 0.025 }, // G#7
          { f: 3951, g: 0.015 }, // B7
          { f: 5274, g: 0.008 }, // E8
        ];
        partials.forEach(({ f, g }) => {
          const osc = ctx.createOscillator();
          const gainNode = ctx.createGain();
          osc.type = "sine";
          osc.frequency.value = f;
          gainNode.gain.setValueAtTime(g, ctx.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 2.5);
          osc.connect(gainNode); gainNode.connect(ctx.destination);
          osc.start(ctx.currentTime); osc.stop(ctx.currentTime + 2.5);
        });
      } catch {}
    },
  },

  // ── 铜磬：A4 金属共鸣，微颤余音 (3.0s) ──
  {
    id: "ping_high",
    name: "铜磬",
    play: async () => {
      const ctx = await getCtx();
      if (!ctx) return;
      try {
        const partials = [
          { f: 440, g: 0.12 },  // A4
          { f: 554, g: 0.05 },  // C#5
          { f: 659, g: 0.06 },  // E5
          { f: 880, g: 0.04 },  // A5
          { f: 1109, g: 0.03 }, // C#6
          { f: 1320, g: 0.02 }, // E6
        ];
        partials.forEach(({ f, g }) => {
          const osc = ctx.createOscillator();
          const lfo = ctx.createOscillator();
          const lfoGain = ctx.createGain();
          const gainNode = ctx.createGain();
          osc.type = "sine";
          osc.frequency.value = f;
          // 轻微颤音给金属感
          lfo.type = "sine";
          lfo.frequency.value = 3.5 + Math.random();
          lfoGain.gain.value = f * 0.002;
          lfo.connect(lfoGain); lfoGain.connect(osc.frequency);
          gainNode.gain.setValueAtTime(g, ctx.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 3.0);
          osc.connect(gainNode); gainNode.connect(ctx.destination);
          lfo.start(ctx.currentTime); osc.start(ctx.currentTime);
          lfo.stop(ctx.currentTime + 3.0); osc.stop(ctx.currentTime + 3.0);
        });
      } catch {}
    },
  },
];

/** 获取完整音效库 */
export function getSoundLibrary(): SoundDef[] {
  return soundLibrary;
}

/** 按 ID 查找音效 */
export function getSoundById(id: string): SoundDef | undefined {
  return soundLibrary.find(s => s.id === id);
}

// ── 音效事件定义 ──
export interface SoundEvent {
  key: string;
  label: string;
  defaultSoundId: string;
}

/** 所有可配置音效事件 */
export const soundEvents: SoundEvent[] = [
  { key: "welcome", label: "启动欢迎", defaultSoundId: "welcome_chord" },
  { key: "send", label: "发送消息", defaultSoundId: "send_short" },
  { key: "reply", label: "收到回复", defaultSoundId: "reply_ding" },
  { key: "popup", label: "弹窗出现", defaultSoundId: "popup_up" },
  { key: "retract", label: "窗口收回", defaultSoundId: "retract_down" },
  { key: "surface", label: "表层提示", defaultSoundId: "surface_light" },
  { key: "middle", label: "中层提示", defaultSoundId: "middle_tremolo" },
  { key: "deep", label: "深层提示", defaultSoundId: "deep_noise" },
];

/** 事件 key → 默认音效 ID 速查表 */
const eventDefaults: Record<string, string> = {};
for (const e of soundEvents) eventDefaults[e.key] = e.defaultSoundId;

// ── 用户音效分配（localStorage）──
const ASSIGNMENTS_KEY = "deskpet_sound_assignments";

function loadAssignments(): Record<string, string> {
  try {
    return JSON.parse(localStorage.getItem(ASSIGNMENTS_KEY) || "{}");
  } catch (e) {
    console.warn("[Audio] 音效分配数据解析失败，已重置:", e);
    return {};
  }
}

/** 获取所有音效分配 */
export function getSoundAssignments(): Record<string, string> {
  const stored = loadAssignments();
  const result: Record<string, string> = {};
  for (const e of soundEvents) {
    result[e.key] = stored[e.key] || e.defaultSoundId;
  }
  return result;
}

/** 保存音效分配 */
export function saveSoundAssignments(assignments: Record<string, string>): void {
  try {
    localStorage.setItem(ASSIGNMENTS_KEY, JSON.stringify(assignments));
  } catch {}
}

// ── 统一播放入口 ──

/** 播放指定事件的音效（按用户分配，回退默认） */
export async function playEventSound(eventKey: string): Promise<void> {
  const assignments = loadAssignments();
  const soundId = assignments[eventKey] || eventDefaults[eventKey] || "none";
  if (soundId === "none") return;
  await getSoundById(soundId)?.play();
}

/** 人格界限联动提示音（根据当前界限自动选择表/中/深层音效） */
export async function playNotificationByBoundary(): Promise<void> {
  const level = getBoundaryLevel();
  if (level <= 3) await playEventSound("surface");
  else if (level === 4) await playEventSound("middle");
  else await playEventSound("deep");
}
