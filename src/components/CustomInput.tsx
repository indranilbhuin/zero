import {StyleSheet, Text, TextInput, View} from 'react-native';
import React from 'react';
import {Colors} from '../types/colorType';

interface CustomInputProps {
  input: string;
  label: string;
  colors: Colors;
  placeholder: string;
  setInput: (value: string) => void;
}

const CustomInput: React.FC<CustomInputProps> = ({
  colors,
  input,
  setInput,
  placeholder,
  label,
}) => {
  return (
    <View>
      {label ? (
        <Text
          style={[
            styles.labelText,
            {color: colors.primaryText, fontSize: 14, marginBottom: 5},
          ]}>
          {label}
        </Text>
      ) : null}
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
    </View>
  );
};

export default CustomInput;

const styles = StyleSheet.create({
  textInput: {
    height: 60,
    borderWidth: 2,
    marginTop: 5,
    marginBottom: 10,
    borderRadius: 15,
    padding: 20,
    fontFamily: 'FiraCode-Medium',
    includeFontPadding: false,
  },
  labelText: {
    fontFamily: 'FiraCode-Medium',
    fontSize: 15,
    includeFontPadding: false,
  },
});
