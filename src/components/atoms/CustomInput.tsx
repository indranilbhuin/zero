import {TextInput, View, KeyboardTypeOptions, TouchableOpacity} from 'react-native';
import React, {useState, useCallback, useMemo, memo} from 'react';
import PrimaryText from './PrimaryText';
import Icon from './Icons';
import {Colors} from '../../hooks/useThemeColors';
import {gs} from '../../styles/globalStyles';
import {ZodType} from 'zod';

interface CustomInputProps {
  input: string;
  setInput: (value: string) => void;
  colors: Colors;
  placeholder: string;
  label?: string;
  schema?: ZodType<string>;
  keyboardType?: KeyboardTypeOptions;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  autoFocus?: boolean;
  secureTextEntry?: boolean;
  multiline?: boolean;
  maxLength?: number;
  onBlur?: () => void;
  onFocus?: () => void;
  leftIcon?: string;
  rightIcon?: string;
  onRightIconPress?: () => void;
  disabled?: boolean;
}

const CustomInput: React.FC<CustomInputProps> = ({
  colors,
  input,
  setInput,
  placeholder,
  label,
  schema,
  keyboardType,
  autoCapitalize,
  autoFocus = false,
  secureTextEntry = false,
  multiline = false,
  maxLength,
  onBlur,
  onFocus,
  leftIcon,
  rightIcon,
  onRightIconPress,
  disabled = false,
}) => {
  const [hasInteracted, setHasInteracted] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const errors = hasInteracted ? schema?.safeParse(input).error?.issues || [] : [];

  const hasLeftIcon = !!leftIcon;
  const hasRightIcon = !!rightIcon;
  const hasIcons = hasLeftIcon || hasRightIcon;

  const inputBorderColor = useMemo(() => {
    return isFocused ? colors.primaryText : colors.secondaryContainerColor;
  }, [isFocused, colors.primaryText, colors.secondaryContainerColor]);

  const inputBackgroundColor = useMemo(() => {
    return disabled ? colors.secondaryContainerColor : colors.secondaryAccent;
  }, [disabled, colors.secondaryContainerColor, colors.secondaryAccent]);

  const handleFocus = useCallback(() => {
    setIsFocused(true);
    onFocus?.();
  }, [onFocus]);

  const handleBlur = useCallback(() => {
    setIsFocused(false);
    setHasInteracted(true);
    onBlur?.();
  }, [onBlur]);

  const handleChangeText = useCallback(
    (text: string) => {
      setInput(text);
      if (!hasInteracted) {
        setHasInteracted(true);
      }
    },
    [setInput, hasInteracted],
  );

  return (
    <View style={disabled ? gs.opacity60 : undefined}>
      {label ? <PrimaryText style={gs.mb5}>{label}</PrimaryText> : null}
      <View
        style={
          hasIcons
            ? [
                gs.h48,
                gs.itemsCenter,
                gs.border2,
                gs.mt5,
                gs.mb15,
                gs.rounded10,
                gs.pl10,
                gs.justifyStart,
                gs.row,
                {borderColor: inputBorderColor, backgroundColor: inputBackgroundColor},
              ]
            : undefined
        }>
        {hasLeftIcon && (
          <View style={gs.mr8}>
            <Icon name={leftIcon} size={20} color={colors.secondaryText} />
          </View>
        )}
        <TextInput
          style={
            hasIcons
              ? [gs.px15, gs.h48, gs.wFull, gs.fontMedium, gs.noFontPadding, {color: colors.primaryText}]
              : [
                  gs.h48,
                  gs.border2,
                  gs.mt5,
                  gs.mb5,
                  gs.rounded10,
                  gs.px15,
                  gs.fontMedium,
                  gs.noFontPadding,
                  {borderColor: inputBorderColor, color: colors.primaryText, backgroundColor: inputBackgroundColor},
                ]
          }
          value={input}
          onChangeText={handleChangeText}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          placeholderTextColor={colors.secondaryText}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          autoFocus={autoFocus}
          secureTextEntry={secureTextEntry}
          multiline={multiline}
          maxLength={maxLength}
          editable={!disabled}
        />
        {hasRightIcon && (
          <TouchableOpacity onPress={onRightIconPress} disabled={!onRightIconPress} style={gs.ml8}>
            <Icon name={rightIcon} size={20} color={colors.secondaryText} />
          </TouchableOpacity>
        )}
      </View>
      {errors.length > 0 && (
        <View style={gs.mb10}>
          {errors.map((error: {message: string}) => (
            <View key={error.message}>
              <PrimaryText size={12} color={colors.accentRed}>
                {error.message}
              </PrimaryText>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

export default memo(CustomInput);
