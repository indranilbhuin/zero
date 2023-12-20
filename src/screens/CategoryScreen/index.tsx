import {
  RefreshControl,
  ScrollView,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import {navigate} from '../../utils/navigationUtils';
import Icon from '../../components/atoms/Icons';
import homeStyles from '../HomeScreen/style';
import HeaderContainer from '../../components/molecules/HeaderContainer';
import styles from './style';
import useCategory from './useCategory';
import PrimaryView from '../../components/atoms/PrimaryView';
import PrimaryText from '../../components/atoms/PrimaryText';
import Category from '../../schemas/CategorySchema';
import EmptyState from '../../components/atoms/EmptyState';

const CategoryScreen = () => {
  const {colors, refreshing, onRefresh, categories, handleEdit, handleDelete} =
    useCategory();

  return (
    <>
      <PrimaryView colors={colors}>
        <View style={{marginBottom: 15}}>
          <HeaderContainer headerText={'Categories'} />
        </View>
        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }>
          {categories.length !== 0 ? (
            <View style={{marginBottom: 65}}>
              {categories?.map((category: Category) => (
                <View
                  style={[
                    styles.transactionContainer,
                    {
                      backgroundColor: colors.containerColor,
                    },
                  ]}
                  key={String(category._id)}>
                  <View style={styles.iconNameContainer}>
                    <View
                      style={[
                        styles.iconContainer,
                        {backgroundColor: colors.iconContainer},
                      ]}>
                      <Icon
                        name={category.icon}
                        size={20}
                        color={category.color}
                        type={'MaterialCommunityIcons'}
                      />
                    </View>
                    <View>
                      <PrimaryText>{category.name}</PrimaryText>
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
          ) : (
            <EmptyState
              colors={colors}
              type={'Categories'}
              style={{marginTop: '30%'}}
            />
          )}
        </ScrollView>
      </PrimaryView>
      <View style={homeStyles.addButtonContainer}>
        <TouchableOpacity
          style={[homeStyles.addButton, {backgroundColor: colors.secondaryBackground}]}
          onPress={() => navigate('AddCategoryScreen')}>
          <Icon
            name={'shape-plus'}
            size={30}
            color={colors.primaryText}
            type={'MaterialCommunityIcons'}
          />
        </TouchableOpacity>
      </View>
    </>
  );
};

export default CategoryScreen;
