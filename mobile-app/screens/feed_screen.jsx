import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MusicTile from '../components/music_tile';

export default function FeedScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>This is Your Feed</Text>
      <View>
        <MusicTile 
        title={"PassionFruit"}
        artist={"Drake"}
        albumCover={"https://i1.sndcdn.com/artworks-CCbZ4mG3Juom-0-t500x500.jpg"}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({

  container: { 
    flex: 1, 
    justifyContent: 'center', 
    gap: 30,
    alignItems: 'center', 
    backgroundColor: '#121212' 
    },
    text: { 
        fontSize: 24, color: '#1DB954' 
    },

});