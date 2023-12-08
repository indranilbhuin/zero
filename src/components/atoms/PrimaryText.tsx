import {StyleSheet, Text, TextStyle} from 'react-native';
import React, {ReactNode} from 'react';

interface PrimaryTextProps {
  children?: ReactNode;
  style?: TextStyle;
}

const PrimaryText: React.FC<PrimaryTextProps> = ({children, style}) => {
  return <Text style={[styles.primaryText, style]}>{children}</Text>;
};

export default PrimaryText;

const styles = StyleSheet.create({
  primaryText: {
    fontFamily: 'FiraCode-Medium',
    includeFontPadding: false,
    fontSize: 14,
  },
});
