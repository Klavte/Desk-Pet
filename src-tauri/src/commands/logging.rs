// ==========================================
// 日志 & 窗口聚焦命令
// ==========================================

use tauri::Manager;

use crate::{rust_info, rust_log};

/// 接收前端统一日志并打印到终端
#[tauri::command]
pub fn log_message(msg: String) {
    println!("{}", msg);
}

/// 聚焦主窗口（通知卡片点击时调用）
#[tauri::command]
pub fn focus_main(app: tauri::AppHandle) -> Result<(), String> {
    if let Some(w) = app.get_webview_window("main") {
        let _ = w.show();
        let _ = w.unminimize();
        let _ = w.set_focus();
        rust_info!("通知点击 → 聚焦主窗口");
    }
    Ok(())
}
