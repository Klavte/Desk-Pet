// ==========================================
// 跨显示器检测 + 最小化判断
// Windows: MonitorFromWindow
// macOS:   鼠标位置启发式
// ==========================================

use tauri::Manager;

/// 检测前台窗口与桌宠是否在不同显示器
pub fn check_cross_monitor(app: &tauri::AppHandle) -> bool {
    #[cfg(target_os = "windows")]
    unsafe {
        use windows_sys::Win32::UI::WindowsAndMessaging::GetForegroundWindow;
        use windows_sys::Win32::Graphics::Gdi::{MonitorFromWindow, MONITOR_DEFAULTTONULL};
        let fg = GetForegroundWindow();
        if fg == 0 { return false; }
        let fg_mon = MonitorFromWindow(fg, MONITOR_DEFAULTTONULL);
        if fg_mon == 0 { return false; }
        let pet_mon = match app.get_webview_window("main") {
            Some(w) => match w.hwnd() {
                Ok(h) => MonitorFromWindow(h.0 as isize, MONITOR_DEFAULTTONULL),
                Err(_) => return false,
            },
            None => return false,
        };
        if pet_mon == 0 { return false; }
        fg_mon != pet_mon
    }

    #[cfg(target_os = "macos")]
    {
        let pet_win = match app.get_webview_window("main") {
            Some(w) => w,
            None => return false,
        };
        let Ok(pet_pos) = pet_win.outer_position() else { return false; };
        let Ok(pet_size) = pet_win.outer_size() else { return false; };

        if let Ok(out) = std::process::Command::new("osascript")
            .arg("-e")
            .arg(r#"tell application "System Events" to get position of mouse"#)
            .output()
        {
            if out.status.success() {
                let s = String::from_utf8_lossy(&out.stdout);
                let parts: Vec<&str> = s.trim().split(',').map(|p| p.trim()).collect();
                if parts.len() == 2 {
                    if let (Ok(mx), Ok(my)) = (parts[0].parse::<f64>(), parts[1].parse::<f64>()) {
                        let mx = mx as i32;
                        let my = my as i32;
                        let pet_l = pet_pos.x;
                        let pet_r = pet_pos.x + pet_size.width as i32;
                        let pet_t = pet_pos.y;
                        let pet_b = pet_pos.y + pet_size.height as i32;
                        return mx < pet_l || mx > pet_r || my < pet_t || my > pet_b;
                    }
                }
            }
        }
    }

    false
}

/// 桌宠是否已最小化
pub fn is_pet_minimized(app: &tauri::AppHandle) -> bool {
    app.get_webview_window("main")
        .map(|w| w.is_minimized().unwrap_or(false))
        .unwrap_or(false)
}
