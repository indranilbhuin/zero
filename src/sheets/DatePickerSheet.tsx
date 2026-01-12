import {Platform, TouchableOpacity, View} from 'react-native';
import React, {useState, useCallback, memo} from 'react';
import {SheetManager, SheetProps} from 'react-native-actions-sheet';
import DateTimePicker, {DateTimePickerEvent} from '@react-native-community/datetimepicker';
import {CustomBottomSheet} from '../components/atoms/CustomBottomSheet';
import useThemeColors from '../hooks/useThemeColors';
import PrimaryText from '../components/atoms/PrimaryText';
import {gs} from '../styles/globalStyles';

const DatePickerSheet: React.FC<SheetProps<'date-picker-sheet'>> = props => {
  const colors = useThemeColors();
  const initialDate = props.payload?.selectedDate ? new Date(props.payload.selectedDate) : new Date();
  const [tempDate, setTempDate] = useState(initialDate);

  const minDate = props.payload?.minDate;
  const maxDate = props.payload?.maxDate;

  const handleDateChange = useCallback((_event: DateTimePickerEvent, selectedDate?: Date) => {
    if (selectedDate) {
      setTempDate(selectedDate);
    }
  }, []);

  const handleConfirm = useCallback(() => {
    props.payload?.onSelect?.(tempDate);
    SheetManager.hide(props.sheetId);
  }, [props.payload, props.sheetId, tempDate]);

  const handleCancel = useCallback(() => {
    SheetManager.hide(props.sheetId);
  }, [props.sheetId]);

  return (
    <CustomBottomSheet sheetId={props.sheetId} header={null} showIndicator={true} gestureEnabled>
      <View style={gs.pb20}>
        <View style={[gs.rowBetween, gs.px20, gs.py10]}>
          <TouchableOpacity onPress={handleCancel} style={gs.p5}>
            <PrimaryText color={colors.accentRed}>Cancel</PrimaryText>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleConfirm} style={gs.p5}>
            <PrimaryText color={colors.accentGreen}>Done</PrimaryText>
          </TouchableOpacity>
        </View>

        <View style={gs.center}>
          <DateTimePicker
            value={tempDate}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={handleDateChange}
            minimumDate={minDate}
            maximumDate={maxDate}
            style={[gs.h200, gs.wFull]}
          />
        </View>
      </View>
    </CustomBottomSheet>
  );
};

export default memo(DatePickerSheet);
