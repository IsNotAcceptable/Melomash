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

const App: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeId, setActiveId] = useState("youtube");
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const { theme, snowflakesEnabled, accentColor } = useTheme();
  const currentTheme = themes[theme];

  const webviewRefs = useRef<{ [key: string]: any }>({});

  useEffect(() => {
    const currentWebview = webviewRefs.current[activeId];
    if (currentWebview) {
      const handleAudioActivation = () => {
        try {
          if (currentWebview.isAudioMuted()) {
            currentWebview.setAudioMuted(false);
          }
        } catch (e) {}

        currentWebview.executeJavaScript(`
          (function() {
            const resume = () => {
              const AudioCtx = window.AudioContext || window.webkitAudioContext;
              if (AudioCtx) {
                const ctx = new AudioCtx();
                if (ctx.state === 'suspended') ctx.resume();
              }
            };

            document.body.click();
            const spaceEvent = new KeyboardEvent('keydown', {
              key: ' ', code: 'Space', keyCode: 32, which: 32, bubbles: true
            });
            document.dispatchEvent(spaceEvent);

            resume();
            console.log('Audio Context resumed');
          })();
        `);

        currentWebview.focus();
      };

      currentWebview.addEventListener("dom-ready", handleAudioActivation);
      const timeout = setTimeout(handleAudioActivation, 2000);

      return () => {
        currentWebview.removeEventListener("dom-ready", handleAudioActivation);
        clearTimeout(timeout);
      };
    }
  }, [activeId]);
  
  return (
    <div
      className="relative flex h-screen w-screen overflow-hidden select-none font-sans"
      style={{ backgroundColor: currentTheme.bg, color: currentTheme.text }}
    >
      <aside
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
        className={`
          absolute left-0 top-0 h-full z-50 flex flex-col transition-[width] duration-300 ease-in-out
          ${isExpanded ? "w-[260px] shadow-[20px_0_50px_rgba(0,0,0,0.8)]" : "w-20"}
        `}
        style={{
          backgroundColor: currentTheme.sidebar,
          borderRight: `1px solid ${currentTheme.border}`
        }}
      >
        <div className="h-[80px] flex items-center px-6 shrink-0 overflow-hidden">
          <div className="flex items-center gap-3 font-bold">
            <div
              className="w-10 h-10 flex items-center justify-center shrink-0 rounded-lg overflow-hidden"
              style={{ backgroundColor: currentTheme.logoBg }}
            >
              <img
                src={logo}
                alt="Logo"
                className="w-full h-full object-contain"
                onError={(e) => {
                  const target = e.currentTarget;
                  target.style.display = "none";
                  const parent = target.parentElement;
                  if (parent && !parent.querySelector(".fallback")) {
                    const el = document.createElement("div");
                    el.className =
                      "fallback w-full h-full bg-indigo-600 flex items-center justify-center text-[10px] text-white";
                    el.innerText = "MLM";
                    parent.appendChild(el);
                  }
                }}
              />
            </div>
            {isExpanded && (
              <span className="text-xl tracking-tighter opacity-100 transition-opacity duration-300 whitespace-nowrap">
                Melomash
              </span>
            )}
          </div>
        </div>

        <nav className="flex-1 px-3 mt-4 space-y-2">
          {SERVICES.map((s) => (
            <button
              key={s.id}
              onClick={() => setActiveId(s.id)}
              className={`
                w-full flex items-center p-3 rounded-xl transition-all duration-200
              `}
              style={{
                backgroundColor: activeId === s.id ? currentTheme.active : 'transparent',
                color: activeId === s.id ? currentTheme.text : currentTheme.textSecondary,
              }}
              onMouseEnter={(e) => {
                if (activeId !== s.id) {
                  e.currentTarget.style.backgroundColor = currentTheme.hover;
                }
              }}
              onMouseLeave={(e) => {
                if (activeId !== s.id) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }
              }}
            >
              <s.icon
                className={`${getAccentColorClass(accentColor, theme)} shrink-0 ${activeId === s.id ? "scale-110" : ""}`}
                size={24}
              />
              {isExpanded && (
                <span className="ml-4 font-medium truncate animate-in fade-in duration-300">
                  {s.name}
                </span>
              )}
            </button>
          ))}
        </nav>

        <div
          className="p-4 mt-auto"
          style={{ borderTop: `1px solid ${currentTheme.border}` }}
        >
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="w-full flex items-center p-3 rounded-xl transition-all"
            style={{
              color: currentTheme.textSecondary,
              backgroundColor: 'transparent'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = currentTheme.hover;
              e.currentTarget.style.color = currentTheme.text;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = currentTheme.textSecondary;
            }}
          >
            <Settings size={24} />
            {isExpanded && (
              <span className="ml-4 font-medium truncate">Настройки</span>
            )}
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

      <Snowflakes enabled={snowflakesEnabled} />
    </div>
  );
};

export default App;
