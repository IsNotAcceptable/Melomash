import React, { useState, useEffect, useRef } from "react";
import {
  Youtube,
  Music,
  Disc,
  MessageCircle,
  Settings,
  HardDrive,
} from "lucide-react";
import { useTheme, themes, getAccentColorClass } from "./context/ThemeContext";
import SettingsModal from "./components/SettingsModal";
import Snowflakes from "./components/Snowflakes";
import LocalPlayer from "./components/LocalPlayer";

//@ts-ignore
import logo from "./assets/icon.png";

const SERVICES = [
  {
    id: "youtube",
    name: "YouTube Music",
    url: "https://music.youtube.com",
    icon: Youtube,
    type: "web",
  },
  {
    id: "yandex",
    name: "Яндекс Музыка",
    url: "https://music.yandex.ru",
    icon: Music,
    type: "web",
  },
  {
    id: "spotify",
    name: "Spotify",
    url: "https://open.spotify.com",
    icon: Disc,
    type: "web",
  },
  {
    id: "vk",
    name: "VK Музыка",
    url: "https://vk.com/audio",
    icon: MessageCircle,
    type: "web",
  },
  {
    id: "local",
    name: "Локальный диск",
    icon: HardDrive,
    type: "local",
  },
];

const CHROME_USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36";

const COSMETIC_AD_BLOCK_CSS = `
  iframe[src*="googleads"],
  div[id*="ad-unit"],
  div[class*="advertising"],
  ins.adsbygoogle { display: none !important; }
`;

const App: React.FC = () => {
  const [activeId, setActiveId] = useState("youtube");
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const { theme, snowflakesEnabled, accentColor } = useTheme();
  const currentTheme = themes[theme];

  const webviewRefs = useRef<{ [key: string]: any }>({});

  useEffect(() => {
    const applyAdBlock = (id: string) => {
      const webview = webviewRefs.current[id];
      if (webview) {
        const handleDomReady = () => {
          webview.insertCSS(COSMETIC_AD_BLOCK_CSS);
        };
        webview.addEventListener("dom-ready", handleDomReady);
        return () => webview.removeEventListener("dom-ready", handleDomReady);
      }
    };

    SERVICES.forEach((s) => {
      if (s.type === "web") applyAdBlock(s.id);
    });
  }, []);

  return (
    <div
      className="flex h-screen w-screen overflow-hidden font-sans select-none"
      style={{ backgroundColor: currentTheme.bg }}
    >
      <Snowflakes enabled={snowflakesEnabled} />

      <aside
        onMouseEnter={() => setIsSidebarExpanded(true)}
        onMouseLeave={() => setIsSidebarExpanded(false)}
        className={`flex flex-col items-start py-6 z-50 fixed left-0 top-0 bottom-0 border-r transition-all duration-300 ease-in-out px-4 ${
          isSidebarExpanded ? "w-64" : "w-20"
        }`}
        style={{
          backgroundColor: currentTheme.sidebar,
          borderColor: currentTheme.border,
        }}
      >
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center mb-10 shadow-lg shrink-0 self-center transition-transform duration-300"
          style={{ backgroundColor: currentTheme.logoBg }}
        >
          <img src={logo} alt="Logo" className="w-8 h-8 object-contain" />
        </div>

        <nav className="flex flex-col gap-3 flex-1 w-full">
          {SERVICES.map((service) => {
            const Icon = service.icon;
            const isActive = activeId === service.id;
            return (
              <button
                key={service.id}
                onClick={() => setActiveId(service.id)}
                className={`flex items-center gap-4 p-3 rounded-2xl transition-all duration-300 w-full overflow-hidden ${
                  isActive ? "bg-white/10" : "hover:bg-white/5"
                }`}
                style={{
                  backgroundColor: isActive
                    ? currentTheme.active
                    : "transparent",
                }}
              >
                <div className="shrink-0">
                  <Icon
                    size={24}
                    className={
                      isActive
                        ? getAccentColorClass(accentColor, theme)
                        : "text-gray-500"
                    }
                  />
                </div>
                <span
                  className={`font-medium text-sm whitespace-nowrap transition-opacity duration-300 ${
                    isSidebarExpanded ? "opacity-100" : "opacity-0"
                  }`}
                  style={{
                    color: isActive
                      ? currentTheme.text
                      : currentTheme.textSecondary,
                  }}
                >
                  {service.name}
                </span>
              </button>
            );
          })}
        </nav>

        <div className="w-full flex flex-col gap-3">
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="flex items-center gap-4 p-3 rounded-2xl group transition-all w-full overflow-hidden hover:bg-white/5"
            style={{
              backgroundColor: isSettingsOpen
                ? currentTheme.active
                : "transparent",
            }}
          >
            <div className="shrink-0">
              <Settings
                size={24}
                className={`text-gray-500 transition-transform duration-500 ${isSettingsOpen ? "rotate-90" : "group-hover:rotate-45"}`}
              />
            </div>
            <span
              className={`font-medium text-sm whitespace-nowrap transition-opacity duration-300 ${
                isSidebarExpanded ? "opacity-100" : "opacity-0"
              }`}
              style={{ color: currentTheme.textSecondary }}
            >
              Настройки
            </span>
          </button>
        </div>
      </aside>

      <main
        className="flex-1 ml-20 h-full relative"
        style={{ backgroundColor: currentTheme.main }}
      >
        {SERVICES.map((s) => (
          <div
            key={s.id}
            className={`absolute inset-0 transition-opacity duration-500 ${
              activeId === s.id
                ? "opacity-100 z-10"
                : "opacity-0 z-0 pointer-events-none"
            }`}
          >
            {s.type === "local" ? (
              <LocalPlayer />
            ) : (
              <webview
                ref={(el) => {
                  if (el) webviewRefs.current[s.id] = el;
                }}
                src={s.url}
                partition="persist:music_session"
                className="w-full h-full"
                useragent={CHROME_USER_AGENT}
                allowpopups={true}
                // @ts-ignore
                webpreferences="autoplayPolicy=no-user-gesture-required, contextIsolation=true, webSecurity=false, plugins=true"
              />
            )}
          </div>
        ))}
      </main>

      <style>{`
        webview {
          display: flex;
          width: 100%;
          height: 100%;
          background: ${currentTheme.main};
        }
        webview:focus { outline: none; }
      `}</style>

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </div>
  );
};

export default App;
