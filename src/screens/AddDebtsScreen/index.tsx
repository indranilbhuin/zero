import React from 'react';
import DebtEntry from '../../components/molecules/DebtEntry';
import {useRoute} from '@react-navigation/native';

const AddDebtsScreen = () => {
  const route = useRoute();

  return <DebtEntry route={route} buttonText="Add" />;
};

export default AddDebtsScreen;
