import {TouchableOpacity, View, useWindowDimensions} from 'react-native';
import React, {useCallback, useMemo, useState} from 'react';
import {SheetManager, SheetProps} from 'react-native-actions-sheet';
import {FlashList} from '@shopify/flash-list';
import {CustomBottomSheet} from '../components/atoms/CustomBottomSheet';
import useThemeColors from '../hooks/useThemeColors';
import CustomInput from '../components/atoms/CustomInput';
import Icon from '../components/atoms/Icons';
import {CATEGORY_ICONS} from '../constants/categoryIcons';
import {gs} from '../styles/globalStyles';

const IconPickerSheet: React.FC<SheetProps<'icon-picker-sheet'>> = React.memo(props => {
  const colors = useThemeColors();
  const [searchText, setSearchText] = useState('');
  const selectedIcon = props.payload?.selectedIcon ?? 'null';

  const {width: screenWidth} = useWindowDimensions();
  const iconsPerRow = 6;
  const iconSize = (screenWidth * 0.85) / iconsPerRow;

  const filteredIcons = useMemo(() => {
    const lowerCaseSearch = searchText.toLowerCase();
    return CATEGORY_ICONS.filter(iconName => iconName.toLowerCase().includes(lowerCaseSearch));
  }, [searchText]);

  const handleSelectIcon = useCallback(
    (iconName: string) => {
      props.payload?.onSelect?.(iconName);
    },
    [props.payload],
  );

  const handleClose = useCallback(() => {
    setSearchText('');
  }, []);

  const renderIconItem = useCallback(
    ({item}: {item: string}) => (
      <TouchableOpacity
        style={[
          gs.m8,
          gs.center,
          gs.rounded8,
          {
            width: iconSize,
            height: iconSize,
            backgroundColor: selectedIcon === item ? colors.primaryText : undefined,
          },
        ]}
        onPress={() => handleSelectIcon(item)}>
        <Icon name={item} size={30} color={selectedIcon === item ? colors.containerColor : colors.secondaryText} />
      </TouchableOpacity>
    ),
    [colors, selectedIcon, iconSize, handleSelectIcon],
  );

  return (
    <CustomBottomSheet
      sheetId={props.sheetId}
      header={{
        title: 'Select Icon',
        showCloseButton: true,
        onClosePress: () => {
          SheetManager.hide(props.sheetId);
        },
      }}
      onClose={handleClose}
      gestureEnabled>
      <View style={gs.px15}>
        <CustomInput
          input={searchText}
          label={undefined}
          colors={colors}
          placeholder="Search Icons"
          setInput={setSearchText}
          schema={undefined}
        />
      </View>

      <View style={[gs.h350, gs.px10]}>
        <FlashList
          data={filteredIcons}
          renderItem={renderIconItem}
          numColumns={6}
          keyExtractor={(iconItem: string) => iconItem}
        />
      </View>
    </CustomBottomSheet>
  );
});

export default IconPickerSheet;
