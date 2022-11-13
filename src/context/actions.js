import {LOGIN_ERROR, LOGIN_SUCCESS, LOGOUT, REQUEST_LOGIN} from './reducer';
import {ApiService} from '../services';
import AsyncStorage from '@react-native-community/async-storage';
import messageService from '../services/messages';

export const loginUser = async (dispatch, loginPayload) => {
    try {
        dispatch({type: REQUEST_LOGIN});
        const {username, password, savePassword} = loginPayload;
        const res = await ApiService.login(username, password);
        if (res.success) {
            dispatch({type: LOGIN_SUCCESS, payload: {token: res.access_token, user: username}});
            await AsyncStorage.setItem('token', res.access_token);
            await AsyncStorage.setItem('userId', `${res.uid}`);
            await AsyncStorage.setItem('currentUser', savePassword ? username : '');
            await AsyncStorage.setItem('currentPassword', savePassword ? password : '');
            if (savePassword) {
                await AsyncStorage.setItem('save_password', 'true');
            }
            messageService.showSuccess('Đăng nhập thành công');
            return true;
        }

        dispatch({type: LOGIN_ERROR, payload: {message: res.message}});
        messageService.showError(res.message);
        return false;
    } catch (e) {
        dispatch({type: LOGIN_ERROR, payload: {message: e.message}});
        messageService.showError(e.message);
        console.log('login exception', e);
        return false;
    }
};

export const restorePassword = async () => {
    const username = await AsyncStorage.getItem('currentUser');
    const password = await AsyncStorage.getItem('currentPassword');
    if (username && password) {
        return {username: username, password: password};
    } else {
        return {username: '', password: ''};
    }
};

export const logout = async (dispatch) => {
    dispatch({type: LOGOUT});
    await AsyncStorage.removeItem('token');
    // await AsyncStorage.removeItem('userId');
    // await AsyncStorage.removeItem('currentUser');
};
