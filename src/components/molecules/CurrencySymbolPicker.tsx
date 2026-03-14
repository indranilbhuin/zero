import {TouchableOpacity, View} from 'react-native';
import React, {useCallback, memo} from 'react';
import useThemeColors from '../../hooks/useThemeColors';
import PrimaryText from '../atoms/PrimaryText';
import {FlashList} from '@shopify/flash-list';
import {gs} from '../../styles/globalStyles';

interface Currency {
  code: string;
  name: string;
  symbol: string;
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
            gs.flex1,
            gs.h80,
            gs.mr6,
            gs.mt6,
            gs.rounded5,
            gs.border2,
            gs.p5,
            gs.justifyEvenly,
            {
              backgroundColor:
                selectedCurrency?.code === currency.code ? `${colors.accentGreen}75` : colors.secondaryAccent,
              borderColor: colors.secondaryContainerColor,
            },
          ]}>
          <View style={gs.rowBetweenCenter}>
            <PrimaryText size={20} color={colors.primaryText} variant="number">
              {currency.symbol}
            </PrimaryText>
            <PrimaryText size={13} color={colors.primaryText}>
              {currency.code}
            </PrimaryText>
          </View>
          <PrimaryText size={10} color={colors.primaryText}>
            {currency.name}
          </PrimaryText>
        </View>
      </TouchableOpacity>
    ),
    [colors, selectedCurrency, handleCurrencySelect],
  );

  return (
    <View style={[gs.wFull, gs.mb10, gs.minH2]}>
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

export default memo(CurrencySymbolPicker);
