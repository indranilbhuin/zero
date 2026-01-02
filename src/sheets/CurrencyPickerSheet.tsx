import {ScrollView, StyleSheet, TextInput, TouchableOpacity, View} from 'react-native';
import React, {useCallback, useMemo, useState} from 'react';
import {SheetManager, SheetProps} from 'react-native-actions-sheet';
import useThemeColors from '../hooks/useThemeColors';
import {CustomBottomSheet} from '../components/atoms/CustomBottomSheet';
import PrimaryButton from '../components/atoms/PrimaryButton';
import PrimaryText from '../components/atoms/PrimaryText';
import Icon from '../components/atoms/Icons';
import currencies from '../../assets/jsons/currencies.json';
import textInputStyles from '../styles/textInput';

interface Currency {
  code: string;
  name: string;
  symbol: string;
}

const CurrencyPickerSheet: React.FC<SheetProps<'currency-picker-sheet'>> = props => {
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

  const currencyRows = useMemo(() => {
    const rows: Currency[][] = [];
    for (let i = 0; i < filteredCurrencies.length; i += 3) {
      rows.push(filteredCurrencies.slice(i, i + 3));
    }
    return rows;
  }, [filteredCurrencies]);

  return (
    <CustomBottomSheet
      sheetId={props.sheetId}
      header={{
        title: 'Select Currency',
        showCloseButton: true,
        onClosePress: () => void SheetManager.hide(props.sheetId),
      }}
      gestureEnabled>
      <View style={styles.container}>
        <View
          style={[
            textInputStyles.textInputContainer,
            {
              borderColor: colors.secondaryContainerColor,
              backgroundColor: colors.secondaryAccent,
            },
          ]}>
          <Icon name="search" size={20} color={colors.primaryText} />
          <TextInput
            style={[textInputStyles.textInputWithIcon, {color: colors.primaryText}]}
            value={searchText}
            onChangeText={setSearchText}
            placeholder="Search currency..."
            placeholderTextColor={colors.secondaryText}
          />
        </View>

        <ScrollView style={styles.listContainer} showsVerticalScrollIndicator={false} nestedScrollEnabled>
          {currencyRows.map((row, rowIndex) => (
            <View key={rowIndex} style={styles.row}>
              {row.map(currency => (
                <TouchableOpacity
                  key={currency.code}
                  style={[
                    styles.currencyItem,
                    {
                      backgroundColor:
                        selectedCurrency?.code === currency.code ? `${colors.accentGreen}40` : colors.secondaryAccent,
                      borderColor:
                        selectedCurrency?.code === currency.code ? colors.accentGreen : colors.secondaryContainerColor,
                    },
                  ]}
                  onPress={() => handleCurrencySelect(currency)}>
                  <View style={styles.symbolRow}>
                    <PrimaryText style={styles.symbolText}>{currency.symbol}</PrimaryText>
                    <PrimaryText style={styles.codeText}>{currency.code}</PrimaryText>
                  </View>
                  <PrimaryText style={styles.nameText}>{currency.name}</PrimaryText>
                </TouchableOpacity>
              ))}
              {/* Fill empty slots if row has less than 3 items */}
              {row.length < 3 &&
                [...new Array(3 - row.length)].map((_, i) => <View key={`empty-${i}`} style={styles.emptyItem} />)}
            </View>
          ))}
        </ScrollView>

        <PrimaryButton onPress={handleConfirm} colors={colors} buttonTitle="Update" disabled={!selectedCurrency} />
      </View>
    </CustomBottomSheet>
  );
};

export default CurrencyPickerSheet;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 15,
    paddingBottom: 10,
  },
  listContainer: {
    height: 320,
    marginVertical: 10,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  currencyItem: {
    flex: 1,
    height: 70,
    marginHorizontal: 3,
    borderRadius: 8,
    borderWidth: 1.5,
    padding: 8,
    justifyContent: 'space-between',
  },
  emptyItem: {
    flex: 1,
    marginHorizontal: 3,
  },
  symbolRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  symbolText: {
    fontSize: 18,
    fontFamily: 'FiraCode-SemiBold',
  },
  codeText: {
    fontSize: 11,
  },
  nameText: {
    fontSize: 9,
  },
});
