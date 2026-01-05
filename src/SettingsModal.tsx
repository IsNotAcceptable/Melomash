import React, { useState } from 'react';
import { X, Sun, Moon, Eye, Settings as SettingsIcon } from 'lucide-react';
import { useTheme, themes, getAccentColorValue } from './ThemeContext';


type AccentColor = 'blue' | 'green' | 'purple' | 'red' | 'orange' | 'pink' | 'yellow' | 'sky' | 'auto';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const { theme, setTheme, snowflakesEnabled, setSnowflakesEnabled, accentColor, setAccentColor } = useTheme();
  const [activeTab, setActiveTab] = useState<'appearance' | 'behavior'>('appearance');

  if (!isOpen) return null;

  const currentTheme = themes[theme];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div
        className="relative max-w-xl w-full mx-4 rounded-2xl border shadow-2xl overflow-hidden"
        style={{
          backgroundColor: currentTheme.sidebar,
          borderColor: currentTheme.border,
          color: currentTheme.text,
          maxHeight: '95vh'
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b" style={{ borderColor: currentTheme.border }}>
          <h2 className="text-xl font-semibold">Настройки</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg transition-colors hover:opacity-70"
            style={{ color: currentTheme.textSecondary }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="px-6 py-4 border-b" style={{ borderColor: currentTheme.border }}>
          <div className="flex gap-1">
            <button
              onClick={() => setActiveTab('appearance')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl transition-all duration-200 ${
                activeTab === 'appearance' ? 'bg-opacity-100' : 'hover:bg-opacity-50'
              }`}
              style={{
                backgroundColor: activeTab === 'appearance' ? currentTheme.active : 'transparent',
                color: currentTheme.text
              }}
            >
              <Eye size={18} />
              <span className="font-medium">Внешний вид</span>
            </button>
            <button
              onClick={() => setActiveTab('behavior')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl transition-all duration-200 ${
                activeTab === 'behavior' ? 'bg-opacity-100' : 'hover:bg-opacity-50'
              }`}
              style={{
                backgroundColor: activeTab === 'behavior' ? currentTheme.active : 'transparent',
                color: currentTheme.text
              }}
            >
              <SettingsIcon size={18} />
              <span className="font-medium">Поведение</span>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1"
          style={{
            maxHeight: 'calc(95vh - 140px)', // Вычитаем высоту заголовка и табов
            scrollbarWidth: 'thin',
            scrollbarColor: `${currentTheme.textSecondary} transparent`
          }}>
          {activeTab === 'appearance' && (
            <>
              {/* Theme Selection */}
              <div className="space-y-3">
                <h3 className="text-sm font-medium" style={{ color: currentTheme.textSecondary }}>
                  Тема
                </h3>
            <div className="space-y-2">
              {/* Dark Theme Option */}
              <button
                onClick={() => setTheme('dark')}
                className="w-full flex items-center gap-3 p-4 rounded-xl transition-all duration-200"
                style={{
                  backgroundColor: theme === 'dark' ? currentTheme.active : currentTheme.hover,
                  border: `1px solid ${theme === 'dark' ? currentTheme.textSecondary : currentTheme.border}`
                }}
              >
                <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center" style={{ borderColor: currentTheme.textSecondary }}>
                  {theme === 'dark' && (
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: currentTheme.textSecondary }} />
                  )}
                </div>
                <Moon size={20} style={{ color: currentTheme.text }} />
                <span className="font-medium">Темная тема</span>
              </button>

              {/* Light Theme Option */}
              <button
                onClick={() => setTheme('light')}
                className="w-full flex items-center gap-3 p-4 rounded-xl transition-all duration-200"
                style={{
                  backgroundColor: theme === 'light' ? currentTheme.active : currentTheme.hover,
                  border: `1px solid ${theme === 'light' ? currentTheme.textSecondary : currentTheme.border}`
                }}
              >
                <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center" style={{ borderColor: currentTheme.textSecondary }}>
                  {theme === 'light' && (
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: currentTheme.textSecondary }} />
                  )}
                </div>
                <Sun size={20} style={{ color: currentTheme.text }} />
                <span className="font-medium">Светлая тема</span>
              </button>
            </div>
          </div>

          {/* Accent Color Selection */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl" style={{ backgroundColor: currentTheme.logoBg }}>
                <Eye size={20} style={{ color: currentTheme.text }} />
              </div>
              <div>
                <h3 className="text-lg font-semibold" style={{ color: currentTheme.text }}>
                  Цвет акцента
                </h3>
                <p className="text-sm" style={{ color: currentTheme.textSecondary }}>
                  Выберите цвет для иконок и элементов интерфейса
                </p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {[
                { color: 'auto', name: 'Авто', bg: theme === 'dark' ? 'bg-white' : 'bg-black', hex: theme === 'dark' ? '#FFFFFF' : '#000000' },
                { color: 'blue', name: 'Синий', bg: 'bg-blue-500', hex: '#3B82F6' },
                { color: 'sky', name: 'Голубой', bg: 'bg-sky-500', hex: '#0EA5E9' },
                { color: 'green', name: 'Зеленый', bg: 'bg-green-500', hex: '#10B981' },
                { color: 'purple', name: 'Фиолетовый', bg: 'bg-purple-500', hex: '#8B5CF6' },
                { color: 'red', name: 'Красный', bg: 'bg-red-500', hex: '#EF4444' },
                { color: 'orange', name: 'Оранжевый', bg: 'bg-orange-500', hex: '#F97316' },
                { color: 'pink', name: 'Розовый', bg: 'bg-pink-500', hex: '#EC4899' },
                { color: 'yellow', name: 'Желтый', bg: 'bg-yellow-500', hex: '#EAB308' },
              ].map((option) => (
                <button
                  key={option.color}
                  onClick={() => setAccentColor(option.color as AccentColor)}
                  className={`group relative flex flex-col items-center gap-3 p-4 rounded-2xl transition-all duration-300 hover:scale-105 ${
                    accentColor === option.color ? 'ring-2 ring-offset-2' : ''
                  }`}
                  style={{
                    backgroundColor: accentColor === option.color ? currentTheme.active : currentTheme.hover,
                    border: `1px solid ${accentColor === option.color ? currentTheme.textSecondary : currentTheme.border}`,
                    boxShadow: accentColor === option.color ? `0 8px 25px rgba(0, 0, 0, 0.15)` : `0 4px 12px rgba(0, 0, 0, 0.08)`,
                    ...(accentColor === option.color && { ringColor: option.hex })
                  }}
                >
                  {/* Активный индикатор */}
                  {accentColor === option.color && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full" />
                    </div>
                  )}

                  {/* Цветной круг */}
                  <div className="relative">
                    <div
                      className={`w-12 h-12 rounded-full border-4 border-white shadow-lg group-hover:scale-110 transition-transform duration-200 ${
                        option.bg || ''
                      }`}
                      style={{
                        boxShadow: `0 0 0 3px ${currentTheme.border}, 0 8px 20px rgba(0, 0, 0, 0.15)`
                      }}
                    />
                    {/* Для авто режима добавим специальный индикатор */}
                    {option.color === 'auto' && (
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-gray-400 rounded-full border-2 border-white flex items-center justify-center">
                        <span className="text-[8px] text-white font-bold">A</span>
                      </div>
                    )}
                  </div>

                  {/* Название цвета */}
                  <div className="text-center">
                    <span className="text-sm font-semibold block" style={{ color: currentTheme.text }}>
                      {option.name}
                    </span>
                  </div>
                </button>
              ))}
            </div>

          </div>
            </>
          )}

          {activeTab === 'behavior' && (
            <>
              {/* Snowflakes toggle */}
              <div className="space-y-3">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-xl" style={{ backgroundColor: currentTheme.logoBg }}>
                    <Eye size={20} style={{ color: currentTheme.text }} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold" style={{ color: currentTheme.text }}>
                      Эффекты
                    </h3>
                    <p className="text-sm" style={{ color: currentTheme.textSecondary }}>
                      Визуальные эффекты и анимации
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setSnowflakesEnabled(!snowflakesEnabled)}
                  className="w-full flex items-center justify-between p-4 rounded-xl transition-all duration-200 hover:scale-102"
                  style={{
                    backgroundColor: currentTheme.hover,
                    border: `1px solid ${currentTheme.border}`,
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)'
                  }}
                >
                  <div className="flex items-center gap-3">
                    <span className="font-medium text-lg">
                      ❄️ Падающие снежинки
                    </span>
                  </div>
                  <div
                    className="w-12 h-6 rounded-full relative transition-colors"
                    style={{ backgroundColor: snowflakesEnabled ? '#3B82F6' : '#6B7280' }}
                  >
                    <div
                      className="w-5 h-5 rounded-full absolute top-0.5 transition-transform duration-200 bg-white"
                      style={{
                        left: snowflakesEnabled ? '23px' : '1px'
                      }}
                    />
                  </div>
                </button>

                <div className="mt-3 p-3 rounded-lg bg-white/5 backdrop-blur-sm"
                  style={{ border: `1px solid ${currentTheme.border}` }}>
                  <p className="text-sm" style={{ color: currentTheme.textSecondary }}>
                    Добавляет праздничную атмосферу с анимированными снежинками на фоне приложения
                  </p>
                </div>
              </div>
            </>
          )}

          {/* Version info */}
          <div className="pt-4 border-t" style={{ borderColor: currentTheme.border }}>
            <p className="text-center text-xs" style={{ color: currentTheme.textSecondary }}>
              Melomash v0.3
            </p>
          </div>
        </div>

        <style>{`
          /* Custom scrollbar styles */
          .overflow-y-auto::-webkit-scrollbar {
            width: 6px;
          }
          .overflow-y-auto::-webkit-scrollbar-track {
            background: ${currentTheme.logoBg};
            border-radius: 3px;
          }
          .overflow-y-auto::-webkit-scrollbar-thumb {
            background: ${currentTheme.textSecondary};
            border-radius: 3px;
            transition: background 0.2s ease;
          }
          .overflow-y-auto::-webkit-scrollbar-thumb:hover {
            background: ${currentTheme.text};
          }
        `}</style>
      </div>
    </div>
  );
};

export default SettingsModal;
