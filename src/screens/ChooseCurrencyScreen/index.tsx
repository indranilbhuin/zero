import {ScrollView, TextInput, TouchableOpacity, View} from 'react-native';
import React from 'react';
import styles from './style';
import Icon from '../../components/Icons';
import PrimaryButton from '../../components/PrimaryButton';
import useChooseCurrency from './useChooseCurrency';
import PrimaryView from '../../components/atoms/PrimaryView';
import PrimaryText from '../../components/atoms/PrimaryText';

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
        <PrimaryText style={{color: colors.primaryText, fontSize: 24}}>
          Your money,
        </PrimaryText>
        <PrimaryText style={{color: colors.primaryText, fontSize: 24}}>
          your currency.
        </PrimaryText>
        <PrimaryText style={{color: colors.primaryText, fontSize: 24}}>
          Pick the one you prefer
        </PrimaryText>
      </View>

      <View style={styles.subtitleTextContainer}>
        <PrimaryText style={{color: colors.accentGreen, fontSize: 15}}>
          Select your currency
        </PrimaryText>
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
