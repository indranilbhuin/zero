import {useEffect, useState} from 'react';
import AsyncStorageService from '../utils/asyncStorageService';
import useColorScheme from './useColorScheme';
import {useSelector} from 'react-redux';
import {selectThemePreference} from '../redux/slice/themePreferenceSlice';

const Colors = {
  light: {
    primaryBackground: '#FFFFFF',
    primaryText: '#000000',
    secondaryBackground: '#ECECEC',
    secondaryText: '#333333',
    accentGreen: '#6E8B3D',
    accentOrange: '#FFA500',
    buttonText: '#FFFFFF',
    containerColor: '#E0E0E0',
    cardBackground: '#EFEFEF'
  },
  dark: {
    primaryBackground: '#0F0F0F',
    primaryText: '#FFFFFF',
    secondaryBackground: '#333333',
    secondaryText: '#CCCCCC',
    accentGreen: '#98FB98',
    accentOrange: '#FFA500',
    buttonText: '#000000',
    containerColor: '#1f1f1f',
    cardBackground: '#262626'
  },
};

const useThemeColors = () => {
  const selectedTheme = useSelector(selectThemePreference);
  const colorScheme = useColorScheme();
  const [theme, setTheme] = useState(null);

  async function fetchTheme() {
    const storedTheme = await AsyncStorageService.getItem('themePreference');
    console.log('this is the async theme', storedTheme);
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
