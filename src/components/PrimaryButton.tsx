import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import useThemeColors from '../hooks/useThemeColors';

const PrimaryButton = ({onPress, backgroundColor, buttonText}) => {
  const colors = useThemeColors();
  return (
    <TouchableOpacity onPress={onPress}>
      <View
        style={[
          styles.touchableButtonContainer,
          {backgroundColor: backgroundColor},
        ]}>
        <Text style={[styles.buttonText, {color: colors.buttonText}]}>
          {buttonText}
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
