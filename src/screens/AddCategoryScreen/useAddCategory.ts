import {useDispatch, useSelector} from 'react-redux';
import useThemeColors from '../../hooks/useThemeColors';
import {useState} from 'react';
import {selectUserId} from '../../redux/slice/userIdSlice';
import {createCategory} from '../../services/CategoryService';
import {goBack} from '../../utils/navigationUtils';
import {FETCH_ALL_CATEGORY_DATA} from '../../redux/actionTypes';

const useAddCategory = () => {
  const colors = useThemeColors();
  const dispatch = useDispatch();
  const [categoryName, setCategoryName] = useState('');
  const [isIconModalVisible, setIsIconModalVisible] = useState(false);
  const [selectedIcon, setSelectedIcon] = useState('null');
  const [isColorModalVisible, setIsColorModalVisible] = useState(false);
  const [selectedColor, setSelectedColor] = useState('null');

  const [searchText, setSearchText] = useState('');
  const userId = useSelector(selectUserId);

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

  const handleIconModalClose = () => {
    setIsIconModalVisible(false);
  };

  const handleColorModalClose = () => {
    setIsColorModalVisible(false);
  };

  return {
    colors,
    categoryName,
    setCategoryName,
    selectedIcon,
    setSelectedIcon,
    isIconModalVisible,
    setIsIconModalVisible,
    isColorModalVisible,
    setIsColorModalVisible,
    handleAddCategory,
    handleIconModalClose,
    handleColorModalClose,
    selectedColor,
    setSelectedColor,
    searchText,
    setSearchText,
  };
};

export default useAddCategory;
