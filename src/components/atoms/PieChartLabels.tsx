import {View} from 'react-native';
import React from 'react';
import PrimaryText from './PrimaryText';
import {Colors} from '../../hooks/useThemeColors';
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
}

const PieChartLabels: React.FC<PieChartLabelsProps> = React.memo(({colors, slices}) => {
  return (
    <View style={[gs.row, gs.wrap, gs.mt15, gs.justifyCenter]}>
      {slices.map(slice => (
        <View key={slice.key} style={gs.rowCenter}>
          <View style={[gs.size8, gs.rounded40, gs.mr3, {backgroundColor: slice.svg.fill}]} />
          <PrimaryText size={10} color={colors.primaryText} style={gs.mr5}>
            {slice?.label} |
          </PrimaryText>
        </View>
      ))}
    </View>
  );
});

export default PieChartLabels;
