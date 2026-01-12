import {RefreshControl, TouchableOpacity, View} from 'react-native';
import React, {useCallback} from 'react';
import {navigate} from '../../utils/navigationUtils';
import Icon from '../../components/atoms/Icons';
import HeaderContainer from '../../components/molecules/HeaderContainer';
import useCategory from './useCategory';
import PrimaryView from '../../components/atoms/PrimaryView';
import PrimaryText from '../../components/atoms/PrimaryText';
import {CategoryData as Category} from '../../watermelondb/services';
import EmptyState from '../../components/atoms/EmptyState';
import {FlashList} from '@shopify/flash-list';
import {gs, hitSlop} from '../../styles/globalStyles';

const CategoryScreen = () => {
  const {colors, refreshing, onRefresh, categories, handleEdit, handleDelete} = useCategory();

  const renderCategoryItem = useCallback(
    ({item: category}: {item: Category}) => (
      <View
        style={[
          gs.h60,
          gs.wFull,
          gs.rounded10,
          gs.rowBetweenCenter,
          gs.mb5,
          {backgroundColor: colors.containerColor, paddingLeft: 10, paddingRight: 5},
        ]}>
        <View style={gs.rowCenter}>
          <View style={[gs.size35, gs.center, gs.rounded50, gs.mr10, {backgroundColor: colors.iconContainer}]}>
            <Icon name={category.icon ?? 'shapes'} size={20} color={category.color ?? colors.primaryText} />
          </View>
          <View>
            <PrimaryText>{category.name}</PrimaryText>
          </View>
        </View>
        <View style={[gs.row, gs.hFull]}>
          <TouchableOpacity
            style={[gs.w40, gs.center, gs.hFull]}
            onPress={() =>
              handleEdit(String(category.id), category.name, category.icon ?? 'shape', category.color ?? colors.primaryText)
            }>
            <Icon name="pencil" size={20} color={colors.accentGreen} />
          </TouchableOpacity>
          <TouchableOpacity style={[gs.w40, gs.center, gs.hFull]} onPress={() => handleDelete(category.id)}>
            <Icon name="trash-2" size={20} color={colors.accentOrange} />
          </TouchableOpacity>
        </View>
      </View>
    ),
    [colors, handleEdit, handleDelete],
  );

  const ListEmptyComponent = useCallback(
    () => <EmptyState colors={colors} type={'Categories'} style={gs.mt30p} />,
    [colors],
  );

  return (
    <>
      <PrimaryView colors={colors} useBottomPadding={false}>
        <View style={gs.mb15}>
          <HeaderContainer headerText={'Categories'} />
        </View>
        <View style={gs.flex1}>
          <FlashList
            data={categories}
            renderItem={renderCategoryItem}
            keyExtractor={item => String(item.id)}
            showsVerticalScrollIndicator={false}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            ListEmptyComponent={ListEmptyComponent}
          />
        </View>
      </PrimaryView>
      <View style={[gs.absolute, gs.bottom15, gs.right15, gs.zIndex1]}>
        <TouchableOpacity
          style={[gs.size50, gs.rounded8, gs.center, {backgroundColor: colors.secondaryBackground}]}
          onPress={() => navigate('AddCategoryScreen')}
          hitSlop={hitSlop}
          accessibilityLabel="Add new category"
          accessibilityRole="button">
          <Icon name="plus" size={30} color={colors.primaryText} />
        </TouchableOpacity>
      </View>
    </>
  );
};

export default CategoryScreen;
