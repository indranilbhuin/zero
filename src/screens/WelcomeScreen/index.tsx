import {Text, View} from 'react-native';
import React from 'react';
import PrimaryView from '../../components/atoms/PrimaryView';
import PrimaryText from '../../components/atoms/PrimaryText';
import PrimaryButton from '../../components/atoms/PrimaryButton';
import Carousel from '../../components/atoms/Carousel';
import useWelcome from './useWelcome';

const WelcomeScreen = () => {
  const {colors, handleAllreadyUser, handleNewUser} = useWelcome();

  return (
    <PrimaryView colors={colors} style={{justifyContent: 'space-between'}}>
      <View style={{paddingTop: '15%'}}>
        <PrimaryText style={{fontSize: 24}}>
          Welcome to <Text style={{color: colors.accentGreen}}>zero</Text>
        </PrimaryText>
      </View>

      <Carousel />

      <View style={{marginBottom: '10%'}}>
        <PrimaryButton
          onPress={handleAllreadyUser}
          colors={colors}
          buttonTitle={'Existing User'}
          disabled={undefined}
        />
        <PrimaryText
          style={{textAlign: 'center', marginTop: '2%', marginBottom: '2%'}}>
          or
        </PrimaryText>
        <PrimaryButton
          onPress={handleNewUser}
          colors={colors}
          buttonTitle={'New User'}
          disabled={undefined}
        />
      </View>
    </PrimaryView>
  );
};

export default WelcomeScreen;
