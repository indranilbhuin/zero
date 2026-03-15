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
          <PrimaryText size={13} weight="medium" color={colors.secondaryText}>Skip</PrimaryText>
        </TouchableOpacity>

        <View style={gs.pt15p}>
          <PrimaryText size={28} weight="bold">What should we</PrimaryText>
          <PrimaryText size={28} weight="bold">call you?</PrimaryText>
        </View>

        <PrimaryText size={14} color={colors.secondaryText} style={gs.mt6}>
          This helps personalize your experience
        </PrimaryText>

        <View style={gs.mt30}>
          <CustomInput
            input={name}
            label={'Your name'}
            colors={colors}
            placeholder={'eg. Indranil'}
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
