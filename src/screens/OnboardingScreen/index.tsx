import {Text, TextInput, TouchableOpacity, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import PrimaryButton from '../../components/PrimaryButton';
import useThemeColors from '../../hooks/useThemeColors';
import styles from './style';
import {navigate} from '../../utils/navigationUtils';
import defaultCategories from '../../../assets/defaultCategories.json';
import {createCategory} from '../../services/CategoryService';
import {getAllUsers} from '../../services/UserService';
import {setUserData} from '../../redux/slice/userDataSlice';
import {useDispatch, useSelector} from 'react-redux';

const OnboardingScreen = () => {
  const colors = useThemeColors();
  const [category, setCategory] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const userId = useSelector(
    (state: {userData: {userId: any}}) => state.userData.userId,
  );

  const dispatch = useDispatch();
  const handleSkip = () => {
    navigate('ChooseCurrencyScreen');
  };

  const fetchAllUsers = async () => {
    try {
      const users = await getAllUsers();
      const userId = String(users[0]?._id);
      console.log(userId);
      const username = users[0]?.username;
      const email = users[0]?.email;
      const userData = {userId, username, email};
      dispatch(setUserData(userData));
    } catch (error) {}
  };

  useEffect(() => {
    fetchAllUsers();
  }, []);

  console.log(userId);

  const handleSubmit = async () => {
    for (const category of selectedCategories) {
      await createCategory(
        category.name,
        Realm.BSON.ObjectID.createFromHexString(userId),
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
          <TouchableOpacity
            key={category._id}
            onPress={() => toggleCategorySelection(category)}>
            <View
              style={[
                styles.categoryContainer,
                {
                  backgroundColor: selectedCategories.includes(category)
                    ? colors.accentGreen
                    : colors.primaryText,
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

      {/* <View style={styles.subtitleTextContainer}>
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
      </View> */}
      <View style={styles.buttonContainer}>
        <PrimaryButton
          onPress={handleSubmit}
          backgroundColor={colors.primaryText}
          buttonText={'Continue'}
        />
      </View>
    </View>
  );
};

export default OnboardingScreen;
