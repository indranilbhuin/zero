import {Platform, StyleSheet, TouchableOpacity, View} from 'react-native';
import React, {useState, useCallback} from 'react';
import {SheetManager, SheetProps} from 'react-native-actions-sheet';
import DateTimePicker, {DateTimePickerEvent} from '@react-native-community/datetimepicker';
import {CustomBottomSheet} from '../components/atoms/CustomBottomSheet';
import useThemeColors from '../hooks/useThemeColors';
import PrimaryText from '../components/atoms/PrimaryText';

const DatePickerSheet: React.FC<SheetProps<'date-picker-sheet'>> = props => {
  const colors = useThemeColors();
  const initialDate = props.payload?.selectedDate
    ? new Date(props.payload.selectedDate)
    : new Date();
  const [tempDate, setTempDate] = useState(initialDate);

  const handleDateChange = useCallback(
    (_event: DateTimePickerEvent, selectedDate?: Date) => {
      if (selectedDate) {
        setTempDate(selectedDate);
      }
    },
    [],
  );

  const handleConfirm = useCallback(() => {
    props.payload?.onSelect?.(tempDate);
    SheetManager.hide(props.sheetId);
  }, [props.payload, props.sheetId, tempDate]);

  const handleCancel = useCallback(() => {
    SheetManager.hide(props.sheetId);
  }, [props.sheetId]);

  return (
    <CustomBottomSheet
      sheetId={props.sheetId}
      header={null}
      showIndicator={true}
      gestureEnabled>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleCancel} style={styles.headerButton}>
            <PrimaryText style={{color: colors.accentRed}}>Cancel</PrimaryText>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleConfirm} style={styles.headerButton}>
            <PrimaryText style={{color: colors.accentGreen}}>Done</PrimaryText>
          </TouchableOpacity>
        </View>

        <View style={styles.pickerContainer}>
          <DateTimePicker
            value={tempDate}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={handleDateChange}
            style={styles.picker}
          />
        </View>
      </View>
    </CustomBottomSheet>
  );
};

export default DatePickerSheet;

const styles = StyleSheet.create({
  container: {
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  headerButton: {
    padding: 5,
  },
  pickerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  picker: {
    height: 200,
    width: '100%',
  },
});
