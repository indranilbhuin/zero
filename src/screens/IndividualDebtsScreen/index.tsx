import {
  RefreshControl,
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
import homeStyles from '../HomeScreen/style';
import Icon from '../../components/Icons';
import {useDispatch, useSelector} from 'react-redux';
import {
  getDebtRequest,
  selectDebtData,
  selectDebtError,
  selectDebtLoading,
} from '../../redux/slice/debtDataSlice';
import {deleteDebtById} from '../../services/DebtService';
import {getAllDebtRequest} from '../../redux/slice/allDebtDataSlice';

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
  const [refreshing, setRefreshing] = useState(false);
  const individualDebts = useSelector(selectDebtData);
  const individualDebtsCopy = JSON.parse(JSON.stringify(individualDebts));
  const debtLoading = useSelector(selectDebtLoading);
  const debtError = useSelector(selectDebtError);
  const route = useRoute<IndividualDebtsScreenRouteProp>();
  const {debtorName, debtorId, debtorTotal} = route.params;
  console.log(debtorId);

  console.log(route.params);

  const onRefresh = () => {
    setRefreshing(true);
  };

  const handleEditDebt = (debtId, debtDescription, amount, debtDate) => {
    navigate('UpdateDebtScreen', {
      debtId,
      debtDescription,
      amount,
      debtorName,
      debtDate,
      debtorId
    });
  };

  const handleDeleteDebt = debtId => {
    deleteDebtById(Realm.BSON.ObjectID.createFromHexString(debtId));
    dispatch(getDebtRequest(debtorId));
    dispatch(getAllDebtRequest());
    setRefreshing(true);
  };

  useEffect(() => {
    dispatch(getDebtRequest(debtorId));
  }, [debtorId]);

  useEffect(() => {
    if (refreshing) {
      dispatch(getDebtRequest(debtorId));
      setRefreshing(false);
    }
  }, [refreshing]);

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
