import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import Icon from './Icons';

const DebtorList = ({colors, debtors}) => {
  return (
    <View
      style={{
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
      }}>
      {debtors.map(debtor => (
        <TouchableOpacity
          style={{
            alignItems: 'center',
            marginRight: '4%',
            marginBottom: '4%',
            marginLeft: '4%',
          }}
          key={debtor._id}>
          <View
            style={[
              styles.debtorContainer,
              {
                backgroundColor: colors.primaryText,
                borderColor: debtor.color,
              },
            ]}>
            <View>
              <Icon
                name={debtor.icon}
                size={30}
                color={debtor.color}
                type="MaterialCommunityIcons"
              />
            </View>
          </View>
          <Text style={[styles.subtitleText, {color: colors.primaryText}]}>
            {debtor.title}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default DebtorList;

const styles = StyleSheet.create({
  debtorContainer: {
    height: 50,
    width: 50,
    borderRadius: 50,
    padding: 5,
    alignItems: 'center',
    marginBottom: 5,
    justifyContent: 'center',
    borderWidth: 2,
  },
  subtitleText: {
    fontFamily: 'FiraCode-Medium',
    fontSize: 12,
    includeFontPadding: false,
  },
});
