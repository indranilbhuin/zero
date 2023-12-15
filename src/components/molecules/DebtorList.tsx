import {StyleSheet, TouchableOpacity, View} from 'react-native';
import React from 'react';
import Icon from '../atoms/Icons';
import {navigate} from '../../utils/navigationUtils';
import Debtor from '../../schemas/DebtorSchema';
import Debt from '../../schemas/DebtSchema';
import PrimaryText from '../atoms/PrimaryText';
import {Colors} from '../../hooks/useThemeColors';

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

  const calculateTotalDebt = (debtorId: string) => {
    const debtorDebts = allDebts.filter(
      debt => debt.debtor?._id?.toString() === debtorId,
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
          key={String(debtor._id)}>
          <TouchableOpacity
            onPress={() =>
              handleDebtor(String(debtor._id), debtor.title, debtor.type)
            }
            onLongPress={() => handleLongPress(String(debtor._id))}
            delayLongPress={500}>
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
                  name={debtor.icon}
                  size={30}
                  color={debtor.color}
                  type="MaterialCommunityIcons"
                />
              </View>
            </View>
            <PrimaryText
              style={{
                color: colors.primaryText,
                alignSelf: 'center',
                fontSize: 12,
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
                color: colors.primaryText,
                fontSize: 12,
                fontFamily: 'FiraCode-SemiBold',
              }}>
              {currencySymbol}
              {calculateTotalDebt(String(debtor._id))}
            </PrimaryText>
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
});
