import {View, Text, StyleSheet, Switch} from 'react-native';
import React from 'react';
import PrimaryButton from '../../components/PrimaryButton';
import useThemeColors from '../../hooks/useThemeColors';

const SplashScreen = () => {
  const handleClick = () => {
    console.log('first');
  };
  const colors = useThemeColors();

  return (
    <View
      style={[
        styles.mainContainer,
        {backgroundColor: colors.primaryBackground},
      ]}>
      {/* <Switch /> */}
      <Text style={[styles.titleText, {color: colors.primaryText}]}>zero</Text>
      <Text style={[styles.subtitleText, {color: colors.secondaryText}]}>
        Count Every
      </Text>
      <Text
        style={[
          styles.subtitleText,
          {marginBottom: '110%', color: colors.secondaryText},
        ]}>
        Penny with zero
      </Text>
      <PrimaryButton
        onPress={handleClick}
        backgroundColor={colors.primaryText}
        buttonText={'Get Started'}
      />
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  mainContainer: {
    height: '100%',
    paddingLeft: '6%',
    paddingRight: '6%',
  },
  titleText: {
    fontFamily: 'FiraCode-Medium',
    fontSize: 90,
    includeFontPadding: false,
    paddingTop: '20%',
  },
  subtitleText: {
    fontFamily: 'FiraCode-Medium',
    fontSize: 25,
    includeFontPadding: false,
  },
});
