import {StyleSheet, View} from 'react-native';
import React from 'react';
import PrimaryText from './PrimaryText';
import {Colors} from '../../hooks/useThemeColors';

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

const PieChartLabels: React.FC<PieChartLabelsProps> = ({colors, slices}) => {
  return (
    <View
      style={{
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 15,
        justifyContent: 'center',
      }}>
      {slices.map(slice => (
        <View
          key={slice.key}
          style={{flexDirection: 'row', alignItems: 'center'}}>
          <View
            style={[styles.dotContainer, {backgroundColor: slice.svg.fill}]}
          />
          <PrimaryText
            style={{
              color: colors.primaryText,
              fontSize: 10,
              marginRight: 5,
            }}
            key={slice.key}>
            {slice?.label} |
          </PrimaryText>
        </View>
      ))}
    </View>
  );
};

export default PieChartLabels;

const styles = StyleSheet.create({
  dotContainer: {
    height: 8,
    width: 8,
    borderRadius: 40,
    marginRight: 3,
  },
});
