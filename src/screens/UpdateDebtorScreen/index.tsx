import React from 'react';
import DebtorEntry from '../../components/molecules/DebtorEntry';
import {useRoute} from '@react-navigation/native';

const UpdateDebtorScreen = () => {
  const route = useRoute();
  return <DebtorEntry type={'Update'} route={route}/>;
};

export default UpdateDebtorScreen;
