import {TouchableOpacity, View} from 'react-native';
import React, {useEffect, useRef, memo, useCallback} from 'react';
import PrimaryText from './PrimaryText';
import useThemeColors from '../../hooks/useThemeColors';
import {gs} from '../../styles/globalStyles';

interface UndoModalProps {
  isVisible: boolean;
  type: string;
  onUndo: () => void;
  timeout?: number;
  onTimeout?: () => void;
}

const UndoModal: React.FC<UndoModalProps> = ({isVisible, onUndo, type, timeout = 0, onTimeout}) => {
  const colors = useThemeColors();
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (isVisible && timeout > 0) {
      timeoutRef.current = setTimeout(() => {
        onTimeout?.();
      }, timeout);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [isVisible, timeout, onTimeout]);

  const handleUndo = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    onUndo();
  }, [onUndo]);

  if (!isVisible) {
    return null;
  }

  return (
    <View
      style={[
        gs.h60,
        gs.rounded10,
        gs.rowBetweenCenter,
        gs.p10,
        gs.mb5,
        {backgroundColor: colors.secondaryBackground, width: '99.5%'},
      ]}>
      <PrimaryText size={12}>1 {type} is deleted</PrimaryText>
      <TouchableOpacity onPress={handleUndo} activeOpacity={0.7}>
        <View style={[gs.p5, gs.rounded5, gs.center, {backgroundColor: colors.accentGreen, height: '85%'}]}>
          <PrimaryText size={12} color={colors.buttonText}>
            Undo
          </PrimaryText>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default memo(UndoModal);
