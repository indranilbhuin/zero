import {useState, useCallback} from 'react';
import useThemeColors from '../../hooks/useThemeColors';
import {createUser} from '../../watermelondb/services';
import {navigate} from '../../utils/navigationUtils';
import {nameSchema} from '../../utils/validationSchema';

const usePersonalize = () => {
  const colors = useThemeColors();
  const [name, setName] = useState('');
  const email = 'null';

  const handleSubmit = useCallback(async () => {
    try {
      await nameSchema.parseAsync(name);
      await createUser(name, email);
      navigate('OnboardingScreen');
    } catch (error) {
      if (__DEV__) {
        console.error('Error saving user data:', error);
      }
    }
  }, [name, email]);

  const handleSkip = useCallback(async () => {
    try {
      await createUser('User', email);
      navigate('OnboardingScreen');
    } catch (error) {
      if (__DEV__) {
        console.error('Error saving demo user data:', error);
      }
    }
  }, [email]);

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
