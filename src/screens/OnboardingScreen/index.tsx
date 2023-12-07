import {Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import PrimaryButton from '../../components/PrimaryButton';
import styles from './style';
import defaultCategories from '../../../assets/jsons/defaultCategories.json';
import CategoryContainer from '../../components/CategoryContainer';
import useOnboarding from './useOnboarding';

const OnboardingScreen = () => {
  const {
    colors,
    selectedCategories,
    handleSkip,
    handleSubmit,
    toggleCategorySelection,
  } = useOnboarding();

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
      <CategoryContainer
        categories={defaultCategories}
        colors={colors}
        toggleCategorySelection={toggleCategorySelection}
        selectedCategories={selectedCategories}
      />
      <View style={styles.buttonContainer}>
        <PrimaryButton
          onPress={handleSubmit}
          colors={colors}
          buttonTitle={'Continue'}
        />
      </View>
    </View>
  );
};

export default OnboardingScreen;
