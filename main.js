const { app, BrowserWindow, ipcMain } = require("electron");
const AudioAPI = require("easyvk-audio");
const path = require("path");
const { platform } = require("os");
const { resolve } = require("dns");

let win;
let vkAPI;

async function loginToVK(creds) {
  try {
    vkAPI = await new AudioAPI().login({
      credits: {
        username: creds.username,
        password: creds.password,
      },
      code: creds.code || null,
      cookies: path.join(app.getPath("userData"), "cookies.json"),
      fields: {
        client_id: 2685278,
        client_secret: "lYpW3bS70ufoQ66t8DGr",
      },
    });
    return { success: true };
  } catch (e) {
    if (e.message.includes("2fa") || e.code === "2fa_required")
      return { success: false, need2FA: true };
    return { success: false, error: e.message };
  }
}

ipcMain.handle("vk-login", async (event, creds) => {
  const result = await loginToVK(creds);
  if (result.success) {
    await new Promise((resolve) => setTimeout(resolve, 500));
    try {
      const { audios } = await vkAPI.audio.getAll();
      return { success: true, tracks: audios };
    } catch (err) {
      return {
        success: false,
        error: "Ошибка при получении списка: " + err.message,
      };
    }
  }
  return result;
});

function createWindow() {
  const win = new BrowserWindow({
    width: 1000,
    height: 700,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  win.loadFile("index.html");
}

app.whenReady().then(createWindow);
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
