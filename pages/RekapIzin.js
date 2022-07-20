import { Dimensions, Image, StatusBar, SafeAreaView, StyleSheet, Text, TouchableOpacity, View, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CalendarStrip from 'react-native-calendar-strip';
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

const RekapIzin = () => {
    const navigation = useNavigation();
    const today = new Date();
    const [data, setData] = useState([]);
    const [date, setDate] = useState();

    const first = moment(today, 'YYYY-MM-DD').startOf('month').format('YYYY-MM-DD');
    const end = moment(today, 'YYYY-MM-DD').endOf('month').format('YYYY-MM-DD');

    const getData = async (date) => {
        const nip = await AsyncStorage.getItem("NIP");
        const tgl = moment(date).format('YYYY-MM-DD');
        fetch('https://afanalfiandi.com/presensi/api/api.php?act=getRekapIzin', {
            method: "POST",
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                nip: nip,
                tgl: tgl
            })
        }).then((res) => res.json())
            .then((json) => {
                setData(json);
                setDate(tgl);
            })
    }

    const renderItem = ({ item }) => (
        <View style={{ backgroundColor: 'white', justifyContent: 'center', flexDirection: 'row' }}>
            <View style={{ width: width * 0.2, height: height * 0.14, marginVertical: 20 }}>
                <View style={{
                    alignItems: 'center',
                    marginVertical: height * 0.005
                }}>
                    <Text style={{ fontSize: width * 0.068, color: 'black', fontWeight: 'bold' }}>{moment(date).format('DD')}</Text>
                    <Text style={{ fontSize: width * 0.04, color: 'black' }}>{moment(date).format('dddd')}</Text>
                </View>
            </View>
            {item.tgl != null && (
                <View>
                    <View style={{ backgroundColor: color, width: width * 0.6, justifyContent: 'center', height: 'auto', borderRadius: 10, margin: 20, padding: 10 }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: height * 0.005 }}>
                            <Text style={{ fontSize: width * 0.04, color: 'black', fontWeight: 'bold' }}>Jenis Izin</Text>
                            <Text style={{ fontSize: width * 0.04, color: 'black' }}>{item.izin}</Text>
                        </View>
                        <View style={{ justifyContent: 'space-between', marginVertical: height * 0.005 }}>
                            <Text style={{ fontSize: width * 0.04, color: 'black', fontWeight: 'bold' }}>Keterangan</Text>
                            <Text style={{ fontSize: width * 0.04, color: 'black', textAlign: 'justify' }}>{item.keterangan}</Text>
                        </View>
                    </View>
                </View>
            )}

            {item.tgl == null && (
                <View>
                    <View style={{ backgroundColor: color, width: width * 0.6, justifyContent: 'center', height: 'auto', borderRadius: 10, margin: 20, padding: 10 }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'center', marginVertical: height * 0.005 }}>
                            <Text style={{ fontSize: width * 0.04, color: 'black', fontWeight: 'bold' }}>Tidak Ada Data</Text>
                        </View>
                    </View>
                </View>
            )}
        </View>
    );
    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="dark-content" hidden={false} backgroundColor="white" />
            <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.navigate('Home')}>
                        <Image source={require('../assets/img/icon-back.png')} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigation.navigate('Rekap')} style={{ flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: 'black', paddingBottom: 1 }}>
                        <Text style={styles.pageTitle}>Izin</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.dayContainer}>
                    <Text style={styles.dayInfoText}>{moment(today).format('dddd, DD MMMM yyyy')}</Text>
                    <Text style={styles.pageTitle}>Today</Text>
                </View>
                <View style={styles.content}>
                    <CalendarStrip
                        scrollable
                        style={{ height: height * 0.1, marginTop: 10, backgroundColor: 'white' }}
                        calendarHeaderStyle={{ color: 'black' }}
                        dateNumberStyle={{ color: 'black', fontSize: width * 0.06 }}
                        dateNameStyle={{ color: "black", fontSize: width * 0.03 }}
                        highlightDateNameStyle={{ color: color, fontSize: width * 0.03 }}
                        highlightDateNumberStyle={{ color: color, fontSize: width * 0.06 }}
                        calendarColor={'transparent'}
                        iconContainer={{ flex: 0.002, }}
                        startingDate={new Date()}
                        selectedDate={new Date()}
                        maxDate={new Date()}
                        rightSelector={[]}
                        leftSelector={[]}
                        calendarHeaderPosition='above'
                        calendarHeaderFormat='MMMM'
                        onDateSelected={(date) => getData(date)}
                    />
                </View>

                <FlatList
                    data={data}
                    renderItem={renderItem}
                    keyExtractor={item => item.tgl}
                />
            </View>
        </SafeAreaView>
    )
}

export default RekapIzin


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
    }
})