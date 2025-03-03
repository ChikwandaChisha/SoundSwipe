import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import MusicTile from '../components/music_tile';

export default function FeedScreen({ navigation }) {

  const handleAddSong = () => {
    navigation.replace("PlaylistScreen");
  }
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
      <TouchableOpacity style={styles.button} onPress={handleAddSong}>
        <Text style={styles.buttonText}>Add Song</Text>
      </TouchableOpacity>
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
    button: {
      width: '40%',
      height: 50,
      backgroundColor: '#1DB954',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 10,
      marginTop: 10,
    },
    buttonText: {
      fontSize: 18,
      color: '#fff',
      fontWeight: 'bold',
    },
});