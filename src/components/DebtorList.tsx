import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import Icon from './Icons';
import {navigate} from '../utils/navigationUtils';

const DebtorList = ({colors, debtors, allDebts}) => {
  const handleDebtor = (debtorId, debtorName, debtorTotal) => {
    navigate('IndividualDebtsScreen', {debtorId, debtorName, debtorTotal});
  };
  console.log('alldebts', allDebts);

  const calculateTotalDebt = debtorId => {
    console.log(debtorId);
    const debtorDebts = allDebts.filter(
      debt => debt.debtor._id.toString() === debtorId,
    );
    console.log(debtorDebts, 'hi');
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
        <TouchableOpacity
          style={{
            alignItems: 'center',
            marginRight: '4%',
            marginBottom: '4%',
            marginLeft: '4%',
          }}
          key={debtor._id}
          onPress={() =>
            handleDebtor(
              String(debtor._id),
              debtor.title,
              calculateTotalDebt(String(debtor._id)),
            )
          }>
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
            {debtor.title}: {calculateTotalDebt(String(debtor._id))}
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
