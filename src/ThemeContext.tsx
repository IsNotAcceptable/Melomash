import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Theme = 'dark' | 'light';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  snowEnabled: boolean;
  toggleSnow: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    // Проверяем сохраненную тему в localStorage
    const savedTheme = localStorage.getItem('melomash-theme');
    return (savedTheme as Theme) || 'dark';
  });

  const [snowEnabled, setSnowEnabled] = useState<boolean>(() => {
    // Проверяем сохраненное состояние снега в localStorage (по умолчанию включено)
    const savedSnow = localStorage.getItem('melomash-snow');
    return savedSnow !== null ? savedSnow === 'true' : true;
  });

  useEffect(() => {
    // Сохраняем тему в localStorage
    localStorage.setItem('melomash-theme', theme);

    // Применяем тему к документу
    document.documentElement.setAttribute('data-theme', theme);

    // Уведомляем Electron о смене темы
    if (window.melomashAPI?.setTheme) {
      window.melomashAPI.setTheme(theme);
    }
  }, [theme]);

  useEffect(() => {
    // Сохраняем состояние снега в localStorage
    localStorage.setItem('melomash-snow', snowEnabled.toString());
  }, [snowEnabled]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'dark' ? 'light' : 'dark');
  };

  const toggleSnow = () => {
    setSnowEnabled(prev => !prev);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, snowEnabled, toggleSnow }}>
      {children}
    </ThemeContext.Provider>
  );
};
