import {StatusBar, StyleSheet, View, ViewStyle} from 'react-native';
import React, {ReactNode} from 'react';
import {Colors} from '../../hooks/useThemeColors';

interface PrimaryViewProps {
  colors: Colors;
  children?: ReactNode;
  style?: ViewStyle;
}

const PrimaryView: React.FC<PrimaryViewProps> = ({colors, children, style}) => {
  const isDark = colors.primaryBackground === '#0F0F0F';
  return (
    <View
      style={[
        styles.mainContainer,
        {backgroundColor: colors.primaryBackground},
        style,
      ]}>
      <StatusBar
        backgroundColor={colors.primaryBackground}
        barStyle={isDark ? 'light-content' : 'dark-content'}
      />
      {children}
    </View>
  );
};

export default PrimaryView;

const styles = StyleSheet.create({
  mainContainer: {
    height: '100%',
    paddingLeft: '6%',
    paddingRight: '6%',
  },
});
