import React from 'react';
import PrimaryButton from '../../components/atoms/PrimaryButton';
import useSplash from './useSplash';
import PrimaryView from '../../components/atoms/PrimaryView';
import PrimaryText from '../../components/atoms/PrimaryText';
import {View} from 'react-native';

const SplashScreen = () => {
  const {handleClick, colors} = useSplash();

  return (
    <PrimaryView colors={colors} style={{justifyContent: 'space-between'}}>
      <View>
        <PrimaryText
          style={{color: colors.primaryText, fontSize: 90, paddingTop: '20%'}}>
          zer0
        </PrimaryText>
        <PrimaryText style={{color: colors.secondaryText, fontSize: 25}}>
          Count Every
        </PrimaryText>
        <PrimaryText
          style={{
            color: colors.secondaryText,
            fontSize: 25,
          }}>
          Penny with zer0
        </PrimaryText>
      </View>
      <View style={{marginBottom: '10%'}}>
        <PrimaryButton
          onPress={handleClick}
          colors={colors}
          buttonTitle={'Get Started'}
        />
      </View>
    </PrimaryView>
  );
};

export default SplashScreen;
