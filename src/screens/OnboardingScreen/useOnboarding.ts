import {useDispatch, useSelector} from 'react-redux';
import useThemeColors from '../../hooks/useThemeColors';
import {useEffect, useState} from 'react';
import {selectUserId} from '../../redux/slice/userIdSlice';
import {navigate} from '../../utils/navigationUtils';
import {FETCH_ALL_USER_DATA} from '../../redux/actionTypes';
import {createCategory} from '../../watermelondb/services';

interface CategorySelection {
  name: string;
  icon?: string;
  color?: string;
}

const useOnboarding = () => {
  const colors = useThemeColors();
  const [selectedCategories, setSelectedCategories] = useState<
    Array<CategorySelection>
  >([]);

  console.log(selectedCategories);
  const userId = useSelector(selectUserId);

  const dispatch = useDispatch();
  const handleSkip = () => {
    navigate('ChooseCurrencyScreen');
  };

  useEffect(() => {
    dispatch({type: FETCH_ALL_USER_DATA});
  }, [dispatch]);

  console.log('userId:', userId);

  const handleSubmit = async () => {
    for (const category of selectedCategories) {
      await createCategory(
        category.name,
        userId,
        category.icon ?? null,
        category.color ?? null,
      );
    }
    navigate('ChooseCurrencyScreen');
  };

  const toggleCategorySelection = (category: CategorySelection) => {
    const isSelected = selectedCategories.some(c => c.name === category.name);
    if (isSelected) {
      setSelectedCategories(
        selectedCategories.filter(item => item.name !== category.name),
      );
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  return {
    colors,
    selectedCategories,
    setSelectedCategories,
    userId,
    handleSkip,
    handleSubmit,
    toggleCategorySelection,
  };
};

export default useOnboarding;
