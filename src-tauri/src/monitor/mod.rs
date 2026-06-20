// ==========================================
// 窗口监控 —— MonitorState + 类型定义
// ==========================================

use std::sync::{Mutex, Condvar, atomic::{AtomicBool, AtomicU64}};
use serde::Serialize;

/// 监控状态：暂停/恢复控制 + 可配置参数
pub struct MonitorState {
    pub paused: AtomicBool,
    pub lock: Mutex<()>,
    pub cv: Condvar,
    /// 轮询间隔（毫秒）
    pub polling_interval_ms: AtomicU64,
    /// 暂停时额外等待（毫秒）
    pub pause_extra_ms: AtomicU64,
    /// 暂停等待超时（毫秒）
    pub wait_timeout_ms: AtomicU64,
}

impl Default for MonitorState {
    fn default() -> Self {
        Self {
            paused: AtomicBool::new(false),
            lock: Mutex::new(()),
            cv: Condvar::new(),
            polling_interval_ms: AtomicU64::new(3000),
            pause_extra_ms: AtomicU64::new(5000),
            wait_timeout_ms: AtomicU64::new(5000),
        }
    }
}

#[derive(Clone, Serialize)]
pub struct WindowChangePayload {
    pub title: String,
    pub content: String,
    pub is_pet_visible: bool,
}

// ── 子模块声明 ──
mod capture;
mod visibility;
mod thread;

pub use thread::spawn_monitor_thread;
