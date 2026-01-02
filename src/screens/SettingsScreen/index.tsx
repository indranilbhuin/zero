import {Modal, ScrollView, Text, TouchableOpacity, View, Platform, Share} from 'react-native';
import React, {useCallback} from 'react';
import Icon from '../../components/atoms/Icons';
import {goBack} from '../../utils/navigationUtils';
import useSettings from './useSettings';
import styles from './style';
import PrimaryView from '../../components/atoms/PrimaryView';
import PrimaryText from '../../components/atoms/PrimaryText';
import CustomToast from '../../components/molecules/CustomToast';
import RNFS from 'react-native-fs';
import {generateUniqueKey, requestStoragePermission} from '../../utils/dataUtils';
import {getTimestamp} from '../../utils/dateUtils';
import ChangeNameModal from '../../components/molecules/ChangeNameModal';
import {SheetManager} from 'react-native-actions-sheet';

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
      console.error('Error saving file:', error);
      setIsDownloadError(true);
    }
  };

  const renderRadioButtons = (onThemeSelect: {(theme: any): Promise<void>; (arg0: string): void}) => {
    const themes = ['light', 'dark', 'system'];
    return themes.map(theme => (
      <TouchableOpacity key={theme} onPress={() => onThemeSelect(theme)}>
        <View style={styles.radioButtonContainer}>
          <PrimaryText>{theme}</PrimaryText>
          <View style={[styles.radioButton, {borderColor: colors.primaryText}]}>
            {selectedTheme === theme && (
              <View style={[styles.radioButtonSelected, {backgroundColor: colors.primaryText}]} />
            )}
          </View>
        </View>
      </TouchableOpacity>
    ));
  };

  return (
    <PrimaryView colors={colors} dismissKeyboardOnTouch>
      <View style={styles.headerContainer}>
        <View style={styles.greetingsContainer}>
          <View style={styles.iconButtonContainer}>
            <TouchableOpacity onPress={() => goBack()}>
              <Icon name="arrow-left" size={25} color={colors.primaryText} />
            </TouchableOpacity>
          </View>
          <PrimaryText style={{fontSize: 25}}>zero</PrimaryText>
        </View>
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        <PrimaryText style={{color: colors.accentGreen, marginTop: 20}}>Appearance & Personalization</PrimaryText>
        <View style={[styles.settingsContainer, {backgroundColor: colors.containerColor}]}>
          <TouchableOpacity onPress={() => setIsThemeModalVisible(true)}>
            <View style={styles.individualSettingsContainer}>
              <PrimaryText>Choose Theme</PrimaryText>
              <PrimaryText style={{color: colors.secondaryText}}>{selectedTheme}</PrimaryText>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setIsNameModalVisible(true)}>
            <View style={styles.individualSettingsContainer}>
              <PrimaryText>Change Name</PrimaryText>
              <PrimaryText style={{color: colors.secondaryText}}>{userName}</PrimaryText>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleOpenCurrencySheet}>
            <View style={styles.individualSettingsContainer}>
              <PrimaryText style={{width: '50%'}}>Change Currency Symbol</PrimaryText>
              <View style={{alignItems: 'flex-end'}}>
                <PrimaryText style={{color: colors.secondaryText}}>{currencySymbol}</PrimaryText>
                <PrimaryText style={{color: colors.secondaryText, fontSize: 11}}>{currencyName}</PrimaryText>
              </View>
            </View>
          </TouchableOpacity>
        </View>

        <PrimaryText style={{color: colors.accentGreen, marginTop: 20}}>Manage your Data</PrimaryText>
        <View style={[styles.settingsContainer, {backgroundColor: colors.containerColor}]}>
          <TouchableOpacity onPress={() => exportData(allData)}>
            <View style={[styles.individualSettingsContainer, {flexDirection: 'column', alignItems: 'flex-start'}]}>
              <PrimaryText>Download your data</PrimaryText>
              <PrimaryText style={{fontSize: 11, color: colors.secondaryText}}>
                You can import this data in a new device
              </PrimaryText>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleDeleteAllData}>
            <View style={[styles.individualSettingsContainer, {flexDirection: 'column', alignItems: 'flex-start'}]}>
              <PrimaryText>Delete all data</PrimaryText>
              <PrimaryText style={{fontSize: 11, color: colors.secondaryText}}>
                All data associated with zero will be deleted
              </PrimaryText>
            </View>
          </TouchableOpacity>
        </View>

        <PrimaryText style={{color: colors.accentGreen, marginTop: 20}}>Help & Feedback</PrimaryText>
        <View style={[styles.settingsContainer, {backgroundColor: colors.containerColor}]}>
          <TouchableOpacity onPress={handleRateNow}>
            <View style={[styles.individualSettingsContainer, {flexDirection: 'column', alignItems: 'flex-start'}]}>
              <PrimaryText>Rate the app</PrimaryText>
              <PrimaryText style={{fontSize: 11, color: colors.secondaryText}}>
                Enjoying zero? Your feedback helps us improve!
              </PrimaryText>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleGithub}>
            <View style={[styles.individualSettingsContainer, {flexDirection: 'column', alignItems: 'flex-start'}]}>
              <PrimaryText>Github</PrimaryText>
              <PrimaryText style={{fontSize: 11, color: colors.secondaryText}}>Explore the Source Code</PrimaryText>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={handlePrivacyPolicy}>
            <View style={[styles.individualSettingsContainer, {flexDirection: 'column', alignItems: 'flex-start'}]}>
              <PrimaryText>Privacy Policy</PrimaryText>
              <PrimaryText style={{fontSize: 11, color: colors.secondaryText}}>
                Your Data, Your Device: zero Servers, zero Access.
              </PrimaryText>
            </View>
          </TouchableOpacity>
          <View style={[styles.individualSettingsContainer, {flexDirection: 'column', alignItems: 'flex-start'}]}>
            <PrimaryText>Version</PrimaryText>
            <PrimaryText style={{fontSize: 11, color: colors.secondaryText}}>v{appVersion}</PrimaryText>
          </View>
        </View>
        <PrimaryText
          style={{
            color: colors.primaryText,
            fontSize: 12,
            alignSelf: 'center',
            textAlign: 'center',
            marginTop: 15,
          }}>
          Embrace the simplicity of zero
        </PrimaryText>
        <PrimaryText
          style={{
            color: colors.primaryText,
            fontSize: 12,
            alignSelf: 'center',
            textAlign: 'center',
            marginBottom: '5%',
          }}>
          Developed with <Text style={{color: colors.accentGreen}}>passion</Text> in India.
        </PrimaryText>
      </ScrollView>

      <Modal
        animationType="fade"
        transparent={true}
        visible={isThemeModalVisible}
        onRequestClose={handleThemeModalClose}>
        <View style={[styles.modalContainer]}>
          <View style={[styles.modal, {backgroundColor: colors.containerColor}]}>
            <PrimaryText
              style={{
                color: colors.primaryText,
                fontSize: 17,
                marginTop: 10,
                marginBottom: 30,
                fontFamily: 'FiraCode-SemiBold',
              }}>
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
