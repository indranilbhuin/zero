import {StyleSheet, Text, View} from 'react-native';
import React, {useState} from 'react';
import AppHeader from '../../components/AppHeader';
import {goBack} from '../../utils/navigationUtils';
import useThemeColors from '../../hooks/useThemeColors';
import CustomInput from '../../components/CustomInput';
import CategoryContainer from '../../components/CategoryContainer';
import debtCategories from '../../../assets/jsons/defaultDebtAccounts.json';
import PrimaryButton from '../../components/PrimaryButton';
import {createDebtor} from '../../services/DebtorService';
import {useDispatch, useSelector} from 'react-redux';
import {selectUserId} from '../../redux/slice/userIdSlice';
import {FETCH_ALL_DEBTOR_DATA} from '../../redux/actionTypes';

const AddDebtorScreen = () => {
  const colors = useThemeColors();
  const dispatch = useDispatch();
  const [debtorTitle, setDebtorTitle] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const userId = useSelector(selectUserId);

  const toggleCategorySelection = category => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories([]);
    } else {
      setSelectedCategories([category]);
    }
  };

  const handleAddDebtor = () => {
    try {
      createDebtor(
        debtorTitle,
        Realm.BSON.ObjectID.createFromHexString(userId),
        selectedCategories[0].icon,
        selectedCategories[0].name,
        selectedCategories[0].color,
      );
      dispatch({type: FETCH_ALL_DEBTOR_DATA});
      goBack();
    } catch (error) {
      console.error('Error creating debtor:', error);
    }
  };

  return (
    <View
      style={[
        styles.mainContainer,
        {backgroundColor: colors.primaryBackground},
      ]}>
      <View style={styles.headerContainer}>
        <AppHeader onPress={goBack} colors={colors} text="Add Debtor" />
      </View>
      <Text
        style={[
          styles.labelText,
          {color: colors.primaryText, fontSize: 14, marginBottom: 5},
        ]}>
        Select Debt Category
      </Text>

      <View style={{marginBottom: 10}}>
        <CategoryContainer
          categories={debtCategories}
          colors={colors}
          toggleCategorySelection={toggleCategorySelection}
          selectedCategories={selectedCategories}
        />
      </View>

      <CustomInput
        colors={colors}
        input={debtorTitle}
        setInput={setDebtorTitle}
        placeholder="eg. John Doe or Axis"
        label="Debtor Name"
      />

      <View style={{marginTop: '110%'}}>
        <PrimaryButton
          onPress={handleAddDebtor}
          colors={colors}
          buttonTitle="Add"
        />
      </View>
    </View>
  );
};

export default AddDebtorScreen;

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
  labelText: {
    fontFamily: 'FiraCode-Medium',
    fontSize: 15,
    includeFontPadding: false,
  },
});
