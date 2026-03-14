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
        <TouchableOpacity onPress={() => toggleCategorySelection(category)}>
          <View
            style={[
              gs.h45,
              gs.p10,
              gs.mr5,
              gs.mt5,
              gs.rounded5,
              gs.border2,
              gs.center,
              gs.row,
              {
                backgroundColor: isSelected ? `${colors.accentGreen}75` : colors.secondaryAccent,
                borderColor: colors.secondaryContainerColor,
              },
            ]}>
            {category.icon ? (
              <View style={gs.mr5}>
                <Icon name={category.icon} size={20} color={category.color} />
              </View>
            ) : null}

            <PrimaryText size={13} color={isSelected ? colors.buttonText : colors.primaryText}>
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
          <AppHeader onPress={goBack} colors={colors} text="Add Category" />
        </View>

        <CustomInput
          colors={colors}
          input={categoryName}
          setInput={setCategoryName}
          placeholder="eg. Stationary"
          label="Category Name"
          schema={categorySchema}
        />

        <PrimaryText style={gs.mb10}>Pick your own icon and color</PrimaryText>
        <View style={[gs.rowCenter, gs.mb10]}>
          <TouchableOpacity
            style={[
              gs.size40,
              gs.center,
              gs.rounded5,
              gs.border2,
              gs.mr10,
              {backgroundColor: colors.secondaryAccent, borderColor: colors.secondaryContainerColor},
            ]}
            onPress={handleOpenIconPicker}>
            {selectedIcon === 'null' ? (
              <Icon name="more-horizontal" size={25} color={colors.primaryText} />
            ) : (
              <Icon name={selectedIcon} size={25} color={colors.primaryText} />
            )}
          </TouchableOpacity>
          <TouchableOpacity onPress={handleOpenIconPicker}>
            <PrimaryText>Tap to select icon</PrimaryText>
          </TouchableOpacity>
        </View>

        <View style={[gs.rowCenter, gs.mb10]}>
          <TouchableOpacity
            style={[
              gs.size40,
              gs.center,
              gs.rounded5,
              gs.border2,
              gs.mr10,
              {backgroundColor: colors.secondaryAccent, borderColor: colors.secondaryContainerColor},
            ]}
            onPress={handleOpenColorPicker}>
            <View
              style={[
                gs.size30,
                gs.rounded50,
                {backgroundColor: selectedColor === 'null' ? colors.accentGreen : selectedColor},
              ]}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleOpenColorPicker}>
            <PrimaryText>Tap to select Color</PrimaryText>
          </TouchableOpacity>
        </View>
        {filteredCategories.length !== 0 && isAddButton ? (
          <>
            <PrimaryText color={colors.accentGreen} style={[gs.mb5p, gs.mt3p]}>
              or
            </PrimaryText>
            <PrimaryText>Add from default categories</PrimaryText>
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
        buttonTitle={type}
        disabled={!isValid && selectedCategories.length === 0}
      />
    </PrimaryView>
  );
};

export default memo(CategoryEntry);
