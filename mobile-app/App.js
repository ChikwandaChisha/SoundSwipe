import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './screens/login_screen';
import ProfileScreen from './screens/profile_screen';
import FeedScreen from './screens/feed_screen';
import CreateSearchScreen from './screens/createSearch_screen';
import FeedScreen from './screens/feed_screen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="LoginScreen">
        <Stack.Screen name="LoginScreen" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="ProfileScreen" component={ProfileScreen} options={{ headerShown: false }} />
        <Stack.Screen name="CreateSearchScreen" component={CreateSearchScreen} options={{ headerShown: false }} />
        <Stack.Screen name="FeedScreen" component={FeedScreen} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}