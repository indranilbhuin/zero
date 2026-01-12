import {Keyboard, Platform, TouchableOpacity, View} from 'react-native';
import React, {useCallback} from 'react';
import Icon from './Icons';
import PrimaryText from './PrimaryText';
import {formatDate} from '../../utils/dateUtils';
import DateTimePicker, {DateTimePickerEvent} from '@react-native-community/datetimepicker';
import useThemeColors from '../../hooks/useThemeColors';
import {SheetManager} from 'react-native-actions-sheet';
import {gs} from '../../styles/globalStyles';

interface DatePickerProps {
  createdAt: string;
  showDatePicker: boolean;
  setCreatedAt: (value: string) => void;
  setShowDatePicker: (value: boolean) => void;
  label?: string;
  minDate?: Date;
  maxDate?: Date;
}

const DatePicker: React.FC<DatePickerProps> = React.memo(
  ({setShowDatePicker, createdAt, showDatePicker, setCreatedAt, label, minDate, maxDate}) => {
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
            minDate,
            maxDate,
            onSelect: (date: Date) => {
              const formattedDateValue = formatDate(date, 'YYYY-MM-DDTHH:mm:ss');
              setCreatedAt(formattedDateValue);
            },
          },
        });
      } else {
        setShowDatePicker(true);
      }
    }, [createdAt, setCreatedAt, setShowDatePicker, minDate, maxDate]);

    return (
      <View>
        {label && <PrimaryText style={gs.mb5}>{label}</PrimaryText>}
        <View style={[gs.rowCenter, gs.mb10]}>
          <TouchableOpacity onPress={handleOpenDatePicker} style={gs.rowCenter}>
            <View
              style={[
                gs.size40,
                gs.center,
                gs.rounded5,
                gs.border2,
                gs.mr10,
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
              minimumDate={minDate}
              maximumDate={maxDate}
            />
          )}
        </View>
      </View>
    );
  },
);

export default DatePicker;
