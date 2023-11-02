import {Text, TextInput, TouchableOpacity, View} from 'react-native';
import React, {useState} from 'react';
import PrimaryButton from '../../components/PrimaryButton';
import useThemeColors from '../../hooks/useThemeColors';
import styles from './style';
import {navigate} from '../../utils/navigationUtils';
import defaultCategories from '../../../assets/defaultCategories.json';

const OnboardingScreen = () => {
  const colors = useThemeColors();
  const [category, setCategory] = useState('');

  const handleSkip = () => {
    navigate('ChooseCurrencyScreen');
  };

  const handleSubmit = () => {
    navigate('ChooseCurrencyScreen');
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
          Default categories are
        </Text>
        <Text style={[styles.titleText, {color: colors.primaryText}]}>
          here, but how about
        </Text>
        <Text style={[styles.titleText, {color: colors.primaryText}]}>
          your unique ones?
        </Text>
      </View>

      <View style={styles.subtitleTextContainer}>
        <Text style={[styles.subtitleText, {color: colors.accentGreen}]}>
          Select your categories you want track
        </Text>
      </View>

      <View style={styles.categoryMainContainer}>
        {defaultCategories.map(category => (
          <TouchableOpacity key={category._id}>
            <View
              style={[
                styles.categoryContainer,
                {
                  backgroundColor: colors.primaryText,
                  borderColor: colors.secondaryText,
                },
              ]}>
              <Text
                style={[
                  styles.subtitleText,
                  {color: colors.buttonText, fontSize: 13},
                ]}>
                {category.name}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.subtitleTextContainer}>
        <Text style={[styles.subtitleText, {color: colors.accentGreen}]}>
          Add your own category
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
          value={category}
          onChangeText={setCategory}
          placeholder="eg. Games"
          placeholderTextColor={colors.secondaryText}
        />
        <TouchableOpacity
          style={[
            styles.addButton,
            {
              backgroundColor: colors.primaryText,
              borderColor: colors.secondaryText,
            },
          ]}>
          <Text
            style={[
              styles.subtitleText,
              {color: colors.buttonText, fontSize: 13},
            ]}>
            Add
          </Text>
        </TouchableOpacity>
      </View>

      <PrimaryButton
        onPress={handleSubmit}
        backgroundColor={colors.primaryText}
        buttonText={'Continue'}
      />
    </View>
  );
};

export default OnboardingScreen;
