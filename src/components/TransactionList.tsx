import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import useThemeColors from '../hooks/useThemeColors';
import Icon from './Icons';

const TransactionList = ({currencySymbol}) => {
  const colors = useThemeColors();
  return (
    <View style={styles.mainContainer}>
      <View style={[styles.transactionContainer, {backgroundColor: colors.containerColor}]}>
        <View style={styles.iconNameContainer}>
          <View
            style={[
              styles.iconContainer,
              {backgroundColor: colors.primaryText},
            ]}>
            <Icon
              name={'hamburger'}
              size={20}
              color={colors.buttonText}
              type={'MaterialCommunityIcons'}
            />
          </View>
          <View>
            <Text style={[styles.transactionText, {color: colors.primaryText}]}>
              Biryani
            </Text>
            <View style={styles.descriptionContainer}>
              <Text
                style={[styles.descriptionText, {color: colors.primaryText}]}>
                Food .
              </Text>
              <Text
                style={[styles.descriptionText, {color: colors.primaryText}]}>
                Description .
              </Text>
              <Text
                style={[styles.descriptionText, {color: colors.primaryText}]}>
                12:59 PM
              </Text>
            </View>
          </View>
        </View>
        <View>
          <Text style={[styles.transactionText, {color: colors.primaryText}]}>
            {currencySymbol} 189
          </Text>
        </View>
      </View>
    </View>
  );
};

export default TransactionList;

const styles = StyleSheet.create({
  mainContainer: {
    marginTop: 10,
  },
  transactionContainer: {
    height: 60,
    width: '100%',
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    alignItems: 'center',
  },
  iconContainer: {
    width: 35,
    height: 35,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 50,
    marginRight: 10,
  },
  iconNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  descriptionContainer: {
    flexDirection: 'row',
  },
  descriptionText: {
    fontFamily: 'FiraCode-Medium',
    fontSize: 10,
    includeFontPadding: false,
    marginRight: 5,
  },
  transactionText: {
    fontFamily: 'FiraCode-Medium',
    fontSize: 14,
    includeFontPadding: false,
  },
});
