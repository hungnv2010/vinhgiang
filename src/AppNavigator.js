import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {useAuthState} from './context';
import {Create, Detail, Edit, Home, Login} from './screens';

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
        component={Login}/>
    </Stack.Navigator>;
  }
  return <Stack.Navigator initialRouteName={Home.route}>
    <Stack.Screen options={options} name={Home.route} component={Home}/>
    <Stack.Screen options={options} name={Create.route} component={Create}/>
    <Stack.Screen options={options} name={Edit.route} component={Edit}/>
    <Stack.Screen options={options} name={Detail.route} component={Detail}/>
  </Stack.Navigator>;
};

export default AppNavigator;
