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
      <View style={gs.pt20p}>
        <PrimaryText size={72} weight="bold" color={colors.primaryText}>
          zero
        </PrimaryText>
        <View style={gs.mt10}>
          <PrimaryText size={18} color={colors.secondaryText}>
            Count every penny.
          </PrimaryText>
          <PrimaryText size={18} color={colors.secondaryText} style={{opacity: 0.5}}>
            Privately.
          </PrimaryText>
        </View>
      </View>
      <PrimaryButton onPress={handleClick} colors={colors} buttonTitle={'Get Started'} />
    </PrimaryView>
  );
};

export default SplashScreen;
