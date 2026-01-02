import {Image, StyleSheet} from 'react-native';
import React from 'react';
import PrimaryView from './PrimaryView';
import {useTheme, ThemeColors} from '../../context/ThemeContext';

const darkIcon = require('../../../assets/icons/adaptive-icon-dark.png');
const lightIcon = require('../../../assets/icons/adaptive-icon-light.png');

interface CustomLoaderProps {
  colors?: ThemeColors;
}

const CustomLoader: React.FC<CustomLoaderProps> = ({colors: propColors}) => {
  const {colors: contextColors, isDark} = useTheme();
  const colors = propColors || contextColors;

  return (
    <PrimaryView
      colors={colors}
      style={{justifyContent: 'center', alignItems: 'center'}}>
      <Image source={isDark ? lightIcon : darkIcon} style={styles.image} />
    </PrimaryView>
  );
};

export default CustomLoader;

const styles = StyleSheet.create({
  image: {
    position: 'absolute',
    zIndex: 2,
    height: 160,
    width: 160,
  },
});
