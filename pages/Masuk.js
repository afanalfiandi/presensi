import { StatusBar, Alert, Dimensions, Image, SafeAreaView, PermissionsAndroid, StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import RNAndroidLocationEnabler from 'react-native-android-location-enabler';
import { getPreciseDistance } from 'geolib';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';


const color = '#FFCF30';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const Masuk = () => {
  const navigation = useNavigation();
  useEffect(() => {
    getUserLocation();
  }, []);
  const items = [
    { label: "PDAM Tirta Anom", latitude: "-7.361347929541185", longitude: "108.53448240000057", value: 0 },
    { label: "PDAM Situbatu", latitude: "-7.383615348309177", longitude: " 108.49622847865825", value: 1 },
    { label: "PDAM Langensari", latitude: "-7.362277836548293", longitude: "108.64024272208854", value: 2 }
  ];


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


  const [latUser, setLatUser] = useState();
  const [longUser, setLongUser] = useState();
  const [jarak, setJarak] = useState();

  const getUserLocation = async () => {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      Geolocation.getCurrentPosition((position) => {
        const lat = JSON.stringify(position.coords.latitude);
        const long = JSON.stringify(position.coords.longitude);
        setCoordinates({
          latitude: parseFloat(lat),
          longitude: parseFloat(long),
          latitudeDelta: 0.002,
          longitudeDelta: 0.002
        });

        setLatUser(lat);
        setLongUser(long);
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

  const calculateDistance = (lat, long) => {
    const distance = getPreciseDistance(
      { latitude: lat, longitude: long },
      { latitude: latUser, longitude: longUser },
    );
    setJarak('10');
  }
  const Map = () => {
    return (
      <View style={styles.mapContainer}>
        <MapView
          initialRegion={coordinates}
          style={styles.map}
          showsUserLocation={true}
        >
          <Marker coordinate={marker} />
        </MapView>
      </View>
    )
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
        console.log(json);
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
    <SafeAreaView style={styles.container}>
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
        <Text style={styles.label}>Pilih Cabang : </Text>
        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
          {Object.keys(items).map((key) => {
            return (
              <TouchableOpacity style={styles.optBtn} key={key} onPress={() => {
                setCoordinates({
                  latitude: parseFloat(items[key].latitude),
                  longitude: parseFloat(items[key].longitude),
                  latitudeDelta: 0.002,
                  longitudeDelta: 0.002
                });

                setMarker({
                  latitude: parseFloat(items[key].latitude),
                  longitude: parseFloat(items[key].longitude),
                });

                calculateDistance(items[key].latitude, items[key].longitude);
              }}>
                <Text style={styles.optLabel}>{items[key].label}</Text>
              </TouchableOpacity>
            )
          })}
        </View>
        <View style={styles.footContainer}>
          {jarak > 50 && (
            <Text style={styles.label}>Jarak : {jarak} Meter (max: 50 meter)</Text>
          )}
          {jarak <= 50 && (
            <Text style={styles.label}>Jarak : {jarak} Meter</Text>
          )}

          <View style={styles.submitContainer}>
            {jarak > 50 && (
              <TouchableOpacity onPress={submit} style={[styles.submitBtn, { backgroundColor: '#eaeaea' }]} disabled={jarak > 50}>
                <Text style={styles.label}>Presensi</Text>
              </TouchableOpacity>
            )}
            {jarak <= 50 && (
              <TouchableOpacity onPress={submit} style={[styles.submitBtn, { backgroundColor: color }]} disabled={jarak > 50}>
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
    height: height * 0.52,
    width: width,
  },
  map: {
    width: width,
    height: '100%'
  },
  footContainer: {
    flex: 1,
  },
  label: {
    fontWeight: 'bold',
    fontSize: width * 0.042,
    color: 'black',
    margin: 8
  },
  optLabel: {
    fontWeight: 'bold',
    fontSize: width * 0.035,
    color: 'black',
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
    padding: width * 0.006,
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
  optBtn: {
    borderWidth: 1,
    marginVertical: 10,
    width: '90%',
    padding: 8,
    borderRadius: 5,

  }
})