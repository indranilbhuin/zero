import {TouchableOpacity, View} from 'react-native';
import React, {ReactNode} from 'react';
import Icon from './Icons';
import PrimaryText from './PrimaryText';
import {Colors} from '../../hooks/useThemeColors';
import {gs, hitSlop} from '../../styles/globalStyles';

interface AppHeaderProps {
  onPress: () => void;
  text: string;
  colors: Colors;
  subtitle?: string;
  iconSize?: number;
  rightAction?: ReactNode;
}

const AppHeader: React.FC<AppHeaderProps> = React.memo(
  ({onPress, colors, text, subtitle, iconSize = 24, rightAction}) => {
    return (
      <View style={[gs.row, gs.itemsCenter, gs.justifyBetween]}>
        <View style={[gs.row, gs.itemsCenter, gs.flex1]}>
          <TouchableOpacity
            onPress={onPress}
            style={gs.mr10}
            hitSlop={hitSlop}
            accessibilityLabel="Go back"
            accessibilityRole="button">
            <Icon name="arrow-left" size={iconSize} color={colors.primaryText} />
          </TouchableOpacity>
          <View style={gs.flex1}>
            <PrimaryText numberOfLines={1} ellipsizeMode="tail">
              {text}
            </PrimaryText>
            {subtitle && (
              <PrimaryText size={12} color={colors.secondaryText} numberOfLines={1} ellipsizeMode="tail">
                {subtitle}
              </PrimaryText>
            )}
          </View>
        </View>
        {rightAction && <View style={gs.ml10}>{rightAction}</View>}
      </View>
    );
  },
);

export default AppHeader;
