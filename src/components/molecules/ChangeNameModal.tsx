import {Modal, View} from 'react-native';
import React, {memo} from 'react';
import PrimaryText from '../atoms/PrimaryText';
import CustomInput from '../atoms/CustomInput';
import PrimaryButton from '../atoms/PrimaryButton';
import {nameSchema} from '../../utils/validationSchema';
import {Colors} from '../../hooks/useThemeColors';
import {gs} from '../../styles/globalStyles';

interface ChangeNameModalProps {
  colors: Colors;
  isNameModalVisible: boolean;
  handleNameModalClose: () => void;
  name: string;
  setName: (name: string) => void;
  handleNameUpdate: () => void;
}

const ChangeNameModal: React.FC<ChangeNameModalProps> = ({
  colors,
  isNameModalVisible,
  handleNameModalClose,
  name,
  setName,
  handleNameUpdate,
}) => {
  return (
    <Modal animationType="fade" transparent={true} visible={isNameModalVisible} onRequestClose={handleNameModalClose}>
      <View style={[gs.wFull, gs.flex1, gs.justifyEnd, {backgroundColor: 'rgba(0, 0, 0, 0.5)'}]}>
        <View style={[gs.roundedTop15, gs.p15, {backgroundColor: colors.containerColor}]}>
          <PrimaryText size={17} weight="semibold" color={colors.primaryText} style={[gs.mt10, gs.mb30]}>
            Change Name
          </PrimaryText>
          <View style={gs.mb10}>
            <CustomInput
              colors={colors}
              input={name}
              setInput={setName}
              placeholder={'change user name'}
              schema={nameSchema}
            />
          </View>
          <PrimaryButton onPress={handleNameUpdate} colors={colors} buttonTitle={'Update'} />
        </View>
      </View>
    </Modal>
  );
};

export default memo(ChangeNameModal);
