import {TouchableOpacity, View} from 'react-native';
import React, {useCallback, useMemo, memo} from 'react';
import Icon from '../atoms/Icons';
import {navigate} from '../../utils/navigationUtils';
import {DebtorData as Debtor, DebtData as DebtDocType} from '../../watermelondb/services';
import PrimaryText from '../atoms/PrimaryText';
import {Colors} from '../../hooks/useThemeColors';
import {formatCurrency} from '../../utils/numberUtils';
import {FlashList} from '@shopify/flash-list';
import {gs} from '../../styles/globalStyles';

interface Debt extends DebtDocType {
  debtor?: {type?: string};
}

interface DebtorListProps {
  currencySymbol: string;
  colors: Colors;
  debtors: Array<Debtor>;
  allDebts: Array<Debt>;
  ListHeaderComponent?: React.ComponentType<any> | React.ReactElement | null;
}

const DebtorList: React.FC<DebtorListProps> = ({colors, debtors, allDebts, currencySymbol, ListHeaderComponent}) => {
  const handleDebtor = useCallback((debtorId: string, debtorName: string, debtorType: string) => {
    navigate('IndividualDebtsScreen', {debtorId, debtorName, debtorType});
  }, []);

  const debtTotalsByDebtor = useMemo(() => {
    const totalsMap = new Map<string, number>();

    allDebts.forEach((debt: Debt) => {
      const debtorId = debt.debtorId;
      if (!debtorId) return;

      const current = totalsMap.get(debtorId) ?? 0;
      const delta = debt.type === 'Borrow' ? debt.amount : -debt.amount;
      totalsMap.set(debtorId, current + delta);
    });

    return totalsMap;
  }, [allDebts]);

  const getDebtTotal = useCallback(
    (debtorId: string): number => {
      return debtTotalsByDebtor.get(debtorId) ?? 0;
    },
    [debtTotalsByDebtor],
  );

  const getAmountColor = useCallback(
    (debtorId: string): string => {
      const totalDebt = getDebtTotal(debtorId);
      if (totalDebt < 0) {
        return colors.accentGreen;
      } else if (totalDebt > 0) {
        return colors.accentOrange;
      }
      return colors.primaryText;
    },
    [colors, getDebtTotal],
  );

  const renderDebtorItem = useCallback(
    ({item: debtor}: {item: Debtor}) => {
      const debtorId = String(debtor.id);
      const totalDebt = getDebtTotal(debtorId);
      const amountColor = getAmountColor(debtorId);

      return (
        <View style={[gs.itemsCenter, gs.flex1, {marginRight: '4%', marginBottom: '4%'}]}>
          <TouchableOpacity
            onPress={() => handleDebtor(debtorId, debtor.title, debtor.type)}
            delayLongPress={500}
            style={gs.center}>
            <View
              style={[
                gs.size50,
                gs.rounded50,
                gs.p5,
                gs.center,
                gs.mb5,
                gs.border2,
                {
                  backgroundColor: colors.sameWhite,
                  borderColor: debtor.color ?? colors.primaryText,
                },
              ]}>
              <View>
                <Icon name={debtor.icon ?? 'user'} size={30} color={debtor.color ?? colors.primaryText} />
              </View>
            </View>
            <PrimaryText size={12} color={colors.primaryText} style={[gs.textCenter, gs.selfCenter]}>
              {debtor.title}
            </PrimaryText>
          </TouchableOpacity>
          <View style={[gs.wFull, gs.itemsCenter, gs.rounded5, gs.mt5, {backgroundColor: colors.iconContainer}]}>
            <PrimaryText size={11} weight="semibold" color={amountColor} style={gs.textCenter}>
              {currencySymbol}
              {formatCurrency(Math.abs(totalDebt))}
            </PrimaryText>
          </View>
        </View>
      );
    },
    [colors, currencySymbol, getDebtTotal, getAmountColor, handleDebtor],
  );

  return (
    <View style={gs.flex1}>
      <FlashList
        data={debtors}
        renderItem={renderDebtorItem}
        numColumns={4}
        keyExtractor={item => String(item.id)}
        ListHeaderComponent={ListHeaderComponent}
        contentContainerStyle={gs.pb80}
      />
    </View>
  );
};

export default memo(DebtorList);
