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
        <PrimaryText size={28} weight="bold">Choose your</PrimaryText>
        <PrimaryText size={28} weight="bold">currency</PrimaryText>
      </View>

      <PrimaryText size={14} color={colors.secondaryText} style={gs.mt6}>
        Select the currency you use daily
      </PrimaryText>

      <View
        style={[
          gs.h48,
          gs.itemsCenter,
          gs.mt20,
          gs.mb15,
          gs.rounded12,
          gs.pl10,
          gs.justifyStart,
          gs.row,
          {backgroundColor: colors.secondaryAccent},
        ]}>
        <Icon name="search" size={18} color={colors.secondaryText} />
        <TextInput
          style={[gs.px15, gs.h48, gs.wFull, gs.fontMedium, gs.noFontPadding, {color: colors.primaryText}]}
          value={search}
          onChangeText={handleSearch}
          placeholder={'Search currency...'}
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
