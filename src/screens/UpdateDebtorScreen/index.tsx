import React from 'react';
import DebtorEntry from '../../components/molecules/DebtorEntry';
import {useRoute} from '@react-navigation/native';

const UpdateDebtorScreen = () => {
  const route = useRoute();
  console.log(route.params)
  return <DebtorEntry type={'Update'} route={route}/>;
};

export default UpdateDebtorScreen;
