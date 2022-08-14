import { SafeAreaView, StatusBar, Dimensions, StyleSheet, Text, View, Image, TextInput, TouchableOpacity, Alert } from 'react-native'
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const color = '#FFCF30';
const Auth = () => {
  const navigation = useNavigation();
  const [nip, setNip] = useState();
  const [password, setPassword] = useState();

  const submit = async () => {
    fetch('https://afanalfiandi.com/presensi/api/api.php?act=auth', {
      method: "POST",
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        nip: nip,
        password: password
      })
    }).then((res) => res.json())
      .then((json) => {
        if (json == "Failed") {
          Alert.alert('', 'NIP atau Password salah');
        } else {
          AsyncStorage.setItem('NIP', json.nip);
          AsyncStorage.setItem('namaCabang', json.nama_cabang);
          AsyncStorage.setItem('latKantor', json.latitude);
          AsyncStorage.setItem('longKantor', json.longitude);
          navigation.navigate('Home');
        }
      })
  }
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" hidden={false} backgroundColor="white" />
      <View style={styles.container}>
        <View style={styles.header}>
          <Image style={styles.img} source={require('../assets/img/splash-bg.png')} />
          <Image style={styles.img} source={require('../assets/img/login-img.png')} />
        </View>
        <View style={styles.formContainer}>
          <Text style={styles.label}>NIP</Text>
          <TextInput style={styles.input} onChangeText={setNip} value={nip} placeholder='Insert your NIP'></TextInput>
          <Text style={styles.label}>Password</Text>
          <TextInput secureTextEntry={true} onChangeText={setPassword} value={password} style={styles.input} placeholder='Insert your password'></TextInput>
          <TouchableOpacity style={styles.submitBtn} onPress={submit}>
            <Text style={styles.label}>Masuk</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  )
}

export default Auth

const styles = StyleSheet.create({
  safeArea: {
    width: width,
    height: height,
    backgroundColor: 'white',
    paddingHorizontal: width * 0.05,
    paddingVertical: height * 0.02,
  },
  container: {
    flex: 1,
  },
  header: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: height * 0.05
  },
  img: {
    marginVertical: height * 0.015
  },
  formContainer: {
    paddingVertical: height * 0.07
  },
  label: {
    fontSize: width * 0.05,
    fontWeight: 'bold',
    color: 'black'
  },
  input: {
    backgroundColor: '#E0E0E0',
    height: height * 0.050,
    borderRadius: width * 0.01,
    marginVertical: height * 0.01,
    color:'black'
  },
  submitBtn: {
    backgroundColor: color,
    height: height * 0.05,
    borderRadius: width * 0.01,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: height * 0.03
  },
})