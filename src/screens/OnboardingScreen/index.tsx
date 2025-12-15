import {TouchableOpacity, View} from 'react-native';
import React from 'react';
import PrimaryButton from '../../components/atoms/PrimaryButton';
import styles from './style';
import defaultCategories from '../../../assets/jsons/defaultCategories.json';
import useOnboarding from './useOnboarding';
import PrimaryView from '../../components/atoms/PrimaryView';
import PrimaryText from '../../components/atoms/PrimaryText';
import Icon from '../../components/atoms/Icons';

const OnboardingScreen = () => {
  const {
    colors,
    selectedCategories,
    handleSkip,
    handleSubmit,
    toggleCategorySelection,
  } = useOnboarding();

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
            Default categories are
          </PrimaryText>
          <PrimaryText style={{fontSize: 24}}>here</PrimaryText>
        </View>

        <View style={styles.subtitleTextContainer}>
          <PrimaryText style={{color: colors.accentGreen, fontSize: 15}}>
            Select your categories you want track
          </PrimaryText>
        </View>
        <View style={styles.categoryMainContainer}>
          {defaultCategories?.map((category: any) => (
            <TouchableOpacity
              key={String(category._id)}
              onPress={() => toggleCategorySelection(category)}>
              <View
                style={[
                  styles.categoryContainer,
                  {
                    backgroundColor: selectedCategories?.includes(category)
                      ? `${colors.accentGreen}75`
                      : colors.secondaryAccent,
                    borderColor: colors.secondaryContainerColor,
                  },
                ]}>
                {category.icon !== undefined ? (
                  <View style={styles.iconContainer}>
                    <Icon
                      name={category.icon}
                      size={20}
                      color={category.color}
                      type="MaterialCommunityIcons"
                    />
                  </View>
                ) : null}

                <PrimaryText
                  style={{
                    color: selectedCategories?.includes(category)
                      ? colors.buttonText
                      : colors.primaryText,
                    fontSize: 13,
                  }}>
                  {category.name}
                </PrimaryText>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      <View style={{marginBottom: '10%'}}>
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
