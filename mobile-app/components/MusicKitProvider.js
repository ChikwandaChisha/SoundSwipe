// components/MusicKitProvider.js
import React, { createContext, useEffect, useState, useRef } from 'react';
import { WebView } from 'react-native-webview';
import { View } from 'react-native';
import { getAppleMusicDevToken, storeAppleMusicToken } from '../services/api'; 

const HARDCODED_MUSIC_USER_TOKEN = "AhiU39Ubv3E0r2Bbdkaw+MVrFENQGH3pGhaKtpg4nBbp4IunVIRMzqFoR8qHNQwJgnMP1bpxkOlV3iseIutarZOxPJBNPUEZIRXS9nz3znyYwd4Y3X4HeSvqzWr39sElh3Uo7tYBjaDhOkz2w2s1iX19zzkrA6Uw8LejmIbRQg2Y6WZ5DtIBsdH4ALN74NQNh5O5IQRkHi4BMWWEMXVr/TBx+m61G8YAcDOwkGd45IVatxhCTw==";  // Replace this with your actual MUT

// export a context so any screen can call "authorize"
export const MusicKitContext = createContext(null);

export default function MusicKitProvider({ children }) {
  const webviewRef = useRef(null);
  const [isConfigured, setIsConfigured] = useState(false);

  // store the userToken if user authorizes
  const [appleMusicUserToken, setAppleMusicUserToken] = useState(null);
  const [bridgeReady, setBridgeReady] = useState(false);

  useEffect(() => {
    console.log("MusicKitProvider mounted. Initiating MusicKit in WebView..."); // debug
    initMusicKitInWebView();
  }, []);

  async function initMusicKitInWebView() {
     if (!bridgeReady) {
      console.warn('WebView bridge not ready. Waiting...');
      return;
    }

    console.log("initMusicKitInWebView called. Fetching Apple dev token...");
    try {
      const { token } = await getAppleMusicDevToken(); 
      console.log("Received dev token from backend:", token);
      // post message to WebView telling it to configure with devToken
      // wait small delay so WebView is ready
      setTimeout(() => {
        console.log("Sending 'configure' message to WebView with devToken...");
        webviewRef.current?.postMessage(JSON.stringify({
          type: 'configure',
          devToken: token
        }));
      }, 500);
    } catch (error) {
      console.error('initMusicKitInWebView error:', error);
    }
  }

  // expose an authorize function to screens
  async function authorizeMusicKit() {
    console.log("Skipping user authorization. Using hardcoded MUT.");
    setAppleMusicUserToken(HARDCODED_MUSIC_USER_TOKEN);
  }

  // messages coming BACK from WebView
  function handleWebViewMessage(event) {
    console.log("handleWebViewMessage => raw data:", event.nativeEvent.data); // debug
    try {
      const data = JSON.parse(event.nativeEvent.data);
      console.log("Parsed from WebView:", data);

      if (data.type === 'bridge-ready') {
        console.log('WebView bridge is ready.');
        setBridgeReady(true);
        initMusicKitInWebView();
      }
      
      if (data.type === 'configured') {
        console.log('MusicKit is now configured inside WebView');
        setIsConfigured(true);
      } 
      
      if (data.type === 'authorized') {
        console.log('User authorized. Got MUT:', data.userToken);
        setAppleMusicUserToken(data.userToken);
        storeAppleMusicToken(userDocId, data.userToken); // to firestore
      } 
      
      if (data.type === 'error') {
        console.error('MusicKit error in WebView:', data.error);
      }

    } catch (err) {
      console.error('Error parsing WebView message:', err);
    }
  }

  return (
    <MusicKitContext.Provider value={{ isConfigured, appleMusicUserToken, authorizeMusicKit }}>
      <View style={{ flex: 1 }}>
        {/* Absolutely positioned hidden WebView */}
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: 0,
            height: 0
          }}
        >
          <WebView
            ref={webviewRef}
            source={require('../assets/musickit-bridge.html')}
            onMessage={handleWebViewMessage}
            style={{ width: 0, height: 0 }}
          />
        </View>

        {/* Render children (the rest of the app) */}
        {children}
      </View>
    </MusicKitContext.Provider>
  );
}
