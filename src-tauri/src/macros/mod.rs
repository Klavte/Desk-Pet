// ==========================================
// Rust 端日志宏
// ==========================================

#[macro_export]
macro_rules! rust_info {
    ($($arg:tt)*) => { rust_log!("INFO ", $($arg)*) };
}
#[macro_export]
macro_rules! rust_warn {
    ($($arg:tt)*) => { rust_log!("WARN ", $($arg)*) };
}
#[macro_export]
macro_rules! rust_debug {
    ($($arg:tt)*) => { rust_log!("DEBUG", $($arg)*) };
}

#[macro_export]
macro_rules! rust_log {
    ($level:expr, $($arg:tt)*) => {
        let now = std::time::SystemTime::now()
            .duration_since(std::time::UNIX_EPOCH)
            .unwrap_or_default();
        let secs = now.as_secs();
        let millis = now.subsec_millis();
        // 东八区近似（用于本地开发显示）
        let adj = (secs + 8 * 3600) % 86400;
        let h = adj / 3600;
        let m = (adj % 3600) / 60;
        let s = adj % 60;
        println!("[{:02}:{:02}:{:02}.{:03}] {} [Rust] {}",
            h, m, s, millis, $level, format!($($arg)*));
    };
}
