import useThemeColors from '../../hooks/useThemeColors';
import {deleteAllData} from '../../services/DeleteService';
import {navigate} from '../../utils/navigationUtils';

const useWelcome = () => {
  const colors = useThemeColors();
  const handleAllreadyUser = async () => {
    await deleteAllData();
    navigate('ExistingUserScreen');
  };

  const handleNewUser = async () => {
    await deleteAllData();
    navigate('PersonalizeScreen');
  };
  
  return {
    colors,
    handleAllreadyUser,
    handleNewUser,
  };
};

export default useWelcome;
