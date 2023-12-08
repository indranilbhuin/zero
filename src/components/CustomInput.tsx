import {StyleSheet, TextInput, View} from 'react-native';
import React from 'react';
import {Colors} from '../types/colorType';
import PrimaryText from './atoms/PrimaryText';

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
        <PrimaryText style={{color: colors.primaryText, marginBottom: 5}}>
          {label}
        </PrimaryText>
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
});
