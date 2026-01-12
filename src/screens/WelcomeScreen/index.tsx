import {Text, View} from 'react-native';
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
        <PrimaryText size={24}>
          Welcome to <Text style={{color: colors.accentGreen}}>zero</Text>
        </PrimaryText>
      </View>

      <Carousel />

      <View>
        <PrimaryButton onPress={handleAllreadyUser} colors={colors} buttonTitle={'Existing User'} disabled={undefined} />
        <PrimaryText style={[gs.textCenter, gs.mt2p, gs.mb2p]}>or</PrimaryText>
        <PrimaryButton onPress={handleNewUser} colors={colors} buttonTitle={'New User'} disabled={undefined} />
      </View>
    </PrimaryView>
  );
};

export default WelcomeScreen;
