import { StatusBar, Image, FlatList, SafeAreaView, Dimensions, StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native'
import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const color = '#FFCF30';
const Home = () => {
  const navigation = useNavigation();

  const [nip, setNip] = useState();
  const [nama, setNama] = useState();
  const [img, setImg] = useState();
  const [jamMasuk, setJamMasuk] = useState();
  const [jamPulang, setJamPulang] = useState();

  useEffect(() => {
    getUser();
    getJam();
  }, []);

  const getUser = async () => {
    try {
      const nip = await AsyncStorage.getItem("NIP");

      fetch('https://afanalfiandi.com/presensi/api/api.php', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          nip: nip
        })
      }).then((res) => res.json())
        .then((json) => {
          setNama(json.nama);
          setNip(json.nip);
          setImg(json.img);
        })
    } catch (error) {

    }
  }

  const getJam = async () => {
    const nip = await AsyncStorage.getItem("NIP");

    fetch('https://afanalfiandi.com/presensi/api/api.php?act=getJam', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        nip: nip
      })
    }).then((res) => res.json())
      .then((json) => {
        setJamMasuk(json.jam_masuk);
        setJamPulang(json.jam_pulang);
      })
  }

  const logout = async () => {
    Alert.alert('', 'Apakah Anda yakin?', [
      {
        text: 'Batal',
        style: 'cancel'
      },
      {
        text: 'Keluar',
        onPress: () => {
          AsyncStorage.removeItem('NIP');
          navigation.navigate('Auth');
        }
      }
    ])

  }
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" hidden={false} backgroundColor="#FFCF30" />
      <View style={styles.titleContainer}>
        <Text style={styles.pageTitle}>DASHBOARD</Text>
      </View>
      <View style={styles.container}>
        {/* <TouchableOpacity style={styles.userInfoContainer} onPress={() => navigation.navigate('Profil')} elevation={10}> */}
        <View style={styles.userInfoContainer} elevation={10}>
          <View style={styles.profileImgContainer}>
            <Image style={styles.imgProfile} source={{ uri: 'https://afanalfiandi.com/presensi/img/' + img }} />
          </View>
          <View style={styles.userInfoTextContainer}>
            <Text style={styles.userInfoText}>{nama}</Text>
            <Text style={styles.userInfoText}>NIP. {nip}</Text>
          </View>
        </View>
        {/* </TouchableOpacity> */}
        <View style={styles.menuContainer}>
          <Text style={styles.pageTitle}>Services</Text>
          <View style={styles.row}>
            <TouchableOpacity onPress={() => navigation.navigate('Masuk')}>
              <View style={styles.menuBtn}>
                <View style={styles.imgContainer}>
                  <Image source={require('../assets/img/icon-masuk.png')} />
                </View>
                <Text style={styles.menuTxt}>Masuk</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Pulang')}>
              <View style={styles.menuBtn}>
                <View style={styles.imgContainer}>
                  <Image source={require('../assets/img/icon-pulang.png')} />
                </View>
                <Text style={styles.menuTxt}>Pulang</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Izin')}>
              <View style={styles.menuBtn}>
                <View style={styles.imgContainer}>
                  <Image source={require('../assets/img/icon-izin.png')} />
                </View>
                <Text style={styles.menuTxt}>Izin</Text>
              </View>
            </TouchableOpacity>
          </View>
          <View style={styles.row}>
            <TouchableOpacity onPress={() => navigation.navigate('Cek')}>
              <View style={styles.menuBtn}>
                <View style={styles.imgContainer}>
                  <Image source={require('../assets/img/icon-cek.png')} />
                </View>
                <Text style={styles.menuTxt}>Cek</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Rekap')}>
              <View style={styles.menuBtn}>
                <View style={styles.imgContainer}>
                  <Image source={require('../assets/img/icon-rekap.png')} />
                </View>
                <Text style={styles.menuTxt}>Rekap</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={logout}>
              <View style={styles.menuBtn}>
                <View style={styles.imgContainer}>
                  <Image source={require('../assets/img/icon-power.png')} />
                </View>
                <Text style={styles.menuTxt}>Log Out</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <View style={styles.historyContainer}>
        <View style={styles.historyHeader}>
          <Text style={styles.historyTitle}>TODAY</Text>
        </View>
        <View style={styles.historyRow}>
          <View style={styles.historyCol}>
            <Image source={require('../assets/img/arrow-down.png')} />
            <View style={styles.jamContainer}>
              <Text style={styles.jamText}>masuk</Text>
              <Text style={styles.jamText}>{jamMasuk}</Text>
            </View>
          </View>
          <View style={styles.historyCol}>
            <Image style={{ transform: [{ rotate: '180deg' }] }} source={require('../assets/img/arrow-down.png')} />
            <View style={styles.jamContainer}>
              <Text style={styles.jamText}>pulang</Text>
              <Text style={styles.jamText}>{jamPulang}</Text>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView >
  )
}

export default Home

const styles = StyleSheet.create({
  safeArea: {
    width: width,
    height: height,
    backgroundColor: color
  },
  titleContainer: {
    paddingHorizontal: width * 0.05,
    marginTop: height * 0.08,
  },
  container: {
    flex: 1,
    paddingHorizontal: width * 0.05,
    alignItems: 'center',
  },
  pageTitle: {
    fontSize: width * 0.055,
    fontWeight: 'bold',
    color: 'black',
  },
  userInfoContainer: {
    backgroundColor: 'white',
    paddingHorizontal: width * 0.08,
    alignItems: 'center',
    height: '20%',
    marginTop: height * 0.03,
    width: '75%',
    borderRadius: width * 0.03,
    flexDirection: 'row'
  },
  userInfoTextContainer: {
    marginLeft: width * 0.02
  },
  userInfoText: {
    fontSize: width * 0.048,
    fontWeight: 'bold',
    color: 'black'
  },
  menuContainer: {
    marginTop: height * 0.05,
    width: width,
    paddingVertical: height * 0.02,
    paddingHorizontal: width * 0.05,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: width * 0.05,
    paddingVertical: width * 0.07,
  },
  menuBtn: {
    width: width * 0.13,
    height: width * 0.13,
    justifyContent: 'center',
    alignItems: 'center'
  },
  menuBtn2: {
    width: width * 0.13,
    height: width * 0.13,
    borderRadius: width * 0.04
  },
  imgContainer: {
    width: '100%',
    height: '100%',
    borderRadius: width * 0.04,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuTxt: {
    marginTop: height * 0.01
  },
  historyContainer: {
    backgroundColor: 'white',
    width: width,
    height: height * 0.15,
    position: 'absolute',
    bottom: 0,
    paddingVertical: height * 0.01,
    borderTopRightRadius: width * 0.14,
    borderTopLeftRadius: width * 0.14,
    paddingHorizontal: width * 0.05,
  },
  historyHeader: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  historyTitle: {
    fontSize: width * 0.05,
    fontWeight: 'bold',
    color: 'black',
  },
  historyRow: {
    flexDirection: 'row',
    height: '80%',
    justifyContent: 'space-between'
  },
  historyCol: {
    width: '30%',
    flexDirection: 'row',
    alignItems: 'center'
  },
  jamContainer: {
    marginLeft: width * 0.03
  },
  jamText: {
    color: 'black'
  },
  profileImgContainer: {
    borderRadius: 400,
    width: 100,
    height: '100%',
    justifyContent: 'center'
  },
  imgProfile: {
    width: '100%',
    height: 100
  }
})