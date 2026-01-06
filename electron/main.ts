import { app, BrowserWindow, Menu, session } from "electron";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let mainWindow: BrowserWindow | null = null;
const CHROME_USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36";

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
app.commandLine.appendSwitch(
  "disable-features",
  "AudioServiceOutOfProcess,AudioServiceSandbox",
);
app.commandLine.appendSwitch("disable-renderer-backgrounding");
app.commandLine.appendSwitch("disable-background-timer-throttling");
app.commandLine.appendSwitch("force-color-profile", "srgb");

async function createWindow() {
  const musicSession = session.fromPartition("persist:music_session");
  musicSession.setUserAgent(CHROME_USER_AGENT);

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
  if (process.platform !== "darwin") app.quit();
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
