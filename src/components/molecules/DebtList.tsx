import {StyleSheet, TouchableOpacity, View} from 'react-native';
import React from 'react';
import Debt from '../../schemas/DebtSchema';
import PrimaryText from '../atoms/PrimaryText';
import Icon from '../atoms/Icons';
import moment from 'moment';
import {Colors} from '../../hooks/useThemeColors';
import {formatCurrency} from '../../utils/numberUtils';

interface DebtListProps {
  colors: Colors;
  handleEditDebt: any;
  handleDeleteDebt: any;
  individualDebts: Array<Debt>;
  currencySymbol: string;
}

const DebtItem = ({
  colors,
  handleEditDebt,
  handleDeleteDebt,
  individualDebts,
  label,
  currencySymbol,
}) => {
  return (
    <View>
      <PrimaryText style={{fontSize: 12, marginBottom: 5}}>{label}</PrimaryText>
      <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
        {individualDebts?.map((debt: Debt) => (
          <View key={String(debt._id)}>
            <View
              style={[
                styles.categoryContainer,
                {
                  backgroundColor: colors.secondaryAccent,
                },
              ]}>
              <TouchableOpacity
                onPress={() =>
                  handleEditDebt(
                    String(debt._id),
                    debt.description,
                    debt.amount,
                    debt.date,
                    debt.type,
                  )
                }>
                <PrimaryText
                  style={{
                    color: colors.primaryText,
                    fontSize: 12,
                    marginRight: 5,
                  }}>
                  {debt.description}: {currencySymbol}
                  {formatCurrency(debt.amount)}
                </PrimaryText>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleDeleteDebt(String(debt._id))}>
                <Icon
                  name={'delete-empty'}
                  size={20}
                  color={colors.accentOrange}
                  type={'MaterialCommunityIcons'}
                />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

const DebtList: React.FC<DebtListProps> = ({
  colors,
  handleEditDebt,
  handleDeleteDebt,
  individualDebts,
  currencySymbol,
}) => {
  const groupedExpenses = new Map<string, Array<Debt>>();

  individualDebts?.forEach(debt => {
    const date = moment(debt.date).format('YYYY-MM-DD');
    const currentGroup = groupedExpenses.get(date) ?? [];
    currentGroup.push(debt);
    groupedExpenses.set(date, currentGroup);
  });

  return (
    <View style={styles.debtsMainContainer}>
      {Array.from(groupedExpenses.keys()).map(date => (
        <DebtItem
          key={date}
          colors={colors}
          handleEditDebt={handleEditDebt}
          handleDeleteDebt={handleDeleteDebt}
          individualDebts={groupedExpenses.get(date) ?? []}
          currencySymbol={currencySymbol}
          label={moment(date).calendar(null, {
            sameDay: '[Today]',
            nextDay: '[Tomorrow]',
            nextWeek: 'dddd',
            lastDay: '[Yesterday]',
            lastWeek: '[Last] dddd',
            sameElse: 'DD MMM YYYY',
          })}
        />
      ))}
    </View>
  );
};

export default DebtList;

const styles = StyleSheet.create({
  debtsMainContainer: {
    flexDirection: 'column',
    flexWrap: 'wrap',
  },
  categoryContainer: {
    height: 40,
    padding: 5,
    marginRight: 5,
    borderRadius: 5,
    paddingLeft: 10,
    paddingRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 5,
    flexDirection: 'row',
  },
});
