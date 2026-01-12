import {useState, useCallback} from 'react';
import useThemeColors from '../../hooks/useThemeColors';
import {useDispatch, useSelector} from 'react-redux';
import {selectUserId} from '../../redux/slice/userIdSlice';
import {createCurrency} from '../../watermelondb/services';
import StorageService from '../../utils/asyncStorageService';
import {setIsOnboarded} from '../../redux/slice/isOnboardedSlice';
import currencies from '../../../assets/jsons/currencies.json';

interface CurrencySelection {
  code: string;
  symbol: string;
  name: string;
}

const useChooseCurrency = () => {
  const colors = useThemeColors();
  const [search, setSearch] = useState('');
  const [filteredCurrencies, setFilteredCurrencies] = useState(currencies);
  const [selectedCurrency, setSelectedCurrency] = useState<CurrencySelection | null>(null);
  const userId = useSelector(selectUserId);
  const dispatch = useDispatch();

  const handleCurrencySubmit = useCallback(async () => {
    if (selectedCurrency) {
      await createCurrency(selectedCurrency.code, selectedCurrency.symbol, selectedCurrency.name, userId);

      StorageService.setItemSync('isOnboarded', JSON.stringify(true));
      dispatch(setIsOnboarded(true));
    }
  }, [selectedCurrency, userId, dispatch]);

  const handleSearch = useCallback((text: string) => {
    setSearch(text);
    const filtered = currencies.filter(currency => {
      const {code, name, symbol} = currency;
      const searchItem = text.toLowerCase();

      return (
        code.toLowerCase().includes(searchItem) ||
        name.toLowerCase().includes(searchItem) ||
        symbol.toLowerCase().includes(searchItem)
      );
    });
    setFilteredCurrencies(filtered);
  }, []);

  const handleCurrencySelect = useCallback((currency: CurrencySelection) => {
    setSelectedCurrency(currency);
  }, []);

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
