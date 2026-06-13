#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::thread;
use std::time::Duration;
use std::path::PathBuf;
use tauri::{Emitter, LogicalSize, Manager, WebviewWindow, WebviewWindowBuilder};
use serde::Serialize;

#[derive(Clone, Serialize)]
struct WindowChangePayload {
    title: String,
    cross_monitor: bool,
}

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

#[tauri::command]
fn are_monitors_different(app: tauri::AppHandle) -> bool {
    check_cross_monitor(&app)
}

fn check_cross_monitor(app: &tauri::AppHandle) -> bool {
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
    #[cfg(not(target_os = "windows"))]
    false
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
        .plugin(tauri_plugin_notification::init())
        .setup(|app| {
            let handle = app.handle().clone();
            thread::spawn(move || {
                loop {
                    thread::sleep(Duration::from_secs(3));
                    let title = get_foreground_window_title();
                    if !title.is_empty() {
                        let cross = check_cross_monitor(&handle);
                        let _ = handle.emit("window-changed", WindowChangePayload { title, cross_monitor: cross });
                    }
                }
            });
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            reset_size,
            close_windows_sim,
            open_windows_sim,
            are_monitors_different,
        ])
        .run(tauri::generate_context!())
        .expect("startup failure");
}
