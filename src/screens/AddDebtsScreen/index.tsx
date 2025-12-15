import React from 'react';
import DebtEntry from '../../components/molecules/DebtEntry';
import {RouteProp, useRoute} from '@react-navigation/native';

export type DebtsScreenProp = RouteProp<
  {
    DebtsScreen: {
      debtorId: string;
      debtorName: string;
      debtId: string;
      debtDescription: string;
      amount: number;
      debtDate: string;
      debtType: string;
    };
  },
  'DebtsScreen'
>;

const AddDebtsScreen = () => {
  const route = useRoute<DebtsScreenProp>();

  return <DebtEntry route={route} buttonText="Add" />;
};

export default AddDebtsScreen;
