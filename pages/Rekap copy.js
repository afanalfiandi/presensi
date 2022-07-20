import { Dimensions, Image, StatusBar, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react';
import { Calendar, CalendarList, Agenda } from 'react-native-calendars';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { LocaleConfig } from 'react-native-calendars';
import moment from 'moment';
import 'moment/locale/id';
import { useNavigation } from '@react-navigation/native';

LocaleConfig.locales['id'] = {
  monthNames: [
    'Januari',
    'Februari',
    'Maret',
    'April',
    'Mei',
    'Juni',
    'Juli',
    'Agustus',
    'September',
    'Oktober',
    'November',
    'Desember'
  ],
  monthNamesShort: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul.', 'Agust', 'Sept', 'Okt', 'Nov', 'Des'],
  dayNames: ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'],
  dayNamesShort: ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'],
  today: "Hari ini"
};
LocaleConfig.defaultLocale = 'id';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
const color = '#FFCF30';

const Rekap = () => {
  const navigation = useNavigation();
  const today = new Date().toDateString();
  const [data, setData] = useState([]);
  useEffect(() => {
    getData();
  }, []);
  const getData = async () => {
    const nip = await AsyncStorage.getItem("NIP");

    fetch('https://afanalfiandi.com/presensi/api/api.php?act=getRekap', {
      method: "POST",
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        nip: nip
      })
    }).then((res) => res.json())
      .then((json) => {
        const mappingData = json.map(item => {
          setData(json)
          console.log(data);
        })
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
          <Text style={styles.pageTitle}>Rekap</Text>
        </View>
        <View style={styles.dayContainer}>
          <Text style={styles.dayInfoText}>{moment(today).format('dddd, DD MMMM yyyy')}</Text>
          <Text style={styles.pageTitle}>Today</Text>
        </View>
        <View style={styles.content}>
          <Agenda
            items={{
              '2022-07-05': [{ masuk: '07.00', pulang: '17.00', lat: 'latitude', long: 'longitude' }]
            }}
            onDayPress={day => {
              console.log('day pressed');
            }}
            // Callback that gets called when day changes while scrolling agenda list
            onDayChange={day => {
              console.log('day changed');
            }}
            selected={'2022-07-05'}
            minDate={'2022-01-01'}
            maxDate={'2022-12-31'}
            renderItem={(item, firstItemInDay) => {
              return (
                <View style={{ backgroundColor: 'white' }}>
                  <View style={{ backgroundColor: color, width: width * 0.6, justifyContent: 'center', height: height * 0.14, borderRadius: 10, margin: 20, padding: 10 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: height * 0.005 }}>
                      <Text style={{ fontSize: width * 0.04, color: 'black', fontWeight: 'bold' }}>Masuk</Text>
                      <Text style={{ fontSize: width * 0.04, color: 'black' }}>07.00</Text>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: height * 0.005 }}>
                      <Text style={{ fontSize: width * 0.04, color: 'black', fontWeight: 'bold' }}>Latitude</Text>
                      <Text style={{ fontSize: width * 0.04, color: 'black' }}>-7.00000</Text>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: height * 0.005 }}>
                      <Text style={{ fontSize: width * 0.04, color: 'black', fontWeight: 'bold' }}>Longitude</Text>
                      <Text style={{ fontSize: width * 0.04, color: 'black' }}>10.00000</Text>
                    </View>
                  </View>
                  <View style={{ backgroundColor: color, width: width * 0.6, justifyContent: 'center', height: height * 0.14, borderRadius: 10, margin: 20, padding: 10 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: height * 0.005 }}>
                      <Text style={{ fontSize: width * 0.04, color: 'black', fontWeight: 'bold' }}>Pulang</Text>
                      <Text style={{ fontSize: width * 0.04, color: 'black' }}>07.00</Text>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: height * 0.005 }}>
                      <Text style={{ fontSize: width * 0.04, color: 'black', fontWeight: 'bold' }}>Latitude</Text>
                      <Text style={{ fontSize: width * 0.04, color: 'black' }}>-7.00000</Text>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: height * 0.005 }}>
                      <Text style={{ fontSize: width * 0.04, color: 'black', fontWeight: 'bold' }}>Longitude</Text>
                      <Text style={{ fontSize: width * 0.04, color: 'black' }}>10.00000</Text>
                    </View>
                  </View>
                </View>
              );
            }}

            renderDay={day => {
              const tgl = day.toISOString();
              return <View style={{ margin: 20, backgroundColor: 'white', alignItems: 'center' }}>
                <Text style={{ fontSize: width * 0.08, color: 'black', fontWeight: 'bold' }}>{moment(tgl).format('DD')}</Text>
                <Text style={{ fontSize: width * 0.05, color: 'black' }}>{moment(tgl).format('ddd')}</Text>
              </View>;
            }}

            renderEmptyDate={() => {
              return (
                <View style={{ backgroundColor: color, width: width * 0.6, justifyContent: 'center', height: height * 0.14, borderRadius: 10, margin: 20, padding: 10 }}>
                  <Text style={{ fontSize: width * 0.04, color: 'black' }}>Tidak Ada Data</Text>
                </View>
              );
            }}

            renderKnob={() => {
              return <View style={{ width: '100%', borderRadius: 20, backgroundColor: 'black', height: 3, marginTop: 12 }}>
                <Text style={{ color: 'black' }}>this is knob</Text>
              </View>;
            }}
            hideKnob={false}
            renderEmptyData={day => {
              return (
                <View style={{ flexDirection: 'row' }}>
                  <View style={{ margin: 20, backgroundColor: 'white', alignItems: 'center' }}>
                    <Text style={{ fontSize: width * 0.08, color: 'black', fontWeight: 'bold' }}>{moment(day).format('DD')}</Text>
                    <Text style={{ fontSize: width * 0.05, color: 'black' }}>{moment(day).format('ddd')}</Text>
                  </View>
                  <View style={{ backgroundColor: color, width: width * 0.6, justifyContent: 'center', height: height * 0.14, borderRadius: 10, margin: 20, padding: 10 }}>
                    <Text style={{ fontSize: width * 0.04, color: 'black' }}>Tidak Ada Data</Text>
                  </View>
                </View>
              );
            }}

            rowHasChanged={(r1, r2) => {
              return r1.text !== r2.text;
            }}
            showClosingKnob={true}
            onRefresh={() => console.log('refreshing...')}
            refreshControl={null}
            theme={{
              agendaDayTextColor: 'black',
              agendaDayNumColor: 'black',
              agendaTodayColor: color,
              selectedDayBackgroundColor: color,
              dayTextColor: 'black',
              backgroundColor: 'white'
            }}
            style={{
              height: '100%',
              backgroundColor: 'white'
            }}
          />
        </View>
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
    paddingHorizontal: width * 0.04,
  },
  header: {
    paddingVertical: height * 0.014,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  pageTitle: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: width * 0.05
  },
  dayInfoText: {
    color: 'black',
    fontSize: width * 0.04
  },
  content: {
    flex: 1,
    backgroundColor: 'white'
  }
})