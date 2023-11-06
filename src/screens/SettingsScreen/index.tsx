import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import useThemeColors from '../../hooks/useThemeColors';
import {colors} from '../../../assets/colors';
import { useSelector } from 'react-redux';

const SettingsScreen = () => {
  const colors = useThemeColors();
  const userName = useSelector(
    (state: {userData: {userName: any}}) => state.userData.userName,
  );
  return (
    <View
      style={[
        styles.mainContainer,
        {backgroundColor: colors.primaryBackground},
      ]}>
      <View style={styles.headerContainer}>
        <View style={styles.greetingsContainer}>
          <Text style={[styles.titleText, {color: colors.primaryText}]}>
            zero
          </Text>
        </View>
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View
          style={[
            styles.settingsContainer,
            {
              backgroundColor: colors.containerColor,
              borderColor: colors.secondaryText,
            },
          ]}>
          <TouchableOpacity>
            <View
              style={[
                styles.individualSettingsContainer,
                {
                  backgroundColor: colors.containerColor,
                  borderColor: colors.secondaryText,
                },
              ]}>
              <Text>Choose Theme</Text>
              <Text>System Defualt</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity>
            <View
              style={[
                styles.individualSettingsContainer,
                {
                  backgroundColor: colors.containerColor,
                  borderColor: colors.secondaryText,
                },
              ]}>
              <Text>Change Name</Text>
              <Text>{userName}</Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({
  mainContainer: {
    height: '100%',
    paddingLeft: '6%',
    paddingRight: '6%',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: '5%',
    justifyContent: 'space-between',
  },
  titleText: {
    fontFamily: 'FiraCode-Medium',
    fontSize: 25,
    includeFontPadding: false,
  },
  greetingsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingsContainer: {
    marginTop: 10,
    borderWidth: 1,
    borderRadius: 10,
  },
  individualSettingsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 60,
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
  },
});
