import React, {createContext, useContext, useState, useCallback, useRef, useMemo, type ReactNode} from 'react';
import {Modal, TouchableOpacity, View} from 'react-native';
import PrimaryText from '../components/atoms/PrimaryText';
import Icon from '../components/atoms/Icons';
import {useThemeColors} from './ThemeContext';
import {gs} from '../styles/globalStyles';

type DialogType = 'success' | 'warning' | 'error' | 'info';

interface DialogConfig {
  type?: DialogType;
  message: string;
  okLabel?: string;
  cancelLabel?: string;
}

interface DialogContextType {
  showDialog: (config: DialogConfig) => Promise<boolean>;
  showAlert: (config: Omit<DialogConfig, 'cancelLabel'>) => Promise<void>;
}

const DialogContext = createContext<DialogContextType | undefined>(undefined);

interface InternalDialog extends DialogConfig {
  resolve: (value: boolean) => void;
  showCancel: boolean;
}

const TYPE_ICON: Record<DialogType, string> = {
  success: 'badge-check',
  warning: 'shield-alert',
  error: 'alert-circle',
  info: 'badge-info',
};

interface DialogProviderProps {
  children: ReactNode;
}

export const DialogProvider: React.FC<DialogProviderProps> = ({children}) => {
  const colors = useThemeColors();
  const [visible, setVisible] = useState(false);
  const [display, setDisplay] = useState<InternalDialog | null>(null);
  const activeRef = useRef<InternalDialog | null>(null);
  const queueRef = useRef<InternalDialog[]>([]);

  const present = useCallback((dialog: InternalDialog) => {
    activeRef.current = dialog;
    setDisplay(dialog);
    setVisible(true);
  }, []);

  const showNext = useCallback(() => {
    if (queueRef.current.length > 0) {
      const next = queueRef.current.shift();
      if (next) {
        present(next);
        return;
      }
    }
    activeRef.current = null;
  }, [present]);

  const dismiss = useCallback(
    (result: boolean) => {
      activeRef.current?.resolve(result);
      activeRef.current = null;
      setVisible(false);
      setTimeout(showNext, 350);
    },
    [showNext],
  );

  const enqueue = useCallback(
    (dialog: InternalDialog) => {
      if (activeRef.current) {
        queueRef.current.push(dialog);
      } else {
        present(dialog);
      }
    },
    [present],
  );

  const showDialog = useCallback(
    (config: DialogConfig): Promise<boolean> => {
      return new Promise(resolve => {
        enqueue({...config, resolve, showCancel: true});
      });
    },
    [enqueue],
  );

  const showAlert = useCallback(
    (config: Omit<DialogConfig, 'cancelLabel'>): Promise<void> => {
      return new Promise(resolve => {
        enqueue({
          ...config,
          resolve: () => resolve(),
          showCancel: false,
        });
      });
    },
    [enqueue],
  );

  const contextValue = useMemo(() => ({showDialog, showAlert}), [showDialog, showAlert]);

  const dialogType = display?.type ?? 'info';

  const accentColor = useMemo(() => {
    switch (dialogType) {
      case 'success':
        return colors.accentGreen;
      case 'warning':
        return colors.accentOrange;
      case 'error':
        return colors.accentRed;
      default:
        return colors.accentBlue;
    }
  }, [dialogType, colors]);

  return (
    <DialogContext.Provider value={contextValue}>
      {children}
      <Modal visible={visible} animationType="fade" transparent statusBarTranslucent>
        <View style={[gs.flex1, gs.center, {backgroundColor: 'rgba(0, 0, 0, 0.3)'}]}>
          <View style={[gs.wFull, gs.itemsCenter]}>
            <View style={[gs.roundedTop24, {backgroundColor: accentColor, height: 10, width: '80%'}]} />
            <View
              style={[
                gs.center,
                gs.py20,
                gs.px20,
                {
                  backgroundColor: colors.secondaryAccent,
                  width: '80%',
                  borderBottomLeftRadius: 8,
                  borderBottomRightRadius: 8,
                },
              ]}>
              <View style={[gs.size40, gs.roundedFull, gs.center, gs.mb10, {backgroundColor: accentColor + '20'}]}>
                <Icon name={TYPE_ICON[dialogType]} size={22} color={accentColor} />
              </View>
              <PrimaryText size={13} color={colors.primaryText} style={gs.textCenter}>
                {display?.message}
              </PrimaryText>
              <View
                style={[
                  gs.rowCenter,
                  gs.mt15,
                  gs.gap12,
                  {justifyContent: display?.showCancel ? 'space-between' : 'center'},
                ]}>
                {display?.showCancel && (
                  <TouchableOpacity
                    onPress={() => dismiss(false)}
                    activeOpacity={0.7}
                    accessibilityLabel={display.cancelLabel ?? 'Cancel'}
                    accessibilityRole="button">
                    <View style={[gs.w60, gs.h35, gs.rounded5, gs.center, {backgroundColor: colors.accentRed}]}>
                      <PrimaryText size={13} weight="semibold" color={colors.sameWhite}>
                        {display.cancelLabel ?? 'Cancel'}
                      </PrimaryText>
                    </View>
                  </TouchableOpacity>
                )}
                <TouchableOpacity
                  onPress={() => dismiss(true)}
                  activeOpacity={0.7}
                  accessibilityLabel={display?.okLabel ?? 'Ok'}
                  accessibilityRole="button">
                  <View style={[gs.w60, gs.h35, gs.rounded5, gs.center, {backgroundColor: colors.accentGreen}]}>
                    <PrimaryText size={13} weight="semibold" color={colors.buttonText}>
                      {display?.okLabel ?? 'Ok'}
                    </PrimaryText>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </DialogContext.Provider>
  );
};

export const useDialog = (): DialogContextType => {
  const context = useContext(DialogContext);
  if (context === undefined) {
    throw new Error('useDialog must be used within a DialogProvider');
  }
  return context;
};

export default DialogContext;
