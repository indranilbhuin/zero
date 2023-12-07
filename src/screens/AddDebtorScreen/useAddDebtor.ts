import {useDispatch, useSelector} from 'react-redux';
import useThemeColors from '../../hooks/useThemeColors';
import {useState} from 'react';
import {selectUserId} from '../../redux/slice/userIdSlice';
import {createDebtor} from '../../services/DebtorService';
import {goBack} from '../../utils/navigationUtils';
import {FETCH_ALL_DEBTOR_DATA} from '../../redux/actionTypes';

const useAddDebtor = () => {
  const colors = useThemeColors();
  const dispatch = useDispatch();
  const [debtorTitle, setDebtorTitle] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const userId = useSelector(selectUserId);

  const toggleCategorySelection = category => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories([]);
    } else {
      setSelectedCategories([category]);
    }
  };

  const handleAddDebtor = () => {
    try {
      createDebtor(
        debtorTitle,
        Realm.BSON.ObjectID.createFromHexString(userId),
        selectedCategories[0].icon,
        selectedCategories[0].name,
        selectedCategories[0].color,
      );
      dispatch({type: FETCH_ALL_DEBTOR_DATA});
      goBack();
    } catch (error) {
      console.error('Error creating debtor:', error);
    }
  };
  
  return {
    colors,
    toggleCategorySelection,
    selectedCategories,
    debtorTitle,
    setDebtorTitle,
    handleAddDebtor,
  };
};

export default useAddDebtor;
