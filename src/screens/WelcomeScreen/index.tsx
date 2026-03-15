import {View} from 'react-native';
import React from 'react';
import PrimaryView from '../../components/atoms/PrimaryView';
import PrimaryText from '../../components/atoms/PrimaryText';
import PrimaryButton from '../../components/atoms/PrimaryButton';
import Carousel from '../../components/atoms/Carousel';
import useWelcome from './useWelcome';
import {gs} from '../../styles/globalStyles';

const WelcomeScreen = () => {
  const {colors, handleAllreadyUser, handleNewUser} = useWelcome();

  return (
    <PrimaryView colors={colors} style={gs.justifyBetween}>
      <View style={gs.pt15p}>
        <PrimaryText size={28} weight="bold" color={colors.primaryText}>
          Welcome to{' '}
          <PrimaryText size={28} weight="bold" color={colors.accentGreen}>
            zero
          </PrimaryText>
        </PrimaryText>
        <PrimaryText size={14} color={colors.secondaryText} style={gs.mt6}>
          Your finances, your device, your control.
        </PrimaryText>
      </View>

      <Carousel />

      <View style={gs.gap12}>
        <PrimaryButton onPress={handleNewUser} colors={colors} buttonTitle={'Get Started'} />
        <PrimaryButton onPress={handleAllreadyUser} colors={colors} buttonTitle={'I have a backup'} variant="outline" />
      </View>
    </PrimaryView>
  );
};

export default WelcomeScreen;
