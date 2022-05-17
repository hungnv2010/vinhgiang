import React, {useEffect, useRef} from 'react';
import {Image, ImageBackground, KeyboardAvoidingView, ScrollView, View} from 'react-native';
import {loginUser, useAuthDispatch, useAuthState} from '../context';
import {Asset, Styles} from '../configs';
import {Button, CheckBox, Icon, Input} from 'react-native-elements';
import AsyncStorage from '@react-native-community/async-storage';
import {restorePassword} from '../context/actions';

const Login = () => {
    const [username, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [savePassword, setSavePassword] = React.useState(false);
    const dispatch = useAuthDispatch();
    const state = useAuthState();

    useEffect(() => {
        AsyncStorage.getItem('save_password')
            .then(async res => {
                if (res === 'true') {
                    await restorePassword(dispatch);
                }
            })
            .catch(e => {
                console.log('restore password error', e);
            });
    }, [dispatch]);

    const handleLogin = async (evt) => {
        evt.preventDefault();
        try {
            await loginUser(dispatch, {username, password, savePassword});
        } catch (err) {
            console.error('login error', err);
        }
    };

    const ref_username = useRef();
    const ref_password = useRef();


    return <ImageBackground
        source={Asset.BackgroundImage}
        style={Styles.loginBg}
        blurRadius={0.6}>
        <KeyboardAvoidingView behavior={'height'} style={Styles.screenContainer}>
            <ScrollView 
            keyboardShouldPersistTaps='always' 
            showsVerticalScrollIndicator={false}>
                <View style={Styles.centerContent}>
                    <Image source={Asset.LoginBanner}
                           style={Styles.logoBanner}/>
                    <View style={Styles.fullWidth}>
                        <Input
                            autoCapitalize={'none'}
                            inputContainerStyle={Styles.inputContainer}
                            leftIcon={<Icon
                                name="login"
                                size={24}
                                color="black"
                            />}
                            value={username}
                            returnKeyType={'next'}
                            ref={ref_username}
                            onSubmitEditing={() => {
                                ref_password.current.focus();
                            }}
                            onChangeText={val => setUsername(val)}/>
                        <Input
                            leftIcon={<Icon
                                name="lock"
                                size={24}
                                color="black"
                            />}
                            inputContainerStyle={Styles.inputContainer}
                            secureTextEntry={true}
                            value={password}
                            ref={ref_password}
                            returnKeyType={'send'}
                            onSubmitEditing={handleLogin}
                            onChangeText={val => setPassword(val)}/>

                        <CheckBox
                            containerStyle={Styles.checkBoxContainer}
                            textStyle={Styles.checkBox}
                            checked={savePassword}
                            onPress={() => setSavePassword(!savePassword)}
                            title={'Nhớ mật khẩu'}/>

                        <Button
                            type={'solid'}
                            title={'ĐĂNG NHẬP'}
                            onPress={handleLogin}
                            loading={state.loading}
                            buttonStyle={Styles.button}
                            containerStyle={Styles.buttonContainer}/>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    </ImageBackground>;
};

Login.route = 'Login';

export default Login;
