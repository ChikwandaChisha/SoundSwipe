// components/music_tile.jsx
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, TouchableWithoutFeedback, Pressable } from 'react-native';
import FlipCard from 'react-native-flip-card'; 
import { Audio } from 'expo-av';

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
    };
  }, [trackUrl]);

  // handlePlayPause toggles the existing loaded sound:
  const handlePlayPause = async () => {
    if (!sound) return;
    if (!isPlaying) {
      await sound.playAsync();
    } else {
      await sound.pauseAsync();
    }
    setIsPlaying(!isPlaying);
  };
    

  return (
    <Animated.View style={[styles.container]}>
      <View style={styles.cardContainer}>

        {/* Front side */}
        <Animated.View
          style={[styles.card, backgroundColor, animatedStyle, frontAnimations]}
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

            {/* Flip button */}
            <TouchableOpacity style={styles.playButton} onPress={handleFlip}>
              <Text style={styles.playText}>…</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Back side */}
        <Animated.View style={[styles.card, styles.back, backAnimations]}>
          <View style={[styles.face]}>
            <Text style={styles.backText}>The Back</Text>
            <TouchableOpacity style={styles.playButton} onPress={handleFlip}>
              <Text style={styles.playTextBack}>…</Text>
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
  },
  face: {
    flex: 1,
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
  },
  back: {
    backgroundColor: 'grey',
  },
  backText: {
    fontSize: 22,
    color: '#FFF',
  },
  image: {
    width: 250,
    height: 250,
    borderRadius: 15,
    marginBottom: 15,
    marginTop: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20,
  },
  artist: {
    fontSize: 16,
    color: '#555',
    marginBottom: 10,
    textAlign: 'center',
    marginTop: 15,
  },
  playButton: {
    borderRadius: 50,
    width: 40,
    height: 40,
    marginBottom: 10,
    marginTop: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playText: {
    fontSize: 36,
    alignSelf: 'center',
    marginTop: 5,
  },
  playTextBack: {
    fontSize: 40,
    alignSelf: 'center',
    marginTop: 50,
    justifyContent: 'flex-end',
  },
});

export default MusicTile;