import {useState} from 'react';
import useThemeColors from '../../hooks/useThemeColors';
import {createUser} from '../../services/UserService';
import {navigate} from '../../utils/navigationUtils';
import { nameSchema } from '../../utils/validationSchema';

const usePersonalize = () => {
  const colors = useThemeColors();
  const [name, setName] = useState('');
  const email = 'null';

  const handleSubmit = async () => {
    try {
      await nameSchema.parseAsync(name);
      await createUser(name, email);
      navigate('OnboardingScreen');
    } catch (error) {
      console.error('Error saving user data to Realm:', error);
    }
  };

  const handleSkip = async () => {
    try {
      await createUser('User', email);
      navigate('OnboardingScreen');
    } catch (error) {
      console.error('Error saving demo user data to Realm:', error);
    }
    navigate('OnboardingScreen');
  };

  return {
    colors,
    setName,
    name,
    handleSubmit,
    handleSkip,
    nameSchema,
  };
};

export default usePersonalize;
