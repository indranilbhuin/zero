import {useMemo} from 'react';
import useThemeColors from './useThemeColors';

const useAmountColor = (amount: number) => {
  const colors = useThemeColors();

  return useMemo(() => {
    if (amount < 0) {
      return colors.accentGreen;
    }
    if (amount === 0) {
      return colors.primaryText;
    }
    return colors.accentOrange;
  }, [amount, colors.accentGreen, colors.accentOrange, colors.primaryText]);
};

export default useAmountColor;
