import {ScrollView, TextInput, View} from 'react-native';
import React from 'react';
import styles from './style';
import Icon from '../../components/atoms/Icons';
import PrimaryButton from '../../components/atoms/PrimaryButton';
import useChooseCurrency from './useChooseCurrency';
import PrimaryView from '../../components/atoms/PrimaryView';
import PrimaryText from '../../components/atoms/PrimaryText';
import textInputStyles from '../../styles/textInput';
import CurrencySymbolPicker from '../../components/molecules/CurrencySymbolPicker';

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
          value={search}
          onChangeText={handleSearch}
          placeholder={'eg. INR'}
          placeholderTextColor={colors.secondaryText}
        />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <CurrencySymbolPicker
          filteredCurrencies={filteredCurrencies}
          selectedCurrency={selectedCurrency}
          handleCurrencySelect={handleCurrencySelect}
        />
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
