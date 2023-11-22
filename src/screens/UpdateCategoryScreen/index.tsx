import {
  Dimensions,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useMemo, useState} from 'react';
import useThemeColors from '../../hooks/useThemeColors';
import {useDispatch} from 'react-redux';
import {updateCategoryById} from '../../services/CategoryService';
import {FETCH_ALL_CATEGORY_DATA} from '../../redux/actionTypes';
import {goBack} from '../../utils/navigationUtils';
import Icon from '../../components/Icons';
import AppHeader from '../../components/AppHeader';
import CustomInput from '../../components/CustomInput';
import addTransactionStyles from '../AddTransactionsScreen/style';
import PrimaryButton from '../../components/PrimaryButton';
import addCategoryStyles from '../AddCategoryScreen/style';
import allIcons from '../../../assets/categoryIcons.json';
import {RouteProp, useRoute} from '@react-navigation/native';

type UpdateCategoryScreenRouteProp = RouteProp<
  {
    UpdateCategoryScreen: {
      categoryId: string;
      categoryName: string;
      categoryIcon: string;
    };
  },
  'UpdateCategoryScreen'
>;

const UpdateCategoryScreen = () => {
  const route = useRoute<UpdateCategoryScreenRouteProp>();
  const categoryData = route.params;

  const colors = useThemeColors();
  const dispatch = useDispatch();
  const [categoryName, setCategoryName] = useState(categoryData.categoryName);
  const [isIconModalVisible, setIsIconModalVisible] = useState(false);
  const [selectedIcon, setSelectedIcon] = useState(categoryData.categoryIcon);
  const [searchText, setSearchText] = useState('');

  const handleUpdateCategory = () => {
    try {
      updateCategoryById(
        Realm.BSON.ObjectID.createFromHexString(categoryData.categoryId),
        categoryName,
        selectedIcon,
      );
      dispatch({type: FETCH_ALL_CATEGORY_DATA});
      goBack();
    } catch (error) {
      console.error('Error creating category:', error);
    }
  };

  const handleIconModalClose = () => {
    setIsIconModalVisible(false);
  };

  console.log('this is the selectedicon', selectedIcon);

  const filteredIcons = useMemo(() => {
    const lowerCaseSearch = searchText.toLowerCase();
    return Object.keys(allIcons).filter(iconName =>
      iconName.toLowerCase().includes(lowerCaseSearch),
    );
  }, [searchText]);

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
              selectedIcon === iconName
                ? colors.primaryText
                : undefined,
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

  return (
    <View
      style={[
        addCategoryStyles.mainContainer,
        {backgroundColor: colors.primaryBackground},
      ]}>
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

      <Text
        style={[
          addCategoryStyles.subtitleText,
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
          <Text
            style={[
              addTransactionStyles.dateText,
              {color: colors.primaryText, fontSize: 14},
            ]}>
            Tap to change icon
          </Text>
        </TouchableOpacity>
      </View>
      <View style={{marginTop: '125%'}}>
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
              <Text
                style={[
                  addCategoryStyles.subtitleText,
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
    </View>
  );
};

export default UpdateCategoryScreen;

const styles = StyleSheet.create({});
