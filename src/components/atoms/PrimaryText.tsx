import {StyleSheet, Text, TextStyle} from 'react-native';
import React, {ReactNode} from 'react';
import useThemeColors from '../../hooks/useThemeColors';

interface PrimaryTextProps {
  children?: ReactNode;
  style?: TextStyle;
}

const PrimaryText: React.FC<PrimaryTextProps> = ({children, style}) => {
  const colors = useThemeColors();
  const textColor = style?.color ?? colors.primaryText;
  return (
    <Text style={[styles.primaryText, style, {color: textColor}]}>
      {children}
    </Text>
  );
};

export default PrimaryText;

const styles = StyleSheet.create({
  primaryText: {
    fontFamily: 'FiraCode-Medium',
    includeFontPadding: false,
    fontSize: 14,
  },
});
