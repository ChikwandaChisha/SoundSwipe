import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, runOnJS } from 'react-native-reanimated';
import MusicTile from './music_tile';

const SWIPE_THRESHOLD = -150;

const SongCard = ({ songs, currentIndex, onSkip }) => {
    const translateY = useSharedValue(0);
    const opacity = useSharedValue(1);
    const nextOpacity = useSharedValue(0); // hidden

    const handleSkip = () => {
        if (currentIndex < songs.length - 1) {
            translateY.value = withSpring(-100, {}, () => {
                runOnJS(onSkip)(); // Move to next song
                translateY.value = 0;
                opacity.value = 1;
                nextOpacity.value = 0; // Reset opacity for the next transition
            });

            opacity.value = withSpring(0); // Fade out current song
            nextOpacity.value = withSpring(1); // Fade in next song
        }
    };

    const swipeUpGesture = Gesture.Pan()
        .onUpdate((event) => {
            translateY.value = event.translationY;
        })
        .onEnd((event) => {
            if (event.translationY < SWIPE_THRESHOLD) {
                runOnJS(handleSkip)();
            }
            translateY.value = withSpring(0);
        });

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: translateY.value }],
        opacity: opacity.value,
    }));

    const nextAnimatedStyle = useAnimatedStyle(() => ({
        opacity: nextOpacity.value,
    }));

    return (
        <View style={styles.container}>

            {/* next song (behind, increasing opacity) */}
            {songs[currentIndex + 1] && (
                <Animated.View style={[styles.nextSong, nextAnimatedStyle]}>
                    <MusicTile
                        title={songs[currentIndex + 1].title}
                        artist={songs[currentIndex + 1].artist}
                        albumCover={songs[currentIndex + 1].albumCover}
                    />
                </Animated.View>
            )}

            {/* current song (on top, swiping up) */}
            <GestureDetector gesture={swipeUpGesture}>
                <Animated.View style={[animatedStyle]}>
                    <MusicTile
                        title={songs[currentIndex].title}
                        artist={songs[currentIndex].artist}
                        albumCover={songs[currentIndex].albumCover}
                    />
                </Animated.View>
            </GestureDetector>

            {/* fixed buttons (will add swip functionality to this) */}
            <View style={styles.actions}>
                <TouchableOpacity style={[styles.button, styles.dislike]}>
                    <Text style={styles.buttonText}>DISLIKE [-]</Text>
                </TouchableOpacity>
                <View style={styles.dots}>
                    <Text style={styles.dot}>•</Text>
                    <Text style={styles.dot}>•</Text>
                    <Text style={styles.dot}>•</Text>
                </View>
                <TouchableOpacity style={[styles.button, styles.playlist]}>
                    <Text style={styles.buttonText}>PLAYLISTS [→]</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        padding: 15,
        backgroundColor: '#D7C081',
        borderRadius: 20,
        margin: 10,
        width: 393,
        height: 650,
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        marginTop: 15,
        paddingHorizontal: 10,
    },
    button: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.2)',
        position: 'absolute',
    },
    dislike: {
        left: 10,
    },
    playlist: {
        right: 10,
    },
    buttonText: {
        color: 'black',
        fontSize: 14,
    },
    dots: {
        flexDirection: 'row',
        alignItems: 'center',
        position: 'absolute',
    },
    dot: {
        fontSize: 8,
        marginHorizontal: 5,
    },
    nextSong: {
        position: 'absolute',
        top: 0,
        opacity: 0, // hidden
    },
});

export default SongCard;
