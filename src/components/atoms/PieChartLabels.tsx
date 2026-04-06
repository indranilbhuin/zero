import {TouchableOpacity, View} from 'react-native';
import React, {useCallback, useMemo} from 'react';
import PrimaryText from './PrimaryText';
import Icon from './Icons';
import {Colors} from '../../hooks/useThemeColors';
import {formatCurrency} from '../../utils/numberUtils';
import {gs} from '../../styles/globalStyles';

interface Label {
  key: string;
  label: string;
  svg: {
    fill: string;
    onPress: () => void;
  };
  value: number;
  categoryId?: string;
  categoryIcon?: string;
}

interface PieChartLabelsProps {
  colors: Colors;
  slices: Array<Label>;
  currencySymbol: string;
  onCategoryPress?: (categoryId: string, categoryName: string, categoryColor: string, categoryIcon?: string) => void;
}

const PieChartLabels: React.FC<PieChartLabelsProps> = React.memo(({colors, slices, currencySymbol, onCategoryPress}) => {
  const total = useMemo(() => slices.reduce((sum, s) => sum + s.value, 0), [slices]);
  const sorted = useMemo(() => [...slices].sort((a, b) => b.value - a.value), [slices]);

  const handlePress = useCallback(
    (slice: Label) => {
      if (onCategoryPress && slice.categoryId) {
        onCategoryPress(slice.categoryId, slice.key, slice.svg.fill, slice.categoryIcon);
      }
    },
    [onCategoryPress],
  );

  const isTappable = !!onCategoryPress;

  return (
    <View style={gs.mt20}>
      {sorted.map(slice => {
        const pct = total > 0 ? Math.round((slice.value / total) * 100) : 0;
        const content = (
          <View
            key={slice.key}
            style={[
              gs.rowCenter,
              gs.rounded12,
              gs.gap8,
              gs.mb6,
              {paddingHorizontal: 14, paddingVertical: 10, backgroundColor: colors.secondaryAccent},
            ]}>
            <View style={[gs.size10, gs.roundedFull, {backgroundColor: slice.svg.fill}]} />
            <PrimaryText size={13} color={colors.primaryText} numberOfLines={1} style={gs.flex1}>
              {slice.key}
            </PrimaryText>
            <PrimaryText size={13} weight="semibold" variant="number" color={colors.primaryText}>
              {currencySymbol}{formatCurrency(slice.value)}
            </PrimaryText>
            <View style={[gs.px5, gs.py3, gs.rounded5, {backgroundColor: slice.svg.fill + '20'}]}>
              <PrimaryText size={11} weight="semibold" variant="number" color={slice.svg.fill}>
                {pct}%
              </PrimaryText>
            </View>
            {isTappable && (
              <Icon name="chevron-right" size={14} color={colors.secondaryText} />
            )}
          </View>
        );

        if (isTappable) {
          return (
            <TouchableOpacity key={slice.key} onPress={() => handlePress(slice)} activeOpacity={0.7}>
              {content}
            </TouchableOpacity>
          );
        }

        return content;
      })}
    </View>
  );
});

export default PieChartLabels;
