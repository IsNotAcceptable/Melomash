import { app, BrowserWindow, Menu, session } from "electron";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let mainWindow: BrowserWindow | null = null;
const CHROME_USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36";

async function createWindow() {
  const musicSession = session.fromPartition("persist:fresh_start");
  musicSession.setUserAgent(CHROME_USER_AGENT);

  mainWindow = new BrowserWindow({
    width: 1100,
    height: 800,
    minWidth: 900,
    minHeight: 600,
    backgroundColor: "#181818",
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      webviewTag: true,
      nodeIntegration: false,
      sandbox: false,
    },
  });

  Menu.setApplicationMenu(null);

  musicSession.webRequest.onBeforeSendHeaders((details, callback) => {
    delete details.requestHeaders["X-User-Agent"];
    callback({ requestHeaders: details.requestHeaders });
  });

  if (process.env.VITE_DEV_SERVER_URL) {
    await mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL);
  } else {
    const indexPath = path.resolve(__dirname, "..", "renderer", "index.html");

    console.log("[Main] Attempting to load UI from:", indexPath);

    mainWindow.loadFile(indexPath).catch(async (err) => {
      console.error("[Main] Failed to load index.html:", err);

      const altPath = path.join(
        app.getAppPath(),
        "out",
        "renderer",
        "index.html",
      );
      if (mainWindow && !mainWindow.isDestroyed()) {
        console.log("[Main] Trying fallback path:", altPath);
        await mainWindow
          .loadFile(altPath)
          .catch((e) => console.error("[Main] Fallback also failed:", e));
      }
    });
  }

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

app.commandLine.appendSwitch("disable-blink-features", "AutomationControlled");
app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

app.on("activate", () => {
  if (mainWindow === null) createWindow();
});
