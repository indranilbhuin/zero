import {TextInput, View} from 'react-native';
import React, {useState} from 'react';
import PrimaryText from './PrimaryText';
import textInputStyles from '../../styles/textInput';
import {Colors} from '../../hooks/useThemeColors';

interface CustomInputProps {
  input: string;
  label?: string;
  colors: Colors;
  placeholder: string;
  setInput: (value: string) => void;
  schema: any;
}

const CustomInput: React.FC<CustomInputProps> = ({
  colors,
  input,
  setInput,
  placeholder,
  label,
  schema,
}) => {
  const [hasInteracted, setHasInteracted] = useState(false);

  const errors = hasInteracted
    ? schema?.safeParse(input).error?.errors || []
    : [];

  const handleTextInputFocus = () => {
    setHasInteracted(true);
  };

  return (
    <View>
      {label ? (
        <PrimaryText style={{marginBottom: 5}}>{label}</PrimaryText>
      ) : null}
      <TextInput
        style={[
          textInputStyles.textInput,
          {
            borderColor: colors.secondaryContainerColor,
            color: colors.primaryText,
            backgroundColor: colors.secondaryAccent,
          },
        ]}
        value={input}
        onChangeText={setInput}
        onChange={handleTextInputFocus}
        placeholder={placeholder}
        placeholderTextColor={colors.secondaryText}
      />
      {errors.length > 0 && (
        <View style={{marginBottom: 10}}>
          {errors.map(error => (
            <View key={error.message}>
              <PrimaryText style={{color: colors.accentRed, fontSize: 12}}>
                {error.message}
              </PrimaryText>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

export default CustomInput;
