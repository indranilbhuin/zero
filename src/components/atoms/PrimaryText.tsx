import {Text, TextStyle, StyleProp, Pressable} from 'react-native';
import React, {ReactNode, useMemo, memo} from 'react';
import useThemeColors from '../../hooks/useThemeColors';

type FontWeight = 'regular' | 'medium' | 'semibold' | 'bold';

const FONT_FAMILIES: Record<FontWeight, string> = {
  regular: 'FiraCode-Regular',
  medium: 'FiraCode-Medium',
  semibold: 'FiraCode-SemiBold',
  bold: 'FiraCode-Bold',
};

interface PrimaryTextProps {
  children?: ReactNode;
  style?: StyleProp<TextStyle>;
  size?: number;
  weight?: FontWeight;
  color?: string;
  numberOfLines?: number;
  ellipsizeMode?: 'head' | 'middle' | 'tail' | 'clip';
  onPress?: () => void;
  selectable?: boolean;
}

const PrimaryText: React.FC<PrimaryTextProps> = ({
  children,
  style,
  size = 14,
  weight = 'medium',
  color,
  numberOfLines,
  ellipsizeMode,
  onPress,
  selectable = false,
}) => {
  const colors = useThemeColors();

  const textStyle = useMemo<TextStyle>(
    () => ({
      fontSize: size,
      fontFamily: FONT_FAMILIES[weight],
      includeFontPadding: false,
      color: color ?? colors.primaryText,
    }),
    [size, weight, color, colors.primaryText],
  );

  const textElement = (
    <Text
      style={[textStyle, style]}
      numberOfLines={numberOfLines}
      ellipsizeMode={ellipsizeMode}
      selectable={selectable}>
      {children}
    </Text>
  );

  if (onPress) {
    return (
      <Pressable onPress={onPress} hitSlop={8}>
        {textElement}
      </Pressable>
    );
  }

  return textElement;
};

export default memo(PrimaryText);
