import {Keyboard, Platform, StatusBar, TouchableWithoutFeedback, View, ViewStyle} from 'react-native';
import React, {ReactNode, memo} from 'react';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useTheme, ThemeColors} from '../../context/ThemeContext';
import {gs} from '../../styles/globalStyles';

interface PrimaryViewProps {
  colors?: ThemeColors;
  children?: ReactNode;
  style?: ViewStyle;
  dismissKeyboardOnTouch?: boolean;
  useBottomPadding?: boolean;
  useSidePadding?: boolean;
}

const PrimaryView: React.FC<PrimaryViewProps> = ({
  colors: propColors,
  children,
  style,
  dismissKeyboardOnTouch = false,
  useBottomPadding = true,
  useSidePadding = true,
}) => {
  const insets = useSafeAreaInsets();
  const {colors: contextColors, isDark} = useTheme();

  const colors = propColors || contextColors;

  const bottomPadding = useBottomPadding ? (Platform.OS === 'ios' ? insets.bottom : insets.bottom + 10) : 0;

  const content = (
    <View
      style={[
        gs.hFull,
        {
          backgroundColor: colors.primaryBackground,
          paddingTop: insets.top,
          paddingBottom: bottomPadding,
          paddingLeft: useSidePadding ? '4%' : 0,
          paddingRight: useSidePadding ? '4%' : 0,
        },
        style,
      ]}>
      <StatusBar backgroundColor={colors.primaryBackground} barStyle={isDark ? 'light-content' : 'dark-content'} />
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

export default memo(PrimaryView);
