import {View} from 'react-native';
import React, {useMemo} from 'react';
import PrimaryText from './PrimaryText';
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
}
interface PieChartLabelsProps {
  colors: Colors;
  slices: Array<Label>;
  currencySymbol: string;
}

const PieChartLabels: React.FC<PieChartLabelsProps> = React.memo(({colors, slices, currencySymbol}) => {
  const total = useMemo(() => slices.reduce((sum, s) => sum + s.value, 0), [slices]);
  const sorted = useMemo(() => [...slices].sort((a, b) => b.value - a.value), [slices]);

  return (
    <View style={[gs.row, gs.wrap, gs.mt10, gs.gap6, gs.justifyCenter]}>
      {sorted.map(slice => {
        const pct = total > 0 ? Math.round((slice.value / total) * 100) : 0;
        return (
          <View
            key={slice.key}
            style={[
              gs.rowCenter,
              gs.rounded8,
              gs.gap4,
              {paddingHorizontal: 8, paddingVertical: 5, backgroundColor: colors.secondaryAccent},
            ]}>
            <View style={[gs.size8, gs.roundedFull, {backgroundColor: slice.svg.fill}]} />
            <PrimaryText size={11} color={colors.primaryText} numberOfLines={1}>
              {slice.key}
            </PrimaryText>
            <PrimaryText size={11} weight="semibold" variant="number" color={colors.secondaryText}>
              {currencySymbol}{formatCurrency(slice.value)}
            </PrimaryText>
            <PrimaryText size={10} variant="number" color={colors.secondaryText} style={{opacity: 0.6}}>
              {pct}%
            </PrimaryText>
          </View>
        );
      })}
    </View>
  );
});

export default PieChartLabels;
