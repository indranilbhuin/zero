import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {Colors} from '../types/colorType';

interface SecondaryButtonProps {
  onPress(): void;
  colors: Colors;
  buttonText: string;
  width: number;
}

const SecondaryButton: React.FC<SecondaryButtonProps> = ({
  onPress,
  buttonText,
  colors,
  width,
}) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <View
        style={[
          styles.categoryContainer,
          {
            backgroundColor: colors.primaryText,
            borderColor: colors.secondaryText,
            width: width,
          },
        ]}>
        <Text
          style={[
            styles.subtitleText,
            {color: colors.buttonText, fontSize: 13},
          ]}>
          {buttonText}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default SecondaryButton;

const styles = StyleSheet.create({
  categoryContainer: {
    height: 45,
    padding: 10,
    marginRight: 5,
    marginTop: 5,
    borderRadius: 5,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  subtitleText: {
    fontFamily: 'FiraCode-Medium',
    fontSize: 15,
    includeFontPadding: false,
  },
});
