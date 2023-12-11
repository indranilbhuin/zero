import {useState} from 'react';
import useThemeColors from '../../hooks/useThemeColors';
import {useDispatch, useSelector} from 'react-redux';
import {selectUserId} from '../../redux/slice/userIdSlice';
import {createCurrency} from '../../services/CurrencyService';
import AsyncStorageService from '../../utils/asyncStorageService';
import {setIsOnboarded} from '../../redux/slice/isOnboardedSlice';
import currencies from '../../../assets/jsons/currencies.json';
import Currency from '../../schemas/CurrencySchema';

const useChooseCurrency = () => {
  const colors = useThemeColors();
  const [search, setSearch] = useState('');
  const [filteredCurrencies, setFilteredCurrencies] = useState(currencies);
  const [selectedCurrency, setSelectedCurrency] = useState<Currency | null>(
    null,
  );
  const userId = useSelector(selectUserId);
  const dispatch = useDispatch();

  const handleCurrencySubmit = async () => {
    if (selectedCurrency) {
      console.log('second');
      await createCurrency(
        selectedCurrency.code,
        selectedCurrency.symbol,
        selectedCurrency.name,
        Realm.BSON.ObjectID.createFromHexString(userId),
      );

      await AsyncStorageService.setItem('isOnboarded', JSON.stringify(true));
      dispatch(setIsOnboarded(true));
    }
  };

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

  const handleCurrencySelect = (currency: any) => {
    setSelectedCurrency(currency);
  };

  return {
    colors,
    search,
    filteredCurrencies,
    selectedCurrency,
    handleCurrencySubmit,
    handleSearch,
    handleCurrencySelect,
  };
};

export default useChooseCurrency;
