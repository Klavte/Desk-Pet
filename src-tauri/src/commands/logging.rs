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

/// macOS 系统通知 fallback（osascript display notification，无需代码签名）
#[tauri::command]
pub fn send_osx_notification(title: String, body: String) -> Result<(), String> {
    #[cfg(target_os = "macos")]
    {
        let t = title.replace('"', "\\\"");
        let b = body.replace('"', "\\\"");
        let script = format!("display notification \"{}\" with title \"{}\"", b, t);
        let out = std::process::Command::new("osascript")
            .arg("-e")
            .arg(&script)
            .output()
            .map_err(|e| e.to_string())?;
        if !out.status.success() {
            let err = String::from_utf8_lossy(&out.stderr);
            rust_info!("osascript 通知失败: {}", err.trim());
        }
    }
    #[cfg(not(target_os = "macos"))]
    let _ = (title, body);
    Ok(())
}
