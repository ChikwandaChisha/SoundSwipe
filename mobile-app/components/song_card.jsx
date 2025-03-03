import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text, SafeAreaView, StatusBar } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, runOnJS } from 'react-native-reanimated';
import MusicTile from './music_tile';

const SWIPE_THRESHOLD = -150;

const SongCard = ({ songs, currentIndex, onSkip }) => {
    const translateY = useSharedValue(0);
    const opacity = useSharedValue(1);
    const nextOpacity = useSharedValue(0);

    const handleSkip = () => {
        if (currentIndex < songs.length - 1) {
            translateY.value = withSpring(-100, {}, () => {
                runOnJS(onSkip)();
                translateY.value = 0;
                opacity.value = 1;
                nextOpacity.value = 0;
            });

            opacity.value = withSpring(0);
            nextOpacity.value = withSpring(1);
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
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="dark-content" backgroundColor="auto" />
            <View style={styles.container}>
                {songs[currentIndex + 1] && (
                    <Animated.View style={[styles.nextSong, nextAnimatedStyle]}>
                        <MusicTile
                            title={songs[currentIndex + 1].title}
                            artist={songs[currentIndex + 1].artist}
                            albumCover={songs[currentIndex + 1].albumCover}
                        />
                    </Animated.View>
                )}

                <GestureDetector gesture={swipeUpGesture}>
                    <Animated.View style={[styles.currentSong, animatedStyle]}>
                        <MusicTile
                            title={songs[currentIndex].title}
                            artist={songs[currentIndex].artist}
                            albumCover={songs[currentIndex].albumCover}
                        />
                    </Animated.View>
                </GestureDetector>

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
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#FF8000',
    },
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 15,
        backgroundColor: '#FF8000',
        borderRadius: 20,
        margin: 10,
    },
    currentSong: {
        width: '100%',
        aspectRatio: 1,
    },
    nextSong: {
        position: 'absolute',
        width: '100%',
        aspectRatio: 1,
        top: 15,
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        marginTop: 15,
        paddingHorizontal: 10,
    },
    button: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.2)',
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
    },
    dot: {
        fontSize: 24,
        marginHorizontal: 5,
    },
});

export default SongCard;
