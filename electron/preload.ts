import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("melomashAPI", {
  switchService: (serviceId: string) =>
    ipcRenderer.send("switch-service", serviceId),
  toggleSidebar: (collapsed: boolean) =>
    ipcRenderer.send("toggle-sidebar", collapsed),
  setTheme: (theme: string) =>
    ipcRenderer.send("set-theme", theme),
});
