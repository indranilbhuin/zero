import {
  Dimensions,
  Modal,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useMemo, useState} from 'react';
import PrimaryView from '../atoms/PrimaryView';
import AppHeader from '../atoms/AppHeader';
import CustomInput from '../atoms/CustomInput';
import PrimaryText from '../atoms/PrimaryText';
import Icon from '../atoms/Icons';
import PrimaryButton from '../atoms/PrimaryButton';
import useThemeColors from '../../hooks/useThemeColors';
import {goBack} from '../../utils/navigationUtils';
import allIcons from '../../../assets/jsons/categoryIcons.json';
import allColors from '../../../assets/jsons/categoryColors.json';
import {useDispatch, useSelector} from 'react-redux';
import {selectUserId} from '../../redux/slice/userIdSlice';
import {
  createCategory,
  updateCategoryById,
} from '../../services/CategoryService';
import {FETCH_ALL_CATEGORY_DATA} from '../../redux/actionTypes';
import mainStyles from '../../styles/main';
import {categorySchema} from '../../utils/validationSchema';
import onboardingStyles from '../../screens/OnboardingScreen/style';
import Category from '../../schemas/CategorySchema';
import defaultCategories from '../../../assets/jsons/defaultCategories.json';
import {selectCategoryData} from '../../redux/slice/categoryDataSlice';

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
  const [isIconModalVisible, setIsIconModalVisible] = useState(false);
  const [selectedIcon, setSelectedIcon] = useState(
    isAddButton ? 'null' : categoryData.categoryIcon,
  );
  const [isColorModalVisible, setIsColorModalVisible] = useState(false);
  const [selectedColor, setSelectedColor] = useState(
    isAddButton ? 'null' : categoryData.categoryColor,
  );
  const [selectedCategories, setSelectedCategories] = useState<Array<Category>>(
    [],
  );
  console.log('ggggggggggg', selectedCategories);
  const allCategories = useSelector(selectCategoryData);

  const existingCategoryNames = allCategories.map(category => category.name);

  const filteredCategories = defaultCategories.filter(
    category => !existingCategoryNames.includes(category.name),
  );

  const [searchText, setSearchText] = useState('');
  const userId = useSelector(selectUserId);

  const isValid = categorySchema.safeParse(categoryName).success;

  const handleAddCategory = () => {
    try {
      createCategory(
        categoryName,
        Realm.BSON.ObjectID.createFromHexString(userId),
        selectedIcon,
        selectedColor,
      );
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
        Realm.BSON.ObjectID.createFromHexString(userId),
        category.icon,
        category.color,
      );
    }
    dispatch({type: FETCH_ALL_CATEGORY_DATA});
    goBack();
  };

  const handleUpdateCategory = () => {
    try {
      updateCategoryById(
        Realm.BSON.ObjectID.createFromHexString(categoryData.categoryId),
        categoryName,
        selectedIcon,
        selectedColor,
      );
      dispatch({type: FETCH_ALL_CATEGORY_DATA});
      goBack();
    } catch (error) {
      console.error('Error creating category:', error);
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

  const handleIconModalClose = () => {
    setIsIconModalVisible(false);
  };

  const handleColorModalClose = () => {
    setIsColorModalVisible(false);
  };

  const filteredIcons = useMemo(() => {
    const lowerCaseSearch = searchText.toLowerCase();
    return Object.keys(allIcons).filter(iconName =>
      iconName.toLowerCase().includes(lowerCaseSearch),
    );
  }, [searchText]);

  const renderIcons = () => {
    const handleSelectIcon = (iconName: string) => {
      setSelectedIcon(iconName);
      setIsIconModalVisible(false);
    };

    const screenWidth = Dimensions.get('window').width;
    const iconsPerRow = 6;
    const iconSize = (screenWidth * 0.7) / iconsPerRow;

    return filteredIcons.map(iconName => (
      <TouchableOpacity
        key={iconName}
        style={[
          styles.iconItem,
          {
            width: iconSize,
            height: iconSize,
            backgroundColor:
              selectedIcon === iconName ? colors.primaryText : undefined,
          },
        ]}
        onPress={() => handleSelectIcon(iconName)}>
        <Icon
          name={iconName}
          size={30}
          color={
            selectedIcon === iconName
              ? colors.containerColor
              : colors.secondaryText
          }
          type={'MaterialCommunityIcons'}
        />
      </TouchableOpacity>
    ));
  };

  const renderColors = () => {
    const handleSelectColor = (color: string) => {
      setSelectedColor(color);
      setIsColorModalVisible(false);
    };

    const screenWidth = Dimensions.get('window').width;
    const colorsPerRow = 6;
    const colorSize = (screenWidth * 0.7) / colorsPerRow;
    console.log(allColors);

    return Object.keys(allColors).map(color => (
      <TouchableOpacity
        key={color}
        style={[
          styles.iconItem,
          {
            width: colorSize,
            height: colorSize,
            backgroundColor:
              selectedIcon === color ? colors.primaryText : undefined,
          },
        ]}
        onPress={() => handleSelectColor(color)}>
        <View style={[styles.colorCircle, {backgroundColor: color}]} />
      </TouchableOpacity>
    ));
  };

  const toggleCategorySelection = (category: Category) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(
        selectedCategories.filter(item => item !== category),
      );
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  return (
    <PrimaryView colors={colors} style={{justifyContent: 'space-between'}}>
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
            onPress={() => setIsIconModalVisible(true)}>
            {selectedIcon === 'null' ? (
              <Icon
                name={'dots-horizontal-circle'}
                size={25}
                color={colors.primaryText}
                type={'MaterialCommunityIcons'}
              />
            ) : (
              <Icon
                name={selectedIcon}
                size={25}
                color={colors.primaryText}
                type={'MaterialCommunityIcons'}
              />
            )}
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setIsIconModalVisible(true)}>
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
            onPress={() => setIsColorModalVisible(true)}>
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
          <TouchableOpacity onPress={() => setIsColorModalVisible(true)}>
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
            <View style={onboardingStyles.categoryMainContainer}>
              {filteredCategories?.map((category: any) => (
                <TouchableOpacity
                  key={String(category._id)}
                  onPress={() => toggleCategorySelection(category)}>
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
                          type="MaterialCommunityIcons"
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
              ))}
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

      <Modal
        animationType="fade"
        transparent={true}
        visible={isIconModalVisible}
        onRequestClose={handleIconModalClose}>
        <View style={[styles.modalContainer]}>
          <View
            style={[styles.modal, {backgroundColor: colors.containerColor}]}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <PrimaryText
                style={{
                  color: colors.primaryText,
                  fontSize: 17,
                  marginTop: 10,
                  marginBottom: 30,
                  fontFamily: 'FiraCode-SemiBold',
                }}>
                Select Icon
              </PrimaryText>

              <CustomInput
                input={searchText}
                label={undefined}
                colors={colors}
                placeholder={'Search Icons'}
                setInput={setSearchText}
                schema={undefined}
              />

              <View
                style={{
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                {renderIcons()}
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="fade"
        transparent={true}
        visible={isColorModalVisible}
        onRequestClose={handleColorModalClose}>
        <View style={[styles.modalContainer]}>
          <View
            style={[styles.modal, {backgroundColor: colors.containerColor}]}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <PrimaryText
                style={{
                  color: colors.primaryText,
                  fontSize: 17,
                  marginTop: 10,
                  marginBottom: 30,
                  fontFamily: 'FiraCode-SemiBold',
                }}>
                Select Color
              </PrimaryText>
              <View
                style={{
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                {renderColors()}
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </PrimaryView>
  );
};

export default CategoryEntry;

const styles = StyleSheet.create({
  modalContainer: {
    width: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    flex: 1,
    justifyContent: 'flex-end',
  },
  modal: {
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    padding: 15,
  },
  iconItem: {
    height: 30,
    width: 30,
    margin: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
  },
  colorCircle: {
    height: 30,
    width: 30,
    borderRadius: 50,
  },
  addButtonContainer: {
    marginBottom: 10,
  },
  submitButtonContainer: {
    marginTop: 5,
    marginBottom: 15,
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
});
