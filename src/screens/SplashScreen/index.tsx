import {View, Text} from 'react-native';
import React from 'react';
import PrimaryButton from '../../components/PrimaryButton';
import useThemeColors from '../../hooks/useThemeColors';
import {navigate} from '../../utils/navigationUtils';
import styles from "./style"

const SplashScreen = () => {
  const handleClick = () => {
    navigate('PersonalizeScreen');
  };
  
  const colors = useThemeColors();
  console.log(colors)

  return (
    <View
      style={[
        styles.mainContainer,
        {backgroundColor: colors.primaryBackground},
      ]}>
      <Text style={[styles.titleText, {color: colors.primaryText}]}>zero</Text>
      <Text style={[styles.subtitleText, {color: colors.secondaryText}]}>
        Count Every
      </Text>
      <Text
        style={[
          styles.subtitleText,
          {marginBottom: '120%', color: colors.secondaryText},
        ]}>
        Penny with zero
      </Text>
      <PrimaryButton
        onPress={handleClick}
        colors={colors}
        buttonTitle={'Get Started'}
      />
    </View>
  );
};

export default SplashScreen;
