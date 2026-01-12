import {Image, View} from 'react-native';
import React from 'react';
import PrimaryView from './PrimaryView';
import PrimaryText from './PrimaryText';
import {useTheme, ThemeColors} from '../../context/ThemeContext';
import {gs} from '../../styles/globalStyles';

const darkIcon = require('../../../assets/icons/adaptive-icon-dark.png');
const lightIcon = require('../../../assets/icons/adaptive-icon-light.png');

type LoaderSize = 'sm' | 'md' | 'lg';

const ICON_SIZES: Record<LoaderSize, number> = {
  sm: 80,
  md: 160,
  lg: 240,
};

interface CustomLoaderProps {
  colors?: ThemeColors;
  size?: LoaderSize;
  message?: string;
}

const CustomLoader: React.FC<CustomLoaderProps> = React.memo(({colors: propColors, size = 'md', message}) => {
  const {colors: contextColors, isDark} = useTheme();
  const colors = propColors || contextColors;
  const iconSize = ICON_SIZES[size];

  return (
    <PrimaryView colors={colors} style={gs.center}>
      <Image
        source={isDark ? lightIcon : darkIcon}
        style={[gs.absolute, gs.zIndex2, {height: iconSize, width: iconSize}]}
      />
      {message && (
        <View style={gs.mt20}>
          <PrimaryText size={14} color={colors.secondaryText}>
            {message}
          </PrimaryText>
        </View>
      )}
    </PrimaryView>
  );
});

export default CustomLoader;
