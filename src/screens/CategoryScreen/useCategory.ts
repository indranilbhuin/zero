import {useDispatch, useSelector} from 'react-redux';
import useThemeColors from '../../hooks/useThemeColors';
import {fetchCategories, selectActiveCategories} from '../../redux/slice/categoryDataSlice';
import {useCallback, useEffect, useState} from 'react';
import {useFocusEffect} from '@react-navigation/native';
import {navigate} from '../../utils/navigationUtils';
import {softDeleteCategoryById} from '../../watermelondb/services';
import {AppDispatch} from '../../redux/store';

const useCategory = () => {
  const colors = useThemeColors();
  const dispatch = useDispatch<AppDispatch>();
  const categories = useSelector(selectActiveCategories);
  const [refreshing, setRefreshing] = useState(false);

  useFocusEffect(
    useCallback(() => {
      dispatch(fetchCategories());
    }, [dispatch]),
  );

  useEffect(() => {
    if (!refreshing) return;

    dispatch(fetchCategories()).finally(() => {
      setRefreshing(false);
    });
  }, [refreshing, dispatch]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
  }, []);

  const handleEdit = useCallback((
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
  }, []);

  const handleDelete = useCallback(async (categoryId: string) => {
    try {
      await softDeleteCategoryById(categoryId);
      dispatch(fetchCategories());
    } catch (error) {
      if (__DEV__) {
        console.error('Error deleting category:', categoryId, error);
      }
    }
  }, [dispatch]);

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
