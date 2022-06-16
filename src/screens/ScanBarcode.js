import React, { useState } from 'react';
import { Screen } from '../containers';
import QRCodeScanner from 'react-native-qrcode-scanner';
import { RNCamera } from 'react-native-camera';
import { Text, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Dimensions } from 'react-native';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const ScanBarcode = (props) => {
    const { navigation, route } = props;
    const title = 'Quét Barcode';
    /**
     * Send update order api
     * @param order {OrderModel}
     */

    const onSuccess = e => {
        console.log("onSuccess e ", JSON.stringify(e));
    };

    /**
 * Returns true if the screen is in portrait mode
 */
    const isPortrait = () => {
        const dim = Dimensions.get('screen');
        return dim.height >= dim.width;
    };

    /**
     * Returns true of the screen is in landscape mode
     */
    const isLandscape = () => {
        const dim = Dimensions.get('screen');
        return dim.width >= dim.height;
    };

    return (
        <Screen header={title} goBack={navigation.goBack}>
            <QRCodeScanner
                onRead={() => onSuccess()}
            // flashMode={RNCamera.Constants.FlashMode.torch}
            // topContent={
            //     <Text style={styles.centerText}>
            //         Go to{' '}
            //         <Text style={styles.textBold}>wikipedia.org/wiki/QR_code</Text> on
            //         your computer and scan the QR code.
            //     </Text>
            // }
            // bottomContent={
            //     <TouchableOpacity style={styles.buttonTouchable}>
            //         <Text style={styles.buttonText}>OK. Got it!</Text>
            //     </TouchableOpacity>
            // }
            />
            <View style={styles.viewCustom}>
                <View style={{ height: isPortrait ? windowHeight / 4 : windowWidth / 4, backgroundColor: 'rgba(1,1,1,0.5)', width: windowHeight }}></View>
                <View style={{ height: isPortrait ? windowHeight * 2 / 4 : windowWidth * 2 / 4, width: isPortrait ? windowWidth : windowHeight, flexDirection: 'row' }}>
                    <View style={{ backgroundColor: 'rgba(1,1,1,0.5)', height: "100%", width: "5%", }}></View>
                    <View style={[{ backgroundColor: 'transparent', height: "100%", width: "90%", }, styles.rectangle]}></View>
                    <View style={{ backgroundColor: 'rgba(1,1,1,0.5)', height: "100%", width: "5%", }}></View>
                </View>
                <View style={{ height: isPortrait ? windowHeight / 4 : windowWidth / 4, backgroundColor: 'rgba(1,1,1,0.5)', width: windowHeight }}></View>
            </View>
            <Text style={styles.textQRCode}>Quét Qr code hoặc Barcode</Text>

        </Screen>
    );
};

const styles = StyleSheet.create({
    centerText: {
        flex: 1,
        fontSize: 18,
        padding: 32,
        color: '#777'
    },
    textBold: {
        fontWeight: '500',
        color: '#000'
    },
    buttonText: {
        fontSize: 21,
        color: 'rgb(0,122,255)'
    },
    buttonTouchable: {
        padding: 16
    },
    container: { flex: 1 },
    preview: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    rectangle: {
        borderWidth: 1,
        borderColor: "#fff",
    },
    viewCustom: { backgroundColor: 'transparent', position: "absolute", flex: 1, width: windowWidth, height: windowHeight },
    viewCenterCustom: { flex: 4.4, flexDirection: 'row' },
    // viewCenterContent: { backgroundColor: 'transparent', height: "100%", width: 8 * (Metrics.screenHeight / orientation == Constant. 22) },
    // viewCenterLeft: { backgroundColor: 'rgba(1,1,1,0.5)', height: "100%", width: Metrics.screenHeight / 10 },
    // viewCenterRight: { backgroundColor: 'rgba(1,1,1,0.5)', height: "100%", width: Metrics.screenHeight / 10 },
    viewBottomCustom: { height: "25%", backgroundColor: 'rgba(1,1,1,0.5)', width: windowHeight },
    viewTopCustom: { height: "30%", backgroundColor: 'rgba(1,1,1,0.5)', width: windowHeight },
    textQRCode: { position: "absolute", bottom: 20, color: "#fff", textAlign: "center", width: "100%" }

});

ScanBarcode.propTypes = {};

ScanBarcode.defaultProps = {};

ScanBarcode.route = 'ScanBarcode';

export default ScanBarcode;
