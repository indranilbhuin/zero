import {StyleSheet, TouchableOpacity, View} from 'react-native';
import React, {useCallback} from 'react';
import Icon from '../atoms/Icons';
import Category from '../../schemas/CategorySchema';
import PrimaryText from '../atoms/PrimaryText';
import {Colors} from '../../hooks/useThemeColors';
import {FlashList} from '@shopify/flash-list';

interface CategoryContainerProps {
  categories: Array<Category>;
  toggleCategorySelection(category: Category): void;
  colors: Colors;
  selectedCategories: Array<Category>;
}

const CategoryContainer: React.FC<CategoryContainerProps> = ({
  categories,
  colors,
  toggleCategorySelection,
  selectedCategories,
}) => {
  const renderCategoryItem = useCallback(
    ({item: category}: {item: Category}) => (
      <TouchableOpacity onPress={() => toggleCategorySelection(category)}>
        <View
          style={[
            styles.categoryContainer,
            {
              backgroundColor:
                category?.name === selectedCategories[0]?.name
                  ? `${colors.accentGreen}75`
                  : colors.secondaryAccent,
              borderColor: colors.secondaryContainerColor,
            },
          ]}>
          {category.icon !== undefined ? (
            <View style={styles.iconContainer}>
              <Icon
                name={category.icon ?? 'shape'}
                size={20}
                color={category.color ?? colors.primaryText}
                type="MaterialCommunityIcons"
              />
            </View>
          ) : null}

          <PrimaryText
            style={{
              color:
                category?.name === selectedCategories[0]?.name
                  ? colors.buttonText
                  : colors.primaryText,
              fontSize: 13,
            }}>
            {category.name}
          </PrimaryText>
        </View>
      </TouchableOpacity>
    ),
    [colors, selectedCategories, toggleCategorySelection],
  );

  return (
    <View style={styles.categoryMainContainer}>
      <FlashList
        data={categories}
        renderItem={renderCategoryItem}
        keyExtractor={item => String(item._id)}
        scrollEnabled={false}
        horizontal
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

export default CategoryContainer;

const styles = StyleSheet.create({
  categoryMainContainer: {
    minHeight: 55,
  },
  listContent: {
    paddingRight: 5,
  },
  categoryContainer: {
    height: 45,
    padding: 10,
    marginRight: 5,
    marginTop: 5,
    borderRadius: 5,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  iconContainer: {
    marginRight: 5,
  },
});
