import React, { useEffect, useState } from 'react';
import { View, Text, Image, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import axios from 'axios';

const ProfileScreen = () => {
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    fetchRecentSessions();
  }, []);

  const fetchRecentSessions = async () => {
    try {
      const response = await axios.get('https://api.music.apple.com/v1/me/recently-played', {
        headers: {
          Authorization: `Bearer YOUR_DEVELOPER_TOKEN`,  // Use a valid Apple Music API token
        },
      });

      setSessions(response.data.data);
    } catch (error) {
      console.error('Error fetching sessions:', error);
    }
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

      {/* Recent Sessions */}
      <Text style={styles.sectionTitle}>Recent Sessions</Text>
      <FlatList
        data={sessions}
        renderItem={renderSession}
        keyExtractor={(item) => item.id}
      />

      {/* New Search Button */}
      <TouchableOpacity style={styles.searchButton}>
        <Text style={styles.searchButtonText}>Create New Search</Text>
      </TouchableOpacity>
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#C49A6C',
    alignItems: 'center',
    paddingTop: 50,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
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
  },
  searchButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default ProfileScreen;
