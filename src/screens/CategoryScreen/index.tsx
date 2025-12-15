import {RefreshControl, TouchableOpacity, View} from 'react-native';
import React, {useCallback} from 'react';
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
import {FlashList} from '@shopify/flash-list';

const CategoryScreen = () => {
  const {colors, refreshing, onRefresh, categories, handleEdit, handleDelete} =
    useCategory();

  const renderCategoryItem = useCallback(
    ({item: category}: {item: Category}) => (
      <View
        style={[
          styles.transactionContainer,
          {
            backgroundColor: colors.containerColor,
          },
        ]}>
        <View style={styles.iconNameContainer}>
          <View
            style={[
              styles.iconContainer,
              {backgroundColor: colors.iconContainer},
            ]}>
            <Icon
              name={category.icon ?? 'shape'}
              size={20}
              color={category.color ?? colors.primaryText}
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
                category.icon ?? 'shape',
                category.color ?? colors.primaryText,
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
    ),
    [colors, handleEdit, handleDelete],
  );

  const ListEmptyComponent = useCallback(
    () => (
      <EmptyState
        colors={colors}
        type={'Categories'}
        style={{marginTop: '30%'}}
      />
    ),
    [colors],
  );

  return (
    <>
      <PrimaryView colors={colors}>
        <View style={{marginBottom: 15}}>
          <HeaderContainer headerText={'Categories'} />
        </View>
        <View style={{flex: 1, marginBottom: 65}}>
          <FlashList
            data={categories}
            renderItem={renderCategoryItem}
            keyExtractor={item => String(item._id)}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            ListEmptyComponent={ListEmptyComponent}
          />
        </View>
      </PrimaryView>
      <View style={homeStyles.addButtonContainer}>
        <TouchableOpacity
          style={[
            homeStyles.addButton,
            {backgroundColor: colors.secondaryBackground},
          ]}
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
