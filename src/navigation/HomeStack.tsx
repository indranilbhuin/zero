import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import SettingsScreen from '../screens/SettingsScreen';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Platform, StyleSheet, Text, View} from 'react-native';
import Icon from '../components/atoms/Icons';
import useThemeColors from '../hooks/useThemeColors';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
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

const ICON_SIZE = 24;

const HomeIcon = ({color}: {color: string}) => (
  <View style={styles.iconContainer}>
    <View style={styles.iconWrapper}>
      <Icon name={'home'} size={ICON_SIZE} type={'MaterialIcons'} color={color} />
    </View>
    <Text style={[styles.labelText, {color}]}>Home</Text>
  </View>
);

const ReportsIcon = ({color}: {color: string}) => (
  <View style={styles.iconContainer}>
    <View style={styles.iconWrapper}>
      <Icon name={'analytics'} size={ICON_SIZE} type={'MaterialIcons'} color={color} />
    </View>
    <Text style={[styles.labelText, {color}]}>Reports</Text>
  </View>
);

const DebtIcon = ({color}: {color: string}) => (
  <View style={styles.iconContainer}>
    <View style={styles.iconWrapper}>
      <Icon name={'credit-card'} size={ICON_SIZE} type={'MaterialIcons'} color={color} />
    </View>
    <Text style={[styles.labelText, {color}]}>Debts</Text>
  </View>
);

const CategoriesIcon = ({color}: {color: string}) => (
  <View style={styles.iconContainer}>
    <View style={styles.iconWrapper}>
      <Icon name={'shape'} size={ICON_SIZE} type={'MaterialCommunityIcons'} color={color} />
    </View>
    <Text style={[styles.labelText, {color}]}>Categories</Text>
  </View>
);

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const TabStack = () => {
  const colors = useThemeColors();
  const insets = useSafeAreaInsets();

  const bottomPadding = Math.max(insets.bottom, 8);

  const tabBarStyle = {
    backgroundColor: colors.containerColor,
    height: 65 + bottomPadding - (Platform.OS === 'ios' ? 20 : 0),
    paddingTop: 8,
    paddingBottom: bottomPadding,
    borderTopWidth: 0,
  };

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.accentGreen,
        tabBarInactiveTintColor: colors.primaryText,
        tabBarShowLabel: false,
        tabBarStyle: tabBarStyle,
      }}>
      <Tab.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{
          headerShown: false,
          tabBarIcon: HomeIcon,
        }}
      />
      <Tab.Screen
        name="ReportsScreen"
        component={ReportsScreen}
        options={{
          headerShown: false,
          tabBarIcon: ReportsIcon,
        }}
      />
      <Tab.Screen
        name="CategoryScreen"
        component={CategoryScreen}
        options={{
          headerShown: false,
          tabBarIcon: CategoriesIcon,
        }}
      />
      <Tab.Screen
        name="DebtsScreen"
        component={DebtsScreen}
        options={{
          headerShown: false,
          tabBarIcon: DebtIcon,
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
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 70,
  },
  iconWrapper: {
    height: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  labelText: {
    fontSize: 10,
    fontFamily: 'FiraCode-Medium',
    includeFontPadding: false,
    textAlign: 'center',
    marginTop: 2,
  },
});
