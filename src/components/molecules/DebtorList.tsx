import {StyleSheet, TouchableOpacity, View} from 'react-native';
import React, {useCallback} from 'react';
import Icon from '../atoms/Icons';
import {navigate} from '../../utils/navigationUtils';
import {DebtorData as Debtor, DebtData as DebtDocType} from '../../watermelondb/services';
import PrimaryText from '../atoms/PrimaryText';
import {Colors} from '../../hooks/useThemeColors';
import {formatCurrency} from '../../utils/numberUtils';
import {FlashList} from '@shopify/flash-list';

// Extended debt type with optional debtor populated from Redux (for backward compatibility)
interface Debt extends DebtDocType {
  debtor?: {_id?: {toString(): string}};
}

interface DebtorListProps {
  currencySymbol: string;
  colors: Colors;
  debtors: Array<Debtor>;
  allDebts: Array<Debt>;
}

const DebtorList: React.FC<DebtorListProps> = ({
  colors,
  debtors,
  allDebts,
  currencySymbol,
}) => {
  const handleDebtor = (
    debtorId: string,
    debtorName: string,
    debtorType: string,
  ) => {
    navigate('IndividualDebtsScreen', {debtorId, debtorName, debtorType});
  };

  const handleLongPress = (debtorId: string) => {
    console.log(debtorId);
  };

  const calculateTotalDebt = useCallback(
    (debtorId: string) => {
      const debtorDebts = allDebts.filter(
        debt => (debt.debtorId ?? debt.debtor?._id?.toString()) === debtorId,
      );

      const debtorBorrowings = debtorDebts.filter(
        (debt: Debt) => debt.type === 'Borrow',
      );
      const debtorLendings = debtorDebts.filter(
        (debt: Debt) => debt.type === 'Lend',
      );

      const totalBorrowings = debtorBorrowings.reduce(
        (total: number, debt: {amount: number}) => total + debt.amount,
        0,
      );
      const totalLendings = debtorLendings.reduce(
        (total: number, debt: {amount: number}) => total + debt.amount,
        0,
      );

      const totalDebt = totalBorrowings - totalLendings;
      return totalDebt;
    },
    [allDebts],
  );

  const amountColor = useCallback(
    (debtorId: string) => {
      let textColor = colors.primaryText;
      const totalDebt = calculateTotalDebt(String(debtorId));

      if (totalDebt < 0) {
        textColor = colors.accentGreen;
      } else if (totalDebt > 0) {
        textColor = colors.accentOrange;
      }
      return textColor;
    },
    [colors, calculateTotalDebt],
  );

  const renderDebtorItem = useCallback(
    ({item: debtor}: {item: Debtor}) => (
      <View style={styles.debtorItemContainer}>
        <TouchableOpacity
          onPress={() =>
            handleDebtor(String(debtor.id), debtor.title, debtor.type)
          }
          onLongPress={() => handleLongPress(String(debtor.id))}
          delayLongPress={500}
          style={{justifyContent: 'center', alignItems: 'center'}}>
          <View
            style={[
              styles.debtorContainer,
              {
                backgroundColor: colors.sameWhite,
                borderColor: debtor.color ?? colors.primaryText,
              },
            ]}>
            <View>
              <Icon
                name={debtor.icon ?? 'account'}
                size={30}
                color={debtor.color ?? colors.primaryText}
                type="MaterialCommunityIcons"
              />
            </View>
          </View>
          <PrimaryText
            style={{
              color: colors.primaryText,
              alignSelf: 'center',
              fontSize: 12,
              textAlign: 'center',
            }}>
            {debtor.title}
          </PrimaryText>
        </TouchableOpacity>
        <View
          style={{
            backgroundColor: colors.iconContainer,
            width: '100%',
            alignItems: 'center',
            borderRadius: 5,
            marginTop: 5,
          }}>
          <PrimaryText
            style={{
              color: amountColor(String(debtor.id)),
              fontSize: 11,
              textAlign: 'center',
              fontFamily: 'FiraCode-SemiBold',
            }}>
            {currencySymbol}
            {formatCurrency(Math.abs(calculateTotalDebt(String(debtor.id))))}
          </PrimaryText>
        </View>
      </View>
    ),
    [colors, currencySymbol, amountColor, calculateTotalDebt],
  );

  return (
    <View style={styles.container}>
      <FlashList
        data={debtors}
        renderItem={renderDebtorItem}
        numColumns={4}
        keyExtractor={item => String(item.id)}
        scrollEnabled={false}
      />
    </View>
  );
};

export default DebtorList;

const styles = StyleSheet.create({
  container: {
    minHeight: 2,
  },
  debtorItemContainer: {
    alignItems: 'center',
    marginRight: '4%',
    marginBottom: '4%',
    flex: 1,
  },
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
});
