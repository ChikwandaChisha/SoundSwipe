import React, {useState} from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Pressable, Icon } from 'react-native';
import { CheckBox } from '@rneui/themed';
import { CheckCircleFilled } from '@ant-design/icons';
import { ScrollView } from 'react-native-gesture-handler';
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
  
  const onAddSong = () => {
    const finalPlaylists = [];
    Object.keys(addedPlaylists).forEach((key) => {
      if (addedPlaylists[key] === true) {
        finalPlaylists.push(key);
      }
    });
    addSong(finalPlaylists);
  }
  
  const PlaylistItem = ({name, cover, togglePlaylist}) => {
    const checked = Boolean(addedPlaylists[name]);
    const toggleCheckbox = () => {
      togglePlaylist(name);
    }
    console.log(cover);
    
    return (
      <View style={styles.playlistContainer}>
        <Image style={styles.playlistCover} source={{uri:cover}} />
        <Text style={styles.playlistTitle} numberOfLines={1} ellipsizeMode="tail">{name}</Text>
        <Pressable >
          <CheckBox
          style={styles.playlistAdd}
          checked={checked}
          checkedIcon="check-circle"
          uncheckedIcon="plus-circle"
          uncheckedColor='#1C3546'
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
          
          <Image source={{ uri:cover }} style={styles.songCover} />
          <View style={styles.songText}>
            <Text style={styles.songTitle} numberOfLines={1} ellipsizeMode="tail">{title}</Text>
            <Text style={styles.songArtist} numberOfLines={1} ellipsizeMode="tail">{artist}</Text>
           </View>
        </View>
        <View style={styles.addSong}>
          <Text style={styles.title}>Select Playlists</Text>
          <ScrollView style={styles.playlistList}>
          {playlists.map((playlist, index)=> (
            <PlaylistItem
            key={playlist.foundId}
            cover={playlist.artworkUrl}
            name={playlist.foundName}
            togglePlaylist={togglePlaylist}
            />
          ))}
          </ScrollView>
        </View>
        <TouchableOpacity style={styles.addButton} onPress={onAddSong}>
          <Text style={styles.buttonText}>Add Song</Text>
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
    width: 330,
    height: 600,
    borderRadius: 20,
    backgroundColor: '#fff',
  },
  currentSong: {
    width: 260,
    height: 100,
    borderRadius: 10,
    backgroundColor: 'white',
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    columnGap: 10,
    boxShadow: '-4px 6px 25px -7px #1C3546',
  },
  songCover: {
    width: 60,
    height: 60,
    borderRadius: 3,
  },
  songText: {
    fontSize: 10,
    rowGap: 3,
    width: '70%',
  },
  songTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1C3546',
  },
  songArtist: {
    fontSize: 15,
    color: '#1C3546',
  },
  addSong: {
    width: 250,
    height: 375,
    borderRadius: 10,
    backgroundColor: 'white',
    padding: 10,
    alignItems: 'center',
    rowGap: 15,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1C3546',
  },
  playlistList: {
    width: 250,
    rowGap: 10,
    // backgroundColor: 'red',
  },
  playlistContainer: {
    // width: 220,
    // marginLeft: 10,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    columnGap: 10,
    marginVertical: 8,
    padding: 5,
    paddingRight: 0,
    borderRadius: 5,
  },
  playlistCover: {
    width: 30,
    height: 30,
    borderRadius: 2,
  },
  playlistTitle: {
    width: 115,
    textAlign: 'left',
    fontSize: 18,
    color: '#1C3546'
  },
  addButton: {
    // backgroundColor: '#f7c697',
    padding: 8,
    borderRadius: 3,
    boxShadow: '-4px 6px 25px -6px #1C3546',
  },
  buttonText: {
    fontSize: 15,
    color: '#1C3546'
  }

});

export default PlaylistTile;
