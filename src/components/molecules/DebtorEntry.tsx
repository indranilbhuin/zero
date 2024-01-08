import {StyleSheet, View} from 'react-native';
import React, {useState} from 'react';
import PrimaryView from '../atoms/PrimaryView';
import mainStyles from '../../styles/main';
import {goBack} from '../../utils/navigationUtils';
import useThemeColors from '../../hooks/useThemeColors';
import AppHeader from '../atoms/AppHeader';
import PrimaryText from '../atoms/PrimaryText';
import CategoryContainer from './CategoryContainer';
import CustomInput from '../atoms/CustomInput';
import PrimaryButton from '../atoms/PrimaryButton';
import {useDispatch, useSelector} from 'react-redux';
import Category from '../../schemas/CategorySchema';
import {selectUserId} from '../../redux/slice/userIdSlice';
import {createDebtor, updateDebtorById} from '../../services/DebtorService';
import {FETCH_ALL_DEBTOR_DATA} from '../../redux/actionTypes';
import debtCategories from '../../../assets/jsons/defaultDebtAccounts.json';
import {nameSchema} from '../../utils/validationSchema';
import {getDebtRequest} from '../../redux/slice/debtDataSlice';

interface DebtorEntryProps {
  type: string;
  route?: any;
}

const DebtorEntry: React.FC<DebtorEntryProps> = ({type, route}) => {
  const colors = useThemeColors();
  const debtorData = route?.params;
  const isAddButton = type === 'Add';
  const dispatch = useDispatch();
  const [debtorTitle, setDebtorTitle] = useState(
    isAddButton ? '' : debtorData.debtorName,
  );
  const [selectedCategories, setSelectedCategories] = useState<Array<any>>(
    isAddButton
      ? []
      : debtCategories.filter(
          category => category.name === debtorData.debtorType,
        ),
  );
  console.log('selected categories', selectedCategories);
  const userId = useSelector(selectUserId);
  const isValid = nameSchema.safeParse(debtorTitle).success;

  const toggleCategorySelection = (category: Category) => {
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

  const handleUpdateDebtor = () => {
    try {
      updateDebtorById(
        Realm.BSON.ObjectID.createFromHexString(debtorData.debtorId),
        debtorTitle,
        selectedCategories[0].icon,
        selectedCategories[0].name,
        selectedCategories[0].color,
      );
      dispatch({type: FETCH_ALL_DEBTOR_DATA});
      dispatch(getDebtRequest(debtorData.debtorId));
      goBack();
    } catch (error) {
      console.error('Error creating debtor:', error);
    }
  };

  return (
    <PrimaryView colors={colors} style={{justifyContent: 'space-between'}}>
      <View>
        <View style={mainStyles.headerContainer}>
          <AppHeader onPress={goBack} colors={colors} text={`${type} Debtor`} />
        </View>
        <PrimaryText style={{marginBottom: 5}}>
          Select Debt Category
        </PrimaryText>

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
          schema={nameSchema}
        />
      </View>
      <View style={{marginBottom: '10%'}}>
        <PrimaryButton
          onPress={isAddButton ? handleAddDebtor : handleUpdateDebtor}
          colors={colors}
          buttonTitle={type}
          disabled={!isValid}
        />
      </View>
    </PrimaryView>
  );
};

export default DebtorEntry;

const styles = StyleSheet.create({});
