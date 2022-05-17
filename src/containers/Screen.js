import React from 'react';
import {KeyboardAvoidingView, ScrollView, Text, View} from 'react-native';
import {PropTypes} from '../base';
import {Colors, Styles} from '../configs';
import {Header, Icon} from 'react-native-elements';
import {logout, useAuthDispatch} from '../context';

const Screen = (props) => {
    const dispatch = useAuthDispatch();
    const {header, children, goBack, showLogoutButton} = props;
    const leftComponent = goBack
        ? <Icon name={'arrow-left'} color={'white'} onPress={() => goBack()}/>
        : '';
    const rightComponent = showLogoutButton
        ? <Icon name={'logout'}
                color={'white'}
                onPress={() => logout(dispatch)}/>
        : '';
    const centerComponent = <Text style={Styles.headerText}>
        {header}
    </Text>;

    return <View style={Styles.screenContainer}>
        {header
            && <Header backgroundColor={Colors.primary}
                       leftComponent={leftComponent}
                       centerComponent={centerComponent}
                       rightComponent={rightComponent}/>}
        <KeyboardAvoidingView behavior="height" style={Styles.screenContainer}>
            {children}
        </KeyboardAvoidingView>
    </View>;
};
Screen.propTypes = {
    header: PropTypes.string,
    goBack: PropTypes.func,
    showLogoutButton: PropTypes.func,
};

export default Screen;
