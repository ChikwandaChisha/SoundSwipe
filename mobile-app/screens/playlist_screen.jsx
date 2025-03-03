import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import PlaylistTile from '../components/playlist_tile';

export default function PlaylistScreen () {
  return (
    <View style={styles.container}>
      <PlaylistTile
      title={'Naive'}
      artist={'The Kooks'}
      playlists={['happy', 'sad', 'fall songs']}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    justifyContent: 'center',
    alignItems: 'center',
    }
  })