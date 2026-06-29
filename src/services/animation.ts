import { chatHistory } from "./session";

// 动画类型定义
export interface Frame {
  src: string;
  duration: number; // 显示时长（毫秒）
}

export interface Animation {
  frames: Frame[];
  loop: boolean;
}

// 所有动画定�?
// 添加新动画只需在这里加一�?
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
  you: {
    frames: [
      { src: "/assets/ctj/stream_cho_dokuzetsu_superchat_000.png", duration: 150 },
      { src: "/assets/ctj/stream_cho_dokuzetsu_superchat_001.png", duration: 150 },
      { src: "/assets/ctj/stream_cho_dokuzetsu_superchat_002.png", duration: 150 },
      { src: "/assets/ctj/stream_cho_dokuzetsu_superchat_003.png", duration: 150 },
      { src: "/assets/ctj/stream_cho_dokuzetsu_superchat_004.png", duration: 150 },
      { src: "/assets/ctj/stream_cho_dokuzetsu_superchat_005.png", duration: 150 },
      { src: "/assets/ctj/stream_cho_dokuzetsu_superchat_004.png", duration: 150 },
      { src: "/assets/ctj/stream_cho_dokuzetsu_superchat_003.png", duration: 150 },
      { src: "/assets/ctj/stream_cho_dokuzetsu_superchat_002.png", duration: 150 },
      { src: "/assets/ctj/stream_cho_dokuzetsu_superchat_001.png", duration: 150 },
      { src: "/assets/ctj/stream_cho_dokuzetsu_superchat_000.png", duration: 600 },
    ],
    loop: false,
  },
  business1: {
    frames: [
      { src: "/assets/ctj/stream_cho_anken_business1_000.png", duration: 3000 },
      { src: "/assets/ctj/stream_cho_anken_business1_001.png", duration: 250 },
      { src: "/assets/ctj/stream_cho_anken_business1_000.png", duration: 3000 },
    ],
    loop: false,
  },
  gaoo: {
    frames: [
      { src: "/assets/ctj/stream_cho_gaoo_000.png", duration: 150 },
      { src: "/assets/ctj/stream_cho_gaoo_001.png", duration: 150 },
      { src: "/assets/ctj/stream_cho_gaoo_000.png", duration: 150 },
      { src: "/assets/ctj/stream_cho_gaoo_001.png", duration: 300 },
    ],
    loop: false,
  },
  sleepy: {
    frames: [
      { src: "/assets/ctj/stream_cho_sleepy_000.png", duration: 3000 },
    ],
    loop: false,
  },
  chu: {
    frames: [
      { src: "/assets/ctj/stream_cho_h_chu_000.png", duration: 120 },
      { src: "/assets/ctj/stream_cho_h_chu_001.png", duration: 120 },
      { src: "/assets/ctj/stream_cho_h_chu_002.png", duration: 120 },
      { src: "/assets/ctj/stream_cho_h_chu_003.png", duration: 800 },
    ],
    loop: false,
  },
  h: {
    frames: [
      { src: "/assets/ctj/stream_cho_h_000.png", duration: 200 },
      { src: "/assets/ctj/stream_cho_h_001.png", duration: 200 },
      { src: "/assets/ctj/stream_cho_h_002.png", duration: 200 },
      { src: "/assets/ctj/stream_cho_h_003.png", duration: 200 },
      { src: "/assets/ctj/stream_cho_h_004.png", duration: 200 },
      { src: "/assets/ctj/stream_cho_h_005.png", duration: 200 },
      { src: "/assets/ctj/stream_cho_h_000.png", duration: 200 },
      { src: "/assets/ctj/stream_cho_h_001.png", duration: 200 },
      { src: "/assets/ctj/stream_cho_h_002.png", duration: 200 },
      { src: "/assets/ctj/stream_cho_h_003.png", duration: 500 },
    ],
    loop: false,
  },
  angry: {
    frames: [
      { src: "/assets/ctj/stream_cho_anken_business8_000.png", duration: 120 },
      { src: "/assets/ctj/stream_cho_anken_business8_001.png", duration: 120 },
      { src: "/assets/ctj/stream_cho_anken_business8_000.png", duration: 120 },
      { src: "/assets/ctj/stream_cho_anken_business8_001.png", duration: 120 },
      { src: "/assets/ctj/stream_cho_anken_business8_000.png", duration: 120 },
    ],
    loop: false,
  },
  hera1: {
    frames: [
      { src: "/assets/ctj/stream_cho_hera_000.png", duration: 150 },
      { src: "/assets/ctj/stream_cho_hera_001.png", duration: 150 },
      { src: "/assets/ctj/stream_cho_hera_002.png", duration: 250 },
      { src: "/assets/ctj/stream_cho_hera_003.png", duration: 150 },
      { src: "/assets/ctj/stream_cho_hera_004.png", duration: 150 },
      { src: "/assets/ctj/stream_cho_hera_003.png", duration: 150 },
      { src: "/assets/ctj/stream_cho_hera_004.png", duration: 150 },
      { src: "/assets/ctj/stream_cho_hera_004.png", duration: 150 },
    ],
    loop: false,
  },
  hera2: {
    frames: [
      { src: "/assets/ctj/stream_cho_hera2_000.png", duration: 150 },
      { src: "/assets/ctj/stream_cho_hera2_001.png", duration: 150 },
      { src: "/assets/ctj/stream_cho_hera2_003.png", duration: 150 },
      { src: "/assets/ctj/stream_cho_hera2_004.png", duration: 150 },
      { src: "/assets/ctj/stream_cho_hera2_000.png", duration: 150 },
      { src: "/assets/ctj/stream_cho_hera2_001.png", duration: 150 },
      { src: "/assets/ctj/stream_cho_hera2_003.png", duration: 150 },
      { src: "/assets/ctj/stream_cho_hera2_004.png", duration: 150 },
    ],
    loop: false,
  },
  hera3: {
    frames: [
      { src: "/assets/ctj/stream_cho_hera_superchat_000.png", duration: 150 },
      { src: "/assets/ctj/stream_cho_hera_superchat_004.png", duration: 150 },
      { src: "/assets/ctj/stream_cho_hera_superchat_005.png", duration: 150 },
      { src: "/assets/ctj/stream_cho_hera_superchat_006.png", duration: 150 },
      { src: "/assets/ctj/stream_cho_hera_superchat_007.png", duration: 150 },
      { src: "/assets/ctj/stream_cho_hera_superchat_005.png", duration: 150 },
      { src: "/assets/ctj/stream_cho_hera_superchat_006.png", duration: 150 },
      { src: "/assets/ctj/stream_cho_hera_superchat_005.png", duration: 150 },
      { src: "/assets/ctj/stream_cho_hera_superchat_006.png", duration: 150 },
    ],
    loop: false,
  },
  grgr1: {
    frames: [
      { src: "/assets/ctj/stream_cho_grgr_000.png", duration: 200 },
      { src: "/assets/ctj/stream_cho_grgr_001.png", duration: 120 },
      { src: "/assets/ctj/stream_cho_grgr_002.png", duration: 200 },
      { src: "/assets/ctj/stream_cho_grgr_003.png", duration: 120 },
      { src: "/assets/ctj/stream_cho_grgr_000.png", duration: 200 },
      { src: "/assets/ctj/stream_cho_grgr_001.png", duration: 120 },
      { src: "/assets/ctj/stream_cho_grgr_002.png", duration: 200 },
      { src: "/assets/ctj/stream_cho_grgr_003.png", duration: 120 },
      { src: "/assets/ctj/stream_cho_grgr_000.png", duration: 200 },
    ],
    loop: false,
  },
  grgr2: {
    frames: [
      { src: "/assets/ctj/stream_cho_grgr2_000.png", duration: 200 },
      { src: "/assets/ctj/stream_cho_grgr2_001.png", duration: 120 },
      { src: "/assets/ctj/stream_cho_grgr2_002.png", duration: 200 },
      { src: "/assets/ctj/stream_cho_grgr2_003.png", duration: 120 },
      { src: "/assets/ctj/stream_cho_grgr2_000.png", duration: 200 },
      { src: "/assets/ctj/stream_cho_grgr2_001.png", duration: 120 },
      { src: "/assets/ctj/stream_cho_grgr2_002.png", duration: 200 },
      { src: "/assets/ctj/stream_cho_grgr2_003.png", duration: 120 },
      { src: "/assets/ctj/stream_cho_grgr2_000.png", duration: 200 },
    ],
    loop: false,
  },
  grgr3: {
    frames: [
      { src: "/assets/ctj/stream_cho_grgr3_000.png", duration: 500 },
      { src: "/assets/ctj/stream_cho_grgr3_001.png", duration: 200 },
      { src: "/assets/ctj/stream_cho_grgr3_004.png", duration: 500 },
      { src: "/assets/ctj/stream_cho_grgr3_005.png", duration: 200 },
      { src: "/assets/ctj/stream_cho_grgr3_000.png", duration: 500 },
    ],
    loop: false,
  },
  grgr4: {
    frames: [
      { src: "/assets/ctj/stream_cho_grgr4_000.png", duration: 1000 },
      { src: "/assets/ctj/stream_cho_grgr4_001.png", duration: 200 },
      { src: "/assets/ctj/stream_cho_grgr4_000.png", duration: 1500 },
    ],
    loop: false,
  },
  come: {
    frames: [
      { src: "/assets/ctj/stream_cho_ide_invoke_000.png", duration: 150 },
      { src: "/assets/ctj/stream_cho_ide_invoke_001.png", duration: 150 },
      { src: "/assets/ctj/stream_cho_ide_invoke_002.png", duration: 150 },
      { src: "/assets/ctj/stream_cho_ide_invoke_003.png", duration: 450 },
      { src: "/assets/ctj/stream_cho_ide_invoke_004.png", duration: 120 },
      { src: "/assets/ctj/stream_cho_ide_invoke_003.png", duration: 500 },
    ],
    loop: false,
  },
  kakoyoku: {
    frames: [
      { src: "/assets/ctj/stream_cho_kakkoyoku_000.png", duration: 700 },
      { src: "/assets/ctj/stream_cho_kakkoyoku_001.png", duration: 120 },
      { src: "/assets/ctj/stream_cho_kakkoyoku_000.png", duration: 700 },
    ],
    loop: false,
  },
  ha: {
    frames: [
      { src: "/assets/ctj/stream_cho_kakkoyoku_superchat_000.png", duration: 150 },
      { src: "/assets/ctj/stream_cho_kakkoyoku_superchat_001.png", duration: 150 },
      { src: "/assets/ctj/stream_cho_kakkoyoku_superchat_002.png", duration: 150 },
      { src: "/assets/ctj/stream_cho_kakkoyoku_superchat_003.png", duration: 150 },
      { src: "/assets/ctj/stream_cho_kakkoyoku_superchat_004.png", duration: 150 },
      { src: "/assets/ctj/stream_cho_kakkoyoku_superchat_005.png", duration: 150 },
      { src: "/assets/ctj/stream_cho_kakkoyoku_superchat_006.png", duration: 150 },
      { src: "/assets/ctj/stream_cho_kakkoyoku_superchat_007.png", duration: 500 },
    ],
    loop: false,
  },
};