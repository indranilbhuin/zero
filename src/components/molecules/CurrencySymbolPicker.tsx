import {StyleSheet, TouchableOpacity, View} from 'react-native';
import React from 'react';
import useThemeColors from '../../hooks/useThemeColors';
import PrimaryText from '../atoms/PrimaryText';

const CurrencySymbolPicker = ({
  filteredCurrencies,
  selectedCurrency,
  handleCurrencySelect,
}) => {
  const colors = useThemeColors();
  return (
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
                  selectedCurrency?.code === currency.code
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
  );
};

export default CurrencySymbolPicker;

const styles = StyleSheet.create({
  currencyMainContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  currencyContainer: {
    width: 95.5,
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
