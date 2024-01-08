import {Image, StyleSheet, TouchableOpacity, View} from 'react-native';
import React, {useState} from 'react';
import Icon from '../atoms/Icons';
import useThemeColors from '../../hooks/useThemeColors';
import {useDispatch, useSelector} from 'react-redux';
import {selectUserName, setUserName} from '../../redux/slice/userNameSlice';
import {navigate} from '../../utils/navigationUtils';
import PrimaryText from '../atoms/PrimaryText';
import useSettings from '../../screens/SettingsScreen/useSettings';
import ChangeNameModal from './ChangeNameModal';
import { updateUserById } from '../../services/UserService';
import { selectUserId } from '../../redux/slice/userIdSlice';

interface HeaderContainerProps {
  headerText: string;
}

const HeaderContainer: React.FC<HeaderContainerProps> = ({headerText}) => {
  const colors = useThemeColors();
  const dispatch = useDispatch();
  const userName = useSelector(selectUserName);
  const userId = useSelector(selectUserId);
  const { handleNameModalClose} = useSettings();
  const [name, setName] = useState(userName);
  const [isNameModalVisible, setIsNameModalVisible] = useState(false);

  const handleProfileClick = () => {
    setIsNameModalVisible(true);
  };

  const handleNameUpdate = async () => {
    try {
      await updateUserById(Realm.BSON.ObjectID.createFromHexString(userId), {
        username: name,
      });
      dispatch(setUserName(name));
      setIsNameModalVisible(false);
    } catch (error) {
      console.error('Error updating the name:', error);
    }
  };

  return (
    <>
      <View style={styles.headerContainer}>
        <View style={styles.greetingsContainer}>
          <TouchableOpacity onPress={handleProfileClick}>
            <View
              style={[
                styles.initialsContainer,
                {backgroundColor: colors.primaryText},
              ]}>
              <Image
                source={require('../../../assets/images/2.png')}
                style={styles.noImage}
              />

              <PrimaryText
                style={{color: colors.buttonText, fontSize: 20, zIndex: 3}}>
                {userName
                  ?.split(' ')
                  .map((name: string) => name.charAt(0))
                  .slice(0, 2)
                  .join('')}
              </PrimaryText>
            </View>
          </TouchableOpacity>
          <PrimaryText style={{fontSize: 15}}>{headerText}</PrimaryText>
        </View>
        <View>
          <TouchableOpacity onPress={() => navigate('SettingsScreen')}>
            <Icon
              name={'setting'}
              size={23}
              color={colors.primaryText}
              type={'AntDesign'}
            />
          </TouchableOpacity>
        </View>
      </View>

      <ChangeNameModal
        colors={colors}
        isNameModalVisible={isNameModalVisible}
        handleNameModalClose={handleNameModalClose}
        name={name}
        setName={setName}
        handleNameUpdate={handleNameUpdate}
      />
    </>
  );
};

export default HeaderContainer;

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
    justifyContent: 'space-between',
  },
  greetingsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: '-2%',
    marginRight: '-2%',
    width: '80%',
  },
  initialsContainer: {
    height: 40,
    width: 40,
    padding: 2,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  noImage: {
    height: 40,
    width: 40,
    position: 'absolute',
    borderRadius: 50,
  },
});
