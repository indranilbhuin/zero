import {
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import AppHeader from '../../components/AppHeader';
import {goBack, navigate} from '../../utils/navigationUtils';
import {useRoute} from '@react-navigation/native';
import homeStyles from '../HomeScreen/style';
import Icon from '../../components/Icons';
import styles from './style';
import useIndividualDebts, {
  IndividualDebtsScreenRouteProp,
} from './useIndividualDebts';

const IndividualDebtsScreen = () => {
  const route = useRoute<IndividualDebtsScreenRouteProp>();
  const {
    colors,
    refreshing,
    individualDebtsCopy,
    debtLoading,
    debtError,
    debtorName,
    debtorId,
    debtorTotal,
    onRefresh,
    handleEditDebt,
    handleDeleteDebt,
  } = useIndividualDebts(route);

  if (debtLoading) {
    return <Text>Loading ...</Text>;
  }

  if (debtError) {
    return <Text>Error</Text>;
  }

  return (
    <View
      style={[
        styles.mainContainer,
        {backgroundColor: colors.primaryBackground},
      ]}>
      <View style={styles.headerContainer}>
        <AppHeader onPress={goBack} colors={colors} text={debtorName} />
      </View>
      <View
        style={[
          styles.categoryContainer,
          {
            backgroundColor: colors.primaryText,
            borderColor: colors.secondaryText,
            width: '100%',
          },
        ]}>
        <Text
          style={[
            styles.subtitleText,
            {
              color: colors.buttonText,
              fontSize: 13,
              fontFamily: 'FiraCode-SemiBold',
            },
          ]}>
          Total: {debtorTotal}
        </Text>
      </View>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        <View style={styles.debtsMainContainer}>
          {individualDebtsCopy?.map(debt => (
            <View key={debt._id}>
              <View
                style={[
                  styles.categoryContainer,
                  {
                    backgroundColor: colors.primaryText,
                    borderColor: colors.secondaryText,
                  },
                ]}>
                <TouchableOpacity
                  onPress={() =>
                    handleEditDebt(
                      debt._id,
                      debt.description,
                      debt.amount,
                      debt.date,
                    )
                  }>
                  <Text
                    style={[
                      styles.subtitleText,
                      {color: colors.buttonText, fontSize: 13, marginRight: 5},
                    ]}>
                    {debt.description}: {debt.amount}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDeleteDebt(debt._id)}>
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
      </ScrollView>
      <View style={homeStyles.addButtonContainer}>
        <TouchableOpacity
          style={[homeStyles.addButton, {backgroundColor: colors.primaryText}]}
          onPress={() => navigate('AddDebtsScreen', {debtorId, debtorName})}>
          <Icon
            name={'assignment-add'}
            size={30}
            color={colors.buttonText}
            type={'MaterialIcons'}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default IndividualDebtsScreen;
