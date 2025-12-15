import React from 'react';
import {RouteProp, useRoute} from '@react-navigation/native';
import CategoryEntry from '../../components/molecules/CategoryEntry';

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

const UpdateCategoryScreen = () => {
  const route = useRoute<UpdateCategoryScreenRouteProp>();

  return <CategoryEntry type={'Update'} route={route} />;
};

export default UpdateCategoryScreen;
