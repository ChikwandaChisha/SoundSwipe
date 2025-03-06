// screens/profile_screen.jsx
import React, { useEffect, useState, useContext } from 'react';
import { View, Text, Image, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { getUserDocById, storeAppleMusicToken, fetchLibrary } from '../services/api';
import { MusicKitContext } from '../components/MusicKitProvider';
import axios from 'axios';

const ProfileScreen = ({ navigation, route }) => {
  const [sessions, setSessions] = useState(null);
  const [userDoc, setUserDoc] = useState(null);
  const [appleMusicLibrary, setAppleMusicLibrary] = useState(null); // Store Apple Music albums


  const { docId } = route.params || {};
  const { authorizeMusicKit, appleMusicUserToken } = useContext(MusicKitContext);

  const goToCreateSearch = () => {
    navigation.replace("CreateSearchScreen");
  };

  // Apple Music Token Handling -----------------------------------------------
  useEffect(() => {
    (async () => {
      if (docId) {
        const fetchedDoc = await getUserDocById(docId); // fetch user doc
        setUserDoc(fetchedDoc);
      }
    })();
  }, [docId]);

  useEffect(() => {
    console.log("Checking for Apple Music token:");
    if (docId && appleMusicUserToken) {
      storeAppleMusicToken(docId, appleMusicUserToken) // store appleMusicUserToken if it changes / docId is known
        .then(() => console.log("Stored Apple Music token in Firestore"))
        .catch(err => console.error("Failed to store Apple Music token:", err));
    }
  }, [appleMusicUserToken]);

  // TESTING: Fetch Apple Music Library when profile loads
  useEffect(() => {
    const loadAppleMusicLibrary = async () => {
      if (!appleMusicUserToken) return;
      console.log("Fetching Apple Music Library...");
      const data = await fetchLibrary(docId, appleMusicUserToken);
      setAppleMusicLibrary(data?.data || []);
    };

    loadAppleMusicLibrary();
  }, [appleMusicUserToken]);

  const handleConnectAppleMusic = async () => {
    try {
      console.log("Authorizing Apple Music...");
      authorizeMusicKit();
      // token is set inside MusicKitContext’s handleWebViewMessage
      // wait for that to update appleMusicUserToken

    } catch (err) {
      console.error("Error authorizing Apple Music:", err);
    }
  };

  const hasAppleMusic = userDoc?.appleMusic?.userToken; // boolean if userDoc has appleMusic token

  // Session Handling ---------------------------------------------------------
  useEffect(() => {
    fetchRecentSessions();
  }, []);

  // Commented out to avoid errors
  const fetchRecentSessions = async () => {
  //   try {
  //     const response = await axios.get('https://api.music.apple.com/v1/me/recently-played', {
  //       headers: {
  //         Authorization: `Bearer YOUR_DEVELOPER_TOKEN`,  // Use a valid Apple Music API token
  //       },
  //     });

  //     setSessions(response.data.data);
  //   } catch (error) {
  //     console.error('Error fetching sessions:', error);
  //   }
  };

  // Render Apple Music Album
  const renderAlbum = ({ item }) => {
    if (!item.attributes?.artwork?.url) {
      // fallback or skip
      return <Text>No artwork</Text>;
    }

    //console.log("Album item url:", item ? item.attributes.artwork.url : "no item");

    const finalUrl = item.attributes.artwork.url
      .replace("{w}", "100")
      .replace("{h}", "100");

    console.log("Album item finalUrl:", finalUrl);

    return (
      <View style={styles.albumContainer}>
        <Image
          source={{ uri: finalUrl }}
          style={styles.albumArtwork}
          onError={e => {
            console.log("Image failed to load", e.nativeEvent.error);
          }}
        />
        <View style={styles.albumInfo}>
          <Text style={styles.albumTitle}>{item.attributes.name}</Text>
          <Text style={styles.albumArtist}>{item.attributes.artistName}</Text>
        </View>
      </View>
    );
  };


  const renderSession = ({ item }) => (
    <View style={styles.sessionContainer}>
      <Image source={{ uri: item.attributes.artwork.url.replace('{w}', '50').replace('{h}', '50') }} style={styles.artwork} />
      <Text style={styles.sessionTitle}>{item.attributes.name}</Text>
      <TouchableOpacity style={styles.playButton}>
        <Text>▶️</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Profile Section */}
      <Text style={styles.title}>SOUNDSWIPE</Text>
      <View style={styles.profileSection}>
        <View style={styles.profilePic} />
        <Text style={styles.username}>USERNAME</Text>
      </View>

      {/* Apple Music Connection Status */}
      <View style={styles.appleMusicContainer}>
        {!hasAppleMusic ? (
          <TouchableOpacity style={styles.appleMusicButton} onPress={handleConnectAppleMusic}>
            <Text style={styles.appleMusicButtonText}>Connect Apple Music</Text>
          </TouchableOpacity>
        ) : (
          <Text style={styles.appleMusicStatus}>✅ Apple Music Connected</Text>
        )}
      </View>

      {/* Apple Music Library */}
      <Text style={styles.sectionTitle}>Your Apple Music Library</Text>
      {appleMusicLibrary ? (
        <FlatList data={appleMusicLibrary} renderItem={renderAlbum} keyExtractor={(item) => item.id} />
      ) : (
        <Text>Loading your music...</Text>
      )}

      {/* Recent Sessions */}
      <Text style={styles.sectionTitle}>Recent Sessions</Text>
      <FlatList
        data={sessions}
        renderItem={renderSession}
        keyExtractor={(item) => item.id}
      />

      {/* New Search Button */}
      <TouchableOpacity style={styles.searchButton} onPress={goToCreateSearch}>
        <Text style={styles.searchButtonText}>Create New Search</Text>
      </TouchableOpacity>
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EA9A4A',
    alignItems: 'center',
    paddingTop: 50,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  profilePic: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#000',
  },
  username: {
    marginLeft: 10,
    fontSize: 18,
    fontWeight: 'bold',
  },
  /* Apple Music Styles */
  appleMusicContainer: {
    alignItems: 'center',
    marginVertical: 5,
  },
  appleMusicButton: {
    backgroundColor: '#D97742',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginTop: 10,
  },
  appleMusicButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  appleMusicStatus: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  sessionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 10,
    marginBottom: 10,
    width: '90%',
  },
  artwork: {
    width: 40,
    height: 40,
    borderRadius: 5,
  },
  sessionTitle: {
    flex: 1,
    marginLeft: 10,
  },
  playButton: {
    padding: 5,
  },
  searchButton: {
    backgroundColor: '#D97742',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginTop: 20,
    marginBottom: 40
  },
  searchButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  albumContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
  },
  albumInfo: {
    flex: 1,
    marginLeft: 10,
  },
  albumTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  albumArtist: {
    fontSize: 14,
    color: '#666',
  },
  albumArtwork: {
    width: 100,
    height: 100,
    borderRadius: 5,
  },

});

export default ProfileScreen;
