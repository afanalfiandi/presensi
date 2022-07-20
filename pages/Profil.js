import { SafeAreaView, Image, Dimensions, StatusBar, StyleSheet, Text, View, TouchableOpacity, TextInput } from 'react-native'
import React, { useRef } from 'react'
import Carousel from 'react-native-anchor-carousel';
import { useNavigation } from '@react-navigation/native';
const width = Dimensions.get('screen').width;
const height = Dimensions.get('screen').height;
const color = '#FFCF30';

const Profil = () => {
    const carouselRef = useRef(null);

    const navigation = useNavigation();
    const renderItem = ({ item, index }) => {
        return (
            <View style={{
                paddingHorizontal: width * 0.05,
                paddingVertical: height * 0.02,
                margin: 10,
                borderRadius: 3,
                borderWidth: 0.4
            }}>
                <TextInput placeholder='Nama' />
                <TextInput placeholder='Nama' />
            </View>
        );
    }
    return (
        <SafeAreaView style={styles.safe}>
            <StatusBar barStyle="dark-content" hidden={false} backgroundColor="#FFCF30" />
            <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.navigate('Home')}>
                        <Image source={require('../assets/img/icon-back.png')} />
                    </TouchableOpacity>
                    <Text style={styles.pageTitle}>Profile</Text>
                </View>
                <View style={styles.content}>
                    <View style={styles.userContainer}>
                        <View style={styles.imgContainer}>
                            <Image style={{ height: 80, width: 80 }} source={require('../assets/img/default.png')} />
                        </View>
                        <View style={styles.infoContainer}>
                            <Text style={styles.userText}>nama</Text>
                            <Text style={styles.userText}>NIP</Text>
                        </View>
                    </View>
                    <View style={styles.formContainer}>
                        <Carousel
                            ref={carouselRef}
                            data={Array(3).fill(0)}
                            renderItem={renderItem}
                            style={styles.carousel}
                            containerWidth={width}
                            separatorWidth={0}
                        />
                    </View>
                </View>
            </View>
        </SafeAreaView>
    )
}

export default Profil

const styles = StyleSheet.create({
    safe: {
        width: width,
        height: height,
        backgroundColor: 'white'
    },
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: width * 0.05,
        paddingVertical: height * 0.02,
        backgroundColor: color
    },
    pageTitle: {
        fontSize: width * 0.045,
        fontWeight: 'bold',
        marginLeft: 10,
        color: 'black'
    },
    content: {
        flex: 1,
        backgroundColor: color
    },
    userContainer: {
        paddingHorizontal: width * 0.05,
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: height * 0.03
    },
    imgContainer: {
        height: 80, width: 80,
        borderRadius: 100
    },
    infoContainer: {
        marginLeft: 10,
        justifyContent: 'center',
    },
    userText: {
        fontSize: width * 0.05,
        color: 'black',
        fontWeight: 'bold'
    },
    formContainer: {
        backgroundColor: 'white',
        flex: 1,
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        paddingHorizontal: width * 0.05,
        paddingVertical: height * 0.02,

    },
    carousel: {
    }
})