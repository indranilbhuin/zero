import {
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
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
    onRefresh,
    handleEditDebt,
    handleDeleteDebt,
    currencySymbol,
    handleDeleteDebtor,
    handleMarkAsPaid,
    handleUpdateDebtor,
    sortedDebts,
  } = useIndividualDebts(route);

  if (debtLoading) {
    return <Text>Loading ...</Text>;
  }

  if (debtError) {
    return <Text>Error</Text>;
  }

  return (
    <PrimaryView colors={colors}>
      <View style={mainStyles.headerContainer}>
        <AppHeader onPress={goBack} colors={colors} text={debtorName} />
      </View>
      <View
        style={{
          flexDirection: 'row',
          width: '100%',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <View
          style={[
            styles.categoryContainer,
            {
              backgroundColor: colors.secondaryAccent,
              borderColor: colors.secondaryContainerColor,
              width: '50%',
              flexDirection: 'column',
            },
          ]}>
          <PrimaryText
            style={{
              color: colors.primaryText,
              fontSize: 13,
              fontFamily: 'FiraCode-SemiBold',
            }}>
            Total
          </PrimaryText>
          <PrimaryText
            style={{
              color: colors.primaryText,
              fontSize: 13,
              fontFamily: 'FiraCode-SemiBold',
            }}>
            {currencySymbol}
            {debtorTotal}
          </PrimaryText>
        </View>
        <TouchableOpacity
          style={[
            styles.categoryContainer,
            {
              backgroundColor: colors.secondaryAccent,
              borderColor: colors.secondaryContainerColor,
              width: '15%',
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
              width: '15%',
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
              width: '15%',
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

      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        <DebtList
          colors={colors}
          handleEditDebt={handleEditDebt}
          handleDeleteDebt={handleDeleteDebt}
          individualDebts={sortedDebts}
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
  );
};

export default IndividualDebtsScreen;
