import {Keyboard, Modal, Platform, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, View} from 'react-native';
import React, {useState} from 'react';
import Icon from './Icons';
import PrimaryText from './PrimaryText';
import {formatDate} from '../../utils/dateUtils';
import DateTimePicker, {DateTimePickerEvent} from '@react-native-community/datetimepicker';
import useThemeColors from '../../hooks/useThemeColors';

interface DatePickerProps {
  createdAt: string;
  showDatePicker: boolean;
  setCreatedAt: (value: string) => void;
  setShowDatePicker: (value: boolean) => void;
}

const DatePicker: React.FC<DatePickerProps> = ({setShowDatePicker, createdAt, showDatePicker, setCreatedAt}) => {
  const colors = useThemeColors();
  const [tempDate, setTempDate] = useState(new Date(createdAt));

  const handleDateChange = (_event: DateTimePickerEvent, selectedDate?: Date | undefined) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
      if (selectedDate) {
        const formattedDateValue = formatDate(selectedDate, 'YYYY-MM-DDTHH:mm:ss');
        setCreatedAt(formattedDateValue);
      }
    } else if (selectedDate) {
      setTempDate(selectedDate);
    }
  };

  const handleIOSConfirm = () => {
    const formattedDateValue = formatDate(tempDate, 'YYYY-MM-DDTHH:mm:ss');
    setCreatedAt(formattedDateValue);
    setShowDatePicker(false);
  };

  const handleIOSCancel = () => {
    setTempDate(new Date(createdAt));
    setShowDatePicker(false);
  };

  const handleOpenDatePicker = () => {
    Keyboard.dismiss();
    setTempDate(new Date(createdAt));
    setShowDatePicker(true);
  };

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

      {Platform.OS === 'ios' && (
        <Modal
          visible={showDatePicker}
          transparent
          animationType="slide"
          onRequestClose={handleIOSCancel}>
          <TouchableWithoutFeedback onPress={handleIOSCancel}>
            <View style={styles.modalOverlay}>
              <TouchableWithoutFeedback>
                <View style={[styles.modalContent, {backgroundColor: colors.primaryBackground}]}>
                  <View style={styles.modalHeader}>
                    <TouchableOpacity onPress={handleIOSCancel}>
                      <PrimaryText style={{color: colors.accentRed}}>Cancel</PrimaryText>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleIOSConfirm}>
                      <PrimaryText style={{color: colors.accentGreen}}>Done</PrimaryText>
                    </TouchableOpacity>
                  </View>
                  <DateTimePicker
                    value={tempDate}
                    mode="date"
                    display="spinner"
                    onChange={handleDateChange}
                    style={styles.iosPicker}
                  />
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
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
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 30,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(128, 128, 128, 0.2)',
  },
  iosPicker: {
    height: 200,
  },
});
