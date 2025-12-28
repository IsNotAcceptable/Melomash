const { app, BrowserWindow, ipcMain } = require("electron");
const easyvk = require("easyvk");
const path = require("path");

let win;
let vkContext;
const sessionPath = path.join(app.getPath("userData"), ".session-vk");

async function loginToVK(creds) {
  try {
    vkContext = await easyvk({
      username: creds.username,
      password: creds.password,
      code: creds.code || null,
      sessionFile: sessionPath,
      reauth: true,
      // Ключи от VK Me - они сейчас самые пробивные для аудио
      clientId: "6121396",
      clientSecret: "6scK68S73v6XUf0S38R3",
      // Маскируемся под Android, чтобы не получать ошибку 5
      userAgent:
        "VKAndroidApp/5.52-4543 (Android 9; SDK 28; arm64-v8a; Xiaomi Mi 9T; ru; 2340x1080)",
    });

    return { success: true };
  } catch (err) {
    console.error("ДЕТАЛИ ОШИБКИ ВК:", err);

    // Если EasyVK вернул ошибку в формате ВК
    const errorMsg = err.error_msg || err.message || "Неизвестная ошибка";

    if (err.code === "need_validation" || errorMsg.includes("2fa")) {
      return { success: false, need2FA: true };
    }

    return { success: false, error: errorMsg };
  }
}

ipcMain.handle("vk-login", async (event, creds) => {
  const result = await loginToVK(creds);
  if (result.success) {
    try {
      // Прямой вызов API через метод call, как в твоей документации
      const response = await vkContext.call("audio.get", { count: 100 });
      return { success: true, tracks: response.items };
    } catch (e) {
      console.log("Ошибка API Audio:", e);
      return { success: false, error: "Нет доступа к аудио: " + e.message };
    }
  }
  return result;
});

// Проверка сессии при старте (авто-вход)
ipcMain.handle("check-auth", async () => {
  try {
    vkContext = await easyvk({ sessionFile: sessionPath, reauth: false });
    const response = await vkContext.call("audio.get", { count: 100 });
    return { success: true, tracks: response.items };
  } catch (e) {
    return { success: false };
  }
});

function createWindow() {
  win = new BrowserWindow({
    width: 1000,
    height: 750,
    webPreferences: { nodeIntegration: true, contextIsolation: false },
  });
  win.loadFile("index.html");
}

app.whenReady().then(createWindow);
