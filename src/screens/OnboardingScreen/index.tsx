import {Text, TouchableOpacity, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import PrimaryButton from '../../components/PrimaryButton';
import useThemeColors from '../../hooks/useThemeColors';
import styles from './style';
import {navigate} from '../../utils/navigationUtils';
import defaultCategories from '../../../assets/jsons/defaultCategories.json';
import {createCategory} from '../../services/CategoryService';
import {useDispatch, useSelector} from 'react-redux';
import {selectUserId} from '../../redux/slice/userIdSlice';
import CategoryContainer from '../../components/CategoryContainer';
import {FETCH_ALL_USER_DATA} from '../../redux/actionTypes';

const OnboardingScreen = () => {
  const colors = useThemeColors();
  const [category, setCategory] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const userId = useSelector(selectUserId);

  const dispatch = useDispatch();
  const handleSkip = () => {
    navigate('ChooseCurrencyScreen');
  };

  useEffect(() => {
    dispatch({type: FETCH_ALL_USER_DATA});
  }, []);

  console.log('outaise', userId);

  const handleSubmit = async () => {
    for (const category of selectedCategories) {
      await createCategory(
        category.name,
        Realm.BSON.ObjectID.createFromHexString(userId),
        category.icon,
        category.color,
      );
    }
    navigate('ChooseCurrencyScreen');
  };

  const toggleCategorySelection = category => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(
        selectedCategories.filter(item => item !== category),
      );
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  console.log(selectedCategories);

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
