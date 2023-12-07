import {useDispatch} from 'react-redux';
import useThemeColors from '../../hooks/useThemeColors';
import {useMemo, useState} from 'react';
import {updateCategoryById} from '../../services/CategoryService';
import {FETCH_ALL_CATEGORY_DATA} from '../../redux/actionTypes';
import {goBack} from '../../utils/navigationUtils';
import allIcons from '../../../assets/jsons/categoryIcons.json';
import {RouteProp} from '@react-navigation/native';

export type UpdateCategoryScreenRouteProp = RouteProp<
  {
    UpdateCategoryScreen: {
      categoryId: string;
      categoryName: string;
      categoryIcon: string;
      categoryColor: string;
    };
  },
  'UpdateCategoryScreen'
>;

const useUpdateCategory = (route: UpdateCategoryScreenRouteProp) => {
  const categoryData = route.params;

  const colors = useThemeColors();
  const dispatch = useDispatch();
  const [categoryName, setCategoryName] = useState(categoryData.categoryName);
  const [isIconModalVisible, setIsIconModalVisible] = useState(false);
  const [selectedIcon, setSelectedIcon] = useState(categoryData.categoryIcon);
  const [searchText, setSearchText] = useState('');
  const [isColorModalVisible, setIsColorModalVisible] = useState(false);
  const [selectedColor, setSelectedColor] = useState(
    categoryData.categoryColor,
  );

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

  const handleIconModalClose = () => {
    setIsIconModalVisible(false);
  };

  const handleColorModalClose = () => {
    setIsColorModalVisible(false);
  };

  console.log('this is the selectedicon', selectedIcon);

  const filteredIcons = useMemo(() => {
    const lowerCaseSearch = searchText.toLowerCase();
    return Object.keys(allIcons).filter(iconName =>
      iconName.toLowerCase().includes(lowerCaseSearch),
    );
  }, [searchText]);

  return {
    colors,
    categoryName,
    setCategoryName,
    isIconModalVisible,
    setIsIconModalVisible,
    selectedIcon,
    setSelectedIcon,
    searchText,
    setSearchText,
    isColorModalVisible,
    setIsColorModalVisible,
    selectedColor,
    setSelectedColor,
    handleUpdateCategory,
    handleIconModalClose,
    handleColorModalClose,
    filteredIcons,
  };
};

export default useUpdateCategory;
