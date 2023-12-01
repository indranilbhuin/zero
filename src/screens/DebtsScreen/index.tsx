import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useEffect } from 'react';
import HeaderContainer from '../../components/HeaderContainer';
import useThemeColors from '../../hooks/useThemeColors';
import homeStyles from '../HomeScreen/style';
import {navigate} from '../../utils/navigationUtils';
import Icon from '../../components/Icons';
import DebtorList from '../../components/DebtorList';
import { useDispatch, useSelector } from 'react-redux';
import { FETCH_ALL_DEBTOR_DATA } from '../../redux/actionTypes';
import { selectDebtorData } from '../../redux/slice/debtorDataSlice';

const DebtsScreen = () => {
  const colors = useThemeColors();
  const dispatch = useDispatch();
  const debtors = useSelector(selectDebtorData);
  console.log(debtors)

  useEffect(() => {
    dispatch({ type: FETCH_ALL_DEBTOR_DATA });
  }, []);

  return (
    <View
      style={[
        styles.mainContainer,
        {backgroundColor: colors.primaryBackground},
      ]}>
      <View style={{marginBottom: 15}}>
        <HeaderContainer headerText={'Debts'} />
      </View>
      <View
        style={{
          flexDirection: 'row',
          width: '100%',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 15,
        }}>
        <View
          style={[
            styles.categoryContainer,
            {
              backgroundColor: colors.primaryText,
              borderColor: colors.secondaryText,
              width: '48.5%',
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
            Person
          </Text>
        </View>
        <View
          style={[
            styles.categoryContainer,
            {
              backgroundColor: colors.primaryText,
              borderColor: colors.secondaryText,
              width: '48.5%',
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
            Other Accounts
          </Text>
        </View>
      </View>

      <ScrollView>
        <DebtorList colors={colors} debtors={debtors}/>
      </ScrollView>

      <View style={homeStyles.addButtonContainer}>
        <TouchableOpacity
          style={[homeStyles.addButton, {backgroundColor: colors.primaryText}]}
          onPress={() => navigate('AddDebtorScreen')}>
          <Icon
            name={'credit-card-plus'}
            size={30}
            color={colors.buttonText}
            type={'MaterialCommunityIcons'}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default DebtsScreen;

const styles = StyleSheet.create({
  mainContainer: {
    height: '100%',
    paddingLeft: '6%',
    paddingRight: '6%',
  },
  categoryContainer: {
    height: 35,
    padding: 5,
    marginRight: 5,
    borderRadius: 5,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  subtitleText: {
    fontFamily: 'FiraCode-Medium',
    fontSize: 15,
    includeFontPadding: false,
  },
});
