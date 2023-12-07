import useThemeColors from '../../hooks/useThemeColors';
import {navigate} from '../../utils/navigationUtils';

const useSplash = () => {
  const handleClick = () => {
    navigate('PersonalizeScreen');
  };

  const colors = useThemeColors();
  return {
    handleClick,
    colors,
  };
};

export default useSplash;
