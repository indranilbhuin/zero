import {useEffect, useState} from 'react';
import useThemeColors from './useThemeColors';

const useAmountColor = (amount: number) => {
  const colors = useThemeColors();
  const [color, setColor] = useState(colors.primaryText);

  useEffect(() => {
    const checkDebtStatus = () => {
      if (amount < 0) {
        setColor(colors.accentGreen);
      } else if (amount === 0) {
        setColor(colors.primaryText);
      } else {
        setColor(colors.accentOrange);
      }
    };

    checkDebtStatus();
  }, [amount, colors]);

  return color;
};

export default useAmountColor;
