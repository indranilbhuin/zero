import {ScrollView, TouchableOpacity, View} from 'react-native';
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
      <View style={gs.flex1}>
        <TouchableOpacity style={[gs.selfEnd, gs.pt5p]} onPress={handleSkip}>
          <PrimaryText size={13} weight="medium" color={colors.secondaryText}>Skip</PrimaryText>
        </TouchableOpacity>

        <View style={gs.pt10p}>
          <PrimaryText size={28} weight="bold">Pick your</PrimaryText>
          <PrimaryText size={28} weight="bold">categories</PrimaryText>
        </View>

        <PrimaryText size={14} color={colors.secondaryText} style={[gs.mt6, gs.mb20]}>
          Select the ones you want to track
        </PrimaryText>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[gs.row, gs.wrap, gs.pb80]}>
          {defaultCategories?.map((category: CategoryData) => {
            const isSelected = isCategorySelected(category.name);

            return (
              <TouchableOpacity key={category.name} onPress={() => toggleCategorySelection(category)} activeOpacity={0.7}>
                <View
                  style={[
                    gs.py8,
                    gs.px14,
                    gs.mr8,
                    gs.mt10,
                    gs.rounded12,
                    gs.rowCenter,
                    gs.gap6,
                    {
                      backgroundColor: isSelected ? colors.primaryText : colors.secondaryAccent,
                    },
                  ]}>
                  {category.icon !== undefined && (
                    <Icon
                      name={category.icon}
                      size={16}
                      color={isSelected ? colors.buttonText : (category.color ?? colors.secondaryText)}
                    />
                  )}
                  <PrimaryText
                    size={13}
                    weight={isSelected ? 'semibold' : 'regular'}
                    color={isSelected ? colors.buttonText : colors.primaryText}>
                    {category.name}
                  </PrimaryText>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
      <PrimaryButton onPress={handleSubmit} colors={colors} buttonTitle={'Continue'} />
    </PrimaryView>
  );
};

export default OnboardingScreen;
