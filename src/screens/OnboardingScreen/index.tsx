import {TouchableOpacity, View} from 'react-native';
import React from 'react';
import PrimaryButton from '../../components/PrimaryButton';
import styles from './style';
import defaultCategories from '../../../assets/jsons/defaultCategories.json';
import CategoryContainer from '../../components/CategoryContainer';
import useOnboarding from './useOnboarding';
import PrimaryView from '../../components/atoms/PrimaryView';
import PrimaryText from '../../components/atoms/PrimaryText';

const OnboardingScreen = () => {
  const {
    colors,
    selectedCategories,
    handleSkip,
    handleSubmit,
    toggleCategorySelection,
  } = useOnboarding();

  return (
    <PrimaryView colors={colors}>
      <TouchableOpacity style={styles.skipButtonContainer} onPress={handleSkip}>
        <PrimaryText style={{color: colors.accentGreen, fontSize: 12}}>
          skip
        </PrimaryText>
      </TouchableOpacity>

      <View style={styles.titleTextContainer}>
        <PrimaryText style={{color: colors.primaryText, fontSize: 24}}>
          Default categories are
        </PrimaryText>
        <PrimaryText style={{color: colors.primaryText, fontSize: 24}}>
          here, but how about
        </PrimaryText>
        <PrimaryText style={{color: colors.primaryText, fontSize: 24}}>
          your unique ones?
        </PrimaryText>
      </View>

      <View style={styles.subtitleTextContainer}>
        <PrimaryText style={{color: colors.accentGreen, fontSize: 15}}>
          Select your categories you want track
        </PrimaryText>
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
    </PrimaryView>
  );
};

export default OnboardingScreen;
