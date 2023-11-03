import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import styles from './style';
import useThemeColors from '../../hooks/useThemeColors';
import Icon from '../../components/Icons';
import currencies from '../../../assets/currencies.json';
import PrimaryButton from '../../components/PrimaryButton';

const ChooseCurrencyScreen = () => {
  const colors = useThemeColors();
  const [search, setSearch] = useState('');
  const [filteredCurrencies, setFilteredCurrencies] = useState(currencies);

  const handleCurrencySubmit = () => {};

  const handleSearch = (text: string) => {
    setSearch(text);
    const filtered = currencies.filter(currency => {
      const {code, name, symbol, symbolNative} = currency;
      const searchItem = text.toLowerCase();

      return (
        code.toLowerCase().includes(searchItem) ||
        name.toLowerCase().includes(searchItem) ||
        symbol.toLowerCase().includes(searchItem) ||
        symbolNative.toLowerCase().includes(searchItem)
      );
    });
    setFilteredCurrencies(filtered);
  };

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
            <TouchableOpacity key={currency.code}>
              <View
                style={[
                  styles.currencyContainer,
                  {
                    backgroundColor: colors.primaryText,
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
          backgroundColor={colors.primaryText}
          buttonText={'Continue'}
        />
      </View>
    </View>
  );
};

export default ChooseCurrencyScreen;
