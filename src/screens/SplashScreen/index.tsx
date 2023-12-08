import React from 'react';
import PrimaryButton from '../../components/PrimaryButton';
import useSplash from './useSplash';
import PrimaryView from '../../components/atoms/PrimaryView';
import PrimaryText from '../../components/atoms/PrimaryText';

const SplashScreen = () => {
  const {handleClick, colors} = useSplash();

  return (
    <PrimaryView colors={colors}>
      <PrimaryText
        style={{color: colors.primaryText, fontSize: 90, paddingTop: '20%'}}>
        zero
      </PrimaryText>
      <PrimaryText style={{color: colors.secondaryText, fontSize: 25}}>
        Count Every
      </PrimaryText>
      <PrimaryText
        style={{
          marginBottom: '120%',
          color: colors.secondaryText,
          fontSize: 25,
        }}>
        Penny with zero
      </PrimaryText>
      <PrimaryButton
        onPress={handleClick}
        colors={colors}
        buttonTitle={'Get Started'}
      />
    </PrimaryView>
  );
};

export default SplashScreen;
