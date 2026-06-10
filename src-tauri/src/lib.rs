#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::thread;
use std::time::Duration;
use std::path::PathBuf;
use tauri::{Emitter, LogicalSize, Manager, WebviewWindow, WebviewWindowBuilder};

#[tauri::command]
fn close_windows_sim(app: tauri::AppHandle) -> Result<String, String> {
    if let Some(w) = app.get_webview_window("windows-sim") {
        let _ = w.destroy();
        Ok("closed".into())
    } else {
        Ok("not found".into())
    }
}

#[tauri::command]
fn reset_size(win: WebviewWindow) {
    let _ = win.set_size(LogicalSize::new(460.0, 272.0));
}

#[tauri::command]
async fn open_windows_sim(app: tauri::AppHandle) -> Result<String, String> {
    let label = "windows-sim";
    if let Some(existing) = app.get_webview_window(label) {
        let _ = existing.set_focus();
        return Ok("focused".into());
    }
    WebviewWindowBuilder::new(&app, label, tauri::WebviewUrl::App(PathBuf::from("index.html")))
        .title("Windows")
        .inner_size(800.0, 600.0)
        .min_inner_size(640.0, 480.0)
        .resizable(true)
        .decorations(false)
        .center()
        .devtools(true)
        .build()
        .map(|w| format!("created: {}", w.label()))
        .map_err(|e| format!("{}", e))
}

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
        .invoke_handler(tauri::generate_handler![reset_size, close_windows_sim, open_windows_sim])
        .run(tauri::generate_context!())
        .expect("启动失败");
}