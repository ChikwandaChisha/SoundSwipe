// App.js
import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { getAppleMusicDevToken } from './services/api';
import LoginScreen from './screens/login_screen';
import ProfileScreen from './screens/profile_screen';
import FeedScreen from './screens/feed_screen';
import CreateSearchScreen from './screens/createSearch_screen';
import PlaylistScreen from './screens/playlist_screen';


import MusicKitProvider from './components/MusicKitProvider';

const Stack = createStackNavigator();

export default function App() {

  return (
    // Have to wrap entire app in MusicKitProvider
    <MusicKitProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="LoginScreen">
          <Stack.Screen name="LoginScreen" component={LoginScreen} options={{ headerShown: false }} />
          <Stack.Screen name="ProfileScreen" component={ProfileScreen} options={{ headerShown: false }} />
          <Stack.Screen name="CreateSearchScreen" component={CreateSearchScreen} options={{ headerShown: false }} />
          <Stack.Screen name="FeedScreen" component={FeedScreen} options={{ headerShown: false }} />
        </Stack.Navigator>
      </NavigationContainer>
    </MusicKitProvider>
  );
}