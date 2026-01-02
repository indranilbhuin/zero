import {Dimensions, ScrollView, StyleSheet, TouchableOpacity, View} from 'react-native';
import React, {useCallback, useMemo} from 'react';
import {SheetManager, SheetProps} from 'react-native-actions-sheet';
import {CustomBottomSheet} from '../components/atoms/CustomBottomSheet';
import useThemeColors from '../hooks/useThemeColors';
import allColors from '../../assets/jsons/categoryColors.json';

const ColorPickerSheet: React.FC<SheetProps<'color-picker-sheet'>> = props => {
  const colors = useThemeColors();
  const selectedColor = props.payload?.selectedColor ?? 'null';

  const screenWidth = Dimensions.get('window').width;
  const colorsPerRow = 6;
  const colorSize = (screenWidth * 0.85) / colorsPerRow;

  const colorsList = useMemo(() => Object.keys(allColors), []);

  const handleSelectColor = useCallback(
    (color: string) => {
      props.payload?.onSelect?.(color);
    },
    [props.payload],
  );

  return (
    <CustomBottomSheet
      sheetId={props.sheetId}
      header={{
        title: 'Select Color',
        showCloseButton: true,
        onClosePress: () => {
          SheetManager.hide(props.sheetId);
        },
      }}
      gestureEnabled>
      <ScrollView
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}>
        <View style={styles.colorGrid}>
          {colorsList.map(color => (
            <TouchableOpacity
              key={color}
              style={[
                styles.colorItem,
                {
                  width: colorSize,
                  height: colorSize,
                  backgroundColor:
                    selectedColor === color ? colors.primaryText : undefined,
                },
              ]}
              onPress={() => handleSelectColor(color)}>
              <View style={[styles.colorCircle, {backgroundColor: color}]} />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </CustomBottomSheet>
  );
};

export default ColorPickerSheet;

const styles = StyleSheet.create({
  scrollContainer: {
    maxHeight: 400,
    paddingHorizontal: 10,
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  colorItem: {
    margin: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
  colorCircle: {
    height: 36,
    width: 36,
    borderRadius: 18,
  },
});
