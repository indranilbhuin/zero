import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import Icon from './Icons';

const AppHeader = ({onPress, colors, text}) => {
  return (
    <View style={styles.headerContainer}>
      <View style={styles.iconButtonContainer}>
        <TouchableOpacity onPress={onPress}>
          <Icon
            name="caret-back-circle"
            size={25}
            color={colors.primaryText}
            type={'IonIcons'}
          />
        </TouchableOpacity>
      </View>

      <Text style={[styles.buttonText, {color: colors.primaryText}]}>
        {text}
      </Text>
    </View>
  );
};

export default AppHeader;

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  buttonText: {
    fontFamily: 'FiraCode-Medium',
    fontSize: 14,
  },
  iconButtonContainer: {
    marginRight: 10,
  },
});
