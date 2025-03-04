import React, {useState} from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Pressable, Icon } from 'react-native';
import { CheckBox } from '@rneui/themed';
import { CheckCircleFilled } from '@ant-design/icons';
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
    addSong,
}) => {

  const [addedPlaylists, setAddedPlaylists] = useState({});

  const togglePlaylist = (playlist) => {
    setAddedPlaylists(prevState => {
    const isSelected = Boolean(prevState[playlist]);
    // Toggle the selected value
    return { ...prevState, [playlist]: !isSelected };
    });
    };
  
  const PlaylistItem = ({playlist, cover, togglePlaylist}) => {
    const checked = Boolean(addedPlaylists[playlist]);
    const toggleCheckbox = () => {
      togglePlaylist(playlist);
    }
    
    return (
      <View style={styles.playlistContainer}>
        <Image style={styles.playlistCover} source={{uri:cover}} />
        <Text style={styles.playlistTitle} numberOfLines={1} ellipsizeMode="tail">{playlist}</Text>
        <Pressable >
          <CheckBox
          style={styles.playlistAdd}
          checked={checked}
          checkedIcon="check-circle"
          uncheckedIcon="plus-circle"
          uncheckedColor='#6d7570'
          checkedColor='#33de60'
          onPress={toggleCheckbox}
          size={23}
          center={true}
          containerStyle={{ backgroundColor: 'transparent', margin: 0, padding: 0 }}
          />
        </Pressable>
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
          <Text style={styles.title}>Select Playlists</Text>
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
        <TouchableOpacity style={styles.addButton}>
          <Text style={styles.buttonText} onPress={console.log(addedPlaylists)}>Add Song</Text>
        </TouchableOpacity>
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
    width: 225,
    height: 100,
    borderRadius: 10,
    backgroundColor: 'white',
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    columnGap: 15,
  },
  songCover: {
    width: 60,
    height: 60,
    borderRadius: 3,
  },
  songText: {
    fontSize: 10,
    rowGap: 3,
  },
  songTitle: {
    fontSize: 18,
  },
  songArtist: {
    fontSize: 15,
  },
  addSong: {
    width: 250,
    height: 300,
    borderRadius: 10,
    backgroundColor: 'white',
    padding: 25,
    alignItems: 'center',
    rowGap: 20,
  },
  title: {
    fontSize: 20,
  },
  playlistList: {
    width: 250,
    rowGap: 10,
  },
  playlistContainer: {
    // width: 220,
    // marginLeft: 10,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    columnGap: 10,
    padding: 5,
    paddingRight: 0,
    backgroundColor: 'lightPink',
    borderRadius: 5,
  },
  playlistCover: {
    width: 30,
    height: 30,
    borderRadius: 2,
  },
  playlistTitle: {
    width: 100,
    textAlign: 'left',
    fontSize: 18,
  },
  addButton: {
    backgroundColor: '#f7c697',
    padding: 8,
    borderRadius: 3,
  }

});

export default PlaylistTile;
