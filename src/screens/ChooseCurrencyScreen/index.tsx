import {ScrollView, TextInput, TouchableOpacity, View} from 'react-native';
import React from 'react';
import styles from './style';
import Icon from '../../components/atoms/Icons';
import PrimaryButton from '../../components/atoms/PrimaryButton';
import useChooseCurrency from './useChooseCurrency';
import PrimaryView from '../../components/atoms/PrimaryView';
import PrimaryText from '../../components/atoms/PrimaryText';
import textInputStyles from '../../styles/textInput';

const ChooseCurrencyScreen = () => {
  const {
    colors,
    search,
    filteredCurrencies,
    selectedCurrency,
    handleCurrencySubmit,
    handleSearch,
    handleCurrencySelect,
  } = useChooseCurrency();

  return (
    <PrimaryView colors={colors}>
      <View style={styles.titleTextContainer}>
        <PrimaryText style={{fontSize: 24}}>Your money,</PrimaryText>
        <PrimaryText style={{fontSize: 24}}>your currency.</PrimaryText>
        <PrimaryText style={{fontSize: 24}}>
          Pick the one you prefer
        </PrimaryText>
      </View>

      <View style={styles.subtitleTextContainer}>
        <PrimaryText style={{color: colors.accentGreen, fontSize: 15}}>
          Select your currency
        </PrimaryText>
      </View>

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
          value={search}
          onChangeText={handleSearch}
          placeholder={'eg. INR'}
          placeholderTextColor={colors.secondaryText}
        />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.currencyMainContainer}>
          {filteredCurrencies.map(currency => (
            <TouchableOpacity
              key={currency.code}
              onPress={() => handleCurrencySelect(currency)}>
              <View
                style={[
                  styles.currencyContainer,
                  {
                    backgroundColor:
                      selectedCurrency === currency
                        ? colors.accentGreen
                        : colors.primaryText,
                    borderColor: colors.secondaryText,
                  },
                ]}>
                <View style={styles.symbolContainer}>
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
      </ScrollView>

      <View style={{marginBottom: 20}}>
        <PrimaryButton
          onPress={handleCurrencySubmit}
          colors={colors}
          buttonTitle={'Continue'}
        />
      </View>
    </PrimaryView>
  );
};

export default ChooseCurrencyScreen;
