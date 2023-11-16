import {Text, TextInput, TouchableOpacity, View} from 'react-native';
import React, {useState} from 'react';
import PrimaryButton from '../../components/PrimaryButton';
import useThemeColors from '../../hooks/useThemeColors';
import styles from './style';
import {navigate} from '../../utils/navigationUtils';
import { createUser } from '../../services/UserService';

const PersonalizeScreen = () => {
  const colors = useThemeColors();
  const [name, setName] = useState('');
  const [email, setEmail] = useState("null");

  const handleSubmit = async () => {
    if (!name || !email) {
      return;
    }
  
    try {
      await createUser(name, email);
      navigate('OnboardingScreen');
    } catch (error) {
      console.error('Error saving user data to Realm:', error);
    }
  };

  const handleSkip = () => {
    navigate('OnboardingScreen');
  };

  return (
    <View
      style={[
        styles.mainContainer,
        {backgroundColor: colors.primaryBackground},
      ]}>
      <TouchableOpacity style={styles.skipButtonContainer} onPress={handleSkip}>
        <Text
          style={[
            styles.subtitleText,
            {color: colors.accentGreen, fontSize: 12},
          ]}>
          skip
        </Text>
      </TouchableOpacity>

      <View style={styles.titleTextContainer}>
        <Text style={[styles.titleText, {color: colors.primaryText}]}>
          Let's Personlize your
        </Text>
        <Text style={[styles.titleText, {color: colors.primaryText}]}>
          experience
        </Text>
      </View>

      <View style={styles.subtitleTextContainer}>
        <Text style={[styles.subtitleText, {color: colors.accentGreen}]}>
          Hi, It's zero! What Do Your Friends
        </Text>
        <Text style={[styles.subtitleText, {color: colors.accentGreen}]}>
          Call You?
        </Text>
      </View>

      <View style={styles.textInputContainer}>
        <TextInput
          style={[
            styles.textInput,
            {
              borderColor: colors.primaryText,
              color: colors.primaryText,
              backgroundColor: colors.secondaryBackground,
            },
          ]}
          value={name}
          onChangeText={setName}
          placeholder="Name"
          placeholderTextColor={colors.secondaryText}
        />
      </View>

      <PrimaryButton
        onPress={handleSubmit}
        colors={colors}
        buttonTitle={'Continue'}
      />
    </View>
  );
};

export default PersonalizeScreen;
