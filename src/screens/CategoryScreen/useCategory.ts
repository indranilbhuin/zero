import {useDispatch, useSelector} from 'react-redux';
import useThemeColors from '../../hooks/useThemeColors';
import {selectActiveCategories} from '../../redux/slice/categoryDataSlice';
import {useEffect, useState} from 'react';
import {FETCH_ALL_CATEGORY_DATA} from '../../redux/actionTypes';
import {navigate} from '../../utils/navigationUtils';
import {softDeleteCategoryById} from '../../services/CategoryService';

const useCategory = () => {
  const colors = useThemeColors();
  const dispatch = useDispatch();
  const categories = useSelector(selectActiveCategories);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    dispatch({type: FETCH_ALL_CATEGORY_DATA});
  }, []);

  useEffect(() => {
    if (refreshing) {
      dispatch({type: FETCH_ALL_CATEGORY_DATA});
      setRefreshing(false);
    }
  }, [refreshing]);

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

  const handleDelete = async (categoryId: Realm.BSON.ObjectId) => {
    try {
      await softDeleteCategoryById(categoryId);
      dispatch({type: FETCH_ALL_CATEGORY_DATA});
      setRefreshing(true);
    } catch (error) {
      console.log('this category is deleting', categoryId);
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
