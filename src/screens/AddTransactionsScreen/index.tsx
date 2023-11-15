import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import useThemeColors from '../../hooks/useThemeColors';
import CustomInput from '../../components/CustomInput';
import AppHeader from '../../components/AppHeader';
import {goBack} from '../../utils/navigationUtils';

const AddTransactionsScreen = () => {
  const colors = useThemeColors();

  return (
    <View
      style={[
        styles.mainContainer,
        {backgroundColor: colors.primaryBackground},
      ]}>
      <View style={styles.headerContainer}>
        <AppHeader onPress={goBack} colors={colors} text="Transaction Screen" />
      </View>
      <View></View>
      <CustomInput
        colors={colors}
        input={undefined}
        setInput={undefined}
        placeholder={'Expense Name'}
      />
      <CustomInput
        colors={colors}
        input={undefined}
        setInput={undefined}
        placeholder={'Expense Description'}
      />
      <CustomInput
        colors={colors}
        input={undefined}
        setInput={undefined}
        placeholder={'Expense Amount'}
      />
      <Text
        style={[
          styles.subtitleText,
          {color: colors.accentGreen, fontSize: 14},
        ]}>
        Select any category
      </Text>
    </View>
  );
};

export default AddTransactionsScreen;

const styles = StyleSheet.create({
  mainContainer: {
    height: '100%',
    paddingLeft: '6%',
    paddingRight: '6%',
  },
  headerContainer: {
    marginBottom: 20,
  },
  subtitleText: {
    fontFamily: 'FiraCode-Medium',
    fontSize: 15,
    includeFontPadding: false,
  },
});
