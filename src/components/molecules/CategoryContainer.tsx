import {TouchableOpacity, View} from 'react-native';
import React from 'react';
import Icon from '../atoms/Icons';
import PrimaryText from '../atoms/PrimaryText';
import {Colors} from '../../hooks/useThemeColors';
import {gs} from '../../styles/globalStyles';

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

const CategoryContainer: React.FC<CategoryContainerProps> = React.memo(
  ({categories, colors, toggleCategorySelection, selectedCategories}) => {
    return (
      <View style={[gs.row, gs.wrap]}>
        {categories.map(category => {
          const isSelected = category?.name === selectedCategories[0]?.name;

          return (
            <TouchableOpacity
              key={String(category.id || category._id || category.name)}
              onPress={() => toggleCategorySelection(category)}
              activeOpacity={0.7}>
              <View
                style={[
                  gs.py8,
                  gs.px14,
                  gs.mr8,
                  gs.mb8,
                  gs.rounded12,
                  gs.rowCenter,
                  gs.gap6,
                  {backgroundColor: isSelected ? colors.primaryText : colors.secondaryAccent},
                ]}>
                {category.icon !== undefined && (
                  <Icon
                    name={category.icon ?? 'shapes'}
                    size={16}
                    color={isSelected ? colors.buttonText : (category.color ?? colors.secondaryText)}
                  />
                )}
                <PrimaryText
                  size={13}
                  weight={isSelected ? 'semibold' : 'regular'}
                  color={isSelected ? colors.buttonText : colors.primaryText}>
                  {category.name}
                </PrimaryText>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  },
);

export default CategoryContainer;
