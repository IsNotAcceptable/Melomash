import React from 'react';
import { X, Sun, Moon } from 'lucide-react';
import { useTheme, themes } from './ThemeContext';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const { theme, setTheme, snowflakesEnabled, setSnowflakesEnabled } = useTheme();

  if (!isOpen) return null;

  const currentTheme = themes[theme];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div
        className="relative max-w-md w-full mx-4 rounded-2xl border shadow-2xl"
        style={{
          backgroundColor: currentTheme.sidebar,
          borderColor: currentTheme.border,
          color: currentTheme.text
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

        {/* Content */}
        <div className="p-6 space-y-6">
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

            {/* Snowflakes toggle */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium" style={{ color: currentTheme.textSecondary }}>
                Эффекты
              </h3>
              <button
                onClick={() => setSnowflakesEnabled(!snowflakesEnabled)}
                className="w-full flex items-center justify-between p-4 rounded-xl transition-all duration-200"
                style={{
                  backgroundColor: currentTheme.hover,
                  border: `1px solid ${currentTheme.border}`
                }}
              >
                <div className="flex items-center gap-3">
                  <span className="font-medium">
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
            </div>

            {/* Version info */}
            <div className="pt-4 border-t" style={{ borderColor: currentTheme.border }}>
              <p className="text-center text-xs" style={{ color: currentTheme.textSecondary }}>
                Melomash v0.1.0
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
