#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::{LogicalSize, WebviewWindow};

#[tauri::command]
fn reset_size(win: WebviewWindow) {
    let _ = win.set_size(LogicalSize::new(460.0, 272.0));
}

pub fn run() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![reset_size])
        .run(tauri::generate_context!())
        .expect("启动失败");
}