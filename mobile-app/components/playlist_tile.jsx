import React, {useState} from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Pressable, Icon } from 'react-native';
// import Animated, {
//   interpolate,
//   useAnimatedStyle,
//   useSharedValue,
//   withTiming,
// } from "react-native-reanimated";
// import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
// import { faPlus, faCheckCircle } from '@fortawesome/free-solid-svg-icons';

const PlaylistTile = ({
    title,
    artist,
    playlists,
}) => {

  const [addedPlaylists, setAddedPlaylists] = useState({});

  const togglePlaylist = (item) => {
    setAddedPlaylists((prevState) => ({
      ...prevState,
      [playlist]: !prevState[playlis],
    }));
  };

  const addSong = ([playlists]) => {
    //add song to playlists through API here
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.currentSong}>
          <Image source={"https://cdn-icons-png.freepik.com/512/5997/5997002.png"} style={styles.profilePic} />
          <View style={styles.songText}>
            <Text style={styles.songTitle}>{title}</Text>
            <Text style={styles.songArtist}>{artist}</Text>
           </View>
        </View>
        <View style={styles.addSong}>
          <Text>Add to Playlist</Text>
          <View style={styles.playlistList}>
          {playlists.map((playlist, index)=> (
            <View key={index} style={styles.playlistContainer}>
              <Image></Image>
              <Text>Playlist Title</Text>
              <TouchableOpacity onPress={() => togglePlaylist(playlist)}>
                <Text>Add</Text>
              {/* <Icon
                  name={addedPlaylists[playlist.id] ? 'check' : 'plus'}
                  size={24}
                  color={addedPlaylists[playlist.id] ? 'green' : 'black'}
                /> */}
              </TouchableOpacity>
          </View>
          ))}
        </View>
        </View>
      </View>

    </View>

  )
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  card: {
    justifyContent: 'space-evenly',
    alignItems: 'center',
    width: 300,
    height: 500,
    borderRadius: 20,
    backgroundColor: '#d68e47',
  },
  currentSong: {
    width: 200,
    height: 100,
    borderRadius: 10,
    backgroundColor: 'white',
    padding: 15,
    justifyContent: 'space-around',
    alignItems: 'center',
    flexDirection: 'row',
  },
  songText: {
    fontSize: 10,
  },
  addSong: {
    width: 225,
    height: 300,
    borderRadius: 10,
    backgroundColor: 'green',
    padding: 25,
    alignItems: 'center',
  },
  playlistContainer: {
    flexDirection: 'row',
  }

});

export default PlaylistTile;
