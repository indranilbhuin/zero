import {Image, TouchableOpacity, View} from 'react-native';
import React, {memo, useCallback} from 'react';
import Icon from '../atoms/Icons';
import useThemeColors from '../../hooks/useThemeColors';
import {useDispatch, useSelector} from 'react-redux';
import {selectUserName, setUserName} from '../../redux/slice/userNameSlice';
import {navigate} from '../../utils/navigationUtils';
import PrimaryText from '../atoms/PrimaryText';
import {updateUserById} from '../../watermelondb/services';
import {selectUserId} from '../../redux/slice/userIdSlice';
import {SheetManager} from 'react-native-actions-sheet';
import {gs, hitSlop} from '../../styles/globalStyles';

interface HeaderContainerProps {
  headerText: string;
}

const HeaderContainer: React.FC<HeaderContainerProps> = ({headerText}) => {
  const colors = useThemeColors();
  const dispatch = useDispatch();
  const userName = useSelector(selectUserName);
  const userId = useSelector(selectUserId);

  const handleProfileClick = useCallback(() => {
    void SheetManager.show('change-name-sheet', {
      payload: {
        currentName: userName,
        onUpdate: (newName: string) => {
          updateUserById(userId, {username: newName})
            .then(() => dispatch(setUserName(newName)))
            .catch(error => {
              if (__DEV__) {
                console.error('Error updating the name:', error);
              }
            });
        },
      },
    });
  }, [userName, userId, dispatch]);

  return (
    <View style={[gs.rowCenter, gs.mt15, gs.justifyBetween]}>
      <View style={[gs.rowCenter, gs.flex1, gs.gap12]}>
        <TouchableOpacity onPress={handleProfileClick}>
          <View style={[gs.size40, gs.p2, gs.rounded50, gs.center, {backgroundColor: colors.primaryText}]}>
            <Image source={require('../../../assets/images/2.png')} style={[gs.size40, gs.absolute, gs.rounded50]} />
            <PrimaryText size={18} weight="bold" color={"#000"} style={gs.zIndex3}>
              {(userName?.split(' ') ?? [])
                .map((n: string) => n.charAt(0))
                .slice(0, 2)
                .join('')}
            </PrimaryText>
          </View>
        </TouchableOpacity>
        <PrimaryText size={16} weight="semibold">{headerText}</PrimaryText>
      </View>
      <TouchableOpacity onPress={() => navigate('SettingsScreen')} hitSlop={hitSlop}>
        <Icon name="settings" size={22} color={colors.secondaryText} />
      </TouchableOpacity>
    </View>
  );
};

export default memo(HeaderContainer);
