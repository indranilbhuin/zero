import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import useThemeColors from '../../hooks/useThemeColors';
import AppHeader from '../../components/AppHeader';
import {goBack, navigate} from '../../utils/navigationUtils';
import Icon from '../../components/Icons';
import {useSelector} from 'react-redux';
import {selectCategoryData} from '../../redux/slice/categoryDataSlice';
import {deleteCategoryById} from '../../services/CategoryService';
import homeStyles from '../HomeScreen/style';

const CategoryScreen = () => {
  const categories = useSelector(selectCategoryData);

  const colors = useThemeColors();

  const handleEdit = (categoryId: Realm.BSON.ObjectId) => {};

  const handleDelete = (categoryId: Realm.BSON.ObjectId) => {
    console.log('this category is deleting', categoryId);
  };

  return (
    <>
      <View
        style={[
          styles.mainContainer,
          {backgroundColor: colors.primaryBackground},
        ]}>
        <View style={styles.headerContainer}>
          <AppHeader onPress={goBack} colors={colors} text="Category Screen" />
        </View>

        {categories?.map(category => (
          <View
            style={[
              styles.transactionContainer,
              {
                backgroundColor: colors.containerColor,
              },
            ]}
            key={category._id}>
            <View style={styles.iconNameContainer}>
              <View
                style={[
                  styles.iconContainer,
                  {backgroundColor: colors.primaryText},
                ]}>
                <Icon
                  name={category.icon}
                  size={20}
                  color={colors.buttonText}
                  type={'MaterialCommunityIcons'}
                />
              </View>
              <View>
                <Text
                  style={[styles.transactionText, {color: colors.primaryText}]}>
                  {category.name}
                </Text>
              </View>
            </View>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => handleEdit(category._id)}>
                <Icon
                  name={'edit'}
                  size={20}
                  color={colors.accentGreen}
                  type={'MaterialIcons'}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => handleDelete(category._id)}>
                <Icon
                  name={'delete-empty'}
                  size={20}
                  color={colors.accentOrange}
                  type={'MaterialCommunityIcons'}
                />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>
      <View style={homeStyles.addButtonContainer}>
        <TouchableOpacity
          style={[homeStyles.addButton, {backgroundColor: colors.primaryText}]}
          onPress={() => navigate('AddCategoryScreen')}>
          <Icon
            name={'shape-plus'}
            size={30}
            color={colors.buttonText}
            type={'MaterialCommunityIcons'}
          />
        </TouchableOpacity>
      </View>
    </>
  );
};

export default CategoryScreen;

const styles = StyleSheet.create({
  mainContainer: {
    height: '100%',
    paddingLeft: '6%',
    paddingRight: '6%',
  },
  headerContainer: {
    marginBottom: 20,
    marginTop: 20,
  },
  transactionContainer: {
    height: 60,
    width: '100%',
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 10,
    paddingRight: 5,
    alignItems: 'center',
    marginBottom: 5,
  },
  iconContainer: {
    width: 35,
    height: 35,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 50,
    marginRight: 10,
  },
  iconNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  descriptionContainer: {
    flexDirection: 'row',
  },
  descriptionText: {
    fontFamily: 'FiraCode-Medium',
    fontSize: 10,
    includeFontPadding: false,
    marginRight: 5,
  },
  transactionText: {
    fontFamily: 'FiraCode-Medium',
    fontSize: 14,
    includeFontPadding: false,
  },
  swipeView: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 60,
    width: 60,
  },
  stretchView: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 60,
    width: 250,
  },
  buttonContainer: {
    flexDirection: 'row',
    height: '100%',
  },
  actionButton: {
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
});
