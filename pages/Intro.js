import { StatusBar, StyleSheet, Text, View, Image, TouchableOpacity, Dimensions } from 'react-native'
import React, { useEffect, useState } from 'react'
import AppIntroSlider from 'react-native-app-intro-slider';

import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Auth from '../pages/Auth';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
const color = '#FFCF30';
const slides = [
  {
    key: 1,
    title: 'Convenient In Use',
    text: 'Everything for comfortable of your attendance management',
    image: require('../assets/img/slider-1.png'),
    backgroundColor: '#59b2ab',
  },
  {
    key: 2,
    title: 'Efficiency and Speed',
    text: 'Attendance in just one click on your smartphone',
    image: require('../assets/img/slider-2.png'),
    backgroundColor: '#febe29',
  }
]

export class Intro extends React.Component {
  state = {
    showRealApp: false
  }
  componentDidMount() {
    this._getState();
  }

  _getState = async () => {
    try {
      const val = await AsyncStorage.getItem('showRealApp')
      if (val == '1') {
        this.setState({ showRealApp: true });
      } else {
        console.log('null');
      }
    } catch (e) {
      console.log(e);
    }
  }

  _renderItem = ({ item }) => {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" hidden={false} backgroundColor="#FFCF30" />
        <View style={styles.imgContainer}>
          <Image style={styles.image} source={item.image} />
        </View>
        <View style={styles.descContainer}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.text}>{item.text}</Text>
          {item.key == 2 && (
            <TouchableOpacity style={styles.startBtn} onPress={this._onDone}>
              <Text style={styles.startTxt}>Mulai</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  }
  _onDone = async () => {
    this.setState({ showRealApp: true });
    try {
      await AsyncStorage.setItem('showRealApp', '1')
    } catch (e) {
      console.log(e);
    }
  }

  _nextBtn = () => {
    return (
      <View>
      </View>
    )
  }
  _doneBtn = () => {
    return (
      <View>
      </View>
    )
  }

  render() {
    if (!this.state.showRealApp) {
      return <AppIntroSlider
        dotStyle={{ backgroundColor: 'white' }}
        activeDotStyle={{ backgroundColor: 'black' }}
        renderItem={this._renderItem}
        data={slides}
        renderNextButton={this._nextBtn}
        renderDoneButton={this._doneBtn}
      />;
    } else {
      return <Auth />;
    }
  }
}

export default Intro


const styles = StyleSheet.create({
  container: {
    backgroundColor: color,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imgContainer: {
    height: height * 0.3,
    width: width,
    justifyContent: 'center',
    alignItems: 'center',
  },
  descContainer: {
    alignItems: 'center'
  },
  title: {
    fontSize: width * 0.06,
    color: 'black',
    fontWeight: 'bold',
    marginBottom: 5
  },
  text: {
    fontSize: width * 0.05,
    color: 'black',
    textAlign: 'center'
  },
  startBtn: {
    backgroundColor: 'black',
    marginTop: 40,
    height: height * 0.05,
    width: width * 0.4,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center'
  },
  startTxt: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: width * 0.05,
  }
})