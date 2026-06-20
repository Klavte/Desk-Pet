// ==========================================
// 窗口可见性判断
// 桌宠收回（隐藏到托盘）后 is_visible() → false
// ==========================================

use tauri::Manager;

/// 桌宠窗口是否可见（未收回）
pub fn is_pet_visible(app: &tauri::AppHandle) -> bool {
    app.get_webview_window("main")
        .map(|w| w.is_visible().unwrap_or(true))
        .unwrap_or(true)
}
