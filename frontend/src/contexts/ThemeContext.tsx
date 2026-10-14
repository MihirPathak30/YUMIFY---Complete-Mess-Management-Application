import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  // ALWAYS default to light mode - only use stored if user explicitly set it
  const [theme, setThemeState] = useState<Theme>('light');
  const [initialized, setInitialized] = useState(false);

  // Initialize theme on mount - check if user ever toggled to dark
  useEffect(() => {
    const stored = localStorage.getItem('yumify-theme') as Theme | null;
    // Only use stored theme if it exists AND is dark (meaning user explicitly chose dark)
    // Otherwise, default to light
    const initialTheme = stored === 'dark' ? 'dark' : 'light';
    setThemeState(initialTheme);
    setInitialized(true);
  }, []);

  // Apply theme changes to DOM
  useEffect(() => {
    if (!initialized) return;
    
    const root = document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    localStorage.setItem('yumify-theme', theme);
  }, [theme, initialized]);

  const toggleTheme = () => {
    setThemeState(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
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
