import React, { useState } from "react";
import {
  X,
  Sun,
  Moon,
  Eye,
  Settings as SettingsIcon,
  LayoutGrid,
  Check,
  Pipette,
  HardDrive,
  Sparkle,
} from "lucide-react";
import { siVk, siSpotify, siYoutubemusic, siSoundcloud, siApplemusic } from "simple-icons";
import {
  useTheme,
  themes,
  getAccentColorValue,
} from "./../context/ThemeContext";
import { useServices, ALL_SERVICE_IDS } from "./../context/ServicesContext";

// Компонент для simple-icons
const SimpleIcon = ({
  icon,
  size = 24,
  className = "",
  color
}: {
  icon: any;
  size?: number;
  className?: string;
  color?: string;
}) => (
  <div
    className={`${className}`}
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

type AccentColor =
  | "blue"
  | "green"
  | "purple"
  | "red"
  | "orange"
  | "pink"
  | "yellow"
  | "sky"
  | "auto";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const {
    theme,
    setTheme,
    snowflakesEnabled,
    setSnowflakesEnabled,
    accentColor,
    setAccentColor,
  } = useTheme();

  const { enabledServices, toggleService } = useServices();

  const [activeTab, setActiveTab] = useState<"appearance" | "services">(
    "appearance",
  );

  if (!isOpen) return null;

  const currentTheme = themes[theme];
  const accentHex = getAccentColorValue(accentColor, theme);

  const accentOptions: { id: AccentColor; color: string; label: string }[] = [
    {
      id: "auto",
      color: theme === "dark" ? "#FFFFFF" : "#000000",
      label: "Авто",
    },
    { id: "blue", color: "#3B82F6", label: "Синий" },
    { id: "sky", color: "#0EA5E9", label: "Голубой" },
    { id: "purple", color: "#A855F7", label: "Фиолет" },
    { id: "pink", color: "#EC4899", label: "Розовый" },
    { id: "red", color: "#EF4444", label: "Красный" },
    { id: "orange", color: "#F97316", label: "Оранж" },
    { id: "yellow", color: "#EAB308", label: "Желтый" },
    { id: "green", color: "#22C55E", label: "Зеленый" },
  ];

  const serviceLabels: Record<string, string> = {
    youtube: "YouTube Music",
    yandex: "Яндекс Музыка",
    spotify: "Spotify",
    vk: "VK Музыка",
    soundcloud: "SoundCloud",
    applemusic: "Apple Music",
    local: "Локальные файлы",
  };

  const serviceIcons: Record<string, { icon: any; iconType: "simple" | "lucide" }> = {
    youtube: { icon: siYoutubemusic, iconType: "simple" },
    yandex: { icon: Sparkle, iconType: "lucide" },
    spotify: { icon: siSpotify, iconType: "simple" },
    vk: { icon: siVk, iconType: "simple" },
    soundcloud: { icon: siSoundcloud, iconType: "simple" },
    applemusic: { icon: siApplemusic, iconType: "simple" },
    local: { icon: HardDrive, iconType: "lucide" },
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-[100]">
      <div
        className="relative max-w-xl w-full mx-4 rounded-3xl border shadow-2xl overflow-hidden flex flex-col transition-all duration-300"
        style={{
          backgroundColor: currentTheme.sidebar,
          borderColor: currentTheme.border,
          color: currentTheme.text,
          maxHeight: "85vh",
        }}
      >
        <div
          className="p-6 border-b flex items-center justify-between"
          style={{ borderColor: currentTheme.border }}
        >
          <div className="flex items-center gap-3">
            <div
              className="p-2.5 rounded-2xl"
              style={{ backgroundColor: currentTheme.logoBg }}
            >
              <SettingsIcon size={22} style={{ color: accentHex }} />
            </div>
            <h2 className="text-xl font-bold tracking-tight">Настройки</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-full transition-colors active:scale-90"
          >
            <X size={22} />
          </button>
        </div>

        <div
          className="flex px-6 pt-2 gap-8 border-b"
          style={{ borderColor: currentTheme.border }}
        >
          {[
            { id: "appearance", label: "Внешний вид" },
            { id: "services", label: "Сервисы" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`pb-4 text-sm font-semibold transition-all relative ${activeTab === tab.id ? "" : "opacity-40 hover:opacity-100"}`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <div
                  className="absolute bottom-0 left-0 right-0 h-1 rounded-t-full"
                  style={{ backgroundColor: accentHex }}
                />
              )}
            </button>
          ))}
        </div>

        <div className="p-8 overflow-y-auto space-y-8 flex-1 custom-scrollbar">
          {activeTab === "appearance" ? (
            <>
              <section className="space-y-4">
                <div className="flex items-center gap-2 opacity-60">
                  <Eye size={14} />
                  <h3 className="text-xs uppercase tracking-[0.15em] font-bold">
                    Тема оформления
                  </h3>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => setTheme("dark")}
                    className={`p-4 rounded-2xl border-2 flex items-center gap-4 transition-all ${theme === "dark" ? "bg-white/5" : "opacity-40 hover:opacity-70"}`}
                    style={{
                      borderColor: theme === "dark" ? accentHex : "transparent",
                    }}
                  >
                    <div className="p-2.5 bg-black rounded-xl text-white shadow-inner">
                      <Moon size={20} />
                    </div>
                    <span className="font-semibold text-sm">Темная</span>
                  </button>
                  <button
                    onClick={() => setTheme("light")}
                    className={`p-4 rounded-2xl border-2 flex items-center gap-4 transition-all ${theme === "light" ? "bg-black/5" : "opacity-40 hover:opacity-70"}`}
                    style={{
                      borderColor:
                        theme === "light" ? accentHex : "transparent",
                    }}
                  >
                    <div className="p-2.5 bg-white text-black rounded-xl shadow-md">
                      <Sun size={20} />
                    </div>
                    <span className="font-semibold text-sm">Светлая</span>
                  </button>
                </div>
              </section>

              <section className="space-y-4">
                <div className="flex items-center gap-2 opacity-60">
                  <Pipette size={14} />
                  <h3 className="text-xs uppercase tracking-[0.15em] font-bold">
                    Акцентный цвет
                  </h3>
                </div>
                <div className="flex flex-wrap gap-3">
                  {accentOptions.map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => setAccentColor(opt.id)}
                      className="group relative flex flex-col items-center gap-2"
                      title={opt.label}
                    >
                      <div
                        className={`w-10 h-10 rounded-full transition-all duration-300 border-4 ${accentColor === opt.id ? "scale-110 shadow-lg" : "scale-90 opacity-80 hover:scale-100 hover:opacity-100"}`}
                        style={{
                          backgroundColor: opt.color,
                          borderColor:
                            accentColor === opt.id
                              ? "rgba(255,255,255,0.2)"
                              : "transparent",
                        }}
                      >
                        {accentColor === opt.id && (
                          <div className="w-full h-full flex items-center justify-center">
                            <Check
                              size={16}
                              className={
                                opt.id === "yellow" ||
                                (opt.id === "auto" && theme === "light")
                                  ? "text-black"
                                  : "text-white"
                              }
                              strokeWidth={4}
                            />
                          </div>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </section>

              <section className="space-y-4 pt-2">
                <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <LayoutGrid size={14} className="opacity-60" />
                      <h3 className="font-bold text-sm">Снежинки</h3>
                    </div>
                    <p className="text-xs opacity-50">
                      Анимированные частицы на фоне приложения
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={snowflakesEnabled}
                      onChange={(e) => setSnowflakesEnabled(e.target.checked)}
                    />
                    <div
                      className="w-11 h-6 bg-white/10 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"
                      style={{
                        backgroundColor: snowflakesEnabled ? accentHex : "",
                      }}
                    ></div>
                  </label>
                </div>
              </section>
            </>
          ) : (
            <section className="space-y-5">
              <div className="flex items-center gap-2 opacity-60">
                <LayoutGrid size={14} />
                <h3 className="text-xs uppercase tracking-[0.15em] font-bold">
                  Сервисы в сайдбаре
                </h3>
              </div>
              <div className="grid gap-4">
                {ALL_SERVICE_IDS.map((id) => (
                  <div
                    key={id}
                    className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-white/10">
                          {serviceIcons[id].iconType === "simple" ? (
                            <SimpleIcon
                              icon={serviceIcons[id].icon}
                              size={16}
                              color={currentTheme.text}
                            />
                          ) : (
                            React.createElement(serviceIcons[id].icon, {
                              size: 16,
                              className: "opacity-80",
                              style: { color: currentTheme.text }
                            })
                          )}
                        </div>
                        <h3 className="font-bold text-sm">{serviceLabels[id]}</h3>
                      </div>
                      <p className="text-xs opacity-50">
                        {id === "local" ? "Музыка с вашего устройства" :
                         id === "youtube" ? "Онлайн музыкальная платформа" :
                         id === "spotify" ? "Популярный стриминговый сервис" :
                         id === "yandex" ? "Российская музыкальная платформа" :
                         id === "vk" ? "Социальная сеть с музыкой" :
                         id === "soundcloud" ? "Онлайн музыкальная платформа" :
                         id === "applemusic" ? "Премиум музыкальный сервис" :
                         "Онлайн музыкальная платформа"}
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={enabledServices.includes(id)}
                        onChange={() => toggleService(id)}
                      />
                      <div
                        className="w-11 h-6 bg-white/10 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"
                        style={{
                          backgroundColor: enabledServices.includes(id) ? accentHex : "",
                        }}
                      ></div>
                    </label>
                  </div>
                ))}
              </div>
              <div className="p-4 bg-white/5 rounded-2xl text-center">
                <p className="text-[11px] opacity-40 leading-relaxed">
                  Отключите сервисы, которые вы не используете. Минимум один
                  сервис всегда должен оставаться активным.
                </p>
              </div>
            </section>
          )}
        </div>

        <div
          className="p-5 border-t text-center"
          style={{ borderColor: currentTheme.border }}
        >
          <p className="text-[10px] opacity-30 uppercase tracking-[0.3em] font-medium">
            Melomash Hub v0.3
          </p>
        </div>

        <style>{`
          .custom-scrollbar::-webkit-scrollbar { width: 5px; }
          .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: ${currentTheme.border};
            border-radius: 10px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: ${accentHex}44;
          }
        `}</style>
      </div>
    </div>
  );
};

export default SettingsModal;
