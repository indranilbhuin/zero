import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import useThemeColors from '../../hooks/useThemeColors';
import {PieChart} from 'react-native-svg-charts';
import HeaderContainer from '../../components/HeaderContainer';
import {useDispatch, useSelector} from 'react-redux';
import {
  getExpenseRequest,
  selectExpenseData,
} from '../../redux/slice/expenseDataSlice';
import {selectCurrencySymbol} from '../../redux/slice/currencyDataSlice';
import moment from 'moment';

const ReportsScreen = () => {
  const colors = useThemeColors();
  const dispatch = useDispatch();
  const [selectedYear, setSelectedYear] = useState(2023);
  const [selectedMonth, setSelectedMonth] = useState(moment().format('MMMM'));
  const [showYearPicker, setShowYearPicker] = useState(false);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const allTransactions = useSelector(selectExpenseData);
  const currencySymbol = useSelector(selectCurrencySymbol);

  const filterTransactions = (year, month) => {
    const filtered = allTransactions.filter(item => {
      const transactionYear = moment(item.date).year();
      const transactionMonth = moment(item.date).format('MMMM');
      return transactionYear === year && (!month || transactionMonth === month);
    });

    setFilteredTransactions(filtered.length > 0 ? filtered : []);
  };

  console.log('this is filtered', filteredTransactions);

  useEffect(() => {
    dispatch(getExpenseRequest());
    filterTransactions(selectedYear, selectedMonth);
  }, [selectedYear, selectedMonth]);

  const handleYearPicker = () => {
    setShowYearPicker(true);
  };

  const handleYearPickerClose = () => {
    setShowYearPicker(false);
  };

  const years = Array.from({length: 101}, (_, index) => 2000 + index);

  const renderYearPickerItems = () => {
    return (
      <View
        style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        {years.map(year => (
          <TouchableOpacity key={year} onPress={() => handleYearSelect(year)}>
            <View
              style={[
                styles.yearContainer,
                {
                  backgroundColor:
                    year === selectedYear
                      ? colors.primaryText
                      : colors.containerColor,
                  borderColor: colors.secondaryText,
                },
              ]}>
              <Text
                style={[
                  styles.subtitleText,
                  {
                    color:
                      year === selectedYear
                        ? colors.buttonText
                        : colors.primaryText,
                    fontSize: 13,
                  },
                ]}>
                {year}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const renderMonths = () => {
    const months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];

    return (
      <>
        {months.map(month => (
          <TouchableOpacity
            key={month}
            onPress={() => handleMonthSelect(month)}>
            <View
              style={[
                styles.categoryContainer,
                {
                  backgroundColor:
                    month === selectedMonth
                      ? colors.accentGreen
                      : colors.primaryText,
                  borderColor: colors.secondaryText,
                },
              ]}>
              <Text
                style={[
                  styles.subtitleText,
                  {color: colors.buttonText, fontSize: 13},
                ]}>
                {month}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </>
    );
  };

  const renderYear = () => {
    return (
      <View
        style={{
          marginRight: 5,
          borderRightWidth: 0.8,
          borderColor: 'white',
          alignItems: 'center',
          justifyContent: 'center',
          borderStyle: 'dashed',
        }}>
        <TouchableOpacity onPress={handleYearPicker}>
          <View
            style={[
              styles.categoryContainer,
              {
                backgroundColor: colors.primaryText,
                borderColor: colors.secondaryText,
              },
            ]}>
            <Text
              style={[
                styles.subtitleText,
                {
                  color: colors.buttonText,
                  fontSize: 13,
                  fontFamily: 'FiraCode-SemiBold',
                },
              ]}>
              {selectedYear}
            </Text>
          </View>
        </TouchableOpacity>
        <Modal
          visible={showYearPicker}
          animationType="fade"
          transparent
          onRequestClose={handleYearPickerClose}>
          <View style={styles.modalContainer}>
            <View style={styles.innerContainer}>
              <View
                style={[
                  styles.toastContainer,
                  {backgroundColor: colors.containerColor, padding: 15},
                ]}>
                <View
                  style={[
                    styles.selectedYearContainer,
                    {borderColor: colors.secondaryText},
                  ]}>
                  <Text
                    style={[
                      styles.subtitleText,
                      {
                        color: colors.primaryText,
                        fontSize: 20,
                      },
                    ]}>
                    {selectedYear}
                  </Text>
                </View>
                <ScrollView showsVerticalScrollIndicator={false}>
                  {renderYearPickerItems()}
                </ScrollView>
                <View
                  style={[
                    styles.buttonContainer,
                    {borderColor: colors.secondaryText},
                  ]}>
                  <TouchableOpacity onPress={handleYearPickerClose}>
                    <Text
                      style={[
                        styles.subtitleText,
                        {
                          color: colors.primaryText,
                          fontSize: 14,
                        },
                      ]}>
                      CANCEL
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    );
  };

  const handleYearSelect = (year: number) => {
    setSelectedYear(year);
    setShowYearPicker(false);
  };

  const handleMonthSelect = (month: string) => {
    setSelectedMonth(month);
  };

  const Labels = ({slices}) => {
    return (
      <View
        style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          marginTop: 10,
          justifyContent: 'center',
        }}>
        {slices.map((slice, index) => (
          <View
            key={slice.key}
            style={{flexDirection: 'row', alignItems: 'center'}}>
            <View
              style={[styles.dotContainer, {backgroundColor: slice.svg.fill}]}
            />
            <Text
              style={[
                styles.subtitleText,
                {
                  color: colors.primaryText,
                  fontSize: 10,
                  marginRight: 5,
                },
              ]}
              key={slice.key}>
              {slice?.label}
            </Text>
          </View>
        ))}
      </View>
    );
  };

  const renderPieChart = () => {
    const aggregateData: {category: any; amount: any}[] = [];
    const categoryMap = new Map();
    console.log(categoryMap);

    filteredTransactions.forEach(transaction => {
      const {amount, category} = transaction;

      const categoryName = category.name;

      if (categoryMap.has(categoryName)) {
        categoryMap.set(categoryName, {
          ...categoryMap.get(categoryName),
          amount: categoryMap.get(categoryName).amount + amount,
        });
      } else {
        categoryMap.set(categoryName, {
          category: {name: categoryName, ...category},
          amount,
        });
      }
    });

    categoryMap.forEach(value => {
      aggregateData.push(value);
    });

    const data = aggregateData.map((item, index) => ({
      key: item.category.name,
      value: item.amount,
      svg: {
        fill: item.category.color,
        onPress: () => console.log('press', item),
      },
      label: `${item.category.name}: ${currencySymbol} ${item.amount}`,
    }));

    return (
      <View style={{}}>
        <PieChart style={{height: 200}} data={data} />
        <Labels slices={data} />
      </View>
    );
  };

  return (
    <View
      style={[
        styles.mainContainer,
        {backgroundColor: colors.primaryBackground},
      ]}>
      <HeaderContainer headerText={'Reports'} />
      <View
        style={{
          flexDirection: 'row',
          marginTop: 15,
          paddingBottom: 5,
          borderColor: colors.secondaryText,
        }}>
        {renderYear()}
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            {renderMonths()}
          </View>
        </ScrollView>
      </View>

      <ScrollView>
        <View style={styles.chartContainer}>{renderPieChart()}</View>
      </ScrollView>
    </View>
  );
};

export default ReportsScreen;

const styles = StyleSheet.create({
  mainContainer: {
    height: '100%',
    paddingLeft: '6%',
    paddingRight: '6%',
  },
  categoryContainer: {
    height: 35,
    padding: 5,
    marginRight: 5,
    borderRadius: 5,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  subtitleText: {
    fontFamily: 'FiraCode-Medium',
    fontSize: 15,
    includeFontPadding: false,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  innerContainer: {
    width: '100%',
    alignItems: 'center',
  },
  toastContainer: {
    height: 500,
    width: '80%',
  },
  buttonContainer: {
    justifyContent: 'flex-end',
    flexDirection: 'row',
    paddingTop: 10,
    borderTopWidth: 0.8,
  },
  buttonText: {},
  yearContainer: {
    padding: 3,
    borderRadius: 5,
    margin: 10,
  },
  selectedYearContainer: {
    paddingBottom: 10,
    borderBottomWidth: 0.8,
  },
  chartContainer: {
    marginTop: 15,
  },
  dotContainer: {
    height: 8,
    width: 8,
    borderRadius: 40,
    marginRight: 3,
  },
});
