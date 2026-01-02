import {
  Keyboard,
  StatusBar,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
  ViewStyle,
} from 'react-native';
import React, {ReactNode} from 'react';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useTheme, ThemeColors} from '../../context/ThemeContext';

interface PrimaryViewProps {
  colors?: ThemeColors;
  children?: ReactNode;
  style?: ViewStyle;
  dismissKeyboardOnTouch?: boolean;
}

const PrimaryView: React.FC<PrimaryViewProps> = ({
  colors: propColors,
  children,
  style,
  dismissKeyboardOnTouch = false,
}) => {
  const insets = useSafeAreaInsets();
  const {colors: contextColors, isDark} = useTheme();
  
  // Use prop colors if provided, otherwise use context colors
  const colors = propColors || contextColors;

  const content = (
    <View
      style={[
        styles.mainContainer,
        {
          backgroundColor: colors.primaryBackground,
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
        },
        style,
      ]}>
      <StatusBar
        backgroundColor={colors.primaryBackground}
        barStyle={isDark ? 'light-content' : 'dark-content'}
      />
      {children}
    </View>
  );

  if (dismissKeyboardOnTouch) {
    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        {content}
      </TouchableWithoutFeedback>
    );
  }

  return content;
};

export default PrimaryView;

const styles = StyleSheet.create({
  mainContainer: {
    height: '100%',
    paddingLeft: '6%',
    paddingRight: '6%',
  },
});
