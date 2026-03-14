import {ScrollView, TouchableOpacity, View} from 'react-native';
import React, {useCallback, useState} from 'react';
import {SheetManager, SheetProps} from 'react-native-actions-sheet';
import useThemeColors from '../hooks/useThemeColors';
import {CustomBottomSheet} from '../components/atoms/CustomBottomSheet';
import PrimaryText from '../components/atoms/PrimaryText';
import {getMonthNamesShort, getCurrentYear} from '../utils/dateUtils';
import {gs} from '../styles/globalStyles';

const MONTHS_SHORT = getMonthNamesShort();
const CURRENT_YEAR = getCurrentYear();

const MonthYearPickerSheet: React.FC<SheetProps<'month-year-picker-sheet'>> = React.memo(props => {
  const colors = useThemeColors();
  const {selectedMonth, selectedYear, availableYears, onSelect} = props.payload ?? {};

  const [pickerYear, setPickerYear] = useState(selectedYear ?? CURRENT_YEAR);
  const [pickerMonthIndex, setPickerMonthIndex] = useState(selectedMonth ?? 0);

  const years = availableYears && availableYears.length > 0 ? availableYears : [CURRENT_YEAR];

  const handleConfirm = useCallback(() => {
    onSelect?.(pickerMonthIndex, pickerYear);
    void SheetManager.hide(props.sheetId);
  }, [onSelect, pickerMonthIndex, pickerYear, props.sheetId]);

  const isMonthDisabled = useCallback(
    (monthIndex: number) => {
      if (pickerYear < CURRENT_YEAR) {
        return false;
      }
      if (pickerYear > CURRENT_YEAR) {
        return true;
      }
      return monthIndex > new Date().getMonth();
    },
    [pickerYear],
  );

  return (
    <CustomBottomSheet
      sheetId={props.sheetId}
      header={{
        title: 'Select Month & Year',
        showCloseButton: true,
        onClosePress: () => void SheetManager.hide(props.sheetId),
      }}
      gestureEnabled>
      <View style={[gs.px16, gs.pb10, gs.pt5]}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={gs.mb15}>
          <View style={[gs.rowCenter, gs.gap6]}>
            {years.map(year => (
              <TouchableOpacity key={year} onPress={() => setPickerYear(year)}>
                <View
                  style={[
                    gs.px12,
                    gs.py8,
                    gs.rounded8,
                    {
                      backgroundColor: year === pickerYear ? colors.accentGreen : colors.secondaryAccent,
                    },
                  ]}>
                  <PrimaryText
                    size={13}
                    weight={year === pickerYear ? 'semibold' : 'regular'}
                    color={year === pickerYear ? colors.buttonText : colors.primaryText}
                    variant="number">
                    {year}
                  </PrimaryText>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        <View style={[gs.row, gs.wrap, gs.gap8, gs.mb15]}>
          {MONTHS_SHORT.map((month, index) => {
            const isActive = index === pickerMonthIndex;
            const disabled = isMonthDisabled(index);

            return (
              <TouchableOpacity
                key={month}
                disabled={disabled}
                onPress={() => setPickerMonthIndex(index)}
                style={[
                  gs.py10,
                  gs.rounded8,
                  gs.center,
                  {
                    width: '22.5%',
                    backgroundColor: isActive ? colors.accentGreen : colors.secondaryAccent,
                    opacity: disabled ? 0.35 : 1,
                  },
                ]}>
                <PrimaryText
                  size={13}
                  weight={isActive ? 'semibold' : 'regular'}
                  color={isActive ? colors.buttonText : colors.primaryText}>
                  {month}
                </PrimaryText>
              </TouchableOpacity>
            );
          })}
        </View>

        <TouchableOpacity
          onPress={handleConfirm}
          style={[
            gs.py12,
            gs.rounded10,
            gs.center,
            {backgroundColor: colors.accentGreen},
          ]}>
          <PrimaryText size={14} weight="semibold" color={colors.buttonText}>
            Done
          </PrimaryText>
        </TouchableOpacity>
      </View>
    </CustomBottomSheet>
  );
});

export default MonthYearPickerSheet;
