import React, { useState, useEffect, useRef } from "react";
import { Settings, ChevronRight, Sparkle, ArrowRight, ArrowLeft, RotateCw } from "lucide-react";
import { useTheme, themes, getAccentColorValue } from "./context/ThemeContext";
import { useServices } from "./context/ServicesContext";
import SettingsModal from "./components/SettingsModal";
import Snowflakes from "./components/Snowflakes";
import Starfield from "./components/Starfield";
import { siVk, siSpotify, siYoutubemusic, siSoundcloud, siApplemusic } from "simple-icons";

//@ts-ignore
import logo from "./assets/icon.png";

type Service = {
  id: string;
  name: string;
  url?: string;
  icon: any;
  iconType: "simple" | "lucide";
  type: "web";
};

const SimpleIcon = ({
  icon,
  size = 24,
  color,
}: {
  icon: any;
  size?: number;
  color?: string;
}) => (
  <div
    style={{
      width: `${size}px`,
      height: `${size}px`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}
    dangerouslySetInnerHTML={{
      __html: icon.svg.replace(
        "<svg",
        `<svg fill="${color || "currentColor"}"`,
      ),
    }}
  />
);

const ALL_SERVICES_DATA: Service[] = [
  {
    id: "youtube",
    name: "YouTube Music",
    url: "https://music.youtube.com",
    icon: siYoutubemusic,
    iconType: "simple",
    type: "web",
  },
  {
    id: "yandex",
    name: "Яндекс Музыка",
    url: "https://music.yandex.ru",
    icon: Sparkle,
    iconType: "lucide",
    type: "web",
  },
  {
    id: "spotify",
    name: "Spotify",
    url: "https://open.spotify.com",
    icon: siSpotify,
    iconType: "simple",
    type: "web",
  },
  {
    id: "vk",
    name: "VK Музыка",
    url: "https://vkmusic.in",
    icon: siVk,
    iconType: "simple",
    type: "web",
  },
  {
    id: "soundcloud",
    name: "SoundCloud",
    url: "https://soundcloud.com",
    icon: siSoundcloud,
    iconType: "simple",
    type: "web",
  },
  {
    id: "applemusic",
    name: "Apple Music",
    url: "https://music.apple.com",
    icon: siApplemusic,
    iconType: "simple",
    type: "web",
  },
];

const App: React.FC = () => {
  const { theme, snowflakesEnabled, starfieldEnabled, starfieldCount, starfieldSpeed, accentColor } = useTheme();
  const { enabledServices } = useServices();

  const currentTheme = themes[theme];
  const accentHex = getAccentColorValue(accentColor, theme);

  const visibleServices = ALL_SERVICES_DATA.filter((s) =>
    enabledServices.includes(s.id),
  );

  const [activeId, setActiveId] = useState<string>(
    () => visibleServices[0]?.id || "youtube",
  );
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const webviewRefs = useRef<Record<string, any>>({});


  useEffect(() => {
    if (!enabledServices.includes(activeId) && visibleServices.length > 0) {
      setActiveId(visibleServices[0].id);
    }
  }, [enabledServices, activeId, visibleServices]);


  // Обработка загрузки webview и инъекция CSS
  useEffect(() => {
    const handleWebviewLoad = (webview: any, serviceId: string) => {
      if (!webview) return;

      const injectCSS = (css: string) => {
        try {
          if (webview.insertCSS) {
            webview.insertCSS(css);
          } else if (webview.executeJavaScript) {
            webview.executeJavaScript(`
              (function() {
                const style = document.createElement('style');
                style.textContent = \`${css}\`;
                style.setAttribute('data-melomash-block', 'true');
                document.head.appendChild(style);
              })();
            `).catch(() => {});
          }
        } catch (error) {
          console.error('CSS injection error:', error);
        }
      };


      // Специфические правила для разных сервисов
      if (serviceId === 'vk') {
        // Убираем навязчивое всплывающее окно VK Музыки
        injectCSS(`
          html body div.ee02ee8c1b_popup {
            display: none !important;
            visibility: hidden !important;
            opacity: 0 !important;
            pointer-events: none !important;
          }
        `);

      }

      if (serviceId === 'yandex') {
        // Убираем оставшийся прямоугольник под рекламу на Яндекс Музыке
        injectCSS(`
          html body.ym-font-music.ym-dark-theme div.WithTopBanner_root__P__x3 div.WithTopBanner_content__6Vh7a div.CommonLayout_root__WC_W1.DefaultLayout_root__7J0wo div.Content_rootOld__g85_m.CommonLayout_content__zy_Ja section.SideAdvertBanner_root__hT1jJ.Content_sideBanner__Na07D {
            display: none !important;
            visibility: hidden !important;
            opacity: 0 !important;
            pointer-events: none !important;
          }
        `);
      }

      // Общие правила для всех сервисов
      injectCSS(`
        /* Дополнительная блокировка рекламы */
        .ad, .ads, .advertisement, .banner {
          display: none !important;
        }
      `);
    };

    // Добавляем обработчики для всех webview
    Object.entries(webviewRefs.current).forEach(([serviceId, webview]) => {
      if (webview && !webview._melomashHandled) {
        webview._melomashHandled = true;

        // Обработчик dom-ready
        webview.addEventListener('dom-ready', () => {
          handleWebviewLoad(webview, serviceId);
        });

        // Если страница уже загружена
        if (webview.getURL && webview.getURL()) {
          handleWebviewLoad(webview, serviceId);
        }
      }
    });
  }, [enabledServices]); // Зависимость от enabledServices чтобы обновлять при изменении



  return (
    <div
      className="flex h-screen w-full overflow-hidden font-sans select-none"
      style={{ backgroundColor: currentTheme.bg, color: currentTheme.text }}
    >
      <Snowflakes enabled={snowflakesEnabled} />
      <Starfield
        enabled={starfieldEnabled}
        particleCount={starfieldCount}
        animationSpeed={starfieldSpeed}
      />

      <aside
        className="group fixed left-0 top-0 h-full z-[60] w-20 hover:w-64 transition-all duration-300 ease-in-out border-r flex flex-col items-center py-6 shadow-2xl overflow-hidden"
        style={{
          backgroundColor: currentTheme.sidebar,
          borderColor: currentTheme.border,
        }}
      >
        <div
          className="mb-10 p-3 rounded-2xl shadow-lg shrink-0 transition-all duration-300 group-hover:w-[calc(100%-2rem)] flex items-center justify-center group-hover:justify-start group-hover:px-4"
          style={{ backgroundColor: currentTheme.logoBg }}
        >
          <img
            src={logo}
            alt="Logo"
            className="w-8 h-8 object-contain shrink-0"
          />
          <span className="ml-4 font-bold text-lg tracking-tight truncate hidden group-hover:block transition-all">
            Melomash
          </span>
        </div>

        <nav className="flex-1 w-full flex flex-col gap-2 px-3 overflow-y-auto no-scrollbar">
          {visibleServices.map((s) => {
            const isActive = activeId === s.id;
            return (
              <button
                key={s.id}
                onClick={() => setActiveId(s.id)}
                className={`w-full flex items-center rounded-2xl transition-all duration-200 group/btn relative min-h-[56px] ${
                  isActive
                    ? ""
                    : "hover:bg-white/5 opacity-50 hover:opacity-100"
                }`}
                style={{
                  backgroundColor: isActive
                    ? currentTheme.active
                    : "transparent",
                }}
              >
                {isActive && (
                  <div
                    className="absolute left-0 top-3 bottom-3 w-1 rounded-r-full"
                    style={{ backgroundColor: accentHex }}
                  />
                )}

                <div className="w-14 flex items-center justify-center shrink-0">
                  {s.iconType === "simple" ? (
                    <SimpleIcon
                      icon={s.icon}
                      size={20}
                      color={isActive ? accentHex : currentTheme.text}
                    />
                  ) : (
                    <s.icon
                      size={20}
                      style={{
                        color: isActive ? accentHex : currentTheme.text,
                      }}
                    />
                  )}
                </div>

                <span
                  className={`text-sm font-medium truncate opacity-0 group-hover:opacity-100 transition-opacity duration-200 ml-1 ${isActive ? "" : "opacity-80"}`}
                  style={isActive ? { color: currentTheme.text } : undefined}
                >
                  {s.name}
                </span>

                {isActive && (
                  <ChevronRight
                    size={14}
                    className="ml-auto mr-4 opacity-40 hidden group-hover:block"
                  />
                )}
              </button>
            );
          })}
        </nav>

        <div className="w-full px-3 mt-auto pt-4">
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="w-full flex items-center min-h-[56px] rounded-2xl opacity-40 hover:opacity-100 hover:bg-white/5 transition-all"
          >
            <div className="w-14 flex items-center justify-center shrink-0">
              <Settings size={20} />
            </div>
            <span className="text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-200 ml-1">
              Настройки
            </span>
          </button>
        </div>
      </aside>

      <main
        className="flex-1 ml-20 h-full relative flex flex-col"
        style={{ backgroundColor: currentTheme.main }}
      >
        {ALL_SERVICES_DATA.find((s) => s.id === activeId)?.type === "web" && (
          <div
            className="nav-panel"
            style={{
              width: "100%",
              background: "rgba(20,20,20,0.97)",
              borderBottom: "1px solid #232",
              padding: "5px 16px",
              position: "relative",
              zIndex: 100
            }}
          >
            <div className="nav-panel-buttons" style={{
              display: "flex",
              gap: "8px",
              alignItems: "center",
              transition: "opacity 0.3s ease-in-out"
            }}>
              <button
                onClick={() => {
                  const wv = webviewRefs.current[activeId];
                  if (wv && wv.canGoBack && wv.canGoBack()) wv.goBack();
                }}
                title="Назад"
                style={{
                  width: 28, height: 28, borderRadius: 6, background: "#232323", border: "none",
                  display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", opacity: 0.75
                }}
              >
                <ArrowLeft size={16} />
              </button>
              <button
                onClick={() => {
                  const wv = webviewRefs.current[activeId];
                  if (wv && wv.canGoForward && wv.canGoForward()) wv.goForward();
                }}
                title="Вперед"
                style={{
                  width: 28, height: 28, borderRadius: 6, background: "#232323", border: "none",
                  display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", opacity: 0.75
                }}
              >
                <ArrowRight size={16} />
              </button>
              <button
                onClick={() => {
                  const wv = webviewRefs.current[activeId];
                  if (wv) wv.reload();
                }}
                title="Обновить"
                style={{
                  width: 28, height: 28, borderRadius: 6, background: "#232323", border: "none",
                  display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", opacity: 0.75
                }}
              >
                <RotateCw size={16} />
              </button>
            </div>
          </div>
        )}

        <div style={{ flex: 1, position: "relative" }}>
          {ALL_SERVICES_DATA.map((s) => (
          <div
            key={s.id}
            className={`absolute inset-0 transition-opacity duration-500 ${
              activeId === s.id
                ? "opacity-100 z-10"
                : "opacity-0 z-0 pointer-events-none"
            }`}
          >
            {enabledServices.includes(s.id) && (
                <webview
                  ref={(el) => {
                    if (el) webviewRefs.current[s.id] = el;
                  }}
                  src={s.url}
                  partition="persist:music_session"
                  className="w-full h-full"
                  allowpopups={true}
                  // @ts-ignore
                  webpreferences="autoplayPolicy=no-user-gesture-required, contextIsolation=false"
                />
              )}
          </div>
        ))}
        </div>
      </main>

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />

      <style>{`
        webview {
          display: flex;
          width: 100%;
          height: 100%;
          background: ${currentTheme.main};
        }
        webview:focus { outline: none; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        aside:hover ~ main .nav-panel {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default App;
