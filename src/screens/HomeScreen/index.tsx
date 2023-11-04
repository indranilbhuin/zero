import React from 'react';
import {Text, View} from 'react-native';
import styles from './style';
import useThemeColors from '../../hooks/useThemeColors';

const HomeScreen = () => {
  const colors = useThemeColors();
  const userName = 'User';
  return (
    <View
      style={[
        styles.mainContainer,
        {backgroundColor: colors.primaryBackground},
      ]}>
      <Text style={[styles.titleText, {color: colors.primaryText}]}>
        Hey, {userName}
      </Text>
    </View>
  );
};

export default HomeScreen;
