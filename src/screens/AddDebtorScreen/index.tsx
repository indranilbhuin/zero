import {View} from 'react-native';
import React from 'react';
import AppHeader from '../../components/atoms/AppHeader';
import {goBack} from '../../utils/navigationUtils';
import CustomInput from '../../components/atoms/CustomInput';
import CategoryContainer from '../../components/molecules/CategoryContainer';
import debtCategories from '../../../assets/jsons/defaultDebtAccounts.json';
import PrimaryButton from '../../components/atoms/PrimaryButton';
import useAddDebtor from './useAddDebtor';
import PrimaryView from '../../components/atoms/PrimaryView';
import PrimaryText from '../../components/atoms/PrimaryText';
import mainStyles from '../../styles/main';

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
    <PrimaryView colors={colors}>
      <View style={mainStyles.headerContainer}>
        <AppHeader onPress={goBack} colors={colors} text="Add Debtor" />
      </View>
      <PrimaryText style={{marginBottom: 5}}>Select Debt Category</PrimaryText>

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
    </PrimaryView>
  );
};

export default AddDebtorScreen;
