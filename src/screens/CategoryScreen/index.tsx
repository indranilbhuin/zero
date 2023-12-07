import {
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import {navigate} from '../../utils/navigationUtils';
import Icon from '../../components/Icons';
import homeStyles from '../HomeScreen/style';
import HeaderContainer from '../../components/HeaderContainer';
import styles from './style';
import useCategory from './useCategory';

const CategoryScreen = () => {
  const {colors, refreshing, onRefresh, categories, handleEdit, handleDelete} =
    useCategory();

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
