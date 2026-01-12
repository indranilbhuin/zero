import {TouchableOpacity, View, useWindowDimensions} from 'react-native';
import React, {useCallback, useMemo} from 'react';
import {SheetManager, SheetProps} from 'react-native-actions-sheet';
import {FlashList} from '@shopify/flash-list';
import {CustomBottomSheet} from '../components/atoms/CustomBottomSheet';
import useThemeColors from '../hooks/useThemeColors';
import allColors from '../../assets/jsons/categoryColors.json';
import {gs} from '../styles/globalStyles';

const ColorPickerSheet: React.FC<SheetProps<'color-picker-sheet'>> = React.memo(props => {
  const colors = useThemeColors();
  const selectedColor = props.payload?.selectedColor ?? 'null';

  const {width: screenWidth} = useWindowDimensions();
  const colorsPerRow = 6;
  const colorSize = (screenWidth * 0.85) / colorsPerRow;

  const colorsList = useMemo(() => Object.keys(allColors), []);

  const handleSelectColor = useCallback(
    (color: string) => {
      props.payload?.onSelect?.(color);
    },
    [props.payload],
  );

  const renderColorItem = useCallback(
    ({item: color}: {item: string}) => (
      <TouchableOpacity
        style={[
          gs.m8,
          gs.center,
          gs.rounded8,
          {
            width: colorSize,
            height: colorSize,
            backgroundColor: selectedColor === color ? colors.primaryText : undefined,
          },
        ]}
        onPress={() => handleSelectColor(color)}>
        <View style={[gs.size36, gs.rounded18, {backgroundColor: color}]} />
      </TouchableOpacity>
    ),
    [colorSize, selectedColor, colors.primaryText, handleSelectColor],
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
      <View style={[gs.h350, gs.px10]}>
        <FlashList
          data={colorsList}
          renderItem={renderColorItem}
          numColumns={6}
          keyExtractor={(color: string) => color}
        />
      </View>
    </CustomBottomSheet>
  );
});

export default ColorPickerSheet;
