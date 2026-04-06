import React, {createContext, useContext, useState, useEffect, useCallback, useMemo, type ReactNode} from 'react';
import {useColorScheme, Appearance} from 'react-native';
import StorageService from '../utils/asyncStorageService';

export type ThemeMode = 'light' | 'dark' | 'system';
export type ResolvedTheme = 'light' | 'dark';

export interface ThemeColors {
  primaryBackground: string;
  primaryText: string;
  secondaryBackground: string;
  secondaryText: string;
  accentGreen: string;
  accentOrange: string;
  accentBlue: string;
  buttonText: string;
  containerColor: string;
  cardBackground: string;
  secondaryContainerColor: string;
  secondaryAccent: string;
  iconContainer: string;
  sameBlack: string;
  sameWhite: string;
  accentRed: string;
  lightAccent: string;
}

const LightColors: ThemeColors = {
  primaryBackground: '#FAFAF8',
  primaryText: '#1A1A1A',
  secondaryBackground: '#E4E9D8',
  secondaryText: '#505050',
  accentGreen: '#6E8B3D',
  accentOrange: '#B86E00',
  accentBlue: '#1E90FF',
  buttonText: '#FFFFFF',
  containerColor: '#ECEEE7',
  cardBackground: '#E8EAE3',
  secondaryContainerColor: '#E4E9D8',
  iconContainer: '#E4E9D8',
  secondaryAccent: '#EEEFE9',
  sameBlack: '#000000',
  sameWhite: '#FAFBF7',
  accentRed: '#C4503C',
  lightAccent: '#F5F6F2',
};

const DarkColors: ThemeColors = {
  primaryBackground: '#0F0F0F',
  primaryText: '#FFFFFF',
  secondaryBackground: '#333333',
  secondaryText: '#CCCCCC',
  accentGreen: '#B1FB98',
  accentOrange: '#FFA500',
  accentBlue: '#1E90FF',
  buttonText: '#000000',
  containerColor: '#1f1f1f',
  cardBackground: '#262626',
  secondaryContainerColor: '#1f1f1f',
  secondaryAccent: '#333333',
  iconContainer: '#313131',
  sameBlack: '#000000',
  sameWhite: '#FAFBF7',
  accentRed: '#FF6347',
  lightAccent: '#313131',
};

interface ThemeContextType {
  themeMode: ThemeMode;
  resolvedTheme: ResolvedTheme;
  colors: ThemeColors;
  isDark: boolean;
  setThemeMode: (mode: ThemeMode) => Promise<void>;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

const getInitialThemeMode = (): ThemeMode => {
  const saved = StorageService.getItemSync('themePreference');
  if (saved && ['light', 'dark', 'system'].includes(saved)) {
    return saved as ThemeMode;
  }
  return 'system';
};

export const ThemeProvider: React.FC<ThemeProviderProps> = ({children}) => {
  const systemColorScheme = useColorScheme();
  const [themeMode, setThemeModeState] = useState<ThemeMode>(getInitialThemeMode);

  const resolvedTheme: ResolvedTheme = useMemo(() => {
    if (themeMode === 'system') {
      return systemColorScheme === 'dark' ? 'dark' : 'light';
    }
    return themeMode;
  }, [themeMode, systemColorScheme]);

  const colors = useMemo(() => {
    return resolvedTheme === 'dark' ? DarkColors : LightColors;
  }, [resolvedTheme]);

  const isDark = resolvedTheme === 'dark';

  useEffect(() => {
    const subscription = Appearance.addChangeListener(() => {});
    return () => subscription.remove();
  }, []);

  const setThemeMode = useCallback(async (mode: ThemeMode) => {
    StorageService.setItemSync('themePreference', mode);
    setThemeModeState(mode);
  }, []);

  const value = useMemo(
    () => ({
      themeMode,
      resolvedTheme,
      colors,
      isDark,
      setThemeMode,
    }),
    [themeMode, resolvedTheme, colors, isDark, setThemeMode],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const useThemeColors = (): ThemeColors => {
  const {colors} = useTheme();
  return colors;
};

export default ThemeContext;
