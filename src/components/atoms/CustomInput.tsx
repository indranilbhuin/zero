import {TextInput, View} from 'react-native';
import React from 'react';
import PrimaryText from './PrimaryText';
import textInputStyles from '../../styles/textInput';
import {Colors} from '../../hooks/useThemeColors';

interface CustomInputProps {
  input: string;
  label?: string;
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
        <PrimaryText style={{marginBottom: 5}}>{label}</PrimaryText>
      ) : null}
      <TextInput
        style={[
          textInputStyles.textInput,
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
