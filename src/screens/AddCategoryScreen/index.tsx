import {
  Dimensions,
  Modal,
  ScrollView,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import {goBack} from '../../utils/navigationUtils';
import AppHeader from '../../components/atoms/AppHeader';
import CustomInput from '../../components/atoms/CustomInput';
import PrimaryButton from '../../components/atoms/PrimaryButton';
import Icon from '../../components/atoms/Icons';
import addTransactionStyles from '../AddTransactionsScreen/style';
import allIcons from '../../../assets/jsons/categoryIcons.json';
import allColors from '../../../assets/jsons/categoryColors.json';
import styles from './style';
import useAddCategory from './useAddCategory';
import PrimaryView from '../../components/atoms/PrimaryView';
import PrimaryText from '../../components/atoms/PrimaryText';

const AddCategoryScreen = () => {
  const {
    colors,
    categoryName,
    setCategoryName,
    selectedIcon,
    setSelectedIcon,
    isIconModalVisible,
    setIsIconModalVisible,
    isColorModalVisible,
    setIsColorModalVisible,
    handleAddCategory,
    handleIconModalClose,
    handleColorModalClose,
    selectedColor,
    setSelectedColor,
    searchText,
    setSearchText,
  } = useAddCategory();

  const renderIcons = () => {
    const handleSelectIcon = iconName => {
      setSelectedIcon(iconName);
      setIsIconModalVisible(false);
    };

    const screenWidth = Dimensions.get('window').width;
    const iconsPerRow = 6;
    const iconSize = (screenWidth * 0.7) / iconsPerRow;

    return Object.keys(allIcons).map((iconName, index) => (
      <TouchableOpacity
        key={index}
        style={[
          styles.iconItem,
          {
            width: iconSize,
            height: iconSize,
            backgroundColor:
              selectedIcon === iconName ? colors.primaryText : undefined,
          },
        ]}
        onPress={() => handleSelectIcon(iconName)}>
        <Icon
          name={iconName}
          size={30}
          color={
            selectedIcon === iconName
              ? colors.containerColor
              : colors.secondaryText
          }
          type={'MaterialCommunityIcons'}
        />
      </TouchableOpacity>
    ));
  };

  const renderColors = () => {
    const handleSelectColor = color => {
      setSelectedColor(color);
      setIsColorModalVisible(false);
    };

    const screenWidth = Dimensions.get('window').width;
    const colorsPerRow = 6;
    const colorSize = (screenWidth * 0.7) / colorsPerRow;
    console.log(allColors);

    return Object.keys(allColors).map((color, index) => (
      <TouchableOpacity
        key={index}
        style={[
          styles.iconItem,
          {
            width: colorSize,
            height: colorSize,
            backgroundColor:
              selectedIcon === color ? colors.primaryText : undefined,
          },
        ]}
        onPress={() => handleSelectColor(color)}>
        <View style={[styles.colorCircle, {backgroundColor: color}]} />
      </TouchableOpacity>
    ));
  };

  return (
    <PrimaryView colors={colors}>
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

      <PrimaryText style={{marginBottom: 10}}>
        Pick your own icon and color
      </PrimaryText>
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
              size={25}
              color={colors.buttonText}
              type={'MaterialCommunityIcons'}
            />
          ) : (
            <Icon
              name={selectedIcon}
              size={25}
              color={colors.buttonText}
              type={'MaterialCommunityIcons'}
            />
          )}
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setIsIconModalVisible(true)}>
          <PrimaryText>Tap to select icon</PrimaryText>
        </TouchableOpacity>
      </View>

      <View style={addTransactionStyles.dateContainer}>
        <TouchableOpacity
          style={[
            addTransactionStyles.dateButtonContainer,
            {
              backgroundColor: colors.primaryText,
              borderColor: colors.secondaryText,
            },
          ]}
          onPress={() => setIsColorModalVisible(true)}>
          {selectedColor === 'null' ? (
            <View
              style={[
                styles.colorCircle,
                {backgroundColor: colors.accentGreen},
              ]}
            />
          ) : (
            <View
              style={[styles.colorCircle, {backgroundColor: selectedColor}]}
            />
          )}
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setIsColorModalVisible(true)}>
          <PrimaryText>Tap to select Color</PrimaryText>
        </TouchableOpacity>
      </View>
      <View style={{marginTop: '110%'}}>
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
              <PrimaryText
                style={{
                  color: colors.primaryText,
                  fontSize: 17,
                  marginTop: 10,
                  marginBottom: 30,
                  fontFamily: 'FiraCode-SemiBold',
                }}>
                Select Icon
              </PrimaryText>
              <CustomInput
                input={searchText}
                label={undefined}
                colors={colors}
                placeholder={'Search Icons'}
                setInput={setSearchText}
              />

              <View
                style={{
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                {renderIcons()}
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="fade"
        transparent={true}
        visible={isColorModalVisible}
        onRequestClose={handleColorModalClose}>
        <View style={[styles.modalContainer]}>
          <View
            style={[styles.modal, {backgroundColor: colors.containerColor}]}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <PrimaryText
                style={{
                  color: colors.primaryText,
                  fontSize: 17,
                  marginTop: 10,
                  marginBottom: 30,
                  fontFamily: 'FiraCode-SemiBold',
                }}>
                Select Color
              </PrimaryText>
              <View
                style={{
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                {renderColors()}
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </PrimaryView>
  );
};

export default AddCategoryScreen;
