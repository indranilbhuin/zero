import {ScrollView, Text, TouchableOpacity, View, Platform, Share} from 'react-native';
import React, {useCallback} from 'react';
import Icon from '../../components/atoms/Icons';
import {goBack} from '../../utils/navigationUtils';
import useSettings from './useSettings';
import PrimaryView from '../../components/atoms/PrimaryView';
import PrimaryText from '../../components/atoms/PrimaryText';
import RNFS from 'react-native-fs';
import {generateUniqueKey, requestStoragePermission} from '../../utils/dataUtils';
import {getTimestamp} from '../../utils/dateUtils';
import {CURRENT_EXPORT_VERSION} from '../../backend/export/format';
import {SheetManager} from 'react-native-actions-sheet';
import {Colors} from '../../hooks/useThemeColors';
import {gs, hitSlop} from '../../styles/globalStyles';

interface SettingsRowProps {
  icon: string;
  label: string;
  subtitle?: string;
  value?: string;
  valueNode?: React.ReactNode;
  onPress?: () => void;
  destructive?: boolean;
  colors: Colors;
}

const SettingsRow: React.FC<SettingsRowProps> = ({icon, label, subtitle, value, valueNode, onPress, destructive, colors}) => (
  <TouchableOpacity onPress={onPress} activeOpacity={onPress ? 0.6 : 1} disabled={!onPress}>
    <View style={[gs.rowCenter, gs.px14, gs.py12, gs.gap10]}>
      <View style={[gs.size32, gs.rounded8, gs.center, {backgroundColor: colors.secondaryAccent}]}>
        <Icon name={icon} size={16} color={destructive ? colors.accentOrange : colors.secondaryText} />
      </View>
      <View style={[gs.flex1, gs.gap2]}>
        <PrimaryText size={14} weight="medium" color={destructive ? colors.accentOrange : colors.primaryText}>
          {label}
        </PrimaryText>
        {subtitle ? (
          <PrimaryText size={11} color={colors.secondaryText}>{subtitle}</PrimaryText>
        ) : null}
      </View>
      {value ? (
        <PrimaryText size={13} color={colors.secondaryText}>{value}</PrimaryText>
      ) : null}
      {valueNode ?? null}
      {onPress ? <Icon name="chevron-right" size={14} color={colors.secondaryText} /> : null}
    </View>
  </TouchableOpacity>
);

const SettingsScreen = () => {
  const {
    appVersion,
    colors,
    handleThemeSelection,
    handleNameUpdate,
    handleCurrencyUpdate,
    selectedTheme,
    userName,
    currencySymbol,
    currencyName,
    handleReportBug,
    handleRateNow,
    handleGithub,
    handlePrivacyPolicy,
    handleTermsAndConditions,
    handleDeleteAllData,
    allData,
    handleExportResult,
    requestStorageViaDialog,
  } = useSettings();

  const handleOpenCurrencySheet = useCallback(() => {
    void SheetManager.show('currency-picker-sheet', {
      payload: {
        selectedCurrency: {code: '', name: currencyName, symbol: currencySymbol},
        onSelect: (currency: {code: string; name: string; symbol: string}) => {
          handleCurrencyUpdate(currency);
        },
      },
    });
  }, [currencyName, currencySymbol, handleCurrencyUpdate]);

  const exportData = async (dataToExport: unknown) => {
    try {
      if (!dataToExport) {
        handleExportResult(false);
        return;
      }

      const currentDateAndTime = getTimestamp();
      const fileName = `zero_v${CURRENT_EXPORT_VERSION}_${currentDateAndTime}.json`;
      const jsonData = JSON.stringify({key: generateUniqueKey(), version: CURRENT_EXPORT_VERSION, data: dataToExport}, null, 2);

      if (Platform.OS === 'ios') {
        const path = `${RNFS.DocumentDirectoryPath}/${fileName}`;

        await RNFS.writeFile(path, jsonData, 'utf8');

        await Share.share({
          url: `file://${path}`,
          title: 'Export Zero Data',
        });

        handleExportResult(true);
      } else {
        const storagePermissionGranted = await requestStoragePermission();

        if (!storagePermissionGranted) {
          requestStorageViaDialog();
          return;
        }

        const path = `${RNFS.DownloadDirectoryPath}/${fileName}`;

        await RNFS.writeFile(path, jsonData, 'utf8');
        handleExportResult(true);
      }
    } catch (error) {
      if (__DEV__) {
        console.error('Error saving file:', error);
      }
      handleExportResult(false);
    }
  };

  const openThemePicker = useCallback(() => {
    void SheetManager.show('theme-picker-sheet', {
      payload: {
        currentTheme: selectedTheme,
        onSelect: (theme: string) => {
          handleThemeSelection(theme);
        },
      },
    });
  }, [selectedTheme, handleThemeSelection]);

  return (
    <PrimaryView colors={colors} dismissKeyboardOnTouch>
      <View style={[gs.rowCenter, gs.gap10, gs.mt5p]}>
        <TouchableOpacity onPress={() => goBack()} hitSlop={hitSlop}>
          <Icon name="arrow-left" size={22} color={colors.primaryText} />
        </TouchableOpacity>
        <PrimaryText size={22} weight="semibold">Settings</PrimaryText>
      </View>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={gs.pb80}>
        <PrimaryText
          size={11}
          weight="semibold"
          color={colors.accentGreen}
          style={[gs.mt20, gs.mb6, {letterSpacing: 0.8}]}>
          PERSONALIZATION
        </PrimaryText>
        <View style={[gs.rounded12, gs.overflowHidden, {backgroundColor: colors.containerColor}]}>
          <SettingsRow
            colors={colors}
            icon="sun-moon"
            label="Theme"
            value={selectedTheme.charAt(0).toUpperCase() + selectedTheme.slice(1)}
            onPress={openThemePicker}
          />
          <View style={[gs.mx16, {height: 1, backgroundColor: colors.secondaryAccent}]} />
          <SettingsRow
            colors={colors}
            icon="user"
            label="Name"
            value={userName}
            onPress={() => {
              void SheetManager.show('change-name-sheet', {
                payload: {
                  currentName: userName,
                  onUpdate: (newName: string) => {
                    handleNameUpdate(newName);
                  },
                },
              });
            }}
          />
          <View style={[gs.mx16, {height: 1, backgroundColor: colors.secondaryAccent}]} />
          <SettingsRow
            colors={colors}
            icon="banknote"
            label="Currency"
            onPress={handleOpenCurrencySheet}
            valueNode={
              <View style={gs.itemsEnd}>
                <PrimaryText size={13} color={colors.secondaryText} variant="number">{currencySymbol}</PrimaryText>
                <PrimaryText size={10} color={colors.secondaryText}>{currencyName}</PrimaryText>
              </View>
            }
          />
        </View>

        <PrimaryText
          size={11}
          weight="semibold"
          color={colors.accentGreen}
          style={[gs.mt20, gs.mb6, {letterSpacing: 0.8}]}>
          YOUR DATA
        </PrimaryText>
        <View style={[gs.rounded12, gs.overflowHidden, {backgroundColor: colors.containerColor}]}>
          <SettingsRow
            colors={colors}
            icon="download"
            label="Export data"
            subtitle="Import on a new device later"
            onPress={() => exportData(allData)}
          />
          <View style={[gs.mx16, {height: 1, backgroundColor: colors.secondaryAccent}]} />
          <SettingsRow
            colors={colors}
            icon="trash-2"
            label="Delete all data"
            subtitle="This action cannot be undone"
            onPress={handleDeleteAllData}
            destructive
          />
        </View>

        <PrimaryText
          size={11}
          weight="semibold"
          color={colors.accentGreen}
          style={[gs.mt20, gs.mb6, {letterSpacing: 0.8}]}>
          ABOUT
        </PrimaryText>
        <View style={[gs.rounded12, gs.overflowHidden, {backgroundColor: colors.containerColor}]}>
          <SettingsRow
            colors={colors}
            icon="bug"
            label="Report a bug"
            subtitle="Found an issue? Let us know"
            onPress={handleReportBug}
          />
          <View style={[gs.mx16, {height: 1, backgroundColor: colors.secondaryAccent}]} />
          <SettingsRow
            colors={colors}
            icon="star"
            label="Rate the app"
            subtitle="Enjoying zero? Your feedback helps!"
            onPress={handleRateNow}
          />
          <View style={[gs.mx16, {height: 1, backgroundColor: colors.secondaryAccent}]} />
          <SettingsRow
            colors={colors}
            icon="code"
            label="Source code"
            subtitle="Explore on GitHub"
            onPress={handleGithub}
          />
          <View style={[gs.mx16, {height: 1, backgroundColor: colors.secondaryAccent}]} />
          <SettingsRow
            colors={colors}
            icon="shield"
            label="Privacy Policy"
            onPress={handlePrivacyPolicy}
          />
          <View style={[gs.mx16, {height: 1, backgroundColor: colors.secondaryAccent}]} />
          <SettingsRow
            colors={colors}
            icon="file-text"
            label="Terms & Conditions"
            onPress={handleTermsAndConditions}
          />
          <View style={[gs.mx16, {height: 1, backgroundColor: colors.secondaryAccent}]} />
          <SettingsRow
            colors={colors}
            icon="info"
            label="Version"
            value={`v${appVersion}`}
          />
        </View>

        <View style={[gs.mt20, gs.mb10, gs.center, gs.gap2]}>
          <PrimaryText size={11} color={colors.secondaryText}>
            Embrace the simplicity of zero
          </PrimaryText>
          <PrimaryText size={11} color={colors.secondaryText}>
            Made with <Text style={{color: colors.accentGreen}}>passion</Text> in India
          </PrimaryText>
        </View>
      </ScrollView>

    </PrimaryView>
  );
};

export default SettingsScreen;
