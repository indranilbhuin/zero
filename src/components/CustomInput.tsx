import {StyleSheet, Text, TextInput, View} from 'react-native';
import React from 'react';

const CustomInput = ({colors, input, setInput, placeholder}) => {
  return (
    <TextInput
      style={[
        styles.textInput,
        {
          borderColor: colors.primaryText,
          color: colors.primaryText,
          backgroundColor: colors.secondaryBackground,
        },
      ]}
      value={input}
      onChangeText={setInput}
      placeholder={placeholder}
      placeholderTextColor={colors.secondaryText}
    />
  );
};

export default CustomInput;

const styles = StyleSheet.create({
  textInput: {
    height: 60,
    borderWidth: 2,
    marginBottom: 15,
    borderRadius: 15,
    padding: 20,
    fontFamily: 'FiraCode-Medium',
    includeFontPadding: false,
  },
});
