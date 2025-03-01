import React, {useState} from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Pressable } from 'react-native';
// import Animated, {
//   interpolate,
//   useAnimatedStyle,
//   useSharedValue,
//   withTiming,
// } from "react-native-reanimated";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faPlus, faCheckCircle } from '@fortawesome/free-solid-svg-icons';

const PlaylistTile = ({
    title,
    artist,
    playlists,
}) => {

  const [addedPlaylists, setAddedPlaylists] = useState({});

  const togglePlaylist = (id) => {
    setAddedPlaylists((prevState) => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.currentSong}>
          <Image source={{uri:profilePic}} style={styles.profilePic} />
            <Text style={styles.songTitle}>{title}</Text>
            <Text style={styles.songArtist}>{artist}</Text>
        </View>
        <Text>Add to Playlist</Text>
        <View>
          {playlists.map((playlist, index)=> (
            <View key={index} style={styles.playlistContainer}>
              <Image></Image>
              <Text>Playlist Title</Text>
              <TouchableOpacity onPress={() => toggleSong(item.id)}>
              <Icon
                  name={addedPlaylists[playlist.id] ? 'check' : 'plus'}
                  size={24}
                  color={addedPlaylists[playlist.id] ? 'green' : 'black'}
                />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </View>

    </View>

  )
};

const styles = StyleSheet.create({
  card: {
    width: 300,
    height: 400,
    backgroundColor: '#d68e47',
  },
  currentSong: {
    width: 200,
    height: 75,
    backgroundColor: 'white',
  }

});

export default PlaylistTile;
