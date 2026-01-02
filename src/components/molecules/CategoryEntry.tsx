import {StyleSheet, TouchableOpacity, View} from 'react-native';
import React, {useCallback, useState} from 'react';
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
import {FETCH_ALL_CATEGORY_DATA} from '../../redux/actionTypes';
import mainStyles from '../../styles/main';
import {categorySchema} from '../../utils/validationSchema';
import onboardingStyles from '../../screens/OnboardingScreen/style';
import defaultCategories from '../../../assets/jsons/defaultCategories.json';
import {selectCategoryData} from '../../redux/slice/categoryDataSlice';
import {FlashList} from '@shopify/flash-list';
import {SheetManager} from 'react-native-actions-sheet';

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
  const dispatch = useDispatch();
  const categoryData = route?.params;
  const isAddButton = type === 'Add';

  const [categoryName, setCategoryName] = useState(
    isAddButton ? '' : categoryData.categoryName,
  );
  const [selectedIcon, setSelectedIcon] = useState(
    isAddButton ? 'null' : categoryData.categoryIcon,
  );
  const [selectedColor, setSelectedColor] = useState(
    isAddButton ? 'null' : categoryData.categoryColor,
  );
  const [selectedCategories, setSelectedCategories] = useState<
    Array<CategorySelection>
  >([]);

  const allCategories = useSelector(selectCategoryData);
  const existingCategoryNames = allCategories.map(category => category.name);
  const filteredCategories = defaultCategories.filter(
    category => !existingCategoryNames.includes(category.name),
  );

  const userId = useSelector(selectUserId);
  const isValid = categorySchema.safeParse(categoryName).success;

  const handleAddCategory = async () => {
    try {
      await createCategory(categoryName, userId, selectedIcon, selectedColor);
      dispatch({type: FETCH_ALL_CATEGORY_DATA});
      goBack();
    } catch (error) {
      console.error('Error creating category:', error);
    }
  };

  const handleAddFromDefaultCategory = async () => {
    for (const category of selectedCategories) {
      await createCategory(
        category.name,
        userId,
        category.icon ?? null,
        category.color ?? null,
      );
    }
    dispatch({type: FETCH_ALL_CATEGORY_DATA});
    goBack();
  };

  const handleUpdateCategory = async () => {
    try {
      await updateCategoryById(
        categoryData.categoryId,
        categoryName,
        selectedIcon,
        selectedColor,
      );
      dispatch({type: FETCH_ALL_CATEGORY_DATA});
      goBack();
    } catch (error) {
      console.error('Error updating category:', error);
    }
  };

  const handleAddFromDefaultOrAddCategory = () => {
    if (isAddButton) {
      if (selectedCategories.length !== 0) {
        handleAddFromDefaultCategory();
      } else {
        handleAddCategory();
      }
    } else {
      handleUpdateCategory();
    }
  };

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
      if (selectedCategories.some(c => c.name === category.name)) {
        setSelectedCategories(
          selectedCategories.filter(item => item.name !== category.name),
        );
      } else {
        setSelectedCategories([...selectedCategories, category]);
      }
    },
    [selectedCategories],
  );

  const renderDefaultCategoryItem = useCallback(
    ({item: category}: {item: any}) => (
      <TouchableOpacity onPress={() => toggleCategorySelection(category)}>
        <View
          style={[
            onboardingStyles.categoryContainer,
            {
              backgroundColor: selectedCategories?.includes(category)
                ? `${colors.accentGreen}75`
                : colors.secondaryAccent,
              borderColor: colors.secondaryContainerColor,
            },
          ]}>
          {category.icon !== undefined ? (
            <View style={onboardingStyles.iconContainer}>
              <Icon
                name={category.icon}
                size={20}
                color={category.color}
              />
            </View>
          ) : null}

          <PrimaryText
            style={{
              color: selectedCategories?.includes(category)
                ? colors.buttonText
                : colors.primaryText,
              fontSize: 13,
            }}>
            {category.name}
          </PrimaryText>
        </View>
      </TouchableOpacity>
    ),
    [colors, selectedCategories, toggleCategorySelection],
  );

  return (
    <PrimaryView
      colors={colors}
      style={{justifyContent: 'space-between'}}
      dismissKeyboardOnTouch>
      <View>
        <View style={mainStyles.headerContainer}>
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

        <PrimaryText style={{marginBottom: 10}}>
          Pick your own icon and color
        </PrimaryText>
        <View style={styles.dateContainer}>
          <TouchableOpacity
            style={[
              styles.dateButtonContainer,
              {
                backgroundColor: colors.secondaryAccent,
                borderColor: colors.secondaryContainerColor,
              },
            ]}
            onPress={handleOpenIconPicker}>
            {selectedIcon === 'null' ? (
              <Icon
                name="more-horizontal"
                size={25}
                color={colors.primaryText}
              />
            ) : (
              <Icon
                name={selectedIcon}
                size={25}
                color={colors.primaryText}
              />
            )}
          </TouchableOpacity>
          <TouchableOpacity onPress={handleOpenIconPicker}>
            <PrimaryText>Tap to select icon</PrimaryText>
          </TouchableOpacity>
        </View>

        <View style={styles.dateContainer}>
          <TouchableOpacity
            style={[
              styles.dateButtonContainer,
              {
                backgroundColor: colors.secondaryAccent,
                borderColor: colors.secondaryContainerColor,
              },
            ]}
            onPress={handleOpenColorPicker}>
            {selectedColor === 'null' ? (
              <View
                style={[
                  styles.colorCircle,
                  {backgroundColor: colors.accentGreen},
                ]}
              />
            ) : (
              <View
                style={[styles.colorCircle, {backgroundColor: selectedColor}]}
              />
            )}
          </TouchableOpacity>
          <TouchableOpacity onPress={handleOpenColorPicker}>
            <PrimaryText>Tap to select Color</PrimaryText>
          </TouchableOpacity>
        </View>
        {filteredCategories.length !== 0 && isAddButton ? (
          <>
            <PrimaryText
              style={{
                marginBottom: '5%',
                color: colors.accentGreen,
                marginTop: '3%',
              }}>
              or
            </PrimaryText>
            <PrimaryText>Add from default categories</PrimaryText>
            <View style={styles.defaultCategoriesContainer}>
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

      <View style={{marginBottom: '10%'}}>
        <PrimaryButton
          onPress={handleAddFromDefaultOrAddCategory}
          colors={colors}
          buttonTitle={type}
          disabled={!isValid && selectedCategories.length === 0}
        />
      </View>
    </PrimaryView>
  );
};

export default CategoryEntry;

const styles = StyleSheet.create({
  colorCircle: {
    height: 30,
    width: 30,
    borderRadius: 50,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  dateButtonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
    width: 40,
    borderRadius: 5,
    borderWidth: 2,
    marginRight: 10,
  },
  defaultCategoriesContainer: {
    minHeight: 55,
    marginTop: 5,
  },
});
