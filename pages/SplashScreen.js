import { Alert, PermissionsAndroid, Animated, StyleSheet, Image, StatusBar, SafeAreaView, Dimensions, Text, View } from 'react-native';
import React, { useEffect, useRef } from 'react';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Geolocation from '@react-native-community/geolocation';
import RNAndroidLocationEnabler from 'react-native-android-location-enabler';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const SplashScreen = () => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const navigation = useNavigation();
  useEffect(() => {
    fadeIn();
    permission();
    navigate();
  }, []);

  const fadeIn = () => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 2000,
      useNativeDriver: true
    }).start();
  };

  const permission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: "Aktifkan Izin Lokasi",
          message:
            "Untuk menggunakan aplikasi, beri izin lokasi",
          buttonNeutral: "Tanya Nanti",
          buttonNegative: "Batal",
          buttonPositive: "Izinkan"
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        Geolocation.getCurrentPosition((position) => {
          console.log('diiiijinkan');
        }, (error) => {
          if (error.code == 2) {
            RNAndroidLocationEnabler.promptForEnableLocationIfNeeded({
              interval: 10000,
              fastInterval: 5000,
            })
              .then((data) => {
              })
              .catch((err) => {
                console.log(err);
              })
          }
        })
      } else {
        console.log('GPS tidak diijinkan');
      }
    } catch (err) {
      console.log(err);
    }
  }

  const navigate = () => {
    setTimeout(async () => {
      try {
        const nip = await AsyncStorage.getItem('NIP');

        if (nip != null) {
          navigation.navigate('Home');
        } else {
          navigation.navigate('Intro');
        }
      } catch (error) {
        console.log(error);
      }
    }, 3500);
  }
  return (
    <SafeAreaView style={styles.safeView}>
      <StatusBar barStyle="dark-content" hidden={false} backgroundColor="white" />
      <Animated.View style={[styles.container, {
        opacity: fadeAnim
      }]}>
        <Image source={require('../assets/img/splash-bg.png')} />
      </Animated.View>
    </SafeAreaView>
  )
}

export default SplashScreen

const styles = StyleSheet.create({
  safeView: {
    width: width,
    height: height,
    backgroundColor: 'white',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
})