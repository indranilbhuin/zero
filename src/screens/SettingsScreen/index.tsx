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
import CustomInput from '../../components/CustomInput';
import PrimaryButton from '../../components/PrimaryButton';
import chooseCurrencyStyles from '../ChooseCurrencyScreen/style';
import addCategoryStyles from '../AddCategoryScreen/style';
import Icon from '../../components/Icons';
import {goBack} from '../../utils/navigationUtils';
import useSettings from './useSettings';
import styles from './style';

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
          <Text
            style={[
              styles.subtitleText,
              {color: colors.primaryText, fontSize: 15},
            ]}>
            {theme}
          </Text>
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
                <Text
                  style={[
                    styles.subtitleText,
                    {color: colors.buttonText, fontSize: 20},
                  ]}>
                  {currency.symbolNative}
                </Text>
                <Text
                  style={[
                    styles.subtitleText,
                    {color: colors.buttonText, fontSize: 13},
                  ]}>
                  {currency.code}
                </Text>
              </View>
              <Text
                style={[
                  styles.subtitleText,
                  {color: colors.buttonText, fontSize: 10},
                ]}>
                {currency.name}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  return (
    <View
      style={[
        styles.mainContainer,
        {backgroundColor: colors.primaryBackground},
      ]}>
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
          <Text style={[styles.titleText, {color: colors.primaryText}]}>
            zero
          </Text>
        </View>
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text
          style={[
            styles.subtitleText,
            {color: colors.accentGreen, fontSize: 14, marginTop: 15},
          ]}>
          Appearance & Personalization
        </Text>
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
              <Text
                style={[
                  styles.subtitleText,
                  {color: colors.primaryText, fontSize: 14},
                ]}>
                Choose Theme
              </Text>
              <Text
                style={[
                  styles.subtitleText,
                  {color: colors.primaryText, fontSize: 14},
                ]}>
                {selectedTheme}
              </Text>
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
              <Text
                style={[
                  styles.subtitleText,
                  {color: colors.primaryText, fontSize: 14},
                ]}>
                Change Name
              </Text>
              <Text
                style={[
                  styles.subtitleText,
                  {color: colors.primaryText, fontSize: 14},
                ]}>
                {userName}
              </Text>
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
              <Text
                style={[
                  styles.subtitleText,
                  {color: colors.primaryText, fontSize: 14, width: '50%'},
                ]}>
                Change Currency Symbol
              </Text>
              <View style={{alignItems: 'flex-end'}}>
                <Text
                  style={[
                    styles.subtitleText,
                    {color: colors.primaryText, fontSize: 14},
                  ]}>
                  {currencySymbol}
                </Text>
                <Text
                  style={[
                    styles.subtitleText,
                    {color: colors.primaryText, fontSize: 14},
                  ]}>
                  {currencyName}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>

        <Text
          style={[
            styles.subtitleText,
            {color: colors.accentGreen, fontSize: 14, marginTop: 15},
          ]}>
          Help & Feedback
        </Text>
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
              <Text
                style={[
                  styles.subtitleText,
                  {color: colors.primaryText, fontSize: 14},
                ]}>
                Rate the app
              </Text>
              <Text
                style={[
                  styles.subtitleText,
                  {color: colors.primaryText, fontSize: 11},
                ]}>
                Enjoying Expense Tracker? Your feedback helps us improve!
              </Text>
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
              <Text
                style={[
                  styles.subtitleText,
                  {color: colors.primaryText, fontSize: 14},
                ]}>
                Github
              </Text>
              <Text
                style={[
                  styles.subtitleText,
                  {color: colors.primaryText, fontSize: 11},
                ]}>
                Explore the Source Code
              </Text>
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
              <Text
                style={[
                  styles.subtitleText,
                  {color: colors.primaryText, fontSize: 14, width: '50%'},
                ]}>
                Privacy Policy
              </Text>
              <Text
                style={[
                  styles.subtitleText,
                  {color: colors.primaryText, fontSize: 11},
                ]}>
                Your Data, Your Device: zero Servers, zero Access.
              </Text>
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
              <Text
                style={[
                  styles.subtitleText,
                  {color: colors.primaryText, fontSize: 14, width: '50%'},
                ]}>
                Version
              </Text>
              <Text
                style={[
                  styles.subtitleText,
                  {color: colors.primaryText, fontSize: 11},
                ]}>
                v{appVersion}
              </Text>
            </View>
          </TouchableWithoutFeedback>
        </View>
        <Text
          style={[
            styles.subtitleText,
            {
              color: colors.primaryText,
              fontSize: 12,
              alignSelf: 'center',
              textAlign: 'center',
              marginTop: 15,
            },
          ]}>
          Embrace the simplicity of zero
        </Text>
        <Text
          style={[
            styles.subtitleText,
            {
              color: colors.primaryText,
              fontSize: 12,
              alignSelf: 'center',
              textAlign: 'center',
            },
          ]}>
          Developed with{' '}
          <Text style={{color: colors.accentGreen}}>passion</Text> in India.
        </Text>
      </ScrollView>

      <Modal
        animationType="fade"
        transparent={true}
        visible={isThemeModalVisible}
        onRequestClose={handleThemeModalClose}>
        <View style={[styles.modalContainer]}>
          <View
            style={[styles.modal, {backgroundColor: colors.containerColor}]}>
            <Text
              style={[
                styles.subtitleText,
                {
                  color: colors.primaryText,
                  fontSize: 17,
                  marginTop: 10,
                  marginBottom: 30,
                  fontFamily: 'FiraCode-SemiBold',
                },
              ]}>
              Select Theme
            </Text>
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
            <Text
              style={[
                styles.subtitleText,
                {
                  color: colors.primaryText,
                  fontSize: 17,
                  marginTop: 10,
                  marginBottom: 30,
                  fontFamily: 'FiraCode-SemiBold',
                },
              ]}>
              Change Name
            </Text>
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
              <Text
                style={[
                  styles.subtitleText,
                  {
                    color: colors.primaryText,
                    fontSize: 17,
                    marginTop: 10,
                    marginBottom: 30,
                    fontFamily: 'FiraCode-SemiBold',
                  },
                ]}>
                Select Currency Symbol
              </Text>
              <TextInput
                style={[
                  addCategoryStyles.textInput,
                  {
                    borderColor: colors.primaryText,
                    color: colors.primaryText,
                    backgroundColor: colors.secondaryBackground,
                  },
                ]}
                placeholder="Search Currency"
                value={searchText}
                onChangeText={handleSearch}
              />
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
    </View>
  );
};

export default SettingsScreen;
