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
        {categories.map(category => (
          <TouchableOpacity
            key={String(category.id || category._id || category.name)}
            onPress={() => toggleCategorySelection(category)}>
            <View
              style={[
                gs.h45,
                gs.p10,
                gs.mr8,
                gs.mb8,
                gs.rounded5,
                gs.border2,
                gs.center,
                gs.row,
                {
                  backgroundColor:
                    category?.name === selectedCategories[0]?.name ? `${colors.accentGreen}75` : colors.secondaryAccent,
                  borderColor: colors.secondaryContainerColor,
                },
              ]}>
              {category.icon !== undefined ? (
                <View style={gs.mr5}>
                  <Icon name={category.icon ?? 'shapes'} size={20} color={category.color ?? colors.primaryText} />
                </View>
              ) : null}

              <PrimaryText
                size={13}
                color={category?.name === selectedCategories[0]?.name ? colors.buttonText : colors.primaryText}>
                {category.name}
              </PrimaryText>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    );
  },
);

export default CategoryContainer;
