import {useDispatch, useSelector} from 'react-redux';
import useThemeColors from '../../hooks/useThemeColors';
import {useCallback, useEffect, useMemo, useState} from 'react';
import {fetchUserData, selectUserId} from '../../redux/slice/userIdSlice';
import {navigate} from '../../utils/navigationUtils';
import {createCategory} from '../../watermelondb/services';
import {AppDispatch} from '../../redux/store';

interface CategorySelection {
  name: string;
  icon?: string;
  color?: string;
}

const useOnboarding = () => {
  const colors = useThemeColors();
  const [selectedCategories, setSelectedCategories] = useState<Array<CategorySelection>>([]);

  const selectedCategoryNames = useMemo(() => new Set(selectedCategories.map(c => c.name)), [selectedCategories]);

  const userId = useSelector(selectUserId);

  const dispatch = useDispatch<AppDispatch>();
  const handleSkip = useCallback(() => {
    navigate('ChooseCurrencyScreen');
  }, []);

  useEffect(() => {
    dispatch(fetchUserData());
  }, [dispatch]);

  const handleSubmit = useCallback(async () => {
    for (const category of selectedCategories) {
      await createCategory(category.name, userId, category.icon ?? null, category.color ?? null);
    }
    navigate('ChooseCurrencyScreen');
  }, [selectedCategories, userId]);

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

  const isCategorySelected = useCallback(
    (categoryName: string): boolean => {
      return selectedCategoryNames.has(categoryName);
    },
    [selectedCategoryNames],
  );

  return {
    colors,
    selectedCategories,
    setSelectedCategories,
    userId,
    handleSkip,
    handleSubmit,
    toggleCategorySelection,
    isCategorySelected,
  };
};

export default useOnboarding;
