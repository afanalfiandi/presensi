import { StatusBar, Image, Button, SafeAreaView, Dimensions, StyleSheet, Text, View, TouchableOpacity, TextInput, Alert } from 'react-native'
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import RadioForm, { RadioButton, RadioButtonInput, RadioButtonLabel } from 'react-native-simple-radio-button';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const color = '#FFCF30';
const options = {
  title: 'Select Image',
  type: 'library',
  options: {
    maxHeight: 200,
    maxWidth: 200,
    selectionLimit: 1,
    mediaType: 'photo',
    includeBase64: false
  }
};
var radio_props = [
  { label: 'Sakit', value: 1 },
  { label: 'Kegiatan', value: 2 },
  { label: 'Lain - lain', value: 3 }
];

const Izin = () => {
  const navigation = useNavigation();
  const [value, setValue] = useState();
  const [keterangan, setKeterangan] = useState();
  const [uri, setUri] = useState();
  const [type, setType] = useState();
  const [name, setName] = useState();

  const handleImagePicker = async () => {
    try {
      const result = await launchImageLibrary(options);

      setUri(result.assets[0].uri,);
      setType(result.assets[0].type,);
      setName(result.assets[0].fileName);
    } catch (error) {
      console.log(error);
    }
  }

  const submit = async () => {
    const formData = new FormData();
    const nip = await AsyncStorage.getItem('NIP');
    formData.append('nip', nip);
    formData.append('izin', value);
    formData.append('keterangan', keterangan);

    formData.append('file', {
      uri: uri,
      type: type,
      name: name,
    });
    let res = await fetch(
      'https://afanalfiandi.com/presensi/api/api.php?act=izin',
      {
        method: 'post',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data; ',
        },
      }
    ).then((res) => res.json()).then((resp) => {
      if (resp == "1") {
        Alert.alert('', 'File Sudah Ada!');
      } else if (resp == "2") {
        Alert.alert('', 'Ukuran File Terlalu Besar!');
      } else if (resp == "3") {
        Alert.alert('', 'Berhasil!', [
          {
            text: 'OK',
            onPress: () => navigation.navigate('Home')
          }
        ]);
      } else {
        Alert.alert('', 'Gagal!');
      }
    });
  }
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" hidden={false} backgroundColor="white" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('Home')}>
          <Image source={require('../assets/img/icon-back.png')} />
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

          <Text style={styles.noteText}>*wajib mengisi keterangan & upload bukti izin (surat dokter, dll.)</Text>
          <TouchableOpacity onPress={handleImagePicker} style={styles.file}>
            <Text>Pilih File  📑</Text>
          </TouchableOpacity>
          {(name != null) && (
            <Text style={styles.noteText}>File siap diupload.</Text>
          )}
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
    fontSize: width * 0.040,
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
    color: 'black'
  },
  noteText: {
    color: 'black',
    marginTop: height * 0.01,
    fontWeight: 'bold',
    fontSize: width * 0.029,
  },

  submitBtn: {
    backgroundColor: color,
    width: width * 0.9,
    marginTop: height * 0.067,
    height: height * 0.045,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: width * 0.02
  },
  file: {
    borderWidth: 1,
    marginVertical: width * 0.038,
    padding: width * 0.02,
    borderColor: color
  },
  submitText: {
    color: 'black',
    fontSize: width * 0.045,
    fontWeight: 'bold',
  }
})