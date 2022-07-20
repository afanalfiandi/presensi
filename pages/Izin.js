import { StatusBar, Image, SafeAreaView, Dimensions, StyleSheet, Text, View, TouchableOpacity, TextInput, Alert } from 'react-native'
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import RadioForm, { RadioButton, RadioButtonInput, RadioButtonLabel } from 'react-native-simple-radio-button';
import AsyncStorage from '@react-native-async-storage/async-storage';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const color = '#FFCF30';

var radio_props = [
  { label: 'Sakit', value: 1 },
  { label: 'Kegiatan', value: 2 },
  { label: 'Lain - lain', value: 3 }
];

const Izin = () => {
  const navigation = useNavigation();
  const [value, setValue] = useState();
  const [keterangan, setKeterangan] = useState();

  const submit = async () => {
    const nip = await AsyncStorage.getItem('NIP');

    fetch('https://afanalfiandi.com/presensi/api/api.php?act=izin', {
      method: "POST",
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        nip: nip,
        izin: value,
        keterangan: keterangan
      })
    }).then((res) => res.json())
      .then((json) => {
        if (json == "Success") {
          Alert.alert('', 'Berhasil!', [
            {
              text: 'OK',
              onPress: () =>  navigation.navigate('Home')
            }
          ])
        } else {
          Alert.alert('', 'Gagal!');
        }
      })
  }
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" hidden={false} backgroundColor="white" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('Home')}>
          <Image source={require('../assets/img/icon-back-yellow.png')} />
        </TouchableOpacity>
        <View style={styles.titleContainer}>
          <Text style={styles.pageTitle}>IZIN</Text>
        </View>
      </View>
      <View style={styles.container}>
        <View style={styles.inputContainer}>
          <Text style={styles.inputTitle}>Izin</Text>
          <RadioForm
            animation={true}
            formHorizontal={false}
            labelHorizontal={true}
          >
            {
              radio_props.map((obj, i) => (
                <RadioButton labelHorizontal={true} key={i} style={{ backgroundColor: '#E0E0E0', padding: 10, justifyContent: 'space-between', borderRadius: 5, marginTop: 20 }}>
                  <RadioButtonLabel
                    obj={obj}
                    index={i}
                    labelHorizontal={true}
                    onPress={(value) => setValue(value)}
                    labelStyle={{ fontSize: 16, color: 'black' }}
                    labelWrapStyle={{}}
                  />
                  <RadioButtonInput
                    obj={obj}
                    index={i}
                    isSelected={value === i + 1}
                    onPress={(value) => setValue(value)}
                    borderWidth={1}
                    buttonInnerColor={color}
                    buttonOuterColor={'black'}
                    buttonSize={10}
                    buttonOuterSize={20}
                    buttonWrapStyle={{ marginLeft: 10 }}
                  />
                </RadioButton>
              ))
            }
          </RadioForm>

        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.inputTitle}>Keterangan</Text>
          <TextInput style={styles.textArea}
            underlineColorAndroid="transparent"
            numberOfLines={10}
            multiline={true}
            onChangeText={setKeterangan}
            value={keterangan}
            placeholder='Keterangan'></TextInput>
          <Text style={styles.noteText}>*kegiatan dan lain - lain wajib mengisi keterangan </Text>
        </View>
        <TouchableOpacity style={styles.submitBtn} onPress={submit}>
          <Text style={styles.submitText}>Submit</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

export default Izin

const styles = StyleSheet.create({
  safeArea: {
    width: width,
    height: height,
    backgroundColor: 'white'
  },
  header: {
    flexDirection: 'row',
    padding: height * 0.02,
    alignItems: 'center'
  },
  titleContainer: {
    paddingHorizontal: width * 0.05,
    alignItems: 'center',
    width: '100%'
  },
  container: {
    flex: 1,
    paddingHorizontal: width * 0.05,
  },
  pageTitle: {
    fontSize: width * 0.055,
    fontWeight: 'bold',
    color: 'black',
  },
  inputTitle: {
    color: 'black',
    fontSize: width * 0.045,
    fontWeight: 'bold',
    marginTop: height * 0.02,
  },
  input: {
    backgroundColor: '#E0E0E0',
    marginTop: height * 0.02,
    height: height * 0.05,
    borderRadius: width * 0.02,
  },
  textArea: {
    marginTop: height * 0.02,
    borderRadius: width * 0.02,
    backgroundColor: '#E0E0E0',
    color:'black'
  },
  noteText: {
    color: 'black',
    marginTop: height * 0.01,
    fontWeight: 'bold'
  },

  submitBtn: {
    backgroundColor: color,
    width: width * 0.9,
    marginTop: height * 0.2,
    height: height * 0.045,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: width * 0.02
  },
  submitText: {
    color: 'black',
    fontSize: width * 0.045,
    fontWeight: 'bold',
  }
})