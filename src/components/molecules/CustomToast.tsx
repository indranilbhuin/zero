import React, {useState, useEffect} from 'react';
import {Image, Modal, StyleSheet, TouchableOpacity, View} from 'react-native';
import useThemeColors from '../../hooks/useThemeColors';
import PrimaryText from '../atoms/PrimaryText';

interface CustomToastProps {
  visible: boolean;
  type?: string;
  message: string;
  timeout?: number;
  onOk?: () => void;
  onCancel?: () => void;
}

const CustomToast: React.FC<CustomToastProps> = ({
  visible,
  type,
  message,
  timeout,
  onOk,
  onCancel,
}) => {
  const [toastVisible, setToastVisible] = useState(visible);
  const colors = useThemeColors();

  useEffect(() => {
    let toastTimeout: number;

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
      clearTimeout(toastTimeout);
    };
  }, [visible, timeout]);

  const handleOkButton = () => {
    setToastVisible(false);
    if (onOk) {
      onOk();
    }
  };

  const handleCancelButton = () => {
    setToastVisible(false);
    if (onCancel) {
      onCancel();
    }
  };

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
      <View style={styles.modalContainer}>
        <View style={styles.innerContainer}>
          <View
            style={[styles.topBarContainer, {backgroundColor: toastColor}]}
          />
          <View
            style={[
              styles.innerToastContainer,
              {backgroundColor: colors.secondaryAccent},
            ]}>
            {toastImage && (
              <Image source={toastImage} style={styles.toastImage} />
            )}
            <PrimaryText
              style={{
                color: colors.primaryText,
                fontSize: 13,
                marginLeft: 20,
                marginRight: 20,
                textAlign: 'center',
              }}>
              {message}
            </PrimaryText>
            {(onOk || onCancel) && (
              <View
                style={[
                  styles.buttonContainer,
                  {
                    justifyContent:
                      onOk && onCancel ? 'space-between' : 'center',
                  },
                ]}>
                {onOk && (
                  <TouchableOpacity onPress={handleOkButton}>
                    <View
                      style={[
                        styles.okButton,
                        {backgroundColor: colors.accentGreen},
                      ]}>
                      <PrimaryText style={{color: colors.buttonText}}>
                        Ok
                      </PrimaryText>
                    </View>
                  </TouchableOpacity>
                )}
                {onCancel && (
                  <TouchableOpacity onPress={handleCancelButton}>
                    <View
                      style={[
                        styles.cancelButton,
                        {backgroundColor: colors.accentRed},
                      ]}>
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

export default CustomToast;

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  buttonContainer: {
    alignItems: 'center',
    width: '50%',
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  okButton: {
    width: 60,
    height: 35,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    width: 60,
    height: 35,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  innerContainer: {
    width: '100%',
    alignItems: 'center',
  },
  innerToastContainer: {
    height: 170,
    width: '80%',
    alignItems: 'center',
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    paddingTop: 5,
    justifyContent: 'center',
  },
  topBarContainer: {
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    height: 10,
    width: '80%',
  },
  toastImage: {
    width: 35,
    height: 35,
    marginBottom: 10,
  },
});
