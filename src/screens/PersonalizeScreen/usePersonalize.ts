import {useState} from 'react';
import useThemeColors from '../../hooks/useThemeColors';
import {createUser} from '../../services/UserService';
import {navigate} from '../../utils/navigationUtils';

const usePersonalize = () => {
  const colors = useThemeColors();
  const [name, setName] = useState('');
  const email = 'null';

  const handleSubmit = async () => {
    if (!name || !email) {
      return;
    }

    try {
      await createUser(name, email);
      navigate('OnboardingScreen');
    } catch (error) {
      console.error('Error saving user data to Realm:', error);
    }
  };

  const handleSkip = () => {
    navigate('OnboardingScreen');
  };

  return {
    colors,
    setName,
    name,
    handleSubmit,
    handleSkip,
  };
};

export default usePersonalize;