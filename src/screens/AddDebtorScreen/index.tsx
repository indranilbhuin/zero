import {Text, View} from 'react-native';
import React from 'react';
import AppHeader from '../../components/AppHeader';
import {goBack} from '../../utils/navigationUtils';
import CustomInput from '../../components/CustomInput';
import CategoryContainer from '../../components/CategoryContainer';
import debtCategories from '../../../assets/jsons/defaultDebtAccounts.json';
import PrimaryButton from '../../components/PrimaryButton';
import styles from './style';
import useAddDebtor from './useAddDebtor';

const AddDebtorScreen = () => {
  const {
    colors,
    toggleCategorySelection,
    selectedCategories,
    debtorTitle,
    handleAddDebtor,
    setDebtorTitle,
  } = useAddDebtor();

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
