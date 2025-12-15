import React from 'react';
import {useRoute} from '@react-navigation/native';
import DebtEntry from '../../components/molecules/DebtEntry';
import { DebtsScreenProp } from '../AddDebtsScreen';

const UpdateDebtScreen = () => {
  const route = useRoute<DebtsScreenProp>();

  return <DebtEntry buttonText="Update" route={route} />;
};

export default UpdateDebtScreen;
