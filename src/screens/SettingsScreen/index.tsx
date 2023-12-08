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
import CustomInput from '../../components/atoms/CustomInput';
import PrimaryButton from '../../components/atoms/PrimaryButton';
import chooseCurrencyStyles from '../ChooseCurrencyScreen/style';
import Icon from '../../components/atoms/Icons';
import {goBack} from '../../utils/navigationUtils';
import useSettings from './useSettings';
import styles from './style';
import PrimaryView from '../../components/atoms/PrimaryView';
import PrimaryText from '../../components/atoms/PrimaryText';
import textInputStyles from '../../styles/textInput';

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
  } = useSettings();

  const renderRadioButtons = onThemeSelect => {
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

  const renderCurrencySymbol = () => {
    return (
      <View style={chooseCurrencyStyles.currencyMainContainer}>
        {filteredCurrencies.map(currency => (
          <TouchableOpacity
            key={currency.code}
            onPress={() => handleCurrencySelect(currency)}>
            <View
              style={[
                chooseCurrencyStyles.currencyContainer,
                {
                  backgroundColor:
                    selectedCurrency?.code === currency.code
                      ? colors.accentGreen
                      : colors.primaryText,
                  borderColor: colors.secondaryText,
                },
              ]}>
              <View style={chooseCurrencyStyles.symbolContainer}>
                <PrimaryText style={{color: colors.buttonText, fontSize: 20}}>
                  {currency.symbolNative}
                </PrimaryText>
                <PrimaryText style={{color: colors.buttonText, fontSize: 13}}>
                  {currency.code}
                </PrimaryText>
              </View>
              <PrimaryText style={{color: colors.buttonText, fontSize: 10}}>
                {currency.name}
              </PrimaryText>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    );
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

      <Modal
        animationType="fade"
        transparent={true}
        visible={isNameModalVisible}
        onRequestClose={handleNameModalClose}>
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
              Change Name
            </PrimaryText>
            <CustomInput
              colors={colors}
              input={name}
              setInput={setName}
              placeholder={'change user name'}
            />
            <PrimaryButton
              onPress={handleNameUpdate}
              colors={colors}
              buttonTitle={'Update'}
            />
          </View>
        </View>
      </Modal>

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
                    borderColor: colors.primaryText,
                    backgroundColor: colors.secondaryBackground,
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
              {renderCurrencySymbol()}
              <PrimaryButton
                onPress={handleCurrencyUpdate}
                colors={colors}
                buttonTitle={'Update'}
              />
            </ScrollView>
          </View>
        </View>
      </Modal>
    </PrimaryView>
  );
};

export default SettingsScreen;
