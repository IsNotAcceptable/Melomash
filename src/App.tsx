import React, { useState } from "react";
import {
  Youtube,
  Music,
  Zap,
  Disc,
  MessageCircle,
  ChevronLeft,
  ChevronRight,
  Settings,
  Layout,
  Sun,
  Moon,
} from "lucide-react";
import { useTheme } from "./ThemeContext";
import Snow from "./Snow";

declare global {
  interface Window {
    melomashAPI: {
      switchService: (id: string) => void;
      toggleSidebar: (collapsed: boolean) => void;
      setTheme: (theme: string) => void;
    };
  }
}

const SERVICES = [
  {
    id: "youtube",
    name: "YouTube Music",
    icon: Youtube,
    color: "text-red-500",
    colorLight: "text-red-600",
  },
  {
    id: "yandex",
    name: "Yandex Music",
    icon: Music,
    color: "text-yellow-500",
    colorLight: "text-orange-600"
  },
  {
    id: "spotify",
    name: "Spotify",
    icon: Disc,
    color: "text-green-500",
    colorLight: "text-green-600"
  },
  {
    id: "vk",
    name: "VK Music",
    icon: MessageCircle,
    color: "text-blue-500",
    colorLight: "text-blue-600"
  },
];

const App: React.FC = () => {
  const [activeId, setActiveId] = useState("youtube");
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const { theme, toggleTheme, snowEnabled, toggleSnow } = useTheme();

  const handleSwitch = (id: string) => {
    console.log('🎵 Switching to service:', id);
    setActiveId(id);
    window.melomashAPI?.switchService(id);
  };

  const toggleSidebar = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    window.melomashAPI?.toggleSidebar(newState);
  };

  const handleOpenSettings = () => {
    setShowSettings(true);
  };

  const handleCloseSettings = () => {
    setShowSettings(false);
  };

  return (
    <>
      <Snow enabled={snowEnabled} />
      <div className="flex h-screen w-screen overflow-hidden" style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-secondary)' }}>
        <aside
          className={`
            flex flex-col h-full bg-[#181818] border-r border-white/5 shrink-0 z-50
            ${isCollapsed ? "w-20" : "w-[260px]"}
          `}
        >
          <div className="p-6 flex items-center h-[88px] shrink-0 overflow-hidden">
            {!isCollapsed && (
              <div className="flex items-center gap-2 font-bold text-xl text-white tracking-tight flex-1 truncate animate-in fade-in duration-200">
                <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center shrink-0">
                  <Zap size={18} className="text-white" />
                </div>
                <span className="truncate">Melomash</span>
              </div>
            )}
            <button
              onClick={toggleSidebar}
              className={`p-2 hover:bg-white/10 rounded-lg text-gray-400 transition-colors ${
                isCollapsed ? "mx-auto" : "ml-auto"
              }`}
            >
              {isCollapsed ? (
                <ChevronRight size={20} />
              ) : (
                <ChevronLeft size={20} />
              )}
            </button>
          </div>

          <nav className="flex-1 px-3 space-y-1 mt-4 overflow-y-auto custom-scrollbar">
            {SERVICES.map((service) => {
              const Icon = service.icon;
              const isActive = activeId === service.id;

              return (
                <button
                  key={service.id}
                  onClick={() => handleSwitch(service.id)}
                  className={`w-full flex items-center px-4 py-3 rounded-xl transition-colors group relative ${
                    isActive
                      ? "bg-white/10 text-white"
                      : "text-gray-400 hover:bg-white/5 hover:text-gray-200"
                  }`}
                >
                  <Icon
                    className={`${service.color} ${isActive ? "scale-110" : "group-hover:scale-110"} transition-transform shrink-0`}
                    size={24}
                  />
                  {!isCollapsed && (
                    <span className="ml-4 font-medium truncate animate-in fade-in duration-300">
                      {service.name}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          <div className="p-4 border-t border-white/5 shrink-0">
            <button
              onClick={() => setShowSettings(true)}
              className="w-full flex items-center px-4 py-3 text-gray-400 hover:text-white transition-colors rounded-xl hover:bg-white/5"
            >
              <Settings size={24} className="shrink-0" />
              {!isCollapsed && (
                <span className="ml-4 font-medium truncate animate-in fade-in">
                  Настройки
                </span>
              )}
            </button>
          </div>
        </aside>

        <main className="flex-1 bg-[#121212]" />

        {/* Модальное окно настроек */}
        {showSettings && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center"
            style={{
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              backdropFilter: 'blur(4px)',
            }}
            onClick={() => setShowSettings(false)}
          >
            <div
              className="relative max-w-md w-full mx-4 rounded-2xl p-6 shadow-2xl"
              style={{
                backgroundColor: 'var(--bg-secondary)',
                border: '1px solid var(--border-color)',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Заголовок */}
              <div className="flex items-center justify-between mb-6">
                <h2
                  className="text-xl font-bold"
                  style={{ color: 'var(--text-primary)' }}
                >
                  Настройки
                </h2>
                <button
                  onClick={() => setShowSettings(false)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  style={{
                    color: 'var(--text-muted)',
                  }}
                >
                  ✕
                </button>
              </div>

              {/* Настройки темы */}
              <div className="space-y-4">
                <div>
                  <h3
                    className="text-sm font-medium mb-3 uppercase tracking-wide"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    Внешний вид
                  </h3>

                  <div className="space-y-2">
                    <button
                      onClick={() => {
                        if (theme !== 'light') toggleTheme();
                      }}
                      className="w-full flex items-center justify-between p-4 rounded-xl transition-colors"
                      style={{
                        backgroundColor: theme === 'light' ? 'var(--bg-accent)' : 'transparent',
                        border: theme === 'light' ? '1px solid var(--border-color)' : 'none',
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <Sun size={20} style={{ color: 'var(--text-muted)' }} />
                        <span style={{ color: 'var(--text-primary)' }}>Светлая тема</span>
                      </div>
                      {theme === 'light' && (
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: 'var(--gradient-end)' }}
                        />
                      )}
                    </button>

                    <button
                      onClick={() => {
                        if (theme !== 'dark') toggleTheme();
                      }}
                      className="w-full flex items-center justify-between p-4 rounded-xl transition-colors"
                      style={{
                        backgroundColor: theme === 'dark' ? 'var(--bg-accent)' : 'transparent',
                        border: theme === 'dark' ? '1px solid var(--border-color)' : 'none',
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <Moon size={20} style={{ color: 'var(--text-muted)' }} />
                        <span style={{ color: 'var(--text-primary)' }}>Темная тема</span>
                      </div>
                      {theme === 'dark' && (
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: 'var(--gradient-end)' }}
                        />
                      )}
                    </button>
                  </div>

                  {/* Настройка снега */}
                  <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                    <button
                      onClick={toggleSnow}
                      className="w-full flex items-center justify-between p-4 rounded-xl transition-colors"
                      style={{
                        backgroundColor: snowEnabled ? 'var(--bg-accent)' : 'transparent',
                        border: snowEnabled ? '1px solid var(--border-color)' : 'none',
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <div className="text-lg">❄️</div>
                        <span style={{ color: 'var(--text-primary)' }}>Падающий снег</span>
                      </div>
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{
                          backgroundColor: snowEnabled ? 'var(--gradient-end)' : 'var(--text-muted)',
                          opacity: snowEnabled ? 1 : 0.5
                        }}
                      />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <style>{`
          .custom-scrollbar::-webkit-scrollbar {
            width: 4px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: transparent;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: rgba(255, 255, 255, 0.1);
            border-radius: 10px;
          }
        `}</style>
      </div>
    </>
  );
};

export default App;
