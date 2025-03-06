// components/MusicKitProvider.js
import React, { createContext, useEffect, useState, useRef } from 'react';
import { WebView } from 'react-native-webview';
import { View } from 'react-native';
import { getAppleMusicDevToken, storeAppleMusicToken } from '../services/api'; 

// export a context so any screen can call "authorize"
export const MusicKitContext = createContext(null);

export default function MusicKitProvider({ children }) {
  const webviewRef = useRef(null);
  const [isConfigured, setIsConfigured] = useState(false);

  // store the userToken if user authorizes
  const [appleMusicUserToken, setAppleMusicUserToken] = useState(null);

  useEffect(() => {
    console.log("MusicKitProvider mounted. Initiating MusicKit in WebView..."); // debug
    initMusicKitInWebView();
  }, []);

  async function initMusicKitInWebView() {
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
    console.log("authorizeMusicKit called. Telling WebView to authorize user...");
    try {
      // This sends a message that the WebView will interpret to call MusicKit JS
      webviewRef.current?.postMessage(JSON.stringify({ type: 'authorize' }));
    } catch (err) {
      console.error("Error in authorizeMusicKit:", err);
    }
  }

  // messages coming BACK from WebView
  function handleWebViewMessage(event) {
    console.log("handleWebViewMessage => raw data:", event.nativeEvent.data); // debug
    try {
      const data = JSON.parse(event.nativeEvent.data);
      console.log("Parsed from WebView:", data);
      
      if (data.type === 'configured') {
        console.log('MusicKit is now configured inside WebView');
        setIsConfigured(true);
      } else if (data.type === 'authorized') {
        console.log('Got Apple Music user token:', data.userToken);
        setAppleMusicUserToken(data.userToken);
        storeAppleMusicToken(userDocId, data.userToken); // to firestore
      } else if (data.type === 'error') {
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
