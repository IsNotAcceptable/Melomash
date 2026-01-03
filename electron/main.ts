import { app, BrowserWindow, WebContentsView, ipcMain, Menu } from "electron";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.commandLine.appendSwitch("no-sandbox");
app.commandLine.appendSwitch("disable-setuid-sandbox");
app.commandLine.appendSwitch("disable-dev-shm-usage");
app.commandLine.appendSwitch("disable-gpu-sandbox");

let mainWindow: BrowserWindow | null = null;
const views: Record<string, WebContentsView> = {};
let activeServiceId: string = "youtube";
let isSidebarCollapsed = false;

const SIDEBAR_FULL = 260;
const SIDEBAR_COLLAPSED = 80;

function updateViewsLayout() {
  if (!mainWindow) return;

  const [width, height] = mainWindow.getContentSize();

  // Чтобы не было черных дыр, ширина вьюхи всегда рассчитывается от 80px
  const viewWidth = Math.max(0, width - SIDEBAR_COLLAPSED);

  // Координата X меняется мгновенно. Плавность в Electron вызывает баги рендеринга.
  const targetX = isSidebarCollapsed ? SIDEBAR_COLLAPSED : SIDEBAR_FULL;

  const activeView = views[activeServiceId];
  if (activeView) {
    activeView.setBounds({
      x: targetX,
      y: 0,
      width: viewWidth,
      height: height,
    });
  }

  // Неактивные вьюхи убираем далеко
  Object.entries(views).forEach(([id, view]) => {
    if (id !== activeServiceId) {
      view.setBounds({ x: -width - 500, y: 0, width: 0, height: 0 });
    }
  });
}

async function createWindow() {
  const preloadPath = path.join(__dirname, "..", "preload", "index.js");

  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 900,
    minHeight: 600,
    backgroundColor: "#121212",
    autoHideMenuBar: true,
    show: false,
    webPreferences: {
      preload: preloadPath,
      contextIsolation: true,
      sandbox: false,
    },
  });

  Menu.setApplicationMenu(null);

  if (process.env.VITE_DEV_SERVER_URL) {
    await mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL);
  } else {
    await mainWindow.loadFile(
      path.join(__dirname, "..", "renderer", "index.html"),
    );
  }

  const SERVICES = [
    { id: "youtube", url: "https://music.youtube.com" },
    { id: "yandex", url: "https://music.yandex.ru" },
    { id: "spotify", url: "https://open.spotify.com" },
    { id: "vk", url: "https://music.vk.com" },
  ];

  for (const service of SERVICES) {
    const view = new WebContentsView({
      webPreferences: {
        contextIsolation: true,
        sandbox: false,
        backgroundThrottling: false, // Важно, чтобы музыка не заикалась
      },
    });

    view.webContents.setUserAgent(
      "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
    );

    mainWindow.contentView.addChildView(view);
    view.webContents.loadURL(service.url);
    views[service.id] = view;
  }

  mainWindow.once("ready-to-show", () => {
    mainWindow?.show();
    updateViewsLayout();
  });

  mainWindow.on("resize", () => updateViewsLayout());

  ipcMain.on("switch-service", (_, id) => {
    activeServiceId = id;
    updateViewsLayout();
  });

  ipcMain.on("toggle-sidebar", (_, collapsed) => {
    isSidebarCollapsed = collapsed;
    updateViewsLayout();
  });
}

app.whenReady().then(createWindow);
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
