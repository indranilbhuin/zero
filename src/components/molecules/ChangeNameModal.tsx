import {Modal, StyleSheet, View} from 'react-native';
import React from 'react';
import PrimaryText from '../atoms/PrimaryText';
import CustomInput from '../atoms/CustomInput';
import PrimaryButton from '../atoms/PrimaryButton';
import { nameSchema } from '../../utils/validationSchema';

const ChangeNameModal = ({
  colors,
  isNameModalVisible,
  handleNameModalClose,
  name,
  setName,
  handleNameUpdate,
}) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isNameModalVisible}
      onRequestClose={handleNameModalClose}>
      <View style={[styles.modalContainer]}>
        <View style={[styles.modal, {backgroundColor: colors.containerColor}]}>
          <PrimaryText
            style={{
              color: colors.primaryText,
              fontSize: 17,
              marginTop: 10,
              marginBottom: 30,
              fontFamily: 'FiraCode-SemiBold',
            }}>
            Change Name
          </PrimaryText>
          <View style={{marginBottom: 10}}>
            <CustomInput
              colors={colors}
              input={name}
              setInput={setName}
              placeholder={'change user name'}
              schema={nameSchema}
            />
          </View>
          <PrimaryButton
            onPress={handleNameUpdate}
            colors={colors}
            buttonTitle={'Update'}
          />
        </View>
      </View>
    </Modal>
  );
};

export default ChangeNameModal;

const styles = StyleSheet.create({
  modalContainer: {
    width: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    flex: 1,
    justifyContent: 'flex-end',
  },
  modal: {
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    padding: 15,
  },
});
