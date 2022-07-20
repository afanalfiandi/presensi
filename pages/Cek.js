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
const Cek = () => {
  const navigation = useNavigation();
  const latKantor = '-7.3697512';
  const longKantor = '108.539128';
  const [latUser, setLatUser] = useState();
  const [longUser, setLongUser] = useState();
  const [coordinates, setCoordinates] = useState({
    latitude: 10,
    longitude: 10,
    latitudeDelta: 0.001,
    longitudeDelta: 0.001,
  });

  useEffect(() => {
    getPosition();
  }, []);

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

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" hidden={false} backgroundColor="white" />
      <View style={styles.container}>
        <View style={styles.mapContainer}>
          <MapView
            initialRegion={coordinates}
            style={styles.map}
            showsUserLocation={true}
          >
            <Marker coordinate={{
              latitude: -7.3697512,
              longitude: 108.539128,
            }} />
          </MapView>
        </View>
        <View style={styles.footContainer}>
          <Text style={styles.label}>latitude : {latUser}</Text>
          <Text style={styles.label}>longitude : {longUser}</Text>

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