import {StyleSheet, TouchableOpacity, View} from 'react-native';
import React, {useCallback} from 'react';
import useThemeColors from '../../hooks/useThemeColors';
import PrimaryText from '../atoms/PrimaryText';
import {FlashList} from '@shopify/flash-list';

interface Currency {
  name: string;
  symbol: string;
  symbolNative: string;
  decimalDigits: number;
  rounding: number;
  code: string;
  namePlural: string;
}

interface CurrencySymbolPickerProps {
  filteredCurrencies?: Array<Currency>;
  selectedCurrency?: Partial<Currency> | null;
  handleCurrencySelect: (currency: Currency) => void;
}

const CurrencySymbolPicker: React.FC<CurrencySymbolPickerProps> = ({
  filteredCurrencies,
  selectedCurrency,
  handleCurrencySelect,
}) => {
  const colors = useThemeColors();

  const renderCurrencyItem = useCallback(
    ({item: currency}: {item: Currency}) => (
      <TouchableOpacity onPress={() => handleCurrencySelect(currency)}>
        <View
          style={[
            styles.currencyContainer,
            {
              backgroundColor:
                selectedCurrency?.code === currency.code
                  ? `${colors.accentGreen}75`
                  : colors.secondaryAccent,
              borderColor: colors.secondaryContainerColor,
            },
          ]}>
          <View style={styles.symbolContainer}>
            <PrimaryText style={{color: colors.primaryText, fontSize: 20}}>
              {currency.symbolNative}
            </PrimaryText>
            <PrimaryText style={{color: colors.primaryText, fontSize: 13}}>
              {currency.code}
            </PrimaryText>
          </View>
          <PrimaryText style={{color: colors.primaryText, fontSize: 10}}>
            {currency.name}
          </PrimaryText>
        </View>
      </TouchableOpacity>
    ),
    [colors, selectedCurrency, handleCurrencySelect],
  );

  return (
    <View style={styles.currencyMainContainer}>
      <FlashList
        data={filteredCurrencies}
        renderItem={renderCurrencyItem}
        numColumns={3}
        keyExtractor={item => item.code}
        scrollEnabled={false}
      />
    </View>
  );
};

export default CurrencySymbolPicker;

const styles = StyleSheet.create({
  currencyMainContainer: {
    width: '100%',
    marginBottom: 10,
    minHeight: 2,
  },
  currencyContainer: {
    flex: 1,
    height: 80,
    marginRight: 6,
    marginTop: 6,
    borderRadius: 5,
    borderWidth: 2,
    padding: 5,
    justifyContent: 'space-evenly',
  },
  symbolContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
