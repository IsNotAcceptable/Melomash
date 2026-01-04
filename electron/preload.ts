import { contextBridge } from "electron";

declare global {
  interface Window {
    chrome: any;
  }
}

const maskScript = () => {
  Object.defineProperty(navigator, "webdriver", { get: () => undefined });

  Object.defineProperty(navigator, "platform", { get: () => "Win32" });

  window.chrome = {
    app: { isInstalled: false },
    runtime: { OnInstalledReason: { INSTALL: "install" } },
    loadTimes: () => ({}),
    csi: () => ({}),
  };

  Object.defineProperty(navigator, "languages", {
    get: () => ["ru-RU", "ru", "en-US", "en"],
  });

  Object.defineProperty(navigator, "plugins", { get: () => [1, 2, 3, 4, 5] });
};

maskScript();

contextBridge.exposeInMainWorld("electron", {});
