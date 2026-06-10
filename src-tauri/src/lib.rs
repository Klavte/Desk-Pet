#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::thread;
use std::time::Duration;
use tauri::{Emitter, LogicalSize, WebviewWindow};

#[tauri::command]
fn reset_size(win: WebviewWindow) {
    let _ = win.set_size(LogicalSize::new(460.0, 272.0));
}

/// 获取当前前台窗口标题（Windows Only）
fn get_foreground_window_title() -> String {
    #[cfg(target_os = "windows")]
    unsafe {
        use windows_sys::Win32::UI::WindowsAndMessaging::{
            GetForegroundWindow, GetWindowTextW,
        };
        let hwnd = GetForegroundWindow();
        let mut buf = [0u16; 1024];
        let len = GetWindowTextW(hwnd, buf.as_mut_ptr(), 1024);
        if len > 0 {
            return String::from_utf16_lossy(&buf[..len as usize]);
        }
    }
    String::new()
}

pub fn run() {
    tauri::Builder::default()
        .setup(|app| {
            let handle = app.handle().clone();
            thread::spawn(move || {
                loop {
                    thread::sleep(Duration::from_secs(3));
                    let current = get_foreground_window_title();
                    if !current.is_empty() {
                        let _ = handle.emit("window-changed", &current);
                    }
                }
            });
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![reset_size])
        .run(tauri::generate_context!())
        .expect("启动失败");
}
