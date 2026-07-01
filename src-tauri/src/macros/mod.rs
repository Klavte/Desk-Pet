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
        let secs = now.as_secs() % 86400;
        let millis = now.subsec_millis();
        let h = secs / 3600;
        let m = (secs % 3600) / 60;
        let s = secs % 60;
        println!("[{:02}:{:02}:{:02}.{:03}] {} [Rust] {}",
            h, m, s, millis, $level, format!($($arg)*));
    };
}
