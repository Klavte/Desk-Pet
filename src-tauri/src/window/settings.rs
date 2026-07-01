// ==========================================
// 设置窗口层级提升
// macOS: level 100 + orderFrontRegardless + makeKeyAndOrderFront
// Windows: alwaysOnTop 已在构造时设置
// ==========================================

use tauri::Manager;

/// 提升设置窗口层级，确保浮动在主窗口之上（双端）
#[tauri::command]
pub fn enhance_settings_window(app: tauri::AppHandle) {
    #[cfg(target_os = "macos")]
    if let Some(win) = app.get_webview_window("settings") {
        use objc::{msg_send, sel, sel_impl};
        use objc::runtime::Object;
        if let Ok(ns_win) = win.ns_window() {
            let ns_win = ns_win as *mut Object;
            unsafe {
                // 设到远高于主窗口(1000)的层级，确保设置面板永远浮在最上面
                let _: () = msg_send![ns_win, setLevel: 1200isize];
                let _: () = msg_send![ns_win, orderFrontRegardless];
                let _: () = msg_send![ns_win, makeKeyAndOrderFront: std::ptr::null::<Object>()];
            }
        }
    }

    // Windows: alwaysOnTop 已在构造时设置 + HWND_TOPMOST 保证
    let _ = app;
}
