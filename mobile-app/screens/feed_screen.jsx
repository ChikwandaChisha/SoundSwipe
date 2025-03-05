import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Dimensions } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import SongCard from '../components/song_card';

const SCREEN_HEIGHT = Dimensions.get('window').height;

export default function FeedScreen() {
  const songs = [
    { id: '1', title: "PassionFruit", artist: "Drake", albumCover: "https://i1.sndcdn.com/artworks-CCbZ4mG3Juom-0-t500x500.jpg" },
    { id: '2', title: "Like a Rolling Stone", artist: "Bob Dylan", albumCover: "https://cdn-images.dzcdn.net/images/cover/96193f14db0501c035bd43ab93960317/500x500-000000-80-0-0.jpg" },
    { id: '3', title: "Bohemian Rhapsody", artist: "Queen", albumCover: "https://dbzbooks.com/cdn/shop/files/81f5a2e2622469a37d468121f86e69f51ef91178560295055e205217a65160d5.jpg?v=1723056046&width=493" },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const translateY = useSharedValue(0);
  const opacity = useSharedValue(1);

  const handleSkip = () => {
    if (currentIndex < songs.length - 1) {
      // animate the current song up and fade out
      translateY.value = withSpring(-SCREEN_HEIGHT / 2, {}, () => {
        setCurrentIndex((prevIndex) => prevIndex + 1); // move to next song
        translateY.value = 0; // reset position for next song
        opacity.value = 1; // reset opacity
      });

      opacity.value = withSpring(0);
    }
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.cardContainer}>
        <SongCard 
          songs={songs} 
          currentIndex={currentIndex} 
          onSkip={handleSkip} 
          animatedStyle={animatedStyle} 
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#121212',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardContainer: {
    width: 393,
    height: 650,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
});   
