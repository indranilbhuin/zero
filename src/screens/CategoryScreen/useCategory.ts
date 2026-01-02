import {useDispatch, useSelector} from 'react-redux';
import useThemeColors from '../../hooks/useThemeColors';
import {selectActiveCategories} from '../../redux/slice/categoryDataSlice';
import {useEffect, useState} from 'react';
import {FETCH_ALL_CATEGORY_DATA} from '../../redux/actionTypes';
import {navigate} from '../../utils/navigationUtils';
import {softDeleteCategoryById} from '../../watermelondb/services';

const useCategory = () => {
  const colors = useThemeColors();
  const dispatch = useDispatch();
  const categories = useSelector(selectActiveCategories);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    dispatch({type: FETCH_ALL_CATEGORY_DATA});
  }, [dispatch]);

  useEffect(() => {
    if (refreshing) {
      dispatch({type: FETCH_ALL_CATEGORY_DATA});
      setRefreshing(false);
    }
  }, [refreshing, dispatch]);

  const onRefresh = () => {
    setRefreshing(true);
  };

  const handleEdit = (
    categoryId: string,
    categoryName: string,
    categoryIcon: string,
    categoryColor: string,
  ) => {
    navigate('UpdateCategoryScreen', {
      categoryId,
      categoryName,
      categoryIcon,
      categoryColor,
    });
  };

  const handleDelete = async (categoryId: string) => {
    try {
      await softDeleteCategoryById(categoryId);
      dispatch({type: FETCH_ALL_CATEGORY_DATA});
      setRefreshing(true);
    } catch (error) {
      console.log('Error deleting category:', categoryId, error);
    }
  };

  return {
    colors,
    refreshing,
    onRefresh,
    categories,
    handleEdit,
    handleDelete,
  };
};

export default useCategory;
