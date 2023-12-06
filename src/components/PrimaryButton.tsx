import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {Colors} from '../types/colorType';

interface PrimaryButtonProps {
  onPress(): void;
  colors: Colors;
  buttonTitle: string;
}

const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  onPress,
  colors,
  buttonTitle,
}) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <View
        style={[
          styles.touchableButtonContainer,
          {backgroundColor: colors.primaryText},
        ]}>
        <Text style={[styles.buttonText, {color: colors.buttonText}]}>
          {buttonTitle}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default PrimaryButton;

const styles = StyleSheet.create({
  touchableButtonContainer: {
    height: 60,
    width: '100%',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontFamily: 'FiraCode-Medium',
  },
});
