import {Image, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import PrimaryView from '../../components/atoms/PrimaryView';
import useThemeColors from '../../hooks/useThemeColors';
import PrimaryText from '../../components/atoms/PrimaryText';
import PrimaryButton from '../../components/atoms/PrimaryButton';
import {navigate} from '../../utils/navigationUtils';
import Carousel from '../../components/atoms/Carousel';
// import Carousel from '../../components/atoms/Carousel';
// import Carousell from '../../components/atoms/Carousel';

const WelcomeScreen = () => {
  const colors = useThemeColors();
  const handleAllreadyUser = () => {
    navigate('ExistingUserScreen');
  };

  const handleNewUser = () => {
    navigate('PersonalizeScreen');
  };

  return (
    <PrimaryView colors={colors} style={{justifyContent: 'space-between'}}>
      <View style={styles.titleTextContainer}>
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

const styles = StyleSheet.create({
  titleTextContainer: {
    paddingTop: '15%',
  },
  noImage: {
    height: 200,
    width: 200,
  },
});
