import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import MusicTile from './music_tile';

const SongCard = ({ song }) => {
    return (
        <View style={songCardStyles.shadowContainer}>
            <View style={songCardStyles.container}>
                <MusicTile
                    title={song.title}
                    artist={song.artist}
                    albumCover={song.albumCover}
                />
                <View style={songCardStyles.actions}>
                    <TouchableOpacity style={[songCardStyles.button, songCardStyles.dislike]}>
                        <Text style={songCardStyles.buttonText}>DISLIKE [-]</Text>
                    </TouchableOpacity>
                    <View style={songCardStyles.dots}>
                        <Text style={songCardStyles.dot}>•</Text>
                        <Text style={songCardStyles.dot}>•</Text>
                        <Text style={songCardStyles.dot}>•</Text>
                    </View>
                    <TouchableOpacity style={[songCardStyles.button, songCardStyles.playlist]}>
                        <Text style={songCardStyles.buttonText}>PLAYLISTS [→]</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

const songCardStyles = StyleSheet.create({
    shadowContainer: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    container: {
        alignItems: 'center',
        padding: 15,
        backgroundColor: '#D7C081', 
        borderRadius: 20, 
        margin: 10,
        width: '393px', 
        height: '852px', 
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
});

export default SongCard;
