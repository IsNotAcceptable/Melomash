import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Theme = 'dark' | 'light';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
  snowflakesEnabled: boolean;
  setSnowflakesEnabled: (enabled: boolean) => void;
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

  useEffect(() => {
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('snowflakesEnabled', JSON.stringify(snowflakesEnabled));
  }, [snowflakesEnabled]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const handleSetTheme = (newTheme: Theme) => {
    setTheme(newTheme);
  };

  const handleSetSnowflakesEnabled = (enabled: boolean) => {
    setSnowflakesEnabled(enabled);
  };

  return (
    <ThemeContext.Provider value={{
      theme,
      toggleTheme,
      setTheme: handleSetTheme,
      snowflakesEnabled,
      setSnowflakesEnabled: handleSetSnowflakesEnabled
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

export { themes };
