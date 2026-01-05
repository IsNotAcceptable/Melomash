import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Theme = 'dark' | 'light';
type AccentColor = 'blue' | 'green' | 'purple' | 'red' | 'orange' | 'pink' | 'yellow' | 'sky' | 'auto';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
  snowflakesEnabled: boolean;
  setSnowflakesEnabled: (enabled: boolean) => void;
  accentColor: AccentColor;
  setAccentColor: (color: AccentColor) => void;
  customColor: string;
  setCustomColor: (color: string) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const themes = {
  dark: {
    bg: '#121212',
    sidebar: '#121212',
    main: '#000000',
    text: 'white',
    textSecondary: '#9CA3AF',
    border: 'rgba(255, 255, 255, 0.05)',
    hover: 'rgba(255, 255, 255, 0.05)',
    active: 'rgba(255, 255, 255, 0.1)',
    logoBg: 'rgba(255, 255, 255, 0.05)',
  },
  light: {
    bg: '#FFFFFF',
    sidebar: '#F8F9FA',
    main: '#FFFFFF',
    text: '#1F2937',
    textSecondary: '#6B7280',
    border: 'rgba(0, 0, 0, 0.1)',
    hover: 'rgba(0, 0, 0, 0.05)',
    active: 'rgba(0, 0, 0, 0.1)',
    logoBg: 'rgba(0, 0, 0, 0.05)',
  },
};

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem('theme');
    return (saved as Theme) || 'dark';
  });

  const [snowflakesEnabled, setSnowflakesEnabled] = useState<boolean>(() => {
    const saved = localStorage.getItem('snowflakesEnabled');
    return saved ? JSON.parse(saved) : false;
  });

  const [accentColor, setAccentColor] = useState<AccentColor>(() => {
    const saved = localStorage.getItem('accentColor');
    return (saved as AccentColor) || 'auto';
  });

  const [customColor, setCustomColor] = useState<string>(() => {
    const saved = localStorage.getItem('customColor');
    return saved || '#3B82F6';
  });

  useEffect(() => {
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('snowflakesEnabled', JSON.stringify(snowflakesEnabled));
  }, [snowflakesEnabled]);

  useEffect(() => {
    localStorage.setItem('accentColor', accentColor);
  }, [accentColor]);

  useEffect(() => {
    localStorage.setItem('customColor', customColor);
  }, [customColor]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const handleSetTheme = (newTheme: Theme) => {
    setTheme(newTheme);
  };

  const handleSetSnowflakesEnabled = (enabled: boolean) => {
    setSnowflakesEnabled(enabled);
  };

  const handleSetAccentColor = (color: AccentColor) => {
    setAccentColor(color);
  };

  const handleSetCustomColor = (color: string) => {
    setCustomColor(color);
  };

  return (
    <ThemeContext.Provider value={{
      theme,
      toggleTheme,
      setTheme: handleSetTheme,
      snowflakesEnabled,
      setSnowflakesEnabled: handleSetSnowflakesEnabled,
      accentColor,
      setAccentColor: handleSetAccentColor,
      customColor,
      setCustomColor: handleSetCustomColor
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const getAccentColorClass = (accentColor: AccentColor, theme: Theme): string => {
  if (accentColor === 'auto') {
    return theme === 'dark' ? 'text-white' : 'text-black';
  }

  const accentColors = {
    blue: 'text-blue-500',
    green: 'text-green-500',
    purple: 'text-purple-500',
    red: 'text-red-500',
    orange: 'text-orange-500',
    pink: 'text-pink-500',
    yellow: 'text-yellow-500',
    sky: 'text-sky-500',
  };
  return accentColors[accentColor];
};

export const getAccentColorValue = (accentColor: AccentColor, theme: Theme): string => {
  if (accentColor === 'auto') {
    return theme === 'dark' ? '#FFFFFF' : '#000000';
  }

  const accentColorValues = {
    blue: '#3B82F6',
    green: '#10B981',
    purple: '#8B5CF6',
    red: '#EF4444',
    orange: '#F97316',
    pink: '#EC4899',
    yellow: '#EAB308',
    sky: '#0EA5E9',
  };
  return accentColorValues[accentColor];
};

export { themes };
