import React, {useState, useEffect, useCallback, memo} from 'react';
import {Image, Modal, TouchableOpacity, View} from 'react-native';
import useThemeColors from '../../hooks/useThemeColors';
import PrimaryText from '../atoms/PrimaryText';
import {gs, hitSlop} from '../../styles/globalStyles';

interface CustomToastProps {
  visible: boolean;
  type?: string;
  message: string;
  timeout?: number;
  onOk?: () => void;
  onCancel?: () => void;
}

const CustomToast: React.FC<CustomToastProps> = ({visible, type, message, timeout, onOk, onCancel}) => {
  const [toastVisible, setToastVisible] = useState(visible);
  const colors = useThemeColors();

  useEffect(() => {
    let toastTimeout: ReturnType<typeof setTimeout> | undefined;

    if (visible) {
      setToastVisible(true);

      if (timeout) {
        toastTimeout = setTimeout(() => {
          setToastVisible(false);
        }, timeout);
      }
    } else {
      setToastVisible(false);
    }

    return () => {
      if (toastTimeout) clearTimeout(toastTimeout);
    };
  }, [visible, timeout]);

  const handleOkButton = useCallback(() => {
    setToastVisible(false);
    onOk?.();
  }, [onOk]);

  const handleCancelButton = useCallback(() => {
    setToastVisible(false);
    onCancel?.();
  }, [onCancel]);

  if (!toastVisible) {
    return null;
  }
  let toastColor = '';
  let toastImage = null;

  switch (type) {
    case 'success':
      toastColor = colors.accentGreen;
      toastImage = require('../../../assets/images/approve.png');
      break;
    case 'error':
      toastColor = colors.accentRed;
      toastImage = require('../../../assets/images/reject.png');
      break;
    case 'warning':
      toastColor = colors.accentOrange;
      toastImage = require('../../../assets/images/warning.png');
      break;
    default:
      toastColor = colors.accentBlue;
      break;
  }

  return (
    <Modal visible={toastVisible} animationType="fade" transparent>
      <View style={[gs.flex1, gs.center, {backgroundColor: 'rgba(0, 0, 0, 0.3)'}]}>
        <View style={[gs.wFull, gs.itemsCenter]}>
          <View style={[gs.roundedTop24, {backgroundColor: toastColor, height: 10, width: '80%'}]} />
          <View
            style={[
              gs.h170,
              gs.center,
              gs.pt5,
              {
                backgroundColor: colors.secondaryAccent,
                width: '80%',
                borderBottomLeftRadius: 8,
                borderBottomRightRadius: 8,
              },
            ]}>
            {toastImage && <Image source={toastImage} style={[gs.size35, gs.mb10]} />}
            <PrimaryText size={13} color={colors.primaryText} style={[gs.mx20, gs.textCenter]}>
              {message}
            </PrimaryText>
            {(onOk || onCancel) && (
              <View
                style={[
                  gs.itemsCenter,
                  gs.w50p,
                  gs.mt10,
                  gs.row,
                  gs.mb10,
                  {justifyContent: onOk && onCancel ? 'space-between' : 'center'},
                ]}>
                {onOk && (
                  <TouchableOpacity
                    onPress={handleOkButton}
                    hitSlop={hitSlop}
                    accessibilityLabel="Confirm"
                    accessibilityRole="button">
                    <View style={[gs.w60, gs.h35, gs.rounded5, gs.center, {backgroundColor: colors.accentGreen}]}>
                      <PrimaryText color={colors.buttonText}>Ok</PrimaryText>
                    </View>
                  </TouchableOpacity>
                )}
                {onCancel && (
                  <TouchableOpacity
                    onPress={handleCancelButton}
                    hitSlop={hitSlop}
                    accessibilityLabel="Cancel"
                    accessibilityRole="button">
                    <View style={[gs.w60, gs.h35, gs.rounded5, gs.center, {backgroundColor: colors.accentRed}]}>
                      <PrimaryText>Cancel</PrimaryText>
                    </View>
                  </TouchableOpacity>
                )}
              </View>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default memo(CustomToast);
