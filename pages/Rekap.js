import { Dimensions, Image, StatusBar, SafeAreaView, StyleSheet, Text, TouchableOpacity, View, FlatList } from 'react-native'
import React, { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import moment from 'moment';
import 'moment/locale/id';
import { useNavigation } from '@react-navigation/native';

const bulan = [
  {
    number: 1,
    nama: 'Januari'
  },
  {
    number: 2,
    nama: 'Februari'
  },
  {
    number: 3,
    nama: 'Maret'
  },
  {
    number: 4,
    nama: 'April'
  },
  {
    number: 5,
    nama: 'Mei'
  },
  {
    number: 6,
    nama: 'Juni'
  },
  {
    number: 7,
    nama: 'Juli'
  },
  {
    number: 8,
    nama: 'Agustus'
  },
  {
    number: 9,
    nama: 'September'
  },
  {
    number: 10,
    nama: 'Oktober'
  },
  {
    number: 11,
    nama: 'November'
  },
  {
    number: 12,
    nama: 'Desember'
  },
];


const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
const color = '#FFCF30';

const Rekap = () => {
  const navigation = useNavigation();
  const today = new Date();
  const [data, setData] = useState();
  const [alpa, setAlpa] = useState();

  const selectMonth = async (number) => {
    const nip = await AsyncStorage.getItem('NIP');
    fetch('https://afanalfiandi.com/presensi/api/api.php?act=getRekap', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        nip: nip,
        bulan: number
      })
    }).then((response) => response.json())
      .then((responseJson) => {
        setData(responseJson);
        
        const year = new Date().getFullYear();
        
        const jmlHari = moment(year + "-" + number, "YYYY-MM").daysInMonth();
        const alpa = jmlHari - responseJson[0].total;
        
        setAlpa(alpa);
      }).catch((e) => {
        console.log(e);
      })
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" hidden={false} backgroundColor="white" />
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.navigate('Home')}>
            <Image source={require('../assets/img/icon-back.png')} />
          </TouchableOpacity>
            <Text style={styles.pageTitle}>Presensi</Text>
        </View>
        <View style={styles.dayContainer}>
          <Text style={styles.dayInfoText}>{moment(today).format('dddd, DD MMMM yyyy')}</Text>
          <Text style={styles.pageTitle}>Today</Text>
        </View>
        <View style={styles.content}>
          <View style={styles.slideContainer}>
            <FlatList
              data={bulan}
              horizontal={true}
              renderItem={({ item }) => (
                <View style={styles.monthSlide}>
                  <TouchableOpacity onPress={() => {
                    selectMonth(item.number);
                  }}>
                    <Text style={styles.monthText}>{item.nama}</Text>
                  </TouchableOpacity>
                </View>
              )}
              keyExtractor={item => item.number}
              showsVerticalScrollIndicator={true}
              style={styles.bulanSlider}
            ></FlatList>
          </View>
        </View>

        <FlatList
          data={data}
          renderItem={({ item }) => (
            <View style={[styles.card, styles.elevation]}>
              <View style={styles.dataContainer}>
                <Text style={styles.dataTitle}>Hadir</Text>
                <Text style={styles.countText}>{item.hadir}</Text>
              </View>
              <View style={styles.divider}></View>

              <View style={styles.dataContainer}>
                <Text style={styles.dataTitle}>Alpa</Text>
                <Text style={styles.countText}>{alpa}</Text>
              </View>
              <View style={styles.divider}></View>

              <View style={styles.dataContainer}>
                <Text style={styles.dataTitle}>Sakit</Text>
                <Text style={styles.countText}>{item.sakit}</Text>
              </View>
              <View style={styles.divider}></View>

              <View style={styles.dataContainer}>
                <Text style={styles.dataTitle}>Kegiatan</Text>
                <Text style={styles.countText}>{item.kegiatan}</Text>
              </View>
              <View style={styles.divider}></View>

              <View style={styles.dataContainer}>
                <Text style={styles.dataTitle}>Lainnya</Text>
                <Text style={styles.countText}>{item.lain}</Text>
              </View>
            </View >
          )}
          keyExtractor={item => item.id}
        />
      </View>
    </SafeAreaView>
  )
}

export default Rekap

const styles = StyleSheet.create({
  safeArea: {
    height: height,
    width: width,
    backgroundColor: 'white'
  },
  container: {
    flex: 1,
    paddingVertical: height * 0.02,
  },
  header: {
    paddingHorizontal: width * 0.04,
    paddingVertical: height * 0.014,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  pageTitle: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: width * 0.05,
    paddingHorizontal: width * 0.04,
  },
  dayInfoText: {
    color: 'black',
    fontSize: width * 0.04,
    paddingHorizontal: width * 0.04,
  },
  content: {
    backgroundColor: 'white'
  },
  slideContainer: {
    paddingVertical: 3,
  },
  monthText: {
    marginHorizontal: 20,
    fontSize: 16,
    color: 'black',
    fontWeight: '600',
    marginVertical: 10
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 8,
    height: height * 0.14,
    margin: 15,
    flexDirection: 'row',
    alignItems: 'center'
  },
  elevation: {
    shadowColor: '#52006A',
    elevation: 30,
  },
  dataContainer: {
    width: '20%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  divider: {
    borderWidth: 0.5,
    height: '50%',
    borderColor: '#808080',
  },
  dataTitle: {
    color: 'black',
    fontSize: width * 0.04,
  },
  countText: {
    color: 'black',
    fontSize: 19,
    marginTop: 5,
    fontWeight: 'bold'
  }
})