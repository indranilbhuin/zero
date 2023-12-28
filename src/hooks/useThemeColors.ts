import {useEffect, useState} from 'react';
import AsyncStorageService from '../utils/asyncStorageService';
import useColorScheme from './useColorScheme';
import {useSelector} from 'react-redux';
import {selectThemePreference} from '../redux/slice/themePreferenceSlice';

export interface Colors {
  primaryBackground: string;
  primaryText: string;
  secondaryBackground: string;
  secondaryText: string;
  accentGreen: string;
  accentOrange: string;
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

const Colors = {
  light: {
    primaryBackground: '#FFFFFF',
    primaryText: '#000000',
    secondaryBackground: '#E0E6D3',
    secondaryText: '#333333',
    accentGreen: '#6E8B3D',
    accentOrange: '#FFA500',
    buttonText: '#FFFFFF',
    containerColor: '#F4F4F0',
    cardBackground: '#EFEFEF',
    accentBlue: '#1E90FF',
    secondaryContainerColor: '#E0E6D3',
    iconContainer: '#E0E6D3',
    secondaryAccent: '#F0F2ED',
    sameBlack: '#000000',
    sameWhite: '#FAFBF7',
    accentRed: '#FF8C6B',
    lightAccent: '#FAFBF7'
  },
  dark: {
    primaryBackground: '#0F0F0F',
    primaryText: '#FFFFFF',
    secondaryBackground: '#333333',
    secondaryText: '#CCCCCC',
    accentGreen: '#B1FB98',
    accentOrange: '#FFA500',
    buttonText: '#000000',
    containerColor: '#1f1f1f',
    cardBackground: '#262626',
    accentBlue: '#1E90FF',
    secondaryContainerColor: '#1f1f1f',
    secondaryAccent: '#333333',
    iconContainer: '#313131',
    sameBlack: '#000000',
    sameWhite: '#FAFBF7',
    accentRed: '#FF6347',
    lightAccent: '#313131'
  },
};

const useThemeColors = () => {
  const selectedTheme = useSelector(selectThemePreference);
  const colorScheme = useColorScheme();
  const [theme, setTheme] = useState<string | null>(null);

  async function fetchTheme() {
    const storedTheme = await AsyncStorageService.getItem('themePreference');
    setTheme(storedTheme);
  }

  useEffect(() => {
    fetchTheme();
  }, [selectedTheme]);

  if (theme === 'system') {
    return Colors[colorScheme];
  } else if (theme === 'dark') {
    return Colors[theme];
  } else if (theme === 'light') {
    return Colors[theme];
  } else {
    return Colors[colorScheme];
  }
};

export default useThemeColors;
