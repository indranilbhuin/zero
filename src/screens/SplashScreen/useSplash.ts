import useThemeColors from '../../hooks/useThemeColors';
import {navigate} from '../../utils/navigationUtils';

const useSplash = () => {
  const handleClick = () => {
    navigate('WelcomeScreen');
  };

  const colors = useThemeColors();
  return {
    handleClick,
    colors,
  };
};

export default useSplash;
