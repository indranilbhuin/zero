import React from 'react';
import {useRoute} from '@react-navigation/native';
import DebtEntry from '../../components/molecules/DebtEntry';

const UpdateDebtScreen = () => {
  const route = useRoute();

  return <DebtEntry buttonText="Update" route={route} />;
};

export default UpdateDebtScreen;
