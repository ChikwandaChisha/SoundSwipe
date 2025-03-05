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
    // on mount fetch Apple dev token & configure MusicKit in WebView
    initMusicKitInWebView();
  }, []);

  async function initMusicKitInWebView() {
    try {
      const { token } = await getAppleMusicDevToken(); 
      // post message to WebView telling it to configure with devToken
      // wait small delay so WebView is ready
      setTimeout(() => {
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
    // tell WebView to call "MusicKit.getInstance().authorize()"
    webviewRef.current?.postMessage(JSON.stringify({ type: 'authorize' }));
  }

  // messages coming BACK from WebView
  function handleWebViewMessage(event) {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.type === 'configured') {
        console.log('MusicKit is now configured inside WebView');
        setIsConfigured(true);
      } else if (data.type === 'authorized') {
        console.log('Got Apple Music user token:', data.userToken);
        setAppleMusicUserToken(data.userToken);
        storeAppleMusicToken(data.userToken); // to firestore
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
