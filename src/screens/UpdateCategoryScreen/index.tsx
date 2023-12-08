import {
  Dimensions,
  Modal,
  ScrollView,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import {goBack} from '../../utils/navigationUtils';
import Icon from '../../components/Icons';
import AppHeader from '../../components/AppHeader';
import CustomInput from '../../components/CustomInput';
import addTransactionStyles from '../AddTransactionsScreen/style';
import PrimaryButton from '../../components/PrimaryButton';
import addCategoryStyles from '../AddCategoryScreen/style';
import {useRoute} from '@react-navigation/native';
import allColors from '../../../assets/jsons/categoryColors.json';
import useUpdateCategory, {
  UpdateCategoryScreenRouteProp,
} from './useUpdateCategory';
import PrimaryView from '../../components/atoms/PrimaryView';
import PrimaryText from '../../components/atoms/PrimaryText';

const UpdateCategoryScreen = () => {
  const route = useRoute<UpdateCategoryScreenRouteProp>();
  const {
    colors,
    categoryName,
    setCategoryName,
    isIconModalVisible,
    setIsIconModalVisible,
    selectedIcon,
    setSelectedIcon,
    searchText,
    setSearchText,
    isColorModalVisible,
    setIsColorModalVisible,
    selectedColor,
    setSelectedColor,
    handleUpdateCategory,
    handleIconModalClose,
    handleColorModalClose,
    filteredIcons,
  } = useUpdateCategory(route);

  const renderIcons = () => {
    const handleSelectIcon = iconName => {
      setSelectedIcon(iconName);
      setIsIconModalVisible(false);
    };

    const screenWidth = Dimensions.get('window').width;
    const iconsPerRow = 6;
    const iconSize = (screenWidth * 0.7) / iconsPerRow;

    return filteredIcons.map((iconName, index) => (
      <TouchableOpacity
        key={index}
        style={[
          addCategoryStyles.iconItem,
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
          addCategoryStyles.iconItem,
          {
            width: colorSize,
            height: colorSize,
            backgroundColor:
              selectedIcon === color ? colors.primaryText : undefined,
          },
        ]}
        onPress={() => handleSelectColor(color)}>
        <View
          style={[addCategoryStyles.colorCircle, {backgroundColor: color}]}
        />
      </TouchableOpacity>
    ));
  };

  return (
    <PrimaryView colors={colors}>
      <View style={addCategoryStyles.headerContainer}>
        <AppHeader onPress={goBack} colors={colors} text="Update Category" />
      </View>

      <CustomInput
        colors={colors}
        input={categoryName}
        setInput={setCategoryName}
        placeholder="eg. Stationary"
        label="Category Name"
      />

      <PrimaryText style={{color: colors.primaryText, marginBottom: 10}}>
        Change icon or color
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
          <PrimaryText style={{color: colors.primaryText}}>
            Tap to change icon
          </PrimaryText>
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
                addCategoryStyles.colorCircle,
                {backgroundColor: colors.accentGreen},
              ]}
            />
          ) : (
            <View
              style={[
                addCategoryStyles.colorCircle,
                {backgroundColor: selectedColor},
              ]}
            />
          )}
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setIsColorModalVisible(true)}>
          <PrimaryText style={{color: colors.primaryText}}>
            Tap to Change Color
          </PrimaryText>
        </TouchableOpacity>
      </View>
      <View style={{marginTop: '110%'}}>
        <PrimaryButton
          onPress={handleUpdateCategory}
          colors={colors}
          buttonTitle="Update"
        />
      </View>

      <Modal
        animationType="fade"
        transparent={true}
        visible={isIconModalVisible}
        onRequestClose={handleIconModalClose}>
        <View style={[addCategoryStyles.modalContainer]}>
          <View
            style={[
              addCategoryStyles.modal,
              {backgroundColor: colors.containerColor},
            ]}>
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
              <TextInput
                style={[
                  addCategoryStyles.textInput,
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
        <View style={[addCategoryStyles.modalContainer]}>
          <View
            style={[
              addCategoryStyles.modal,
              {backgroundColor: colors.containerColor},
            ]}>
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

export default UpdateCategoryScreen;
