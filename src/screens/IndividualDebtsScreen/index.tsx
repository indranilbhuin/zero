import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import AppHeader from '../../components/AppHeader';
import {goBack, navigate} from '../../utils/navigationUtils';
import useThemeColors from '../../hooks/useThemeColors';
import {RouteProp, useRoute} from '@react-navigation/native';
import CustomInput from '../../components/CustomInput';
import PrimaryButton from '../../components/PrimaryButton';
import homeStyles from '../HomeScreen/style';
import Icon from '../../components/Icons';
import categories from '../../../assets/jsons/defaultCategories.json';
import { useDispatch, useSelector } from 'react-redux';
import { getDebtRequest, selectDebtData } from '../../redux/slice/debtDataSlice';

type IndividualDebtsScreenRouteProp = RouteProp<
  {
    IndividualDebtsScreen: {
      debtorName: string;
      debtorId: string;
    };
  },
  'IndividualDebtsScreen'
>;

const IndividualDebtsScreen = () => {
  const colors = useThemeColors();
  const dispatch = useDispatch();
  const route = useRoute<IndividualDebtsScreenRouteProp>();
  const {debtorName, debtorId, debtorTotal} = route.params;
  console.log(debtorId);

  console.log(route.params);

  const handleEditDebt = () => {};

  useEffect(() => {
    dispatch(getDebtRequest(debtorId));
  }, [debtorId]);

  const individualDebts = useSelector(selectDebtData);

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
      <ScrollView>
        <View style={styles.debtsMainContainer}>
          {individualDebts?.map(debt => (
            <TouchableOpacity key={debt._id} onPress={handleEditDebt}>
              <View
                style={[
                  styles.categoryContainer,
                  {
                    backgroundColor: colors.primaryText,
                    borderColor: colors.secondaryText,
                  },
                ]}>
                <Text
                  style={[
                    styles.subtitleText,
                    {color: colors.buttonText, fontSize: 13, marginRight: 5},
                  ]}>
                  {debt.description}: {debt.amount}
                </Text>
                <Icon
                  name={'delete-empty'}
                  size={20}
                  color={colors.accentOrange}
                  type={'MaterialCommunityIcons'}
                />
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
      <View style={homeStyles.addButtonContainer}>
        <TouchableOpacity
          style={[homeStyles.addButton, {backgroundColor: colors.primaryText}]}
          onPress={() => navigate('AddDebtsScreen', {debtorId})}>
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

const styles = StyleSheet.create({
  mainContainer: {
    height: '100%',
    paddingLeft: '6%',
    paddingRight: '6%',
  },
  headerContainer: {
    marginBottom: 20,
    marginTop: 20,
  },
  submitButtonContainer: {
    marginTop: 5,
    marginBottom: 15,
  },
  categoryContainer: {
    height: 35,
    padding: 5,
    marginRight: 5,
    borderRadius: 5,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 5,
    flexDirection: 'row',
  },
  subtitleText: {
    fontFamily: 'FiraCode-Medium',
    fontSize: 15,
    includeFontPadding: false,
  },
  debtsMainContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});
