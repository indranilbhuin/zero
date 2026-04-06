import {RefreshControl, View} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import React, {useCallback, useRef, memo} from 'react';
import Animated, {SharedValue, useAnimatedStyle, interpolate} from 'react-native-reanimated';
import ReanimatedSwipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import {navigate} from '../../utils/navigationUtils';
import Icon from '../../components/atoms/Icons';
import HeaderContainer from '../../components/molecules/HeaderContainer';
import useCategory from './useCategory';
import PrimaryView from '../../components/atoms/PrimaryView';
import PrimaryText from '../../components/atoms/PrimaryText';
import {CategoryData as Category} from '../../watermelondb/services';
import EmptyState from '../../components/atoms/EmptyState';
import {Colors} from '../../hooks/useThemeColors';
import {FlashList} from '@shopify/flash-list';
import {gs, hitSlop} from '../../styles/globalStyles';

const ACTION_WIDTH = 50;

const SwipeAction = memo(({
  progress,
  iconName,
  iconColor,
  backgroundColor,
  onPress,
}: {
  progress: SharedValue<number>;
  iconName: string;
  iconColor: string;
  backgroundColor: string;
  onPress: () => void;
}) => {
  const animatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(progress.value, [0, 0.6, 1], [0, 0.8, 1]),
    transform: [{scale: interpolate(progress.value, [0, 1], [0.6, 1])}],
  }));

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={[gs.center, {flex: 1, width: ACTION_WIDTH}]}>
      <Animated.View style={[gs.size40, gs.roundedFull, gs.center, animatedStyle, {backgroundColor}]}>
        <Icon name={iconName} size={18} color={iconColor} />
      </Animated.View>
    </TouchableOpacity>
  );
});

const CategoryRow = memo(({
  category,
  colors,
  onEdit,
  onDelete,
  openSwipeableRef,
}: {
  category: Category;
  colors: Colors;
  onEdit: (id: string, name: string, icon: string, color: string) => void;
  onDelete: (id: string) => void;
  openSwipeableRef: React.RefObject<{close: () => void} | null>;
}) => {
  const swipeableRef = useRef<any>(null);

  const handleSwipeWillOpen = useCallback(() => {
    if (openSwipeableRef.current && openSwipeableRef.current !== swipeableRef.current) {
      openSwipeableRef.current.close();
    }
    openSwipeableRef.current = swipeableRef.current;
  }, [openSwipeableRef]);

  return (
    <View style={gs.mb5}>
      <ReanimatedSwipeable
        ref={swipeableRef}
        renderLeftActions={(progress, _translation, swipeableMethods) => (
          <SwipeAction
            progress={progress}
            iconName="pencil"
            iconColor={colors.accentGreen}
            backgroundColor={colors.lightAccent}
            onPress={() => {
              onEdit(String(category.id), category.name, category.icon ?? '', category.color ?? colors.primaryText);
              swipeableMethods.close();
            }}
          />
        )}
        renderRightActions={(progress, _translation, swipeableMethods) => (
          <SwipeAction
            progress={progress}
            iconName="trash-2"
            iconColor={colors.accentOrange}
            backgroundColor={colors.lightAccent}
            onPress={() => {
              onDelete(category.id);
              swipeableMethods.close();
            }}
          />
        )}
        onSwipeableWillOpen={handleSwipeWillOpen}
        friction={2}
        overshootLeft={false}
        overshootRight={false}
        overshootFriction={8}>
        <View
          style={[
            gs.rounded12,
            gs.rowCenter,
            gs.px14,
            gs.py12,
            {backgroundColor: colors.containerColor},
          ]}>
          <View
            style={[
              gs.size36,
              gs.rounded10,
              gs.center,
              {backgroundColor: (category.color || colors.primaryText) + '18'},
            ]}>
            <Icon name={category.icon || 'shapes'} size={18} color={category.color || colors.primaryText} />
          </View>
          <PrimaryText weight="medium" size={14} style={gs.ml12} numberOfLines={1}>
            {category.name}
          </PrimaryText>
        </View>
      </ReanimatedSwipeable>
    </View>
  );
});

const CategoryScreen = () => {
  const {colors, refreshing, onRefresh, categories, handleEdit, handleDelete} = useCategory();
  const openSwipeableRef = useRef<{close: () => void} | null>(null);

  const renderCategoryItem = useCallback(
    ({item: category}: {item: Category}) => (
      <CategoryRow
        category={category}
        colors={colors}
        onEdit={handleEdit}
        onDelete={handleDelete}
        openSwipeableRef={openSwipeableRef}
      />
    ),
    [colors, handleEdit, handleDelete],
  );

  const ListEmptyComponent = useCallback(
    () => <EmptyState colors={colors} type={'Categories'} style={gs.mt30p} />,
    [colors],
  );

  return (
    <>
      <PrimaryView colors={colors} useSidePadding={false} useBottomPadding={false}>
        <View style={[gs.mb15, gs.px16]}>
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
            contentContainerStyle={{...gs.px16, ...gs.pb80}}
          />
        </View>
      </PrimaryView>
      <View style={[gs.absolute, gs.bottom15, gs.right15, gs.zIndex1]}>
        <TouchableOpacity
          style={[gs.size50, gs.roundedFull, gs.center, {backgroundColor: colors.primaryText}]}
          onPress={() => navigate('AddCategoryScreen')}
          hitSlop={hitSlop}
          accessibilityLabel="Add new category"
          accessibilityRole="button">
          <Icon name="plus" size={24} color={colors.buttonText} />
        </TouchableOpacity>
      </View>
    </>
  );
};

export default CategoryScreen;
