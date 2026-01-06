import { contextBridge, ipcRenderer } from "electron";

declare global {
  interface Window {
    electron: {
      selectFolder: () => Promise<string | undefined>;
      getAudioFiles: (folderPath: string) => Promise<any[]>;
    };
  }
}

const maskScript = () => {
  const win = window as any;

  Object.defineProperty(navigator, "webdriver", { get: () => undefined });

  Object.defineProperty(navigator, "platform", { get: () => "Win32" });

  win.chrome = {
    app: { isInstalled: false },
    runtime: {
      OnInstalledReason: { INSTALL: "install" },
    },
    loadTimes: () => ({}),
    csi: () => ({}),
  };

  Object.defineProperty(navigator, "languages", {
    get: () => ["ru-RU", "ru", "en-US", "en"],
  });

  Object.defineProperty(navigator, "plugins", { get: () => [1, 2, 3, 4, 5] });
};

maskScript();

contextBridge.exposeInMainWorld("electron", {
  selectFolder: () => ipcRenderer.invoke("select-folder"),
  getAudioFiles: (folderPath: string) =>
    ipcRenderer.invoke("get-audio-files", folderPath),
});
