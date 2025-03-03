import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import PlaylistTile from '../components/playlist_tile';

export default function PlaylistScreen () {
  const addSongs = ([selectedPlaylists]) => {
    //add song to playlists through API here
  };

  return (
    <View style={styles.container}>
      <PlaylistTile
      cover={"https://i1.sndcdn.com/artworks-CCbZ4mG3Juom-0-t500x500.jpg"}
      title={'Naive'}
      artist={'The Kooks'}
      playlists={['happy', 'sad', 'fall songs and lots of leaves falling']}
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