import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import Icon from './Icons';
import {navigate} from '../utils/navigationUtils';

const DebtorList = ({colors, debtors, allDebts, currencySymbol}) => {
  const handleDebtor = (debtorId, debtorName, debtorTotal) => {
    navigate('IndividualDebtsScreen', {debtorId, debtorName, debtorTotal});
  };

  const handleLongPress = debtorId => {
    console.log(debtorId);
  };

  const calculateTotalDebt = debtorId => {
    const debtorDebts = allDebts.filter(
      debt => debt.debtor._id.toString() === debtorId,
    );
    const totalDebt = debtorDebts.reduce((acc, curr) => acc + curr.amount, 0);
    return totalDebt;
  };

  return (
    <View
      style={{
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
      }}>
      {debtors.map(debtor => (
        <View
          style={{
            alignItems: 'center',
            marginRight: '4%',
            marginBottom: '4%',
            width: '20%',
          }}
          key={debtor._id}>
          <TouchableOpacity
            onPress={() =>
              handleDebtor(
                String(debtor._id),
                debtor.title,
                calculateTotalDebt(String(debtor._id)),
              )
            }
            onLongPress={() => handleLongPress(String(debtor._id))}
            delayLongPress={500}>
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
            <Text
              style={[
                styles.subtitleText,
                {color: colors.primaryText, alignSelf: 'center'},
              ]}>
              {debtor.title}
            </Text>
          </TouchableOpacity>
          <View
            style={{
              backgroundColor: colors.primaryText,
              width: '100%',
              alignItems: 'center',
              borderRadius: 5,
              marginTop: 5,
            }}>
            <Text
              style={[
                styles.subtitleText,
                {
                  color: colors.buttonText,
                  fontSize: 12,
                  fontFamily: 'FiraCode-SemiBold',
                },
              ]}>
              {currencySymbol}
              {calculateTotalDebt(String(debtor._id))}
            </Text>
          </View>
        </View>
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
