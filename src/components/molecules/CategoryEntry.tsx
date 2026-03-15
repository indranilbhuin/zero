import {TouchableOpacity, View} from 'react-native';
import React, {useCallback, useMemo, useState, memo} from 'react';
import PrimaryView from '../atoms/PrimaryView';
import AppHeader from '../atoms/AppHeader';
import CustomInput from '../atoms/CustomInput';
import PrimaryText from '../atoms/PrimaryText';
import Icon from '../atoms/Icons';
import PrimaryButton from '../atoms/PrimaryButton';
import useThemeColors from '../../hooks/useThemeColors';
import {goBack} from '../../utils/navigationUtils';
import {useDispatch, useSelector} from 'react-redux';
import {selectUserId} from '../../redux/slice/userIdSlice';
import {createCategory, updateCategoryById} from '../../watermelondb/services';
import {fetchCategories, selectCategoryData} from '../../redux/slice/categoryDataSlice';
import {categorySchema} from '../../utils/validationSchema';
import defaultCategories from '../../../assets/jsons/defaultCategories.json';
import {FlashList} from '@shopify/flash-list';
import {SheetManager} from 'react-native-actions-sheet';
import {AppDispatch} from '../../redux/store';
import {gs} from '../../styles/globalStyles';

interface CategorySelection {
  name: string;
  icon?: string;
  color?: string;
}

interface CategoryEntryProps {
  type: string;
  route?: any;
}

const CategoryEntry: React.FC<CategoryEntryProps> = ({type, route}) => {
  const colors = useThemeColors();
  const dispatch = useDispatch<AppDispatch>();
  const categoryData = route?.params;
  const isAddButton = type === 'Add';

  const [categoryName, setCategoryName] = useState(isAddButton ? '' : categoryData?.categoryName ?? '');
  const [selectedIcon, setSelectedIcon] = useState(isAddButton ? 'null' : categoryData?.categoryIcon ?? 'null');
  const [selectedColor, setSelectedColor] = useState(isAddButton ? 'null' : categoryData?.categoryColor ?? 'null');
  const [selectedCategories, setSelectedCategories] = useState<Array<CategorySelection>>([]);

  const selectedCategoryNames = useMemo(() => new Set(selectedCategories.map(c => c.name)), [selectedCategories]);

  const allCategories = useSelector(selectCategoryData) ?? [];
  const existingCategoryNamesSet = useMemo(
    () => new Set((allCategories ?? []).map((category: CategorySelection) => category.name)),
    [allCategories],
  );
  const filteredCategories = useMemo(
    () => defaultCategories.filter(category => !existingCategoryNamesSet.has(category.name)),
    [existingCategoryNamesSet],
  );

  const userId = useSelector(selectUserId);
  const isValid = categorySchema.safeParse(categoryName).success;

  const handleAddCategory = useCallback(async () => {
    try {
      await createCategory(categoryName, userId, selectedIcon, selectedColor);
      dispatch(fetchCategories());
      goBack();
    } catch (error) {
      if (__DEV__) {
        console.error('Error creating category:', error);
      }
    }
  }, [categoryName, userId, selectedIcon, selectedColor, dispatch]);

  const handleAddFromDefaultCategory = useCallback(async () => {
    for (const category of selectedCategories) {
      await createCategory(category.name, userId, category.icon ?? null, category.color ?? null);
    }
    dispatch(fetchCategories());
    goBack();
  }, [selectedCategories, userId, dispatch]);

  const handleUpdateCategory = useCallback(async () => {
    try {
      await updateCategoryById(categoryData?.categoryId, categoryName, selectedIcon, selectedColor);
      dispatch(fetchCategories());
      goBack();
    } catch (error) {
      if (__DEV__) {
        console.error('Error updating category:', error);
      }
    }
  }, [categoryData?.categoryId, categoryName, selectedIcon, selectedColor, dispatch]);

  const handleAddFromDefaultOrAddCategory = useCallback(() => {
    if (isAddButton) {
      if (selectedCategories.length > 0) {
        handleAddFromDefaultCategory();
      } else {
        handleAddCategory();
      }
    } else {
      handleUpdateCategory();
    }
  }, [isAddButton, selectedCategories.length, handleAddFromDefaultCategory, handleAddCategory, handleUpdateCategory]);

  const handleOpenIconPicker = useCallback(() => {
    SheetManager.show('icon-picker-sheet', {
      payload: {
        selectedIcon,
        onSelect: (icon: string) => {
          setSelectedIcon(icon);
          SheetManager.hide('icon-picker-sheet');
        },
      },
    });
  }, [selectedIcon]);

  const handleOpenColorPicker = useCallback(() => {
    SheetManager.show('color-picker-sheet', {
      payload: {
        selectedColor,
        onSelect: (color: string) => {
          setSelectedColor(color);
          SheetManager.hide('color-picker-sheet');
        },
      },
    });
  }, [selectedColor]);

  const toggleCategorySelection = useCallback(
    (category: CategorySelection) => {
      if (selectedCategoryNames.has(category.name)) {
        setSelectedCategories(prev => prev.filter(item => item.name !== category.name));
      } else {
        setSelectedCategories(prev => [...prev, category]);
      }
    },
    [selectedCategoryNames],
  );

  const renderDefaultCategoryItem = useCallback(
    ({item: category}: {item: CategorySelection}) => {
      const isSelected = selectedCategoryNames.has(category.name);

      return (
        <TouchableOpacity onPress={() => toggleCategorySelection(category)} activeOpacity={0.7}>
          <View
            style={[
              gs.py8,
              gs.px14,
              gs.mr8,
              gs.mt5,
              gs.rounded12,
              gs.rowCenter,
              gs.gap6,
              {backgroundColor: isSelected ? colors.primaryText : colors.secondaryAccent},
            ]}>
            {category.icon ? (
              <Icon
                name={category.icon}
                size={16}
                color={isSelected ? colors.buttonText : (category.color ?? colors.secondaryText)}
              />
            ) : null}
            <PrimaryText
              size={13}
              weight={isSelected ? 'semibold' : 'regular'}
              color={isSelected ? colors.buttonText : colors.primaryText}>
              {category.name}
            </PrimaryText>
          </View>
        </TouchableOpacity>
      );
    },
    [colors, selectedCategoryNames, toggleCategorySelection],
  );

  return (
    <PrimaryView colors={colors} style={gs.justifyBetween} dismissKeyboardOnTouch>
      <View>
        <View style={[gs.mb20, gs.mt20]}>
          <AppHeader onPress={goBack} colors={colors} text={isAddButton ? 'Add Category' : 'Edit Category'} />
        </View>

        <CustomInput
          colors={colors}
          input={categoryName}
          setInput={setCategoryName}
          placeholder="eg. Stationary"
          label="Category Name"
          schema={categorySchema}
        />

        <PrimaryText size={12} color={colors.secondaryText} style={gs.mb8}>Appearance</PrimaryText>
        <View style={[gs.row, gs.gap8, gs.mb15]}>
          <TouchableOpacity
            onPress={handleOpenIconPicker}
            activeOpacity={0.7}
            style={[
              gs.py10,
              gs.px14,
              gs.rounded12,
              gs.rowCenter,
              gs.gap8,
              gs.flex1,
              {backgroundColor: colors.secondaryAccent},
            ]}>
            <View
              style={[
                gs.size32,
                gs.roundedFull,
                gs.center,
                {backgroundColor: colors.containerColor},
              ]}>
              <Icon
                name={selectedIcon === 'null' ? 'shapes' : selectedIcon}
                size={16}
                color={colors.primaryText}
              />
            </View>
            <View style={gs.flex1}>
              <PrimaryText size={11} color={colors.secondaryText}>Icon</PrimaryText>
              <PrimaryText size={13} weight="medium">
                {selectedIcon === 'null' ? 'Choose' : 'Change'}
              </PrimaryText>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleOpenColorPicker}
            activeOpacity={0.7}
            style={[
              gs.py10,
              gs.px14,
              gs.rounded12,
              gs.rowCenter,
              gs.gap8,
              gs.flex1,
              {backgroundColor: colors.secondaryAccent},
            ]}>
            <View
              style={[
                gs.size32,
                gs.roundedFull,
                gs.center,
                {backgroundColor: selectedColor === 'null' ? colors.accentGreen : selectedColor},
              ]}
            />
            <View style={gs.flex1}>
              <PrimaryText size={11} color={colors.secondaryText}>Color</PrimaryText>
              <PrimaryText size={13} weight="medium">
                {selectedColor === 'null' ? 'Choose' : 'Change'}
              </PrimaryText>
            </View>
          </TouchableOpacity>
        </View>

        {filteredCategories.length !== 0 && isAddButton ? (
          <>
            <View style={[gs.rowCenter, gs.gap8, gs.mb8]}>
              <View style={[gs.flex1, {height: 0.5, backgroundColor: colors.secondaryAccent}]} />
              <PrimaryText size={11} color={colors.secondaryText}>or pick from defaults</PrimaryText>
              <View style={[gs.flex1, {height: 0.5, backgroundColor: colors.secondaryAccent}]} />
            </View>
            <View style={[gs.minH55, gs.mt5]}>
              <FlashList
                data={filteredCategories}
                renderItem={renderDefaultCategoryItem}
                keyExtractor={item => item.name}
                scrollEnabled={false}
                horizontal
              />
            </View>
          </>
        ) : null}
      </View>

      <PrimaryButton
        onPress={handleAddFromDefaultOrAddCategory}
        colors={colors}
        buttonTitle={isAddButton ? 'Add' : 'Update'}
        disabled={!isValid && selectedCategories.length === 0}
      />
    </PrimaryView>
  );
};

export default memo(CategoryEntry);
