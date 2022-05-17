import React from 'react';
import {ActivityIndicator, View} from 'react-native';
import {Styles} from '../configs';

const Loading = () => {
    return <View style={Styles.loadingContainer}>
        <ActivityIndicator size={'large'} style={Styles.loadingContainer}/>
    </View>;
};

export default Loading;
