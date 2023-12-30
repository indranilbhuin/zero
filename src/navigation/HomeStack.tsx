import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import SettingsScreen from '../screens/SettingsScreen';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {StyleSheet, Text, View} from 'react-native';
import Icon from '../components/atoms/Icons';
import useThemeColors from '../hooks/useThemeColors';
import ReportsScreen from '../screens/ReportsScreen';
import DebtsScreen from '../screens/DebtsScreen';
import AddTransactionsScreen from '../screens/AddTransactionsScreen';
import UpdateTransactionScreen from '../screens/UpdateTransactionScreen';
import CategoryScreen from '../screens/CategoryScreen';
import AddCategoryScreen from '../screens/AddCategoryScreen';
import UpdateCategoryScreen from '../screens/UpdateCategoryScreen';
import AddDebtorScreen from '../screens/AddDebtorScreen';
import IndividualDebtsScreen from '../screens/IndividualDebtsScreen';
import AddDebtsScreen from '../screens/AddDebtsScreen';
import UpdateDebtScreen from '../screens/UpdateDebtScreen';
import EverydayTransactionScreen from '../screens/EverydayTransactionScreen';
import UpdateDebtorScreen from '../screens/UpdateDebtorScreen';

const screenOptions = {
  headerShown: false,
};

const HomeIcon = ({color}: any) => (
  <View style={{alignItems: 'center'}}>
    <Icon
      name={'home'}
      size={28}
      type={'MaterialIcons'}
      color={color}
    />
    <Text style={[styles.labelText, {color: color}]}>Home</Text>
  </View>
);

const ReportsIcon = ({color}: any) => (
  <View style={{alignItems: 'center'}}>
    <Icon name={'analytics'} size={25} type={'MaterialIcons'} color={color} />
    <Text style={[styles.labelText, {color: color}]}>Reports</Text>
  </View>
);

const DebtIcon = ({color}: any) => (
  <View style={{alignItems: 'center'}}>
    <Icon name={'credit-card'} size={25} type={'MaterialIcons'} color={color} />
    <Text style={[styles.labelText, {color: color}]}>Debts</Text>
  </View>
);

const CategoriesIcon = ({color}: any) => (
  <View style={{alignItems: 'center'}}>
    <Icon
      name={'shape'}
      size={25}
      type={'MaterialCommunityIcons'}
      color={color}
    />
    <Text style={[styles.labelText, {color: color}]}>Categories</Text>
  </View>
);

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const TabStack = () => {
  const colors = useThemeColors();
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.accentGreen,
        tabBarInactiveTintColor: colors.primaryText,
        tabBarShowLabel: false,
      }}>
      <Tab.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{
          headerShown: false,
          tabBarIcon: HomeIcon,
          tabBarStyle: {
            backgroundColor: colors.containerColor,
            height: 55,
          },
        }}
      />
      <Tab.Screen
        name="ReportsScreen"
        component={ReportsScreen}
        options={{
          headerShown: false,
          tabBarIcon: ReportsIcon,
          tabBarStyle: {
            backgroundColor: colors.containerColor,
            height: 55,
          },
        }}
      />
      <Tab.Screen
        name="CategoryScreen"
        component={CategoryScreen}
        options={{
          headerShown: false,
          tabBarIcon: CategoriesIcon,
          tabBarStyle: {
            backgroundColor: colors.containerColor,
            height: 55,
          },
        }}
      />
      <Tab.Screen
        name="DebtsScreen"
        component={DebtsScreen}
        options={{
          headerShown: false,
          tabBarIcon: DebtIcon,
          tabBarStyle: {
            backgroundColor: colors.containerColor,
            height: 55,
          },
        }}
      />
    </Tab.Navigator>
  );
};

const HomeStack = () => {
  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen name="TabStack" component={TabStack} />
      <Stack.Screen name="SettingsScreen" component={SettingsScreen} />
      <Stack.Screen
        name="AddTransactionsScreen"
        component={AddTransactionsScreen}
      />
      <Stack.Screen name="CategoryScreen" component={CategoryScreen} />
      <Stack.Screen
        name="UpdateTransactionScreen"
        component={UpdateTransactionScreen}
      />
      <Stack.Screen name="AddCategoryScreen" component={AddCategoryScreen} />
      <Stack.Screen
        name="UpdateCategoryScreen"
        component={UpdateCategoryScreen}
      />
      <Stack.Screen
        name="EverydayTransactionScreen"
        component={EverydayTransactionScreen}
      />
      <Stack.Screen name="AddDebtorScreen" component={AddDebtorScreen} />
      <Stack.Screen
        name="IndividualDebtsScreen"
        component={IndividualDebtsScreen}
      />
      <Stack.Screen name="AddDebtsScreen" component={AddDebtsScreen} />
      <Stack.Screen name="UpdateDebtScreen" component={UpdateDebtScreen} />
      <Stack.Screen name="UpdateDebtorScreen" component={UpdateDebtorScreen} />
    </Stack.Navigator>
  );
};

export default HomeStack;

const styles = StyleSheet.create({
  labelText: {
    fontSize: 12,
    fontFamily: 'FiraCode-Medium',
    includeFontPadding: false,
  },
});
