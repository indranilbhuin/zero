import {Image, TouchableOpacity, View} from 'react-native';
import React, {useState, memo, useCallback} from 'react';
import Icon from '../atoms/Icons';
import useThemeColors from '../../hooks/useThemeColors';
import {useDispatch, useSelector} from 'react-redux';
import {selectUserName, setUserName} from '../../redux/slice/userNameSlice';
import {navigate} from '../../utils/navigationUtils';
import PrimaryText from '../atoms/PrimaryText';
import useSettings from '../../screens/SettingsScreen/useSettings';
import ChangeNameModal from './ChangeNameModal';
import {updateUserById} from '../../watermelondb/services';
import {selectUserId} from '../../redux/slice/userIdSlice';
import {gs} from '../../styles/globalStyles';

interface HeaderContainerProps {
  headerText: string;
}

const HeaderContainer: React.FC<HeaderContainerProps> = ({headerText}) => {
  const colors = useThemeColors();
  const dispatch = useDispatch();
  const userName = useSelector(selectUserName);
  const userId = useSelector(selectUserId);
  const {handleNameModalClose} = useSettings();
  const [name, setName] = useState(userName);
  const [isNameModalVisible, setIsNameModalVisible] = useState(false);

  const handleProfileClick = useCallback(() => {
    setIsNameModalVisible(true);
  }, []);

  const handleNameUpdate = useCallback(async () => {
    try {
      await updateUserById(userId, {
        username: name,
      });
      dispatch(setUserName(name));
      setIsNameModalVisible(false);
    } catch (error) {
      if (__DEV__) {
        console.error('Error updating the name:', error);
      }
    }
  }, [userId, name, dispatch]);

  return (
    <>
      <View style={[gs.rowCenter, gs.mt15, gs.justifyBetween]}>
        <View style={[gs.rowCenter, gs.flex1]}>
          <TouchableOpacity onPress={handleProfileClick}>
            <View style={[gs.size40, gs.p2, gs.rounded50, gs.center, gs.mr8, {backgroundColor: colors.primaryText}]}>
              <Image source={require('../../../assets/images/2.png')} style={[gs.size40, gs.absolute, gs.rounded50]} />

              <PrimaryText size={20} color={"#000"} style={gs.zIndex3}>
                {userName
                  ?.split(' ')
                  .map((n: string) => n.charAt(0))
                  .slice(0, 2)
                  .join('')}
              </PrimaryText>
            </View>
          </TouchableOpacity>
          <PrimaryText size={15}>{headerText}</PrimaryText>
        </View>
        <View>
          <TouchableOpacity onPress={() => navigate('SettingsScreen')}>
            <Icon name="settings" size={23} color={colors.primaryText} />
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

export default memo(HeaderContainer);
