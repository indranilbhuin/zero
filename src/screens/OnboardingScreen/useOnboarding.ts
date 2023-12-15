import {useDispatch, useSelector} from 'react-redux';
import useThemeColors from '../../hooks/useThemeColors';
import {useEffect, useState} from 'react';
import {selectUserId} from '../../redux/slice/userIdSlice';
import {navigate} from '../../utils/navigationUtils';
import {FETCH_ALL_USER_DATA} from '../../redux/actionTypes';
import {createCategory} from '../../services/CategoryService';
import Category from '../../schemas/CategorySchema';

const useOnboarding = () => {
  const colors = useThemeColors();
  const [selectedCategories, setSelectedCategories] = useState<Array<Category>>(
    [],
  );

  console.log(selectedCategories)
  const userId = useSelector(selectUserId);

  const dispatch = useDispatch();
  const handleSkip = () => {
    navigate('ChooseCurrencyScreen');
  };

  useEffect(() => {
    dispatch({type: FETCH_ALL_USER_DATA});
  }, []);

  console.log('outaise', userId);

  const handleSubmit = async () => {
    for (const category of selectedCategories) {
      await createCategory(
        category.name,
        Realm.BSON.ObjectID.createFromHexString(userId),
        category.icon,
        category.color,
      );
    }
    navigate('ChooseCurrencyScreen');
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
