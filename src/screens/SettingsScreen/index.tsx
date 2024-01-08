import {
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  TouchableWithoutFeedback,
} from 'react-native';
import React from 'react';
import PrimaryButton from '../../components/atoms/PrimaryButton';
import Icon from '../../components/atoms/Icons';
import {goBack} from '../../utils/navigationUtils';
import useSettings from './useSettings';
import styles from './style';
import PrimaryView from '../../components/atoms/PrimaryView';
import PrimaryText from '../../components/atoms/PrimaryText';
import textInputStyles from '../../styles/textInput';
import CurrencySymbolPicker from '../../components/molecules/CurrencySymbolPicker';
import CustomToast from '../../components/molecules/CustomToast';
import RNFS from 'react-native-fs';
import {
  generateUniqueKey,
  requestStoragePermission,
} from '../../utils/dataUtils';
import moment from 'moment';
import ChangeNameModal from '../../components/molecules/ChangeNameModal';

const SettingsScreen = () => {
  const {
    isThemeModalVisible,
    setIsThemeModalVisible,
    isNameModalVisible,
    setIsNameModalVisible,
    name,
    setName,
    searchText,
    isCurrencyModalVisible,
    setIsCurrencyModalVisible,
    filteredCurrencies,
    appVersion,
    colors,
    handleThemeModalClose,
    handleNameModalClose,
    handleCurrencyModalClose,
    handleCurrencySelect,
    handleThemeSelection,
    handleNameUpdate,
    handleSearch,
    handleCurrencyUpdate,
    selectedCurrency,
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

  const exportRealmData = async allData => {
    try {
      console.log(allData);

      const storagePermissionGranted = await requestStoragePermission();

      if (!storagePermissionGranted) {
        console.log('Storage permission denied.');
        setIsStorageModalVisible(true);
        return;
      }

      const currentDateAndTime = moment().format('YYYYMMDDHHmmss');
      const jsonData = JSON.stringify(
        {key: generateUniqueKey(), data: allData},
        null,
        2,
      );
      console.log(jsonData);
      const path = `${RNFS.DownloadDirectoryPath}/zero${currentDateAndTime}.json`;

      RNFS.writeFile(path, jsonData, 'utf8')
        .then(success => {
          setIsDownloadSuccessful(true);
          console.log('File written successfully!');
          console.log('File path:', path);
        })
        .catch(error => {
          setIsDownloadError(true);
        });

      console.log('File saved successfully at: ', path);
    } catch (error) {
      console.error('Error saving file:', error);
    }
  };

  const renderRadioButtons = (onThemeSelect: {
    (theme: any): Promise<void>;
    (arg0: string): void;
  }) => {
    const themes = ['light', 'dark', 'system'];
    return themes.map(theme => (
      <TouchableOpacity key={theme} onPress={() => onThemeSelect(theme)}>
        <View style={styles.radioButtonContainer}>
          <PrimaryText>{theme}</PrimaryText>
          <View style={[styles.radioButton, {borderColor: colors.primaryText}]}>
            {selectedTheme === theme && (
              <View
                style={[
                  styles.radioButtonSelected,
                  {backgroundColor: colors.primaryText},
                ]}
              />
            )}
          </View>
        </View>
      </TouchableOpacity>
    ));
  };

  return (
    <PrimaryView colors={colors}>
      <View style={styles.headerContainer}>
        <View style={styles.greetingsContainer}>
          <View style={styles.iconButtonContainer}>
            <TouchableOpacity onPress={() => goBack()}>
              <Icon
                name="caret-back-circle"
                size={25}
                color={colors.primaryText}
                type={'IonIcons'}
              />
            </TouchableOpacity>
          </View>
          <PrimaryText style={{fontSize: 25}}>zero</PrimaryText>
        </View>
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        <PrimaryText style={{color: colors.accentGreen, marginTop: 15}}>
          Appearance & Personalization
        </PrimaryText>
        <View
          style={[
            styles.settingsContainer,
            {
              backgroundColor: colors.containerColor,
              borderColor: colors.secondaryText,
            },
          ]}>
          <TouchableOpacity onPress={() => setIsThemeModalVisible(true)}>
            <View
              style={[
                styles.individualSettingsContainer,
                {
                  borderColor: colors.secondaryText,
                },
              ]}>
              <PrimaryText>Choose Theme</PrimaryText>
              <PrimaryText>{selectedTheme}</PrimaryText>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setIsNameModalVisible(true)}>
            <View
              style={[
                styles.individualSettingsContainer,
                {
                  backgroundColor: colors.containerColor,
                  borderColor: colors.secondaryText,
                },
              ]}>
              <PrimaryText>Change Name</PrimaryText>
              <PrimaryText>{userName}</PrimaryText>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setIsCurrencyModalVisible(true)}>
            <View
              style={[
                styles.individualSettingsContainer,
                {
                  backgroundColor: colors.containerColor,
                  borderBottomWidth: 0,
                  borderBottomLeftRadius: 8,
                  borderBottomRightRadius: 8,
                },
              ]}>
              <PrimaryText style={{width: '50%'}}>
                Change Currency Symbol
              </PrimaryText>
              <View style={{alignItems: 'flex-end'}}>
                <PrimaryText>{currencySymbol}</PrimaryText>
                <PrimaryText>{currencyName}</PrimaryText>
              </View>
            </View>
          </TouchableOpacity>
        </View>

        <PrimaryText style={{color: colors.accentGreen, marginTop: 15}}>
          Manage your Data
        </PrimaryText>
        <View
          style={[
            styles.settingsContainer,
            {
              backgroundColor: colors.containerColor,
              borderColor: colors.secondaryText,
            },
          ]}>
          <TouchableOpacity onPress={() => exportRealmData(allData)}>
            <View
              style={[
                styles.individualSettingsContainer,
                {
                  borderColor: colors.secondaryText,
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'flex-start',
                },
              ]}>
              <PrimaryText>Download your data</PrimaryText>
              <PrimaryText style={{fontSize: 11}}>
                You can import this data in a new device
              </PrimaryText>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleDeleteAllData}>
            <View
              style={[
                styles.individualSettingsContainer,
                {
                  borderColor: colors.secondaryText,
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'flex-start',
                  borderBottomWidth: 0,
                },
              ]}>
              <PrimaryText>Delete all data</PrimaryText>
              <PrimaryText style={{fontSize: 11}}>
                All data associated with zero will be deleted
              </PrimaryText>
            </View>
          </TouchableOpacity>
        </View>

        <PrimaryText style={{color: colors.accentGreen, marginTop: 15}}>
          Help & Feedback
        </PrimaryText>
        <View
          style={[
            styles.settingsContainer,
            {
              backgroundColor: colors.containerColor,
              borderColor: colors.secondaryText,
            },
          ]}>
          <TouchableOpacity onPress={handleRateNow}>
            <View
              style={[
                styles.individualSettingsContainer,
                {
                  borderColor: colors.secondaryText,
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'flex-start',
                },
              ]}>
              <PrimaryText>Rate the app</PrimaryText>
              <PrimaryText style={{fontSize: 11}}>
                Enjoying Expense Tracker? Your feedback helps us improve!
              </PrimaryText>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleGithub}>
            <View
              style={[
                styles.individualSettingsContainer,
                {
                  borderColor: colors.secondaryText,
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'flex-start',
                },
              ]}>
              <PrimaryText>Github</PrimaryText>
              <PrimaryText style={{fontSize: 11}}>
                Explore the Source Code
              </PrimaryText>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={handlePrivacyPolicy}>
            <View
              style={[
                styles.individualSettingsContainer,
                {
                  borderColor: colors.secondaryText,
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'flex-start',
                },
              ]}>
              <PrimaryText>Privacy Policy</PrimaryText>
              <PrimaryText style={{fontSize: 11}}>
                Your Data, Your Device: zero Servers, zero Access.
              </PrimaryText>
            </View>
          </TouchableOpacity>
          <TouchableWithoutFeedback>
            <View
              style={[
                styles.individualSettingsContainer,
                {
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'flex-start',
                  borderBottomWidth: 0,
                  borderBottomLeftRadius: 8,
                  borderBottomRightRadius: 8,
                },
              ]}>
              <PrimaryText>Version</PrimaryText>
              <PrimaryText style={{fontSize: 11}}>v{appVersion}</PrimaryText>
            </View>
          </TouchableWithoutFeedback>
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
          Developed with{' '}
          <Text style={{color: colors.accentGreen}}>passion</Text> in India.
        </PrimaryText>
      </ScrollView>

      <Modal
        animationType="fade"
        transparent={true}
        visible={isThemeModalVisible}
        onRequestClose={handleThemeModalClose}>
        <View style={[styles.modalContainer]}>
          <View
            style={[styles.modal, {backgroundColor: colors.containerColor}]}>
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

      <Modal
        animationType="fade"
        transparent={true}
        visible={isCurrencyModalVisible}
        onRequestClose={handleCurrencyModalClose}>
        <View style={[styles.modalContainer]}>
          <View
            style={[styles.modal, {backgroundColor: colors.containerColor}]}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <PrimaryText
                style={{
                  color: colors.primaryText,
                  fontSize: 17,
                  marginTop: 10,
                  marginBottom: 30,
                  fontFamily: 'FiraCode-SemiBold',
                }}>
                Select Currency Symbol
              </PrimaryText>

              <View
                style={[
                  textInputStyles.textInputContainer,
                  {
                    borderColor: colors.secondaryContainerColor,
                    backgroundColor: colors.secondaryAccent,
                  },
                ]}>
                <Icon
                  name="search"
                  size={20}
                  color={colors.primaryText}
                  type="Feather"
                />
                <TextInput
                  style={[
                    textInputStyles.textInputWithIcon,
                    {
                      color: colors.primaryText,
                    },
                  ]}
                  value={searchText}
                  onChangeText={handleSearch}
                  placeholder={'eg. INR'}
                  placeholderTextColor={colors.secondaryText}
                />
              </View>
              <CurrencySymbolPicker
                filteredCurrencies={filteredCurrencies}
                selectedCurrency={selectedCurrency}
                handleCurrencySelect={handleCurrencySelect}
              />
              <PrimaryButton
                onPress={handleCurrencyUpdate}
                colors={colors}
                buttonTitle={'Update'}
              />
            </ScrollView>
          </View>
        </View>
      </Modal>

      <CustomToast
        visible={isDeleteModalVisible}
        message={'Are you sure you want to delete all your data'}
        type="warning"
        onOk={handleDeleteAllDataOk}
        onCancel={handleDeleteAllDataCancel}
      />

      <CustomToast
        visible={isStorageModalVisible}
        message={
          'You need to manually give permission for the storage to download your data'
        }
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
