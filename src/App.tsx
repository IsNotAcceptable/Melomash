import React, { useState, useEffect, useRef } from "react";
import { Youtube, Music, Disc, MessageCircle, Settings } from "lucide-react";
import { useTheme, themes, getAccentColorClass } from "./ThemeContext";
import SettingsModal from "./SettingsModal";
import Snowflakes from "./Snowflakes";

//@ts-ignore
import logo from "./assets/icon.png";

const SERVICES = [
  {
    id: "youtube",
    name: "YouTube Music",
    url: "https://music.youtube.com",
    icon: Youtube,
  },
  {
    id: "yandex",
    name: "Яндекс Музыка",
    url: "https://music.yandex.ru",
    icon: Music,
  },
  {
    id: "spotify",
    name: "Spotify",
    url: "https://open.spotify.com",
    icon: Disc,
  },
  {
    id: "vk",
    name: "VK Музыка",
    url: "https://vk.com/audio",
    icon: MessageCircle,
  },
];

const CHROME_USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36";

const COSMETIC_AD_BLOCK_CSS = `
  iframe[src*="googleads"],
  div[id*="ad-unit"],
  div[class*="advertising"],
  ins.adsbygoogle { display: none !important; height: 0 !important; width: 0 !important; }

  .d-main-layout__column_right,
  aside.d-main-layout__column_right,
  .deco-ads-wrapper,
  .bar-below-ads,
  [class*="Ad-module"],
  [class*="Ads-module"],
  .d-main-layout__column_right_is-hidden {
    display: none !important;
    width: 0 !important;
    height: 0 !important;
    margin: 0 !important;
    padding: 0 !important;
    visibility: hidden !important;
    position: absolute !important;
    pointer-events: none !important;
  }

  .d-main-layout__main {
    margin-right: 0 !important;
    width: 100% !important;
    max-width: 100% !important;
    flex: 1 1 auto !important;
  }

  .d-main-layout__column_center {
    width: 100% !important;
    max-width: 100% !important;
  }

  .page-root .page-root__main,
  .centerblock-wrapper,
  .page-index__main,
  .page-artist__main,
  .page-playlist__main {
    max-width: none !important;
    margin-right: 0 !important;
    padding-right: 30px !important;
    width: 100% !important;
  }

  .d-track_ads, .ads-block { display: none !important; }
`;

const App: React.FC = () => {
  const { theme, snowflakesEnabled } = useTheme();
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeId, setActiveId] = useState("youtube");
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const { theme, snowflakesEnabled, accentColor, customColor } = useTheme();
  const currentTheme = themes[theme];
  const webviewRefs = useRef<{ [key: string]: any }>({});

  useEffect(() => {
    const applyInjects = (id: string) => {
      const wv = webviewRefs.current[id];
      if (!wv) return;

      const onDomReady = () => {
        wv.insertCSS(COSMETIC_AD_BLOCK_CSS);

        if (id === "yandex") {
          wv.executeJavaScript(`
            (function() {
              const cleanYandex = () => {
                const targets = [
                  '.d-main-layout__column_right',
                  '.deco-ads-wrapper',
                  '.bar-below-ads',
                  'aside.d-main-layout__column_right'
                ];

                targets.forEach(sel => {
                  const el = document.querySelector(sel);
                  if (el) el.remove();
                });

                const main = document.querySelector('.d-main-layout__main');
                if (main) {
                  main.style.setProperty('margin-right', '0', 'important');
                  main.style.setProperty('width', '100%', 'important');
                  main.style.setProperty('max-width', '100%', 'important');
                }
              };

              const observer = new MutationObserver(cleanYandex);
              observer.observe(document.body, { childList: true, subtree: true });

              cleanYandex();
              setTimeout(cleanYandex, 2000);
              setTimeout(cleanYandex, 5000);
            })();
          `);
        }

        wv.executeJavaScript(`
          (function() {
            const resume = () => {
              const AudioCtx = window.AudioContext || window.webkitAudioContext;
              if (AudioCtx) {
                const ctx = new AudioCtx();
                if (ctx.state === 'suspended') ctx.resume();
              }
            };
            document.body.click();
            resume();
          })();
        `);
      };

      wv.addEventListener("dom-ready", onDomReady);
      return () => wv.removeEventListener("dom-ready", onDomReady);
    };

    SERVICES.forEach((s) => applyInjects(s.id));
  }, []);

  return (
    <div
      className="relative flex h-screen w-screen overflow-hidden select-none font-sans transition-colors duration-300"
      style={{ backgroundColor: currentTheme.bg, color: currentTheme.text }}
    >
      <Snowflakes enabled={snowflakesEnabled} />

      <aside
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
        className="absolute left-0 top-0 h-full z-50 border-r transition-[width] duration-300 ease-in-out flex flex-col"
        style={{
          width: isExpanded ? "260px" : "80px",
          backgroundColor: currentTheme.sidebar,
          borderColor: currentTheme.border,
          boxShadow: isExpanded ? "10px 0 30px rgba(0,0,0,0.2)" : "none",
        }}
      >
        <div className="h-[80px] flex items-center px-5 shrink-0 overflow-hidden">
          <div className="flex items-center gap-4">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 overflow-hidden"
              style={{ backgroundColor: currentTheme.logoBg }}
            >
              <img
                src={logo}
                alt="Logo"
                className="w-full h-full object-contain"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src =
                    "https://img.icons8.com/fluency/48/music.png";
                }}
              />
            </div>
            <span
              className={`text-xl font-bold tracking-tight transition-opacity duration-300 whitespace-nowrap ${
                isExpanded ? "opacity-100" : "opacity-0"
              }`}
            >
              Melomash
            </span>
          </div>
        </div>

        <nav className="flex-1 px-3 mt-4 space-y-2">
          {SERVICES.map((s) => (
            <button
              key={s.id}
              onClick={() => setActiveId(s.id)}
              className="w-full flex items-center p-3 rounded-xl transition-all duration-200 group"
              style={{
                backgroundColor:
                  activeId === s.id ? currentTheme.active : "transparent",
              }}
            >
              <s.icon
                className={`${getAccentColorClass(accentColor, theme)} shrink-0 ${activeId === s.id ? "scale-110" : ""}`}
                size={24}
              />
              <span
                className={`ml-4 font-medium truncate transition-opacity duration-300 ${
                  isExpanded ? "opacity-100" : "opacity-0"
                }`}
              >
                {s.name}
              </span>
            </button>
          ))}
        </nav>

        <div
          className="p-4 border-t"
          style={{ borderColor: currentTheme.border }}
        >
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="w-full flex items-center p-3 rounded-xl transition-all hover:opacity-80"
            style={{ backgroundColor: currentTheme.hover }}
          >
            <Settings size={24} style={{ color: currentTheme.textSecondary }} />
            <span
              className={`ml-4 font-medium transition-opacity duration-300 ${
                isExpanded ? "opacity-100" : "opacity-0"
              }`}
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
            <webview
              ref={(el) => {
                if (el) webviewRefs.current[s.id] = el;
              }}
              src={s.url}
              partition="persist:music_session"
              className="w-full h-full"
              style={{ width: "100%", height: "100%", border: "none" }}
              useragent={CHROME_USER_AGENT}
              allowpopups={true}
              // @ts-ignore
              webpreferences="autoplayPolicy=no-user-gesture-required, contextIsolation=true, webSecurity=false, plugins=true"
            />
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
