import useColorScheme from './useColorScheme';

const Colors = {
  light: {
    primaryBackground: '#FFFFFF',
    primaryText: '#000000',
    secondaryBackground: '#ECECEC',
    secondaryText: '#333333',
    accentGreen: '#6E8B3D',
    accentOrange: '#FFA500',
    buttonText: '#FFFFFF',
  },
  dark: {
    primaryBackground: '#000000',
    primaryText: '#FFFFFF',
    secondaryBackground: '#333333',
    secondaryText: '#CCCCCC',
    accentGreen: '#98FB98',
    accentOrange: '#FFA500',
    buttonText: '#000000',
  },
};

const useThemeColors = () => {
  const colorScheme = useColorScheme();
  console.log(colorScheme);
  const colors = Colors[colorScheme];

  return colors;
};

export default useThemeColors;
