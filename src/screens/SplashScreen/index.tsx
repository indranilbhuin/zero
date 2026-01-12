import React from 'react';
import PrimaryButton from '../../components/atoms/PrimaryButton';
import useSplash from './useSplash';
import PrimaryView from '../../components/atoms/PrimaryView';
import PrimaryText from '../../components/atoms/PrimaryText';
import {View} from 'react-native';
import {gs} from '../../styles/globalStyles';

const SplashScreen = () => {
  const {handleClick, colors} = useSplash();

  return (
    <PrimaryView colors={colors} style={gs.justifyBetween}>
      <View>
        <PrimaryText size={90} style={gs.pt20p} color={colors.primaryText}>
          zero
        </PrimaryText>
        <PrimaryText size={25} color={colors.secondaryText}>
          Count Every
        </PrimaryText>
        <PrimaryText size={25} color={colors.secondaryText}>
          Penny with zero
        </PrimaryText>
      </View>
      <PrimaryButton onPress={handleClick} colors={colors} buttonTitle={'Get Started'} />
    </PrimaryView>
  );
};

export default SplashScreen;
