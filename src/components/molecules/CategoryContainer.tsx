import {StyleSheet, TouchableOpacity, View} from 'react-native';
import React from 'react';
import Icon from '../atoms/Icons';
import PrimaryText from '../atoms/PrimaryText';
import {Colors} from '../../hooks/useThemeColors';

// Generic category type that works for both RxDB categories and JSON categories
interface Category {
  id?: string;
  _id?: string;
  name: string;
  icon?: string;
  color?: string;
  categoryStatus?: boolean;
  userId?: string;
}

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
  return (
    <View style={styles.categoryMainContainer}>
      {categories.map(category => (
        <TouchableOpacity
          key={String(category.id)}
          onPress={() => toggleCategorySelection(category)}>
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
      ))}
    </View>
  );
};

export default CategoryContainer;

const styles = StyleSheet.create({
  categoryMainContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  categoryContainer: {
    height: 45,
    padding: 10,
    marginRight: 8,
    marginBottom: 8,
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
