import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import useThemeColors from '../../hooks/useThemeColors';
import {navigate} from '../../utils/navigationUtils';
import Icon from '../../components/Icons';
import {useDispatch, useSelector} from 'react-redux';
import {selectActiveCategories} from '../../redux/slice/categoryDataSlice';
import homeStyles from '../HomeScreen/style';
import {FETCH_ALL_CATEGORY_DATA} from '../../redux/actionTypes';
import {softDeleteCategoryById} from '../../services/CategoryService';
import HeaderContainer from '../../components/HeaderContainer';

const CategoryScreen = () => {
  const colors = useThemeColors();
  const dispatch = useDispatch();
  const categories = useSelector(selectActiveCategories);
  const [refreshing, setRefreshing] = useState(false);

  console.log(categories);

  useEffect(() => {
    if (refreshing) {
      dispatch({type: FETCH_ALL_CATEGORY_DATA});
      setRefreshing(false);
    }
  }, [refreshing]);

  const onRefresh = () => {
    setRefreshing(true);
  };

  const handleEdit = (
    categoryId: string,
    categoryName: string,
    categoryIcon: string,
    categoryColor: string,
  ) => {
    navigate('UpdateCategoryScreen', {
      categoryId,
      categoryName,
      categoryIcon,
      categoryColor,
    });
  };

  const handleDelete = async (categoryId: Realm.BSON.ObjectId) => {
    try {
      await softDeleteCategoryById(categoryId);
      dispatch({type: FETCH_ALL_CATEGORY_DATA});
      setRefreshing(true);
    } catch (error) {
      console.log('this category is deleting', categoryId);
    }
  };

  return (
    <>
      <View
        style={[
          styles.mainContainer,
          {backgroundColor: colors.primaryBackground},
        ]}>
        <View style={{marginBottom: 15}}>
          <HeaderContainer headerText={'Categories'} />
        </View>
        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }>
          <View style={{marginBottom: 65}}>
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
                      color={category.color}
                      type={'MaterialCommunityIcons'}
                    />
                  </View>
                  <View>
                    <Text
                      style={[
                        styles.transactionText,
                        {color: colors.primaryText},
                      ]}>
                      {category.name}
                    </Text>
                  </View>
                </View>
                <View style={styles.buttonContainer}>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() =>
                      handleEdit(
                        String(category._id),
                        category.name,
                        category.icon,
                        category.color,
                      )
                    }>
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
        </ScrollView>
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
