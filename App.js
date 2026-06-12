import { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppProvider } from './src/context/AppContext';
import ErrorBoundary from './src/components/ErrorBoundary';
import ConsentModal from './src/components/ConsentModal';

import WelcomeScreen from './src/screens/WelcomeScreen';
import GenderScreen from './src/screens/GenderScreen';
import UploadScreen from './src/screens/UploadScreen';
import AnalyzingBasicScreen from './src/screens/AnalyzingBasicScreen';
import BasicScreen from './src/screens/BasicScreen';
import PaywallScreen from './src/screens/PaywallScreen';
import AnalyzingBaseScreen from './src/screens/AnalyzingBaseScreen';
import BaseScreen from './src/screens/BaseScreen';
import TargetScreen from './src/screens/TargetScreen';
import AnalyzingTargetScreen from './src/screens/AnalyzingTargetScreen';
import TResultScreen from './src/screens/TResultScreen';
import ShareScreen from './src/screens/ShareScreen';
import MeScreen from './src/screens/MeScreen';
import LegalScreen from './src/screens/LegalScreen';

const Stack = createNativeStackNavigator();

const CONSENT_KEY = 'magnet_consent_v1';

export default function App() {
  // null = 加载中（避免闪一下弹框）, false = 未同意, true = 已同意
  const [consented, setConsented] = useState(null);

  useEffect(() => {
    AsyncStorage.getItem(CONSENT_KEY)
      .then((v) => setConsented(v === '1'))
      .catch(() => setConsented(false));
  }, []);

  function handleAgree() {
    AsyncStorage.setItem(CONSENT_KEY, '1').catch(() => {});
    setConsented(true);
  }

  return (
    <ErrorBoundary onReset={() => {}}>
    <SafeAreaProvider>
      <AppProvider>
        <NavigationContainer>
          <StatusBar style="light" />
          <Stack.Navigator
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: '#0d0d0d' },
              animation: 'slide_from_right',
            }}
          >
            <Stack.Screen name="Welcome" component={WelcomeScreen} />
            <Stack.Screen name="Gender" component={GenderScreen} />
            <Stack.Screen name="Upload" component={UploadScreen} />
            <Stack.Screen name="AnalyzingBasic" component={AnalyzingBasicScreen} />
            <Stack.Screen name="Basic" component={BasicScreen} />
            <Stack.Screen name="Paywall" component={PaywallScreen} />
            <Stack.Screen name="AnalyzingBase" component={AnalyzingBaseScreen} />
            <Stack.Screen name="Base" component={BaseScreen} />
            <Stack.Screen name="Target" component={TargetScreen} />
            <Stack.Screen name="AnalyzingTarget" component={AnalyzingTargetScreen} />
            <Stack.Screen name="TResult" component={TResultScreen} />
            <Stack.Screen name="Share" component={ShareScreen} />
            <Stack.Screen name="Me" component={MeScreen} />
            <Stack.Screen name="Legal" component={LegalScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </AppProvider>
      {consented === false && <ConsentModal onAgree={handleAgree} />}
    </SafeAreaProvider>
    </ErrorBoundary>
  );
}
