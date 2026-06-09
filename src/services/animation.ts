// 动画类型定义
export interface Frame {
  src: string;
  duration: number; // 显示时长（毫秒）
}

export interface Animation {
  frames: Frame[];
  loop: boolean;
}

// 所有动画定义
// 添加新动画只需在这里加一条
export const animations: Record<string, Animation> = {
  idle: {
    frames: [
      { src: "/assets/ctj/stream_cho_idle_000.png", duration: 5000 },
      { src: "/assets/ctj/stream_cho_idle_001.png", duration: 250 },
    ],
    loop: true,
  },
  smile: {
    frames: [
      { src: "/assets/ctj/stream_cho_smile_001.png", duration: 100 },
      { src: "/assets/ctj/stream_cho_smile_002.png", duration: 100 },
      { src: "/assets/ctj/stream_cho_smile_003.png", duration: 100 },
      { src: "/assets/ctj/stream_cho_smile_004.png", duration: 100 },
      { src: "/assets/ctj/stream_cho_smile_005.png", duration: 100 },
      { src: "/assets/ctj/stream_cho_smile_006.png", duration: 100 },
      { src: "/assets/ctj/stream_cho_smile_007.png", duration: 300 },
    ],
    loop: false,
  },
  superchat: {
    frames: [
      { src: "/assets/ctj/stream_cho_akaruku_superchat_000.png", duration: 120 },
      { src: "/assets/ctj/stream_cho_akaruku_superchat_001.png", duration: 120 },
      { src: "/assets/ctj/stream_cho_akaruku_superchat_002.png", duration: 120 },
      { src: "/assets/ctj/stream_cho_akaruku_superchat_003.png", duration: 120 },
      { src: "/assets/ctj/stream_cho_akaruku_superchat_000.png", duration: 120 },
      { src: "/assets/ctj/stream_cho_akaruku_superchat_001.png", duration: 120 },
      { src: "/assets/ctj/stream_cho_akaruku_superchat_002.png", duration: 120 },
      { src: "/assets/ctj/stream_cho_akaruku_superchat_003.png", duration: 120 },
      { src: "/assets/ctj/stream_cho_akaruku_superchat_000.png", duration: 120 },
      { src: "/assets/ctj/stream_cho_akaruku_superchat_001.png", duration: 120 },
      { src: "/assets/ctj/stream_cho_akaruku_superchat_002.png", duration: 120 },
      { src: "/assets/ctj/stream_cho_akaruku_superchat_003.png", duration: 300 },
    ],
    loop: false,
  },
  su: {
    frames: [
      { src: "/assets/ctj/stream_cho_su_000.png", duration: 3000 },
    ],
    loop: false,
  },
  sleepy: {
    frames: [
      { src: "/assets/ctj/stream_cho_sleepy_000.png", duration: 3000 },
    ],
    loop: false,
  },
};