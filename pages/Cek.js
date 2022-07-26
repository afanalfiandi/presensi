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
var formatcoords = require('formatcoords');
const color = '#FFCF30';
const Cek = () => {
  const navigation = useNavigation();

  const [latUser, setLatUser] = useState();
  const [longUser, setLongUser] = useState();
  const [coordinates, setCoordinates] = useState({
    latitude: 0,
    longitude: 0,
    latitudeDelta: 0,
    longitudeDelta: 0,
  });

  useEffect(() => {
    getPosition();
  }, []);

  function convertToDegree(coord) {
    var absolute = Math.abs(coord);
    var degrees = Math.floor(absolute);
    var minutesNotTruncated = (absolute - degrees) * 60;
    var minutes = Math.floor(minutesNotTruncated);
    var seconds = Math.floor((minutesNotTruncated - minutes) * 60);

    return degrees + "° " + minutes + "' " + seconds + '" ';
  }

  function convertDMS(lat, long) {
    var latitude = convertToDegree(lat);
    var latitudeCardinal = lat >= 0 ? "LU" : "LS";

    var longitude = convertToDegree(long);
    var longitudeCardinal = long >= 0 ? "BT" : "BB";

    return latitude + " " + latitudeCardinal + " dan " + longitude + " " + longitudeCardinal;
  }

  const getPosition = async () => {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
    );

    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      Geolocation.getCurrentPosition((position) => {
        const lat = JSON.stringify(position.coords.latitude);
        const long = JSON.stringify(position.coords.longitude);
        setCoordinates({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005
        });

        setLatUser(position.coords.latitude);
        setLongUser(position.coords.longitude);

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

  const Map = () => {
    return (
      <MapView
        initialRegion={coordinates}
        style={styles.map}
        showsUserLocation={true}
      >
      </MapView>
    )
  }
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" hidden={false} backgroundColor="white" />
      <View style={styles.container}>
        <View style={styles.mapContainer}>
          <Map />
        </View>
        <View style={styles.footContainer}>
          <Text style={styles.label}>Posisi Anda : {"\n"}{convertDMS(latUser, longUser)}</Text>

          <View style={styles.submitContainer}>
            <TouchableOpacity style={styles.submitBtn} onPress={() => navigation.navigate('Home')}>
              <Text style={styles.label}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  )
}

export default Cek

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
    justifyContent: 'center',
  },
  backBtn: {
    width: '20%',
    alignItems: 'center'
  },
  submitBtn: {
    backgroundColor: color,
    padding: width * 0.02,
    width: '70%',
    borderRadius: width * 0.02,
    alignItems: 'center',
    justifyContent: 'center',
  }
})