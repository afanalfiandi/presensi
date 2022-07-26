import { Dimensions, PermissionsAndroid, Image, SafeAreaView, StatusBar, StyleSheet, Text, TouchableOpacity, View, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { useNavigation } from '@react-navigation/native';
import Geolocation from '@react-native-community/geolocation';
import RNAndroidLocationEnabler from 'react-native-android-location-enabler';
import { getPreciseDistance } from 'geolib';
import AsyncStorage from '@react-native-async-storage/async-storage';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const color = '#FFCF30';
const Masuk = () => {
  const navigation = useNavigation();
  const [latUser, setLatUser] = useState();
  const [longUser, setLongUser] = useState();
  const [distance, setDistance] = useState();

  const [coordinates, setCoordinates] = useState({
    latitude: 0,
    longitude: 0,
    latitudeDelta: 0,
    longitudeDelta: 0
  });

  const [marker, setMarker] = useState({
    latitude: 0,
    longitude: 0,
  });

  useEffect(() => {
    getUserDistance();
  }, []);

  const Map = () => {
    return (
      <MapView
        initialRegion={coordinates}
        style={styles.map}
        showsUserLocation={true}
      >
        <Marker coordinate={marker} />
      </MapView>
    )
  }
  const getUserDistance = async () => {
    const latKantor = await AsyncStorage.getItem('latKantor');
    const longKantor = await AsyncStorage.getItem('longKantor');
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
    );

    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      Geolocation.getCurrentPosition((position) => {
        const lat = JSON.stringify(position.coords.latitude);
        const long = JSON.stringify(position.coords.longitude);
        const distance = getPreciseDistance(
          { latitude: latKantor, longitude: longKantor },
          { latitude: lat, longitude: long },
        );
        setLatUser(lat);
        setLongUser(long);
        setDistance(distance);

        setCoordinates({
          latitude: parseFloat(latKantor),
          longitude: parseFloat(longKantor),
          latitudeDelta: 0.002,
          longitudeDelta: 0.002
        });

        setMarker({
          latitude: parseFloat(latKantor),
          longitude: parseFloat(longKantor),
        });
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
      } catch (err) {
        console.log(err);
      }
    }
  }

  const submit = async () => {
    const nip = await AsyncStorage.getItem('NIP');

    fetch('https://afanalfiandi.com/presensi/api/api.php?act=pMasuk', {
      method: "POST",
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        nip: nip,
        lat: latUser,
        long: longUser
      })
    }).then((res) => res.json())
      .then((json) => {
        if (json == 'Success') {
          Alert.alert('', 'Presensi Masuk Berhasil', [
            {
              text: 'OK',
              onPress: () => navigation.navigate('Home')
            }
          ])
        } else {
          Alert.alert('', 'Presensi Masuk Gagal')
        }
      })
  }
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" hidden={false} backgroundColor="white" />
      <View style={styles.container}>
        <View style={styles.mapContainer}>
          <Map />
          <View style={styles.buttonCallout}>
            <TouchableOpacity
              style={styles.backBtn}
              onPress={() => navigation.navigate("Home")}
            >
              <Image source={require('../assets/img/icon-back.png')} />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.footContainer}>
          {distance > 50 && (
            <Text style={styles.label}>Jarak : {distance} Meter (max: 50 meter)</Text>
          )}
          {distance <= 50 && (
            <Text style={styles.label}>Jarak : {distance} Meter</Text>
          )}

          <View style={styles.submitContainer}>
            {distance > 50 && (
              <TouchableOpacity onPress={submit} style={[styles.submitBtn, { backgroundColor: '#eaeaea' }]} disabled={distance > 50}>
                <Text style={styles.label}>Presensi</Text>
              </TouchableOpacity>
            )}
            {distance <= 50 && (
              <TouchableOpacity onPress={submit} style={[styles.submitBtn, { backgroundColor: color }]} disabled={distance > 50}>
                <Text style={styles.label}>Presensi</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </SafeAreaView>
  )
}

export default Masuk

const styles = StyleSheet.create({
  safeArea: {
    width: width,
    height: height,
    backgroundColor: 'white'
  },
  container: {
    flex: 1,
  },
  mapContainer: {
    height: height * 0.82,
    width: width,
  },
  map: {
    width: width,
    height: '100%'
  },
  footContainer: {
    flex: 1,
    paddingVertical: height * 0.02,
    paddingHorizontal: width * 0.03,
  },
  label: {
    fontWeight: 'bold',
    fontSize: width * 0.042,
    color: 'black'
  },
  submitContainer: {
    position: 'absolute',
    bottom: height * 0.009,
    width: width,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center'
  },

  submitBtn: {
    padding: width * 0.015,
    width: '87%',
    borderRadius: width * 0.02,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonCallout: {
    flex: 1,
    position: 'absolute',
    borderRadius: 100,
    backgroundColor: 'white',
    margin: width * 0.05,
    width: width * 0.1,
    justifyContent: 'center',
    alignItems: 'center',
    height: width * 0.1,
  },
})