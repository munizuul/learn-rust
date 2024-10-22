// src-tauri/src/main.rs
#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

// use tauri::tray::TrayIconBuilder;
use tauri::{
    menu::{Menu, MenuItem},
    tray::TrayIconBuilder,
};
// use tauri::{
//     CustomMenuItem, Manager, SystemTray, SystemTrayEvent, SystemTrayMenu, SystemTrayMenuItem,
// };

fn main() {
    // let quit = CustomMenuItem::new("quit".to_string(), "Quit");
    // let show = CustomMenuItem::new("show".to_string(), "Show");
    // let tray_menu = SystemTrayMenu::new()
    //     .add_item(show)
    //     .add_native_item(SystemTrayMenuItem::Separator)
    //     .add_item(quit);

    // let system_tray = SystemTray::new().with_menu(tray_menu);

    // let tray = TrayIconBuilder::new()
    //     .menu(&menu)
    //     .menu_on_left_click(true)
    //     .build(app)?;

    tauri::Builder::default()
        .setup(|app| {
            let quit_i = MenuItem::with_id(app, "quit", "Quit", true, None::<&str>)?;
            let show_i = MenuItem::with_id(app, "shpw", "Show", true, None::<&str>)?;
            let menu = Menu::with_items(app, &[&quit_i, &show_i])?;
            let tray = TrayIconBuilder::new()
                .menu(&menu)
                .menu_on_left_click(true)
                .build(app)?;
            Ok(())
        })
        // .system_tray(system_tray)
        // .on_system_tray_event(|app, event| match event {
        //     SystemTrayEvent::MenuItemClick { id, .. } => match id.as_str() {
        //         "quit" => {
        //             std::process::exit(0);
        //         }
        //         "show" => {
        //             let window = app.get_window("main").unwrap();
        //             window.show().unwrap();
        //         }
        //         _ => {}
        //     },
        //     _ => {}
        // })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
