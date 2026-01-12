import {ScrollView, TextInput, View} from 'react-native';
import React from 'react';
import Icon from '../../components/atoms/Icons';
import PrimaryButton from '../../components/atoms/PrimaryButton';
import useChooseCurrency from './useChooseCurrency';
import PrimaryView from '../../components/atoms/PrimaryView';
import PrimaryText from '../../components/atoms/PrimaryText';
import CurrencySymbolPicker from '../../components/molecules/CurrencySymbolPicker';
import {gs} from '../../styles/globalStyles';

const ChooseCurrencyScreen = () => {
  const {colors, search, filteredCurrencies, selectedCurrency, handleCurrencySubmit, handleSearch, handleCurrencySelect} =
    useChooseCurrency();

  return (
    <PrimaryView colors={colors} dismissKeyboardOnTouch>
      <View style={gs.pt15p}>
        <PrimaryText size={24}>Your money,</PrimaryText>
        <PrimaryText size={24}>your currency.</PrimaryText>
        <PrimaryText size={24}>Pick the one you prefer</PrimaryText>
      </View>

      <View style={[gs.pt5p, gs.pb5p]}>
        <PrimaryText size={15} color={colors.accentGreen}>Select your currency</PrimaryText>
      </View>

      <View
        style={[
          gs.h48,
          gs.itemsCenter,
          gs.border2,
          gs.mt5,
          gs.mb15,
          gs.rounded10,
          gs.pl10,
          gs.justifyStart,
          gs.row,
          {borderColor: colors.secondaryContainerColor, backgroundColor: colors.secondaryAccent},
        ]}>
        <Icon name="search" size={20} color={colors.primaryText} />
        <TextInput
          style={[gs.px15, gs.h48, gs.wFull, gs.fontMedium, gs.noFontPadding, {color: colors.primaryText}]}
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

      <PrimaryButton onPress={handleCurrencySubmit} colors={colors} buttonTitle={'Continue'} />
    </PrimaryView>
  );
};

export default ChooseCurrencyScreen;
