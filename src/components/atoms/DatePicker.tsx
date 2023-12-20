import {StyleSheet, TouchableOpacity, View} from 'react-native';
import React from 'react';
import Icon from './Icons';
import PrimaryText from './PrimaryText';
import moment from 'moment';
import DateTimePicker, {
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import useThemeColors from '../../hooks/useThemeColors';

interface DatePickerProps {
  createdAt: string;
  showDatePicker: boolean;
  setCreatedAt: (value: string) => void;
  setShowDatePicker: (value: boolean) => void;
}

const DatePicker: React.FC<DatePickerProps> = ({
  setShowDatePicker,
  createdAt,
  showDatePicker,
  setCreatedAt,
}) => {
  const colors = useThemeColors();
  const handleDateChange = (
    event: DateTimePickerEvent,
    selectedDate?: Date | undefined,
  ) => {
    const currentDate = selectedDate ?? createdAt;
    const utcDate = new Date(currentDate);
    const formattedDate = moment(currentDate).format('YYYY-MM-DDTHH:mm:ss');
    setCreatedAt(formattedDate);
    setShowDatePicker(false);
    console.log("this is selected date", currentDate, utcDate, formattedDate)
  };
  console.log("this is current date", createdAt)

  return (
    <View style={styles.dateContainer}>
      <TouchableOpacity onPress={() => setShowDatePicker(true)}>
        <View
          style={[
            styles.dateButtonContainer,
            {
              backgroundColor: colors.secondaryAccent,
              borderColor: colors.secondaryContainerColor,
            },
          ]}>
          <Icon
            name={'calendar'}
            size={20}
            color={colors.primaryText}
            type={'IonIcons'}
          />
        </View>
      </TouchableOpacity>

      <PrimaryText>{moment(createdAt).format('Do MMM YYYY')}</PrimaryText>

      <View>
        {showDatePicker && (
          <DateTimePicker
            value={new Date(createdAt)}
            mode="date"
            is24Hour={false}
            display="default"
            onChange={handleDateChange}
            style={{backgroundColor: colors.accentGreen}}
          />
        )}
      </View>
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
