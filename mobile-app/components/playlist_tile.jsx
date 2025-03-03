import React, {useState} from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Pressable, Icon } from 'react-native';
import { CheckBox } from '@rneui/themed';
// import Animated, {
//   interpolate,
//   useAnimatedStyle,
//   useSharedValue,
//   withTiming,
// } from "react-native-reanimated";
// import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
// import { faPlus, faCheckCircle } from '@fortawesome/free-solid-svg-icons';

const PlaylistTile = ({
    cover,
    title,
    artist,
    playlists,
}) => {

  const [addedPlaylists, setAddedPlaylists] = useState({});

  const togglePlaylist = (item, checked) => {
    setAddedPlaylists((prevState) => ({
      ...prevState,
      [item]: checked,
    }));
  };

  const PlaylistItem = ({playlist, cover, togglePlaylist}) => {
    const [checked, setChecked] = useState(false);
    const toggleCheckbox = () => setChecked(!checked);
    
    return (
      <View style={styles.playlistContainer}>
        <Image style={styles.playlistCover} source={{uri:cover}} />
        <Text>Title</Text>
        <TouchableOpacity onPress={() => togglePlaylist(playlist, checked)} >
          <CheckBox
          style={styles.playlistAdd}
          checked={checked}
          checkedIcon="heart"
          uncheckedIcon="plus"
          checkedColor="red"
          onPress={toggleCheckbox}
          size={18}
          center={true}
          />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.currentSong}>
          <Image source={{uri:cover}} style={styles.songCover} />
          <View style={styles.songText}>
            <Text style={styles.songTitle}>{title}</Text>
            <Text style={styles.songArtist}>{artist}</Text>
           </View>
        </View>
        <View style={styles.addSong}>
          <Text>Add to Playlist</Text>
          <View style={styles.playlistList}>
          {playlists.map((playlist, index)=> (
            <PlaylistItem
            key={index}
            cover={"https://images.unsplash.com/photo-1740738174801-12a109f9acd3?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxMnx8fGVufDB8fHx8fA%3D%3D"}
            playlist={playlist}
            togglePlaylist={togglePlaylist}
            />
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
  songCover: {
    width: 50,
    height: 50,
    borderRadius: 3,
  },
  songText: {
    fontSize: 10,
  },
  addSong: {
    width: 225,
    height: 300,
    borderRadius: 10,
    backgroundColor: 'white',
    padding: 25,
    alignItems: 'center',
    rowGap: 10,
  },
  playlistContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    columnGap: 50,
  },
  playlistCover: {
    width: 30,
    height: 30,
  },
  playlistAdd: {
    size: 10,
    backgroundColor: 'green',
  },

});

export default PlaylistTile;
