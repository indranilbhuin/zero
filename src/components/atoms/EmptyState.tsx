import {Image, View, ViewStyle} from 'react-native';
import React, {ReactNode} from 'react';
import PrimaryText from './PrimaryText';
import {Colors} from '../../hooks/useThemeColors';
import {useTheme} from '../../context/ThemeContext';
import {gs} from '../../styles/globalStyles';

type EmptyStateType = 'Transactions' | 'Insights' | 'Debts' | 'Categories';

interface EmptyStateProps {
  colors: Colors;
  type: EmptyStateType;
  style?: ViewStyle;
  message?: string;
  actionButton?: ReactNode;
}

const lightImages: Record<EmptyStateType, any> = {
  Transactions: require('../../../assets/images/lightNoTransaction.png'),
  Insights: require('../../../assets/images/lightNoReport.png'),
  Debts: require('../../../assets/images/lightNoDebt.png'),
  Categories: require('../../../assets/images/lightNoCategory.png'),
};

const darkImages: Record<EmptyStateType, any> = {
  Transactions: require('../../../assets/images/darkNoTransaction.png'),
  Insights: require('../../../assets/images/darkNoReport.png'),
  Debts: require('../../../assets/images/darkNoDebt.png'),
  Categories: require('../../../assets/images/darkNoCategory.png'),
};

const EmptyState: React.FC<EmptyStateProps> = React.memo(({colors, type, style, message, actionButton}) => {
  const {isDark} = useTheme();
  const imageSource = isDark ? darkImages[type] : lightImages[type];
  const displayMessage = message ?? `zero ${type}`;

  return (
    <View style={[gs.center, gs.h350, style]}>
      <Image source={imageSource} style={gs.size100} />
      <PrimaryText size={13} color={colors.primaryText} style={gs.mt5}>
        {displayMessage}
      </PrimaryText>
      {actionButton && <View style={gs.mt15}>{actionButton}</View>}
    </View>
  );
});

export default EmptyState;
