import { StyleSheet, BackHandler, Alert } from 'react-native'
import React from 'react'
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SplashScreen from './pages/SplashScreen';
import Intro from './pages/Intro';
import Auth from './pages/Auth';
import Home from './pages/Home';
import Masuk from './pages/Masuk';
import Pulang from './pages/Pulang';
import Izin from './pages/Izin';
import Cek from './pages/Cek';
import Rekap from './pages/Rekap';
import RekapIzin from './pages/RekapIzin';
import Profil from './pages/Profil';

const App = () => {
  const Stack = createNativeStackNavigator();
  React.useEffect(() => {
    const backAction = () => {
      Alert.alert("", "Apakah Anda yakin ingin keluar ?", [
        {
          text: "Batal",
          onPress: () => null,
          style: "cancel"
        },
        { text: "Keluar", onPress: () => BackHandler.exitApp() }
      ]);
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="SplashScreen" component={SplashScreen} />
        <Stack.Screen name="Intro" component={Intro} />
        <Stack.Screen name="Auth" component={Auth} />
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Masuk" component={Masuk} />
        <Stack.Screen name="Pulang" component={Pulang} />
        <Stack.Screen name="Izin" component={Izin} />
        <Stack.Screen name="Cek" component={Cek} />
        <Stack.Screen name="Rekap" component={Rekap} />
        <Stack.Screen name="RekapIzin" component={RekapIzin} />
        <Stack.Screen name="Profil" component={Profil} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default App

const styles = StyleSheet.create({})