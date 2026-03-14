import {View} from 'react-native';
import React, {useCallback, useState} from 'react';
import {SheetManager, SheetProps} from 'react-native-actions-sheet';
import useThemeColors from '../hooks/useThemeColors';
import {CustomBottomSheet} from '../components/atoms/CustomBottomSheet';
import PrimaryButton from '../components/atoms/PrimaryButton';
import CustomInput from '../components/atoms/CustomInput';
import {nameSchema} from '../utils/validationSchema';
import {gs} from '../styles/globalStyles';

const ChangeNameSheet: React.FC<SheetProps<'change-name-sheet'>> = React.memo(props => {
  const colors = useThemeColors();
  const [name, setName] = useState(props.payload?.currentName ?? '');

  const handleConfirm = useCallback(() => {
    if (nameSchema.safeParse(name).success) {
      props.payload?.onUpdate?.(name);
    }
    void SheetManager.hide(props.sheetId);
  }, [props, name]);

  return (
    <CustomBottomSheet
      sheetId={props.sheetId}
      header={{
        title: 'Change Name',
        showCloseButton: true,
        onClosePress: () => void SheetManager.hide(props.sheetId),
      }}
      gestureEnabled>
      <View style={[gs.px20, gs.pb10, gs.pt5]}>
        <View style={gs.mb15}>
          <CustomInput
            colors={colors}
            input={name}
            setInput={setName}
            placeholder={'Enter your name'}
            schema={nameSchema}
          />
        </View>
        <PrimaryButton
          onPress={handleConfirm}
          colors={colors}
          buttonTitle="Update"
          disabled={!nameSchema.safeParse(name).success}
        />
      </View>
    </CustomBottomSheet>
  );
});

export default ChangeNameSheet;
