import {TouchableOpacity, View} from 'react-native';
import React from 'react';
import PrimaryButton from '../../components/atoms/PrimaryButton';
import usePersonalize from './usePersonalize';
import PrimaryView from '../../components/atoms/PrimaryView';
import PrimaryText from '../../components/atoms/PrimaryText';
import CustomInput from '../../components/atoms/CustomInput';
import {gs} from '../../styles/globalStyles';

const PersonalizeScreen = () => {
  const {colors, setName, name, handleSubmit, handleSkip, nameSchema} = usePersonalize();
  const isValid = nameSchema.safeParse(name).success;

  return (
    <PrimaryView colors={colors} style={gs.justifyBetween} dismissKeyboardOnTouch>
      <View>
        <TouchableOpacity style={[gs.selfEnd, gs.pt5p]} onPress={handleSkip}>
          <PrimaryText size={12} color={colors.accentGreen}>skip</PrimaryText>
        </TouchableOpacity>

        <View style={gs.pt15p}>
          <PrimaryText size={24}>Let's Personlize your</PrimaryText>
          <PrimaryText size={24}>experience</PrimaryText>
        </View>

        <View style={[gs.pt10p, gs.pb5p]}>
          <PrimaryText size={15} color={colors.accentGreen}>Hi, It's zero! What Do Your Friends</PrimaryText>
          <PrimaryText size={15} color={colors.accentGreen}>Call You?</PrimaryText>
        </View>

        <View style={isValid ? gs.mb90p : undefined}>
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
      <PrimaryButton onPress={handleSubmit} colors={colors} buttonTitle={'Continue'} disabled={!isValid} />
    </PrimaryView>
  );
};

export default PersonalizeScreen;
