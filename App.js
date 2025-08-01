import React, { useEffect, useState } from 'react';
import { View, StatusBar } from 'react-native';
import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import FlashMessage from 'react-native-flash-message';

import AppContainer from './src/routes/routes';
import { colors } from './src/utils/colors';
import { SafeAreaView } from 'react-native-safe-area-context';

SplashScreen.preventAutoHideAsync(); // Don't hide splash until fonts load

const loadFonts = async () => {
  await Font.loadAsync({
    'TrajanPro-Bold': require('./src/assets/font/TrajanPro-Bold.otf'),
    'TrajanPro-Normal': require('./src/assets/font/TrajanPro-Regular.ttf'),
  });
};

export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        await loadFonts();
      } catch (e) {
        console.warn('Font loading error:', e);
      } finally {
        setFontsLoaded(true);
        SplashScreen.hideAsync(); // Hide splash once fonts are ready
      }
    }
    prepare();
  }, []);

  if (!fontsLoaded) {
    return null; // Don't render anything until fonts are loaded
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={colors.headerbackground}
      />
      <AppContainer />
      <FlashMessage position="top" />
    </SafeAreaView>
  );
}
