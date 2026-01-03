import React, { useState } from "react";
import {
  Youtube,
  Music,
  Disc,
  MessageCircle,
  ChevronLeft,
  ChevronRight,
  Settings,
  Layout,
} from "lucide-react";

declare global {
  interface Window {
    melomashAPI: {
      switchService: (id: string) => void;
      toggleSidebar: (collapsed: boolean) => void;
    };
  }
}

const SERVICES = [
  {
    id: "youtube",
    name: "YouTube Music",
    icon: Youtube,
    color: "text-red-500",
  },
  { id: "yandex", name: "Yandex Music", icon: Music, color: "text-yellow-500" },
  { id: "spotify", name: "Spotify", icon: Disc, color: "text-green-500" },
  { id: "vk", name: "VK Music", icon: MessageCircle, color: "text-blue-500" },
];

const App: React.FC = () => {
  const [activeId, setActiveId] = useState("youtube");
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleSwitch = (id: string) => {
    setActiveId(id);
    window.melomashAPI?.switchService(id);
  };

  const toggleSidebar = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    window.melomashAPI?.toggleSidebar(newState);
  };

  return (
    <div className="flex h-screen w-screen bg-[#121212] overflow-hidden text-slate-200">
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
                <Layout size={18} className="text-white" />
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
          <button className="w-full flex items-center px-4 py-3 text-gray-400 hover:text-white transition-colors rounded-xl hover:bg-white/5">
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
  );
};

export default App;
