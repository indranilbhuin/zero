import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import styles from './style';
import Icon from '../../components/Icons';
import PrimaryButton from '../../components/PrimaryButton';
import useChooseCurrency from './useChooseCurrency';

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
    <View
      style={[
        styles.mainContainer,
        {backgroundColor: colors.primaryBackground},
      ]}>
      <View style={styles.titleTextContainer}>
        <Text style={[styles.titleText, {color: colors.primaryText}]}>
          Your money,
        </Text>
        <Text style={[styles.titleText, {color: colors.primaryText}]}>
          your currency.
        </Text>
        <Text style={[styles.titleText, {color: colors.primaryText}]}>
          Pick the one you prefer
        </Text>
      </View>

      <View style={styles.subtitleTextContainer}>
        <Text style={[styles.subtitleText, {color: colors.accentGreen}]}>
          Select your currency
        </Text>
      </View>

      <View style={styles.textInputContainer}>
        <TextInput
          style={[
            styles.textInput,
            {
              borderColor: colors.primaryText,
              color: colors.primaryText,
              backgroundColor: colors.secondaryBackground,
            },
          ]}
          value={search}
          onChangeText={handleSearch}
          placeholder="eg. INR"
          placeholderTextColor={colors.secondaryText}
        />
        <TouchableOpacity
          style={[
            styles.addButton,
            {
              backgroundColor: colors.primaryText,
              borderColor: colors.secondaryText,
            },
          ]}>
          <Icon
            name="search"
            size={25}
            color={colors.buttonText}
            type="Feather"
          />
        </TouchableOpacity>
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
      </ScrollView>

      <View style={{marginBottom: 20}}>
        <PrimaryButton
          onPress={handleCurrencySubmit}
          colors={colors}
          buttonTitle={'Continue'}
        />
      </View>
    </View>
  );
};

export default ChooseCurrencyScreen;
