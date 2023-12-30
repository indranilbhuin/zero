import {TouchableOpacity, View} from 'react-native';
import React from 'react';
import PrimaryButton from '../../components/atoms/PrimaryButton';
import styles from './style';
import usePersonalize from './usePersonalize';
import PrimaryView from '../../components/atoms/PrimaryView';
import PrimaryText from '../../components/atoms/PrimaryText';
import CustomInput from '../../components/atoms/CustomInput';

const PersonalizeScreen = () => {
  const {colors, setName, name, handleSubmit, handleSkip, nameSchema} =
    usePersonalize();
  const isValid = nameSchema.safeParse(name).success;

  return (
    <PrimaryView colors={colors} style={{justifyContent: 'space-between'}}>
      <View>
        <TouchableOpacity
          style={styles.skipButtonContainer}
          onPress={handleSkip}>
          <PrimaryText style={{color: colors.accentGreen, fontSize: 12}}>
            skip
          </PrimaryText>
        </TouchableOpacity>

        <View style={styles.titleTextContainer}>
          <PrimaryText style={{fontSize: 24}}>
            Let's Personlize your
          </PrimaryText>
          <PrimaryText style={{fontSize: 24}}>experience</PrimaryText>
        </View>

        <View style={styles.subtitleTextContainer}>
          <PrimaryText style={{color: colors.accentGreen, fontSize: 15}}>
            Hi, It's zer0! What Do Your Friends
          </PrimaryText>
          <PrimaryText style={{color: colors.accentGreen, fontSize: 15}}>
            Call You?
          </PrimaryText>
        </View>

        <View
          style={[
            styles.textInputContainer,
            isValid ? {marginBottom: '100%'} : null,
          ]}>
          <CustomInput
            input={name}
            label={'Name'}
            colors={colors}
            placeholder={'eg. Indranil Bhuin'}
            setInput={setName}
            schema={nameSchema}
          />
        </View>
      </View>
      <View style={{marginBottom: '10%'}}>
        <PrimaryButton
          onPress={handleSubmit}
          colors={colors}
          buttonTitle={'Continue'}
          disabled={!isValid}
        />
      </View>
    </PrimaryView>
  );
};

export default PersonalizeScreen;
