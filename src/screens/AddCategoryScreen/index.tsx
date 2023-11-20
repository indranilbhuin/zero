import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import {goBack} from '../../utils/navigationUtils';
import useThemeColors from '../../hooks/useThemeColors';
import AppHeader from '../../components/AppHeader';
import CustomInput from '../../components/CustomInput';
import PrimaryButton from '../../components/PrimaryButton';
import Icon from '../../components/Icons';
import addTransactionStyles from '../AddTransactionsScreen/style';
import MaterialCommunityIcons from 'react-native-vector-icons/Feather';
import allIcons from '../../../assets/categoryIcons.json'

const AddCategoryScreen = () => {
  const colors = useThemeColors();
  const [categoryName, setCategoryName] = useState('');
  const [isIconModalVisible, setIsIconModalVisible] = useState(false);
  const [selectedIcon, setSelectedIcon] = useState('null');
  const [searchText, setSearchText] = useState('');

  const handleAddCategory = () => {};
  const handleIconModalClose = () => {
    setIsIconModalVisible(false);
  };

  console.log('this is the selectedicon', selectedIcon);

  const renderIcons = () => {
    // const allIcons = MaterialCommunityIcons.getRawGlyphMap();
    console.log(allIcons);
    const handleSelectIcon = iconName => {
      setSelectedIcon(iconName);
      setIsIconModalVisible(false);
    };
    return Object.keys(allIcons).map((iconName, index) => (
      <TouchableOpacity
        key={index}
        style={styles.iconItem}
        onPress={() => handleSelectIcon(iconName)}>
        <Icon
          name={iconName}
          size={30}
          color={
            selectedIcon === iconName
              ? colors.primaryText
              : colors.secondaryText
          }
          type={'MaterialCommunityIcons'}
        />
      </TouchableOpacity>
    ));
  };

  return (
    <View
      style={[
        styles.mainContainer,
        {backgroundColor: colors.primaryBackground},
      ]}>
      <View style={styles.headerContainer}>
        <AppHeader onPress={goBack} colors={colors} text="Add Category" />
      </View>

      <CustomInput
        colors={colors}
        input={categoryName}
        setInput={setCategoryName}
        placeholder="eg. Stationary"
        label="Category Name"
      />

      <Text
        style={[
          styles.subtitleText,
          {color: colors.primaryText, marginBottom: 10},
        ]}>
        Pick your own icon
      </Text>
      <View style={addTransactionStyles.dateContainer}>
        <TouchableOpacity
          style={[
            addTransactionStyles.dateButtonContainer,
            {
              backgroundColor: colors.primaryText,
              borderColor: colors.secondaryText,
            },
          ]}
          onPress={() => setIsIconModalVisible(true)}>
          {selectedIcon === 'null' ? (
            <Icon
              name={'dots-horizontal-circle'}
              size={20}
              color={colors.buttonText}
              type={'MaterialCommunityIcons'}
            />
          ) : (
            <Icon
              name={selectedIcon}
              size={20}
              color={colors.buttonText}
              type={'MaterialCommunityIcons'}
            />
          )}
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setIsIconModalVisible(true)}>
          <Text
            style={[
              addTransactionStyles.dateText,
              {color: colors.primaryText, fontSize: 14},
            ]}>
            Tap to select icon
          </Text>
        </TouchableOpacity>
      </View>
      <View style={{marginTop: '125%'}}>
        <PrimaryButton
          onPress={handleAddCategory}
          colors={colors}
          buttonTitle="Add"
        />
      </View>

      <Modal
        animationType="fade"
        transparent={true}
        visible={isIconModalVisible}
        onRequestClose={handleIconModalClose}>
        <View style={[styles.modalContainer]}>
          <View
            style={[styles.modal, {backgroundColor: colors.containerColor}]}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text
                style={[
                  styles.subtitleText,
                  {
                    color: colors.primaryText,
                    fontSize: 17,
                    marginTop: 10,
                    marginBottom: 30,
                    fontFamily: 'FiraCode-SemiBold',
                  },
                ]}>
                Select Icon
              </Text>
              <TextInput
                style={[
                  styles.textInput,
                  {
                    borderColor: colors.primaryText,
                    color: colors.primaryText,
                    backgroundColor: colors.secondaryBackground,
                  },
                ]}
                placeholder="Search Icons"
                value={searchText}
                onChangeText={setSearchText}
              />

              <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
                {renderIcons()}
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default AddCategoryScreen;

const styles = StyleSheet.create({
  mainContainer: {
    height: '100%',
    paddingLeft: '6%',
    paddingRight: '6%',
  },
  headerContainer: {
    marginBottom: 20,
    marginTop: 20,
  },
  subtitleText: {
    fontFamily: 'FiraCode-Medium',
    fontSize: 14,
    includeFontPadding: false,
  },
  modalContainer: {
    width: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    flex: 1,
    justifyContent: 'flex-end',
  },
  modal: {
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    padding: 15,
  },
  iconItem: {
    height: 30,
    width: 30,
    margin: 12,
  },
  textInput: {
    height: 60,
    borderWidth: 2,
    marginTop: 5,
    marginBottom: 10,
    borderRadius: 15,
    padding: 20,
    fontFamily: 'FiraCode-Medium',
    includeFontPadding: false,
  },
});
