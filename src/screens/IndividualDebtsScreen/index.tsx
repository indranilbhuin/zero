import {
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import AppHeader from '../../components/atoms/AppHeader';
import {goBack, navigate} from '../../utils/navigationUtils';
import {useRoute} from '@react-navigation/native';
import homeStyles from '../HomeScreen/style';
import Icon from '../../components/atoms/Icons';
import styles from './style';
import useIndividualDebts, {
  IndividualDebtsScreenRouteProp,
} from './useIndividualDebts';
import PrimaryView from '../../components/atoms/PrimaryView';
import PrimaryText from '../../components/atoms/PrimaryText';
import mainStyles from '../../styles/main';
import DebtList from '../../components/molecules/DebtList';
import debtsStyles from '../DebtsScreen/style';
import {formatCurrency} from '../../utils/numberUtils';
import CustomToast from '../../components/molecules/CustomToast';

const IndividualDebtsScreen = () => {
  const route = useRoute<IndividualDebtsScreenRouteProp>();
  const {
    colors,
    refreshing,
    debtLoading,
    debtError,
    debtorName,
    debtorId,
    debtorTotal,
    debtorTotalColor,
    onRefresh,
    handleEditDebt,
    handleDeleteDebt,
    currencySymbol,
    handleDeleteDebtor,
    handleMarkAsPaid,
    handleUpdateDebtor,
    sortedBorrowings,
    sortedLendings,
    totalBorrowings,
    totalLendings,
    paidToastVisible,
    handleOk,
    handleCancel,
    deleteDebtorVisible,
    handleDeleteOk,
    handleDeleteCancel,
  } = useIndividualDebts(route);

  const [debtsType, setDebtsType] = useState('Borrow');

  if (debtLoading) {
    return <Text>Loading ...</Text>;
  }

  if (debtError) {
    return <Text>Error</Text>;
  }

  return (
    <>
      <PrimaryView colors={colors}>
        <View style={mainStyles.headerContainer}>
          <AppHeader onPress={goBack} colors={colors} text={debtorName} />
        </View>
        <View
          style={{
            flexDirection: 'row',
            width: '100%',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <View
            style={[
              styles.categoryContainer,
              {
                backgroundColor: colors.secondaryAccent,
                borderColor: colors.secondaryContainerColor,
                borderWidth: undefined,
                width: '49%',
                flexDirection: 'column',
              },
            ]}>
            <PrimaryText
              style={{
                color: debtorTotalColor,
                fontSize: 12,
                fontFamily: 'FiraCode-SemiBold',
              }}>
              Total
            </PrimaryText>
            <PrimaryText
              style={{
                color: debtorTotalColor,
                fontSize: 12,
                fontFamily: 'FiraCode-SemiBold',
              }}>
              {currencySymbol}
              {formatCurrency(Math.abs(debtorTotal))}
            </PrimaryText>
          </View>
          <View style={{width: '49%', flexDirection: 'row'}}>
            <TouchableOpacity
              style={[
                styles.categoryContainer,
                {
                  backgroundColor: colors.secondaryAccent,
                  borderColor: colors.secondaryContainerColor,
                  width: '31.2%',
                },
              ]}
              onPress={handleMarkAsPaid}>
              <Icon
                name={'check-circle'}
                size={20}
                color={colors.accentBlue}
                type={'MaterialIcons'}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.categoryContainer,
                {
                  backgroundColor: colors.secondaryAccent,
                  borderColor: colors.secondaryContainerColor,
                  width: '31.2%',
                },
              ]}
              onPress={handleUpdateDebtor}>
              <Icon
                name={'edit'}
                size={20}
                color={colors.accentGreen}
                type={'MaterialIcons'}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.categoryContainer,
                {
                  backgroundColor: colors.secondaryAccent,
                  borderColor: colors.secondaryContainerColor,
                  width: '31.2%',
                },
              ]}
              onPress={handleDeleteDebtor}>
              <Icon
                name={'delete-empty'}
                size={20}
                color={colors.accentOrange}
                type={'MaterialCommunityIcons'}
              />
            </TouchableOpacity>
          </View>
        </View>
        <View
          style={{
            flexDirection: 'row',
            width: '100%',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 15,
          }}>
          <TouchableOpacity
            onPress={() => setDebtsType('Borrow')}
            style={[
              debtsStyles.categoryContainer,
              {
                backgroundColor:
                  debtsType === 'Borrow'
                    ? colors.accentOrange
                    : colors.secondaryAccent,
                borderColor: colors.secondaryContainerColor,
                width: '49%',
                height: 50,
                marginRight: '2%',
              },
            ]}>
            <PrimaryText
              style={{
                color:
                  debtsType === 'Borrow'
                    ? colors.buttonText
                    : colors.primaryText,
                fontSize: 12,
                fontFamily: 'FiraCode-SemiBold',
                textAlign: 'center',
              }}>
              Borrowed
            </PrimaryText>
            <PrimaryText
              style={{
                color:
                  debtsType === 'Borrow'
                    ? colors.buttonText
                    : colors.primaryText,
                fontSize: 12,
                fontFamily: 'FiraCode-SemiBold',
                textAlign: 'center',
              }}>
              {currencySymbol}
              {formatCurrency(totalBorrowings)}
            </PrimaryText>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setDebtsType('Lend')}
            style={[
              debtsStyles.categoryContainer,
              {
                backgroundColor:
                  debtsType === 'Lend'
                    ? colors.accentGreen
                    : colors.secondaryAccent,
                borderColor: colors.secondaryContainerColor,
                width: '49%',
                height: 50,
              },
            ]}>
            <PrimaryText
              style={{
                color:
                  debtsType === 'Lend' ? colors.buttonText : colors.primaryText,
                fontSize: 12,
                fontFamily: 'FiraCode-SemiBold',
                textAlign: 'center',
              }}>
              Lent
            </PrimaryText>
            <PrimaryText
              style={{
                color:
                  debtsType === 'Lend' ? colors.buttonText : colors.primaryText,
                fontSize: 12,
                fontFamily: 'FiraCode-SemiBold',
                textAlign: 'center',
              }}>
              {currencySymbol}
              {formatCurrency(totalLendings)}
            </PrimaryText>
          </TouchableOpacity>
        </View>

        <ScrollView
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }>
          <DebtList
            colors={colors}
            handleEditDebt={handleEditDebt}
            handleDeleteDebt={handleDeleteDebt}
            individualDebts={
              debtsType === 'Borrow' ? sortedBorrowings : sortedLendings
            }
            currencySymbol={currencySymbol}
          />
        </ScrollView>
        <View style={homeStyles.addButtonContainer}>
          <TouchableOpacity
            style={[
              homeStyles.addButton,
              {backgroundColor: colors.secondaryBackground},
            ]}
            onPress={() => navigate('AddDebtsScreen', {debtorId, debtorName})}>
            <Icon
              name={'assignment-add'}
              size={30}
              color={colors.primaryText}
              type={'MaterialIcons'}
            />
          </TouchableOpacity>
        </View>
      </PrimaryView>
      <CustomToast
        visible={paidToastVisible}
        message={`You want to settle payment with ${debtorName}`}
        onCancel={handleCancel}
        onOk={handleOk}
        type="success"
      />
      <CustomToast
        visible={deleteDebtorVisible}
        message={`First you need to settle payment with ${debtorName}`}
        onCancel={handleDeleteCancel}
        onOk={handleDeleteOk}
        type="success"
      />
    </>
  );
};

export default IndividualDebtsScreen;
