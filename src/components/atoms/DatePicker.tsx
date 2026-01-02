import {Keyboard, Platform, StyleSheet, TouchableOpacity, View} from 'react-native';
import React, {useCallback} from 'react';
import Icon from './Icons';
import PrimaryText from './PrimaryText';
import {formatDate} from '../../utils/dateUtils';
import DateTimePicker, {DateTimePickerEvent} from '@react-native-community/datetimepicker';
import useThemeColors from '../../hooks/useThemeColors';
import {SheetManager} from 'react-native-actions-sheet';

interface DatePickerProps {
  createdAt: string;
  showDatePicker: boolean;
  setCreatedAt: (value: string) => void;
  setShowDatePicker: (value: boolean) => void;
}

const DatePicker: React.FC<DatePickerProps> = ({setShowDatePicker, createdAt, showDatePicker, setCreatedAt}) => {
  const colors = useThemeColors();

  const handleDateChange = useCallback(
    (_event: DateTimePickerEvent, selectedDate?: Date) => {
      setShowDatePicker(false);
      if (selectedDate) {
        const formattedDateValue = formatDate(selectedDate, 'YYYY-MM-DDTHH:mm:ss');
        setCreatedAt(formattedDateValue);
      }
    },
    [setCreatedAt, setShowDatePicker],
  );

  const handleOpenDatePicker = useCallback(() => {
    Keyboard.dismiss();

    if (Platform.OS === 'ios') {
      SheetManager.show('date-picker-sheet', {
        payload: {
          selectedDate: createdAt,
          onSelect: (date: Date) => {
            const formattedDateValue = formatDate(date, 'YYYY-MM-DDTHH:mm:ss');
            setCreatedAt(formattedDateValue);
          },
        },
      });
    } else {
      setShowDatePicker(true);
    }
  }, [createdAt, setCreatedAt, setShowDatePicker]);

  return (
    <View style={styles.dateContainer}>
      <TouchableOpacity onPress={handleOpenDatePicker} style={styles.touchableArea}>
        <View
          style={[
            styles.dateButtonContainer,
            {
              backgroundColor: colors.secondaryAccent,
              borderColor: colors.secondaryContainerColor,
            },
          ]}>
          <Icon name="calendar" size={20} color={colors.primaryText} />
        </View>
        <PrimaryText>{formatDate(createdAt, 'Do MMM YYYY')}</PrimaryText>
      </TouchableOpacity>

      {Platform.OS === 'android' && showDatePicker && (
        <DateTimePicker
          value={new Date(createdAt)}
          mode="date"
          is24Hour={false}
          display="default"
          onChange={handleDateChange}
        />
      )}
    </View>
  );
};

export default DatePicker;

const styles = StyleSheet.create({
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  touchableArea: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateButtonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
    width: 40,
    borderRadius: 5,
    borderWidth: 2,
    marginRight: 10,
  },
});
