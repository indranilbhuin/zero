import {TouchableOpacity, View} from 'react-native';
import React, {useCallback, useState} from 'react';
import {SheetManager, SheetProps} from 'react-native-actions-sheet';
import useThemeColors from '../hooks/useThemeColors';
import {CustomBottomSheet} from '../components/atoms/CustomBottomSheet';
import PrimaryText from '../components/atoms/PrimaryText';
import {gs} from '../styles/globalStyles';

const THEMES = ['light', 'dark', 'system'] as const;

const ThemePickerSheet: React.FC<SheetProps<'theme-picker-sheet'>> = React.memo(props => {
  const colors = useThemeColors();
  const [selected, setSelected] = useState(props.payload?.currentTheme ?? 'system');

  const handleConfirm = useCallback(() => {
    props.payload?.onSelect?.(selected);
    void SheetManager.hide(props.sheetId);
  }, [props, selected]);

  return (
    <CustomBottomSheet
      sheetId={props.sheetId}
      header={{
        title: 'Select Theme',
        showCloseButton: true,
        onClosePress: () => void SheetManager.hide(props.sheetId),
      }}
      gestureEnabled>
      <View style={[gs.px20, gs.pb10, gs.pt5]}>
        {THEMES.map(theme => (
          <TouchableOpacity key={theme} onPress={() => setSelected(theme)} activeOpacity={0.6}>
            <View style={[gs.rowBetweenCenter, gs.py12]}>
              <PrimaryText size={15} weight={selected === theme ? 'semibold' : 'medium'}>
                {theme.charAt(0).toUpperCase() + theme.slice(1)}
              </PrimaryText>
              <View
                style={[
                  gs.size20,
                  gs.rounded10,
                  gs.border2,
                  gs.center,
                  {borderColor: selected === theme ? colors.accentGreen : colors.secondaryText},
                ]}>
                {selected === theme && (
                  <View style={[gs.size10, gs.rounded5, {backgroundColor: colors.accentGreen}]} />
                )}
              </View>
            </View>
          </TouchableOpacity>
        ))}
        <TouchableOpacity
          onPress={handleConfirm}
          activeOpacity={0.7}
          style={[gs.mt10, gs.py12, gs.rounded10, gs.center, {backgroundColor: colors.accentGreen}]}>
          <PrimaryText size={14} weight="semibold" color={colors.buttonText}>
            Apply
          </PrimaryText>
        </TouchableOpacity>
      </View>
    </CustomBottomSheet>
  );
});

export default ThemePickerSheet;
