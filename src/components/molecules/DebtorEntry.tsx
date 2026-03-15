import {ScrollView, View} from 'react-native';
import React, {useCallback, useState, memo} from 'react';
import PrimaryView from '../atoms/PrimaryView';
import {goBack} from '../../utils/navigationUtils';
import useThemeColors from '../../hooks/useThemeColors';
import AppHeader from '../atoms/AppHeader';
import PrimaryText from '../atoms/PrimaryText';
import CategoryContainer from './CategoryContainer';
import CustomInput from '../atoms/CustomInput';
import PrimaryButton from '../atoms/PrimaryButton';
import {useDispatch, useSelector} from 'react-redux';
import {selectUserId} from '../../redux/slice/userIdSlice';
import {createDebtor, updateDebtorById} from '../../watermelondb/services';
import {fetchDebtors} from '../../redux/slice/debtorDataSlice';
import debtCategories from '../../../assets/jsons/defaultDebtAccounts.json';
import {nameSchema} from '../../utils/validationSchema';
import {fetchDebtsByDebtor} from '../../redux/slice/debtDataSlice';
import {AppDispatch} from '../../redux/store';
import {gs} from '../../styles/globalStyles';

interface DebtCategory {
  name: string;
  icon?: string;
  color?: string;
}

interface DebtorEntryProps {
  type: string;
  route?: any;
}

const DebtorEntry: React.FC<DebtorEntryProps> = ({type, route}) => {
  const colors = useThemeColors();
  const debtorData = route?.params;
  const isAddButton = type === 'Add';
  const dispatch = useDispatch<AppDispatch>();
  const [debtorTitle, setDebtorTitle] = useState(isAddButton ? '' : debtorData?.debtorName ?? '');
  const [selectedCategories, setSelectedCategories] = useState<Array<DebtCategory>>(
    isAddButton ? [] : debtCategories.filter(category => category.name === debtorData?.debtorType),
  );
  const userId = useSelector(selectUserId);
  const isValid = nameSchema.safeParse(debtorTitle).success;

  const toggleCategorySelection = useCallback(
    (category: DebtCategory) => {
      if (selectedCategories.some(c => c.name === category.name)) {
        setSelectedCategories([]);
      } else {
        setSelectedCategories([category]);
      }
    },
    [selectedCategories],
  );

  const handleAddDebtor = useCallback(async () => {
    try {
      await createDebtor(
        debtorTitle,
        userId,
        selectedCategories[0]?.icon ?? null,
        selectedCategories[0]?.name ?? '',
        selectedCategories[0]?.color ?? null,
      );
      dispatch(fetchDebtors());
      goBack();
    } catch (error) {
      if (__DEV__) {
        console.error('Error creating debtor:', error);
      }
    }
  }, [debtorTitle, userId, selectedCategories, dispatch]);

  const handleUpdateDebtor = useCallback(async () => {
    try {
      await updateDebtorById(
        debtorData?.debtorId,
        debtorTitle,
        selectedCategories[0]?.name ?? '',
        selectedCategories[0]?.icon,
        selectedCategories[0]?.color,
      );
      dispatch(fetchDebtors());
      dispatch(fetchDebtsByDebtor(debtorData.debtorId));
      goBack();
    } catch (error) {
      if (__DEV__) {
        console.error('Error updating debtor:', error);
      }
    }
  }, [debtorData?.debtorId, debtorTitle, selectedCategories, dispatch]);

  return (
    <PrimaryView colors={colors} style={gs.justifyBetween} dismissKeyboardOnTouch>
      <View>
        <View style={[gs.mb20, gs.mt20]}>
          <AppHeader onPress={goBack} colors={colors} text={isAddButton ? 'Add Person' : 'Edit Person'} />
        </View>

        <PrimaryText size={12} color={colors.secondaryText} style={gs.mb8}>Type</PrimaryText>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={gs.mb15}>
          <CategoryContainer
            categories={debtCategories}
            colors={colors}
            toggleCategorySelection={toggleCategorySelection}
            selectedCategories={selectedCategories}
          />
        </ScrollView>

        <CustomInput
          colors={colors}
          input={debtorTitle}
          setInput={setDebtorTitle}
          placeholder="eg. John Doe or Axis"
          label="Name"
          schema={nameSchema}
        />
      </View>
      <PrimaryButton
        onPress={isAddButton ? handleAddDebtor : handleUpdateDebtor}
        colors={colors}
        buttonTitle={isAddButton ? 'Add' : 'Update'}
        disabled={!isValid}
      />
    </PrimaryView>
  );
};

export default memo(DebtorEntry);
