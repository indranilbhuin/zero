import React, {useCallback, useMemo, ReactNode} from 'react';
import {View, TouchableOpacity, ViewStyle, StyleProp} from 'react-native';
import ActionSheet, {SheetManager} from 'react-native-actions-sheet';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import useThemeColors from '../../hooks/useThemeColors';
import PrimaryText from './PrimaryText';
import Icon from './Icons';
import {gs} from '../../styles/globalStyles';

export interface CustomBottomSheetHeader {
  title?: string;
  showCloseButton?: boolean;
  customComponent?: ReactNode;
  style?: StyleProp<ViewStyle>;
  onClosePress?: () => void;
}

export interface CustomBottomSheetProps {
  sheetId: string;
  children: ReactNode;
  header?: CustomBottomSheetHeader | null;
  showIndicator?: boolean;
  gestureEnabled?: boolean;
  closeOnTouchBackdrop?: boolean;
  overlayOpacity?: number;
  useBottomSafeAreaPadding?: boolean;
  animated?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
  indicatorStyle?: StyleProp<ViewStyle>;
  onOpen?: () => void;
  onClose?: () => void;
}

function CustomBottomSheetComponent({
  sheetId,
  children,
  header,
  showIndicator = true,
  gestureEnabled = true,
  closeOnTouchBackdrop = true,
  overlayOpacity = 0.5,
  useBottomSafeAreaPadding = true,
  animated = true,
  containerStyle,
  indicatorStyle,
  onOpen,
  onClose,
}: Readonly<CustomBottomSheetProps>) {
  const colors = useThemeColors();
  const safeAreaInsets = useSafeAreaInsets();

  const containerStyles = useMemo(() => {
    return [
      gs.roundedTop24,
      gs.pt8,
      {
        backgroundColor: colors.containerColor,
        paddingBottom: useBottomSafeAreaPadding ? 16 : 0,
      },
      containerStyle,
    ];
  }, [colors.containerColor, useBottomSafeAreaPadding, containerStyle]);

  const indicatorStyles = useMemo(() => {
    return [gs.w40, gs.h4, gs.rounded2, {backgroundColor: colors.secondaryText}, indicatorStyle];
  }, [colors.secondaryText, indicatorStyle]);

  const handleOpen = useCallback(() => {
    onOpen?.();
  }, [onOpen]);

  const handleClose = useCallback(() => {
    onClose?.();
  }, [onClose]);

  const handleClosePress = useCallback(() => {
    if (header?.onClosePress) {
      header.onClosePress();
    } else {
      SheetManager.hide(sheetId);
    }
  }, [header, sheetId]);

  const renderHeader = useMemo(() => {
    if (header === null) {
      return null;
    }

    if (header?.customComponent) {
      return (
        <>
          {showIndicator && (
            <View style={[gs.itemsCenter, gs.py8]}>
              <View style={indicatorStyles} />
            </View>
          )}
          {header.customComponent}
        </>
      );
    }

    if (header) {
      return (
        <>
          {showIndicator && (
            <View style={[gs.itemsCenter, gs.py8]}>
              <View style={indicatorStyles} />
            </View>
          )}
          <View
            style={[
              gs.px16,
              gs.py12,
              {borderBottomWidth: 1, borderBottomColor: colors.secondaryContainerColor},
              header.style,
            ]}>
            <View style={gs.rowBetweenCenter}>
              {header.title && (
                <PrimaryText size={18} weight="semibold" style={gs.flex1}>
                  {header.title}
                </PrimaryText>
              )}
              {header.showCloseButton && (
                <TouchableOpacity
                  onPress={handleClosePress}
                  style={[gs.size35, gs.center, gs.rounded16, gs.ml12, {backgroundColor: colors.secondaryAccent}]}
                  accessibilityRole="button"
                  accessibilityLabel="Close"
                  hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
                  <Icon name="x" size={18} color={colors.primaryText} />
                </TouchableOpacity>
              )}
            </View>
          </View>
        </>
      );
    }

    return undefined;
  }, [
    header,
    colors.secondaryContainerColor,
    colors.secondaryAccent,
    colors.primaryText,
    handleClosePress,
    showIndicator,
    indicatorStyles,
  ]);

  return (
    <ActionSheet
      id={sheetId}
      isModal={true}
      gestureEnabled={gestureEnabled}
      closeOnTouchBackdrop={closeOnTouchBackdrop}
      overlayColor="black"
      defaultOverlayOpacity={overlayOpacity}
      useBottomSafeAreaPadding={useBottomSafeAreaPadding}
      animated={animated}
      containerStyle={containerStyles}
      indicatorStyle={!header && showIndicator ? indicatorStyles : {width: 0, height: 0}}
      headerAlwaysVisible={!!header}
      CustomHeaderComponent={renderHeader}
      onOpen={handleOpen}
      onClose={handleClose}
      enableGesturesInScrollView={true}
      statusBarTranslucent={true}
      drawUnderStatusBar={true}
      safeAreaInsets={safeAreaInsets}
      keyboardHandlerEnabled={true}>
      {children}
    </ActionSheet>
  );
}

export const CustomBottomSheet = React.memo(CustomBottomSheetComponent);

export default CustomBottomSheet;
