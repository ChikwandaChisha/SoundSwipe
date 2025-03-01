import React, {useState} from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, TouchableWithoutFeedback, Pressable } from 'react-native';
import FlipCard from 'react-native-flip-card'

const MusicTile = ({
    title,
    artist,
    albumCover,
}) => {
    const [isFlipped, setIsFlipped] = useState(false);

    return (
    <View style={styles.container}>
      <FlipCard 
        style={styles.card}
        friction={6}
        perspective={1000}
        flipHorizontal={true}
        flipVertical={false}
        flip={isFlipped}
        clickable={false}
        onFlipEnd={(isFlipEnd)=>{console.log('isFlipEnd', isFlipEnd)}}
        >
    <View style={[styles.face, styles.front]}>
      <Image source={{uri:albumCover}} style={styles.image} />
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.artist}>{artist}</Text>
      <Pressable style={styles.playButton}>
        <Text style={styles.playText}>▶</Text>
      </Pressable>
      <TouchableOpacity  style={styles.playButton} onPress={()=>setIsFlipped(!isFlipped)}>
        <Text style={styles.playText}>...</Text>
      </TouchableOpacity>
    </View>
    <View style={[styles.face, styles.back]}>
      <Text>The Back</Text>
      <TouchableOpacity  style={styles.playButton} onPress={()=>setIsFlipped(!isFlipped)}>
        <Text style={styles.playText}>...</Text>
      </TouchableOpacity>
    </View>
    </FlipCard>
  </View>

    );

};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
    },
    card: {
        width: 300,
        height: 500,
        borderRadius: 20,
        margin: 10,
        elevation: 5,
    },
    face: {
        width: '100%',
        height: '100%',
        borderRadius: 20,
        padding: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    front: {
        backgroundColor: '#d68e47',
    },
    back: {
        backgroundColor: 'grey',
        width: 300,
        height: 500,
        
    },
    image: {
        width: 250,
        height: 250,
        borderRadius: 15,
        marginBottom: 15,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    artist: {
        fontSize: 16,
        color: '#555',
        marginBottom: 10,
        textAlign: 'center',
    },
    playButton: {
        backgroundColor: '#ffffff',
        borderRadius: 50,
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },
    playText: {
        fontSize: 25,
        alignSelf: "center",
    },
});



export default MusicTile;
