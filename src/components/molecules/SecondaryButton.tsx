import {TouchableOpacity, View} from 'react-native';
import React from 'react';
import PrimaryText from '../atoms/PrimaryText';
import {Colors} from '../../hooks/useThemeColors';
import {gs, hitSlop} from '../../styles/globalStyles';

interface SecondaryButtonProps {
  onPress(): void;
  colors: Colors;
  buttonText: string;
  width: number;
}

const SecondaryButton: React.FC<SecondaryButtonProps> = React.memo(({onPress, buttonText, colors, width}) => {
  return (
    <TouchableOpacity onPress={onPress} hitSlop={hitSlop} accessibilityLabel={buttonText} accessibilityRole="button">
      <View
        style={[
          gs.h45,
          gs.p10,
          gs.mr5,
          gs.mt5,
          gs.rounded5,
          gs.border2,
          gs.center,
          {
            backgroundColor: colors.secondaryContainerColor,
            borderColor: colors.secondaryAccent,
            width: width,
          },
        ]}>
        <PrimaryText size={13} color={colors.primaryText}>
          {buttonText}
        </PrimaryText>
      </View>
    </TouchableOpacity>
  );
});

export default SecondaryButton;
