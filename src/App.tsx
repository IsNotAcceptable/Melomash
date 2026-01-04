import React, { useState } from "react";
import { Youtube, Music, Disc, MessageCircle, Settings } from "lucide-react";

// @ts-ignore
import logo from "./assets/icon.png";

const SERVICES = [
  {
    id: "youtube",
    name: "YouTube Music",
    url: "https://music.youtube.com",
    icon: Youtube,
    color: "text-red-500",
  },
  {
    id: "yandex",
    name: "Яндекс Музыка",
    url: "https://music.yandex.ru",
    icon: Music,
    color: "text-yellow-400",
  },
  {
    id: "spotify",
    name: "Spotify",
    url: "https://open.spotify.com",
    icon: Disc,
    color: "text-green-500",
  },
  {
    id: "vk",
    name: "VK Музыка",
    url: "https://vk.com/audio",
    icon: MessageCircle,
    color: "text-blue-400",
  },
];

const CHROME_USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36";

const App: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeId, setActiveId] = useState("youtube");

  return (
    <div className="relative flex h-screen w-screen bg-[#181818] text-white overflow-hidden select-none font-sans">
      <aside
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
        className={`
          absolute left-0 top-0 h-full z-50 bg-[#181818] border-r border-white/5
          flex flex-col transition-[width] duration-300 ease-in-out
          ${isExpanded ? "w-[260px] shadow-[20px_0_50px_rgba(0,0,0,0.8)]" : "w-20"}
        `}
      >
        <div className="h-[80px] flex items-center px-6 shrink-0 overflow-hidden">
          <div className="flex items-center gap-3 font-bold">
            <div className="w-10 h-10 flex items-center justify-center shrink-0">
              {logo ? (
                <img
                  src={logo}
                  alt="M"
                  className="w-full h-full object-contain pointer-events-none rounded-lg"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                    const parent = e.currentTarget.parentElement;
                    if (parent) {
                      parent.innerHTML =
                        '<div class="w-full h-full bg-indigo-600 rounded-lg flex items-center justify-center text-xs text-white">M</div>';
                    }
                  }}
                />
              ) : (
                <div className="w-full h-full bg-indigo-600 rounded-lg flex items-center justify-center text-xs text-white">
                  M
                </div>
              )}
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
                ${activeId === s.id ? "bg-white/10 text-white shadow-sm" : "text-gray-400 hover:bg-white/5 hover:text-gray-200"}
              `}
            >
              <s.icon
                className={`${s.color} shrink-0 ${activeId === s.id ? "scale-110" : ""}`}
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

        <div className="p-4 border-t border-white/5 mt-auto">
          <button className="w-full flex items-center p-3 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-all">
            <Settings size={24} />
            {isExpanded && (
              <span className="ml-4 font-medium truncate">Настройки</span>
            )}
          </button>
        </div>
      </aside>

      <main className="flex-1 ml-20 h-full relative bg-black">
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
              src={s.url}
              partition="persist:fresh_start"
              className="w-full h-full"
              style={{ width: "100%", height: "100%", border: "none" }}
              useragent={CHROME_USER_AGENT}
              allowpopups={true}
            />
          </div>
        ))}
      </main>

      <style>{`
        webview { display: flex; width: 100%; height: 100%; background: #000; }
        webview:focus { outline: none; }
        .fade-in { animation: fadeIn 0.2s ease-out; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
      `}</style>
    </div>
  );
};

export default App;
