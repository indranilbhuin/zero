import {Text, TextStyle, StyleProp, Pressable} from 'react-native';
import React, {ReactNode, useMemo, memo} from 'react';
import useThemeColors from '../../hooks/useThemeColors';

type FontWeight = 'regular' | 'medium' | 'semibold' | 'bold';
type FontVariant = 'text' | 'number';

const TEXT_FONTS: Record<FontWeight, string> = {
  regular: 'GoogleSansCode-Regular',
  medium: 'GoogleSansCode-Medium',
  semibold: 'GoogleSansCode-SemiBold',
  bold: 'GoogleSansCode-Bold',
};

const NUMBER_FONTS: Record<FontWeight, string> = {
  regular: 'GoogleSansCode-Regular',
  medium: 'GoogleSansCode-Medium',
  semibold: 'GoogleSansCode-SemiBold',
  bold: 'GoogleSansCode-Bold',
};

interface PrimaryTextProps {
  children?: ReactNode;
  style?: StyleProp<TextStyle>;
  size?: number;
  weight?: FontWeight;
  variant?: FontVariant;
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
  variant = 'text',
  color,
  numberOfLines,
  ellipsizeMode,
  onPress,
  selectable = false,
}) => {
  const colors = useThemeColors();
  const fonts = variant === 'number' ? NUMBER_FONTS : TEXT_FONTS;

  const resolvedEllipsizeMode = ellipsizeMode ?? (numberOfLines ? 'tail' : undefined);

  const textStyle = useMemo<TextStyle>(
    () => ({
      fontSize: size,
      fontFamily: fonts[weight],
      includeFontPadding: false,
      color: color ?? colors.primaryText,
      flexShrink: numberOfLines ? 1 : undefined,
    }),
    [size, weight, fonts, color, colors.primaryText, numberOfLines],
  );

  const textElement = (
    <Text
      style={[textStyle, style]}
      numberOfLines={numberOfLines}
      ellipsizeMode={resolvedEllipsizeMode}
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
