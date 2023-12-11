import {StyleSheet, View} from 'react-native';
import React, {ReactNode} from 'react';
import {Colors} from '../../hooks/useThemeColors';

interface PrimaryViewProps {
  colors: Colors;
  children?: ReactNode;
}

const PrimaryView: React.FC<PrimaryViewProps> = ({colors, children}) => {
  return (
    <View
      style={[
        styles.mainContainer,
        {backgroundColor: colors.primaryBackground},
      ]}>
      {children}
    </View>
  );
};

export default PrimaryView;

const styles = StyleSheet.create({
  mainContainer: {
    height: '100%',
    paddingLeft: '6%',
    paddingRight: '6%',
  },
});
