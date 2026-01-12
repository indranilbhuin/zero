import {TouchableOpacity, View} from 'react-native';
import React from 'react';
import PrimaryButton from '../../components/atoms/PrimaryButton';
import defaultCategories from '../../../assets/jsons/defaultCategories.json';
import useOnboarding from './useOnboarding';
import PrimaryView from '../../components/atoms/PrimaryView';
import PrimaryText from '../../components/atoms/PrimaryText';
import Icon from '../../components/atoms/Icons';
import {gs} from '../../styles/globalStyles';

interface CategoryData {
  name: string;
  icon?: string;
  color?: string;
}

const OnboardingScreen = () => {
  const {colors, handleSkip, handleSubmit, toggleCategorySelection, isCategorySelected} = useOnboarding();

  return (
    <PrimaryView colors={colors} style={gs.justifyBetween}>
      <View>
        <TouchableOpacity style={[gs.selfEnd, gs.pt5p]} onPress={handleSkip}>
          <PrimaryText size={12} color={colors.accentGreen}>skip</PrimaryText>
        </TouchableOpacity>

        <View style={gs.pt15p}>
          <PrimaryText size={24}>Default categories are</PrimaryText>
          <PrimaryText size={24}>here</PrimaryText>
        </View>

        <View style={[gs.pt10p, gs.pb5p]}>
          <PrimaryText size={15} color={colors.accentGreen}>
            Select your categories you want track
          </PrimaryText>
        </View>
        <View style={[gs.row, gs.wrap]}>
          {defaultCategories?.map((category: CategoryData) => {
            const isSelected = isCategorySelected(category.name);

            return (
              <TouchableOpacity key={category.name} onPress={() => toggleCategorySelection(category)}>
                <View
                  style={[
                    gs.h45,
                    gs.p10,
                    gs.mr5,
                    gs.mt5,
                    gs.rounded5,
                    gs.border2,
                    gs.center,
                    gs.row,
                    {
                      backgroundColor: isSelected ? `${colors.accentGreen}75` : colors.secondaryAccent,
                      borderColor: colors.secondaryContainerColor,
                    },
                  ]}>
                  {category.icon !== undefined ? (
                    <View style={gs.mr5}>
                      <Icon name={category.icon} size={20} color={category.color} />
                    </View>
                  ) : null}

                  <PrimaryText size={13} color={isSelected ? colors.buttonText : colors.primaryText}>
                    {category.name}
                  </PrimaryText>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
      <PrimaryButton onPress={handleSubmit} colors={colors} buttonTitle={'Continue'} />
    </PrimaryView>
  );
};

export default OnboardingScreen;
