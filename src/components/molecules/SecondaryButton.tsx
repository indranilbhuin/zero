import {StyleSheet, TouchableOpacity, View} from 'react-native';
import React from 'react';
import PrimaryText from '../atoms/PrimaryText';
import {Colors} from '../../hooks/useThemeColors';

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
            backgroundColor: colors.secondaryContainerColor,
            borderColor: colors.secondaryAccent,
            width: width,
          },
        ]}>
        <PrimaryText style={{color: colors.primaryText, fontSize: 13}}>
          {buttonText}
        </PrimaryText>
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
});
