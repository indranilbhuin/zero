import {TextInput, TouchableOpacity, View} from 'react-native';
import React, {useCallback, useMemo, useState} from 'react';
import {SheetManager, SheetProps} from 'react-native-actions-sheet';
import {FlashList} from '@shopify/flash-list';
import useThemeColors from '../hooks/useThemeColors';
import {CustomBottomSheet} from '../components/atoms/CustomBottomSheet';
import PrimaryButton from '../components/atoms/PrimaryButton';
import PrimaryText from '../components/atoms/PrimaryText';
import Icon from '../components/atoms/Icons';
import currencies from '../../assets/jsons/currencies.json';
import {gs} from '../styles/globalStyles';

interface Currency {
  code: string;
  name: string;
  symbol: string;
}

const CurrencyPickerSheet: React.FC<SheetProps<'currency-picker-sheet'>> = React.memo(props => {
  const colors = useThemeColors();
  const initialCurrency = props.payload?.selectedCurrency;
  const [searchText, setSearchText] = useState('');
  const [selectedCurrency, setSelectedCurrency] = useState<Currency | null>(initialCurrency || null);

  const filteredCurrencies = useMemo(() => {
    if (!searchText) return currencies;
    const searchItem = searchText.toLowerCase();
    return currencies.filter(currency => {
      const {code, name, symbol} = currency;
      return (
        code.toLowerCase().includes(searchItem) ||
        name.toLowerCase().includes(searchItem) ||
        symbol.toLowerCase().includes(searchItem)
      );
    });
  }, [searchText]);

  const handleCurrencySelect = useCallback((currency: Currency) => {
    setSelectedCurrency(currency);
  }, []);

  const handleConfirm = useCallback(() => {
    if (selectedCurrency) {
      props.payload?.onSelect?.(selectedCurrency);
    }
    void SheetManager.hide(props.sheetId);
  }, [props, selectedCurrency]);

  const handleClose = useCallback(() => {
    setSearchText('');
  }, []);

  const renderCurrencyItem = useCallback(
    ({item: currency}: {item: Currency}) => (
      <TouchableOpacity
        style={[
          gs.flex1,
          gs.h70,
          gs.mx3,
          gs.mb8,
          gs.rounded8,
          gs.border15,
          gs.p8,
          gs.justifyBetween,
          {
            backgroundColor:
              selectedCurrency?.code === currency.code ? `${colors.accentGreen}40` : colors.secondaryAccent,
            borderColor:
              selectedCurrency?.code === currency.code ? colors.accentGreen : colors.secondaryContainerColor,
          },
        ]}
        onPress={() => handleCurrencySelect(currency)}>
        <View style={gs.rowBetweenCenter}>
          <PrimaryText size={18} weight="semibold">{currency.symbol}</PrimaryText>
          <PrimaryText size={11}>{currency.code}</PrimaryText>
        </View>
        <PrimaryText size={9}>{currency.name}</PrimaryText>
      </TouchableOpacity>
    ),
    [selectedCurrency, colors, handleCurrencySelect],
  );

  return (
    <CustomBottomSheet
      sheetId={props.sheetId}
      header={{
        title: 'Select Currency',
        showCloseButton: true,
        onClosePress: () => void SheetManager.hide(props.sheetId),
      }}
      onClose={handleClose}
      gestureEnabled>
      <View style={[gs.px15, gs.pb10]}>
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
            value={searchText}
            onChangeText={setSearchText}
            placeholder="Search currency..."
            placeholderTextColor={colors.secondaryText}
          />
        </View>

        <View style={[gs.h320, gs.my10]}>
          <FlashList
            data={filteredCurrencies}
            renderItem={renderCurrencyItem}
            numColumns={3}
            keyExtractor={(currency: Currency) => currency.code}
          />
        </View>

        <PrimaryButton onPress={handleConfirm} colors={colors} buttonTitle="Update" disabled={!selectedCurrency} />
      </View>
    </CustomBottomSheet>
  );
});

export default CurrencyPickerSheet;
