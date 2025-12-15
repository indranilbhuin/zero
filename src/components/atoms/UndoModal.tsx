import {StyleSheet, TouchableOpacity, View} from 'react-native';
import React from 'react';
import PrimaryText from './PrimaryText';
import useThemeColors from '../../hooks/useThemeColors';

interface UndoModalProps {
  isVisible: boolean;
  type: string;
  onUndo: () => void;
}

const UndoModal: React.FC<UndoModalProps> = ({isVisible, onUndo, type}) => {
  const colors = useThemeColors();
  return (
    <>
      {isVisible && (
        <View
          style={[
            styles.contentContainer,
            {backgroundColor: colors.secondaryBackground},
          ]}>
          <PrimaryText style={{fontSize: 12}}>1 {type} is deleted</PrimaryText>
          <TouchableOpacity onPress={onUndo}>
            <View
              style={{
                backgroundColor: colors.accentGreen,
                padding: 5,
                height: '85%',
                borderRadius: 5,
                alignItems: 'center',
                justifyContent: 'center'
              }}>
              <PrimaryText style={{fontSize: 12, color: colors.buttonText}}>
                Undo
              </PrimaryText>
            </View>
          </TouchableOpacity>
        </View>
      )}
    </>
  );
};

export default UndoModal;

const styles = StyleSheet.create({
  contentContainer: {
    height: 60,
    width: '99.5%',
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    alignItems: 'center',
    marginBottom: 5,
  },
});
