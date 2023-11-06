import React from 'react';
import {Text, View} from 'react-native';
import styles from './style';
import useThemeColors from '../../hooks/useThemeColors';
import { useSelector } from 'react-redux';

const HomeScreen = () => {
  const colors = useThemeColors();
  const userName = useSelector(
    (state: {userData: {userName: any}}) => state.userData.userName,
  );

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
