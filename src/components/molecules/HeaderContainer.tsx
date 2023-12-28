import {StyleSheet, TouchableOpacity, View} from 'react-native';
import React from 'react';
import Icon from '../atoms/Icons';
import useThemeColors from '../../hooks/useThemeColors';
import {useSelector} from 'react-redux';
import {selectUserName} from '../../redux/slice/userNameSlice';
import {navigate} from '../../utils/navigationUtils';
import PrimaryText from '../atoms/PrimaryText';

interface HeaderContainerProps {
  headerText: string;
}

const HeaderContainer: React.FC<HeaderContainerProps> = ({headerText}) => {
  const colors = useThemeColors();
  const userName = useSelector(selectUserName);

  return (
    <View style={styles.headerContainer}>
      <View style={styles.greetingsContainer}>
        <View
          style={[
            styles.initialsContainer,
            {backgroundColor: colors.primaryText},
          ]}>
          <PrimaryText style={{color: colors.buttonText, fontSize: 20}}>
            {userName
              ?.split(' ')
              .map((name: string) => name.charAt(0))
              .slice(0, 2)
              .join('')}
          </PrimaryText>
        </View>
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
});
