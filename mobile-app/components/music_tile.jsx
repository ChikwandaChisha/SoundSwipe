import React, {useState} from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, TouchableWithoutFeedback, Pressable } from 'react-native';
import FlipCard from 'react-native-flip-card'
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
    animatedStyle
}) => {
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

    return (
      <Animated.View style={[styles.container]}>
      <View style={styles.cardContainer}>
      {/* <FlipCard 
        style={styles.card}
        friction={6}
        perspective={1000}
        flipHorizontal={true}
        flipVertical={false}
        flip={isFlipped}
        clickable={false}
        onFlipEnd={(isFlipEnd)=>{console.log('isFlipEnd', isFlipEnd)}}
        > */}
      <Animated.View style={[styles.card, backgroundColor, animatedStyle, frontAnimations]}>
        <View style={[styles.face]}>
          <Image source={{uri:albumCover}} style={styles.image} />
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.artist}>{artist}</Text>
          <Pressable style={styles.playButton}>
            <Text style={styles.playText}>▶</Text>
          </Pressable>
          <TouchableOpacity  style={styles.playButton} onPress={handleFlip}>
            <Text style={styles.playText}>...</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
      <Animated.View style={[styles.card, styles.back, backAnimations]}>
        <View style={[styles.face]}>
          <Text>The Back</Text>
          <TouchableOpacity  style={styles.playButton} onPress={handleFlip}>
            <Text style={styles.playTextBack}>...</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    {/* </FlipCard> */}
    </View>
    </Animated.View>

    );

};

const styles = StyleSheet.create({
  container: {
        alignItems: 'center',
    },
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
      justifyContent: 'start',
      alignItems: 'center',
    },
  front: {
      backgroundColor: '#d68e47',
    },
  back: {
      backgroundColor: 'grey',
    },
  image: {
        width: 250,
        height: 250,
        borderRadius: 15,
        marginBottom: 15,
        marginTop: 20
    },
  title: {
        fontSize: 22,
        fontWeight: 'bold',
        textAlign: 'center',
        marginTop: 20
    },
  artist: {
        fontSize: 16,
        color: '#555',
        marginBottom: 10,
        textAlign: 'center',
        marginTop: 15
    },
  playButton: {
        borderRadius: 50,
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
        marginTop: 30
    },
  playText: {
        fontSize: 40,
        alignSelf: "center",
        marginTop: 20
    },
    playTextBack: {
      fontSize: 40,
      alignSelf: "center",
      marginTop: 900,
      justifyContent: 'flex-end'
  },
});

export default MusicTile;
