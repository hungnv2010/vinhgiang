import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useAuthState } from './context';
import { Create, Detail, Edit, Home, Login, Customer, Sell, Product, WareHouse, CustomerDetail } from './screens';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Colors } from './configs';

const Tab = createBottomTabNavigator();

export const BottomTabNavigator = () => {
  return (
    <Tab.Navigator
      initialRouteName={Customer.route}
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.gray_aaa,
        headerShown: false,
        tabBarStyle: {
          // height: 52,
          // padding: 0,
        }
      })}
    >
      <Tab.Screen name={Customer.route} component={Customer} options={optionsTab('Khách hàng', 'account')} />
      <Tab.Screen name={Product.route} component={Product} options={optionsTab('Sản phẩm', 'cube-outline')} />
      <Tab.Screen name={Sell.route} component={Sell} options={optionsTab('Bán hàng', 'cart-outline')} />
      <Tab.Screen name={WareHouse.route} component={WareHouse} options={optionsTab('Kho vận', 'store-outline')} />
    </Tab.Navigator >
  );
}
BottomTabNavigator.route = "BottomTabNavigator";

const optionsTab = (name, icon) => {
  return {
    tabBarLabelStyle: {
      fontSize: 12,
      marginBottom: 3
    },
    tabBarLabel: name,
    tabBarIcon: ({ color, size }) => (
      <MaterialCommunityIcons name={icon} color={color} size={size} />
    ),
  }
}

const Stack = createStackNavigator();
const options = {
  headerShown: false,
};

const AppNavigator = (props) => {
  const state = useAuthState();
  if (!state.token) {
    return <Stack.Navigator
      screenOptions={options}
      initialRouteName={Login.route}>
      <Stack.Screen
        name={Login.route}
        component={Login} />
    </Stack.Navigator>;
  }
  return <Stack.Navigator initialRouteName={BottomTabNavigator.route}>
    <Stack.Screen options={options} name={BottomTabNavigator.route} component={BottomTabNavigator} />
    <Stack.Screen options={options} name={Home.route} component={Home} />
    <Stack.Screen options={options} name={Create.route} component={Create} />
    <Stack.Screen options={options} name={Edit.route} component={Edit} />
    <Stack.Screen options={options} name={Detail.route} component={Detail} />
    <Stack.Screen options={options} name={CustomerDetail.route} component={CustomerDetail} />
  </Stack.Navigator>;
};

export default AppNavigator;
