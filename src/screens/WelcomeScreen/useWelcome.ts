import useThemeColors from '../../hooks/useThemeColors';
import {deleteAllData, debugLogAllData} from '../../watermelondb/services';
import {navigate} from '../../utils/navigationUtils';

const useWelcome = () => {
  const colors = useThemeColors();

  const handleAllreadyUser = async () => {
    console.log('=== handleAllreadyUser START ===');
    try {
      console.log('Logging current database state before delete...');
      await debugLogAllData();

      console.log('Deleting all data...');
      await deleteAllData();
      console.log('Data deleted successfully');

      console.log('Logging database state after delete...');
      await debugLogAllData();
    } catch (error) {
      console.error('Error deleting data for existing user:', error);
    }
    console.log('Navigating to ExistingUserScreen...');
    navigate('ExistingUserScreen');
    console.log('=== handleAllreadyUser END ===');
  };

  const handleNewUser = async () => {
    console.log('=== handleNewUser START ===');
    try {
      console.log('Logging current database state before delete...');
      await debugLogAllData();

      console.log('Deleting all data...');
      await deleteAllData();
      console.log('Data deleted successfully');

      console.log('Logging database state after delete...');
      await debugLogAllData();
    } catch (error) {
      console.error('Error deleting data for new user:', error);
    }
    console.log('Navigating to PersonalizeScreen...');
    navigate('PersonalizeScreen');
    console.log('=== handleNewUser END ===');
  };

  return {
    colors,
    handleAllreadyUser,
    handleNewUser,
  };
};

export default useWelcome;
