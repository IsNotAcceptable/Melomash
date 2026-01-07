import { app, BrowserWindow, Menu, session, ipcMain, dialog } from "electron";
import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let mainWindow: BrowserWindow | null = null;

const AD_BLOCK_PATTERNS = [
  "*://*.doubleclick.net/*",
  "*://*.google-analytics.com/*",
  "*://*.googlesyndication.com/*",
  "*://*.googleadservices.com/*",
  "*://*.moatads.com/*",
  "*://*.amazon-adsystem.com/*",
  "*://*.ad-delivery.net/*",
  "*://*.yandex.ru/ads/*",
  "*://*.an.yandex.ru/*",
  "*://*.static.doubleclick.net/*",
  "*://adservice.google.com/*",
  "*://adservice.google.ru/*",
  "*://*.youtube.com/api/stats/ads*",
  "*://*.youtube.com/pagead/*",
  "*://*.youtube.com/ptracking/*",
  "*://*.vk.com/ads_rotate.php*",
];

app.commandLine.appendSwitch("autoplay-policy", "no-user-gesture-required");

function UserAgent() {
  const chromeVersion = "142.0.0.0";

  switch (process.platform) {
    case "darwin":
      return `Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${chromeVersion} Safari/537.36`;
    case "linux":
      return `Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${chromeVersion} Safari/537.36`;
    default:
      return `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${chromeVersion} Safari/537.36`;
  }
}

app.userAgentFallback = UserAgent();

async function createWindow() {
  const musicSession = session.fromPartition("persist:music_session");

  try {
    musicSession.webRequest.onBeforeRequest(
      { urls: AD_BLOCK_PATTERNS },
      (details, callback) => {
        callback({ cancel: true });
      },
    );
  } catch (error) {
    console.error("Ошибка инициализации блокировщика рекламы:", error);
  }

  session.defaultSession.protocol.registerFileProtocol(
    "local-audio",
    (request, callback) => {
      const url = request.url.replace("local-audio://", "");
      try {
        return callback(decodeURIComponent(url));
      } catch (error) {
        console.error("Protocol error:", error);
      }
    },
  );

  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    backgroundColor: "#121212",
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      webviewTag: true,
      nodeIntegration: false,
      sandbox: false,
      backgroundThrottling: false,
    },
  });

  Menu.setApplicationMenu(null);

  ipcMain.handle("select-folder", async () => {
    const result = await dialog.showOpenDialog(mainWindow!, {
      properties: ["openDirectory"],
    });
    return result.filePaths[0];
  });

  ipcMain.handle("get-audio-files", async (_event, folderPath: string) => {
    if (!folderPath || !fs.existsSync(folderPath)) return [];
    try {
      const files = fs.readdirSync(folderPath);
      return files
        .filter((file) => /\.(mp3|wav|ogg|flac|m4a)$/i.test(file))
        .map((file) => ({
          name: file,
          path: path.join(folderPath, file),
          url: `local-audio://${path.join(folderPath, file)}`,
        }));
    } catch (err) {
      console.error("Ошибка чтения папки:", err);
      return [];
    }
  });

  if (process.env.VITE_DEV_SERVER_URL) {
    await mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL);
  } else {
    const indexPath = path.resolve(__dirname, "..", "renderer", "index.html");
    mainWindow.loadFile(indexPath).catch(async () => {
      const altPath = path.join(
        app.getAppPath(),
        "out",
        "renderer",
        "index.html",
      );
      if (mainWindow && !mainWindow.isDestroyed()) {
        await mainWindow.loadFile(altPath);
      }
    });
  }
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
