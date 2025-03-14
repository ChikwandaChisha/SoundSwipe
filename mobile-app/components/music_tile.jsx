// components/music_tile.jsx
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, TouchableWithoutFeedback, Pressable } from 'react-native';
import FlipCard from 'react-native-flip-card'; 
import { Audio } from 'expo-av';
import AudioWave from './Waveform';

import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";


const MusicTile = ({
    title,
    artist,
    albumCover,
    backgroundColor,
    animatedStyle,
    trackUrl,
    onPlayStateChange,
    description,
    album,
}) => {
    
  const [isPlaying, setIsPlaying] = useState(false);
  const [sound, setSound] = useState(null);

  const rotate = useSharedValue(0);
    const frontAnimations = useAnimatedStyle(()=>{
      const rotateVal = interpolate(rotate.value, [0,1], [0,180])
      return {
        transform: [
          {
            rotateY : withTiming(`${rotateVal}deg`,{duration: 1000}),
          }
        ],
        pointerEvents: rotate.value === 0 ? 'auto' : 'none',
      }
    })
    const backAnimations = useAnimatedStyle(()=>{
      const rotateVal = interpolate(rotate.value, [0,1], [180,0])
      return {
        transform: [
          {
            rotateY : withTiming(`${rotateVal}deg`,{duration: 1000}),
          }
        ],
        pointerEvents: rotate.value === 1 ? 'auto' : 'none',
      }
    })
    const handleFlip = () => {
      console.log(rotate.value);
      rotate.value = rotate.value ? 0 : 1;
      };

  // auto play-pause every time new track is loaded
  useEffect(() => {
    let newSound = null;
    setSound(null);
    const loadAudio = async () => {
      // if there is an old sound loaded unload it first
      if (sound) {
        await sound.unloadAsync();
        setSound(null);
      }
      if (trackUrl) {
        try {
          const { sound: createdSound } = await Audio.Sound.createAsync(
            { uri: trackUrl },
            { shouldPlay: true } // auto-start playback
          );
          newSound = createdSound;
          setSound(createdSound);
          setIsPlaying(true);
          onPlayStateChange?.(true);
        } catch (err) {
          console.warn('Error creating audio', err);
        }
      }
    };
    loadAudio();

    // cleanup component unmounts or trackUrl changes again
    return () => {
      if (newSound) {
        newSound.unloadAsync();
      }
      onPlayStateChange?.(false);
    };
  }, [trackUrl]);

  // handlePlayPause toggles the existing loaded sound:
  const handlePlayPause = async () => {
    if (!sound) return;
    const newPlayState = !isPlaying;
    if (newPlayState) {
      await sound.playAsync();
    } else {
      await sound.pauseAsync();
    }
    setIsPlaying(newPlayState);
    onPlayStateChange?.(newPlayState);
  };
    

  return (
    <Animated.View style={[styles.container, animatedStyle,]}>
      <View style={styles.cardContainer}>

        {/* Front side */}
        <Animated.View
          style={[styles.card, frontAnimations, backgroundColor]}
        >
          <View style={[styles.face]}>
            <Image source={{ uri: albumCover }} style={styles.image} />
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.artist}>{artist}</Text>

            {/* Play/Pause button */}
            <Pressable style={styles.playButton} onPress={handlePlayPause}>
              <Text style={styles.playText}>
                {isPlaying ? '❚❚' : '▶'}
              </Text>
            </Pressable>

            {/* Minimal wave visualization */}
            <AudioWave isPlaying={isPlaying} color={'#1C3546'} />

            {/* Flip button */}
            <TouchableOpacity style={styles.flipButton} onPress={handleFlip}>
              <Text style={styles.flipText}>…</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Back side */}
        <Animated.View style={[styles.card, backAnimations, backgroundColor]}>
          <View style={[styles.face, styles.back]}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>Originally featured on</Text>
          <Text style={styles.album}>{album}</Text>
          <View style={styles.artistCard}>
            <Text style={styles.subtitle2}>About the Artist</Text>
            <Text style={styles.backArtist}>{artist}</Text>
            <Text style={styles.desc}>{description}</Text>

          </View>
            <TouchableOpacity style={styles.flipButton} onPress={handleFlip}>
              <Text style={styles.flipText}>…</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>

      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: { alignItems: 'center' },
  cardContainer: {
    width: 330,
    height: 600,
    position: 'relative',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
    position: 'absolute',
    backfaceVisibility: 'hidden',
    // backgroundColor: (255, 255, 255, 0),
    // opacity: 0,
  },
  face: {
    flex: 1,
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
  },
  image: {
    width: 250,
    height: 250,
    borderRadius: 15,
    marginBottom: 15,
    marginTop: 20,
  },
  title: {
    fontSize: 27,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20,
    color: '#1C3546',
  },
  artist: {
    fontSize: 20,
    color: '#555',
    marginBottom: 0,
    textAlign: 'center',
    marginTop: 15,
  },
  playButton: {
    borderRadius: 50,
    width: 50,
    height: 50,
    marginBottom: 0,
    marginTop: 30,
    justifyContent: 'center',
    alignItems: 'center',
    color: '#1C3546',
  },
  playText: {
    fontSize: 36,
    alignSelf: 'center',
    marginTop: 0,
    color: '#1C3546',
  },
  flipButton: {
    position: 'absolute',
    borderRadius: 50,
    width: 50,
    height: 50,
    bottom: 10,
    marginTop: 0,
    justifyContent: 'center',
    alignItems: 'center',
    color: '#1C3546',
  },
  flipText: {
    fontSize: 30,
    alignSelf: 'center',
    marginTop: 0,
    color: '#1C3546',
  },
  playTextBack: {
    fontSize: 40,
    alignSelf: 'center',
    marginTop: 20,
    justifyContent: 'flex-end',
  },
  back: {
    // backgroundColor: '#D0D7E1',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    rowGap: 10,
    padding: 20,
    textAlign: 'center'
  },
  album: {
    fontSize: 25,
    margin: 10,
    color: '#1C3546',
    textAlign: 'center',
  },
  backArtist: {
    textAlign: 'center',
    color: '#C9E7E0',
    fontSize: 20,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 15,
    color: '#1C3546',
    textAlign: 'center',
    margin: 5,
  },
  subtitle2: {
    fontSize: 24,
    color: '#FFF',
    textAlign: 'center'
  },
  desc: {
    fontSize: 22,
    color: '#FFF',
    textAlign: 'center'
  },
  artistCard: {
    backgroundColor: '#1C3546',
    width: 250,
    height: 330,
    borderRadius: 30,
    padding: 20,
    rowGap: 25,
    justifyContent: 'flex-start',
  }
});

export default MusicTile;