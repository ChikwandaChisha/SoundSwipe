import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import PlaylistTile from '../components/playlist_tile';

export default function PlaylistScreen () {
  const addSongs = (selectedPlaylists) => {
    //add song to playlists through API here
    console.log(`Added Song to ${selectedPlaylists}`);
    return(selectedPlaylists);
  };

  return (
    <View style={styles.container}>
      <PlaylistTile
      cover={"https://i.scdn.co/image/ab67616d0000b27324961edce577bdb99d34a538"}
      title={'Naive'}
      artist={'The Kooks'}
      playlists={['happy', 'sad', 'fall songs and lots of leaves falling']}
      addSong={addSongs}
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