import {Image, StyleSheet, View, ViewStyle} from 'react-native';
import React from 'react';
import PrimaryText from './PrimaryText';
import {Colors} from '../../hooks/useThemeColors';

interface EmptyStateProps {
  colors: Colors;
  type: string;
  style?: ViewStyle;
}

const lightImages = {
  Transactions: require('../../../assets/images/lightNoTransaction.png'),
  Insights: require('../../../assets/images/lightNoReport.png'),
  Debts: require('../../../assets/images/lightNoDebt.png'),
  Categories: require('../../../assets/images/lightNoCategory.png'),
} as Record<string, any>;

const darkImages = {
  Transactions: require('../../../assets/images/darkNoTransaction.png'),
  Insights: require('../../../assets/images/darkNoReport.png'),
  Debts: require('../../../assets/images/darkNoDebt.png'),
  Categories: require('../../../assets/images/darkNoCategory.png'),
} as Record<string, any>;

const EmptyState: React.FC<EmptyStateProps> = ({colors, type, style}) => {
  const selectedLightImage = lightImages[type];
  const selectedDarkImage = darkImages[type];
  return (
    <View style={[styles.noTransactionContainer, style]}>
      {colors.primaryText === '#000000' ? (
        <Image source={selectedLightImage} style={styles.noImage} />
      ) : (
        <Image source={selectedDarkImage} style={styles.noImage} />
      )}
      <PrimaryText
        style={{
          color: colors.primaryText,
          fontSize: 13,
          marginTop: 5,
        }}>
        zero {type}
      </PrimaryText>
    </View>
  );
};

export default EmptyState;

const styles = StyleSheet.create({
  noTransactionContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 350,
  },
  noImage: {
    height: 100,
    width: 100,
  },
});
