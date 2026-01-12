import {Modal, ScrollView, Text, TouchableOpacity, View, Platform, Share} from 'react-native';
import React, {useCallback} from 'react';
import Icon from '../../components/atoms/Icons';
import {goBack} from '../../utils/navigationUtils';
import useSettings from './useSettings';
import PrimaryView from '../../components/atoms/PrimaryView';
import PrimaryText from '../../components/atoms/PrimaryText';
import CustomToast from '../../components/molecules/CustomToast';
import RNFS from 'react-native-fs';
import {generateUniqueKey, requestStoragePermission} from '../../utils/dataUtils';
import {getTimestamp} from '../../utils/dateUtils';
import ChangeNameModal from '../../components/molecules/ChangeNameModal';
import {SheetManager} from 'react-native-actions-sheet';
import {gs} from '../../styles/globalStyles';

const SettingsScreen = () => {
  const {
    isThemeModalVisible,
    setIsThemeModalVisible,
    isNameModalVisible,
    setIsNameModalVisible,
    name,
    setName,
    appVersion,
    colors,
    handleThemeModalClose,
    handleNameModalClose,
    handleThemeSelection,
    handleNameUpdate,
    handleCurrencyUpdate,
    selectedTheme,
    userName,
    currencySymbol,
    currencyName,
    handleRateNow,
    handleGithub,
    handlePrivacyPolicy,
    handleDeleteAllData,
    isDeleteModalVisible,
    handleDeleteAllDataOk,
    handleDeleteAllDataCancel,
    allData,
    isStorageModalVisible,
    handleAccessStorageOk,
    handleAccessStorageCancel,
    setIsStorageModalVisible,
    isDownloadSuccessful,
    setIsDownloadSuccessful,
    isDownloadError,
    setIsDownloadError,
    handleDownloadSuccessful,
    handleDownloadError,
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
        setIsDownloadError(true);
        return;
      }

      const currentDateAndTime = getTimestamp();
      const fileName = `zero${currentDateAndTime}.json`;
      const jsonData = JSON.stringify({key: generateUniqueKey(), data: dataToExport}, null, 2);

      if (Platform.OS === 'ios') {
        const path = `${RNFS.DocumentDirectoryPath}/${fileName}`;

        await RNFS.writeFile(path, jsonData, 'utf8');

        await Share.share({
          url: `file://${path}`,
          title: 'Export Zero Data',
        });

        setIsDownloadSuccessful(true);
      } else {
        const storagePermissionGranted = await requestStoragePermission();

        if (!storagePermissionGranted) {
          setIsStorageModalVisible(true);
          return;
        }

        const path = `${RNFS.DownloadDirectoryPath}/${fileName}`;

        await RNFS.writeFile(path, jsonData, 'utf8');
        setIsDownloadSuccessful(true);
      }
    } catch (error) {
      if (__DEV__) {
        console.error('Error saving file:', error);
      }
      setIsDownloadError(true);
    }
  };

  const renderRadioButtons = (onThemeSelect: {(theme: any): Promise<void>; (arg0: string): void}) => {
    const themes = ['light', 'dark', 'system'];
    return themes.map(theme => (
      <TouchableOpacity key={theme} onPress={() => onThemeSelect(theme)}>
        <View style={[gs.rowBetweenCenter, gs.mb20]}>
          <PrimaryText>{theme}</PrimaryText>
          <View style={[gs.size20, gs.rounded10, gs.border2, gs.center, {borderColor: colors.primaryText}]}>
            {selectedTheme === theme && <View style={[gs.size10, gs.rounded5, {backgroundColor: colors.primaryText}]} />}
          </View>
        </View>
      </TouchableOpacity>
    ));
  };

  return (
    <PrimaryView colors={colors} dismissKeyboardOnTouch>
      <View style={[gs.rowBetweenCenter, gs.mt5p]}>
        <View style={gs.rowCenter}>
          <View style={gs.mr10}>
            <TouchableOpacity onPress={() => goBack()}>
              <Icon name="arrow-left" size={25} color={colors.primaryText} />
            </TouchableOpacity>
          </View>
          <PrimaryText size={25}>zero</PrimaryText>
        </View>
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        <PrimaryText color={colors.accentGreen} style={gs.mt20}>Appearance & Personalization</PrimaryText>
        <View style={[gs.mt10, gs.rounded12, gs.overflowHidden, {backgroundColor: colors.containerColor}]}>
          <TouchableOpacity onPress={() => setIsThemeModalVisible(true)}>
            <View style={[gs.rowBetweenCenter, gs.minH60, gs.px14, gs.py12]}>
              <PrimaryText>Choose Theme</PrimaryText>
              <PrimaryText color={colors.secondaryText}>{selectedTheme}</PrimaryText>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setIsNameModalVisible(true)}>
            <View style={[gs.rowBetweenCenter, gs.minH60, gs.px14, gs.py12]}>
              <PrimaryText>Change Name</PrimaryText>
              <PrimaryText color={colors.secondaryText}>{userName}</PrimaryText>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleOpenCurrencySheet}>
            <View style={[gs.rowBetweenCenter, gs.minH60, gs.px14, gs.py12]}>
              <PrimaryText style={gs.w50p}>Change Currency Symbol</PrimaryText>
              <View style={gs.itemsEnd}>
                <PrimaryText color={colors.secondaryText}>{currencySymbol}</PrimaryText>
                <PrimaryText size={11} color={colors.secondaryText}>{currencyName}</PrimaryText>
              </View>
            </View>
          </TouchableOpacity>
        </View>

        <PrimaryText color={colors.accentGreen} style={gs.mt20}>Manage your Data</PrimaryText>
        <View style={[gs.mt10, gs.rounded12, gs.overflowHidden, {backgroundColor: colors.containerColor}]}>
          <TouchableOpacity onPress={() => exportData(allData)}>
            <View style={[gs.minH60, gs.px14, gs.py12, gs.col, gs.itemsStart]}>
              <PrimaryText>Download your data</PrimaryText>
              <PrimaryText size={11} color={colors.secondaryText}>
                You can import this data in a new device
              </PrimaryText>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleDeleteAllData}>
            <View style={[gs.minH60, gs.px14, gs.py12, gs.col, gs.itemsStart]}>
              <PrimaryText>Delete all data</PrimaryText>
              <PrimaryText size={11} color={colors.secondaryText}>
                All data associated with zero will be deleted
              </PrimaryText>
            </View>
          </TouchableOpacity>
        </View>

        <PrimaryText color={colors.accentGreen} style={gs.mt20}>Help & Feedback</PrimaryText>
        <View style={[gs.mt10, gs.rounded12, gs.overflowHidden, {backgroundColor: colors.containerColor}]}>
          <TouchableOpacity onPress={handleRateNow}>
            <View style={[gs.minH60, gs.px14, gs.py12, gs.col, gs.itemsStart]}>
              <PrimaryText>Rate the app</PrimaryText>
              <PrimaryText size={11} color={colors.secondaryText}>
                Enjoying zero? Your feedback helps us improve!
              </PrimaryText>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleGithub}>
            <View style={[gs.minH60, gs.px14, gs.py12, gs.col, gs.itemsStart]}>
              <PrimaryText>Github</PrimaryText>
              <PrimaryText size={11} color={colors.secondaryText}>Explore the Source Code</PrimaryText>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={handlePrivacyPolicy}>
            <View style={[gs.minH60, gs.px14, gs.py12, gs.col, gs.itemsStart]}>
              <PrimaryText>Privacy Policy</PrimaryText>
              <PrimaryText size={11} color={colors.secondaryText}>
                Your Data, Your Device: zero Servers, zero Access.
              </PrimaryText>
            </View>
          </TouchableOpacity>
          <View style={[gs.minH60, gs.px14, gs.py12, gs.col, gs.itemsStart]}>
            <PrimaryText>Version</PrimaryText>
            <PrimaryText size={11} color={colors.secondaryText}>v{appVersion}</PrimaryText>
          </View>
        </View>
        <PrimaryText size={12} style={[gs.selfCenter, gs.textCenter, gs.mt15]}>
          Embrace the simplicity of zero
        </PrimaryText>
        <PrimaryText size={12} style={[gs.selfCenter, gs.textCenter, gs.mb5p]}>
          Developed with <Text style={{color: colors.accentGreen}}>passion</Text> in India.
        </PrimaryText>
      </ScrollView>

      <Modal animationType="fade" transparent={true} visible={isThemeModalVisible} onRequestClose={handleThemeModalClose}>
        <View style={[gs.wFull, gs.flex1, gs.justifyEnd, {backgroundColor: 'rgba(0, 0, 0, 0.5)'}]}>
          <View style={[gs.roundedTop15, gs.p15, {backgroundColor: colors.containerColor}]}>
            <PrimaryText size={17} weight="semibold" style={[gs.mt10, gs.mb30]}>
              Select Theme
            </PrimaryText>
            {renderRadioButtons(handleThemeSelection)}
          </View>
        </View>
      </Modal>

      <ChangeNameModal
        colors={colors}
        isNameModalVisible={isNameModalVisible}
        handleNameModalClose={handleNameModalClose}
        name={name}
        setName={setName}
        handleNameUpdate={handleNameUpdate}
      />

      <CustomToast
        visible={isDeleteModalVisible}
        message={'Are you sure you want to delete all your data'}
        type="warning"
        onOk={handleDeleteAllDataOk}
        onCancel={handleDeleteAllDataCancel}
      />

      <CustomToast
        visible={isStorageModalVisible}
        message={'You need to manually give permission for the storage to download your data'}
        type="warning"
        onOk={handleAccessStorageOk}
        onCancel={handleAccessStorageCancel}
      />
      <CustomToast
        visible={isDownloadSuccessful}
        message={'You data is successfuly exported in Downloads folder'}
        type="success"
        onOk={handleDownloadSuccessful}
      />
      <CustomToast
        visible={isDownloadError}
        message={'There is an error in exporting your data'}
        type="warning"
        onOk={handleDownloadError}
      />
    </PrimaryView>
  );
};

export default SettingsScreen;
