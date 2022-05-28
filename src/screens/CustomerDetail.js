import React, { useCallback, useEffect, useRef, useState } from 'react';
import { OrderForm, Screen } from '../containers';
import { ApiService } from '../services';
import { Platform, ToastAndroid, PermissionsAndroid, ActivityIndicator, View, Text, Image, RefreshControl, TextInput, TouchableOpacity, FlatList } from 'react-native';
import { Asset, Colors, Styles } from '../configs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons'
import FSModal from '../components/FSModal';
import { Button } from 'react-native-elements/dist/buttons/Button';
import { CheckBox } from 'react-native-elements';
import { ChangeAlias } from '../configs/Utils';
import { FAB } from 'react-native-elements';
import Geolocation from 'react-native-geolocation-service';
import moment from 'moment';
import messageService from '../services/messages';

const CustomerDetail = (props) => {
    const { navigation, route, params } = props;
    const title = 'Chi tiết khách hàng';
    const [latitude, setLatitude] = useState("")
    const [longitude, setLongitude] = useState("")
    const [customer, setCustomer] = useState(route.params ? route.params : {})

    const goBack = () => {
        if (route?.params?.goBack) {
            route.params.goBack();
        }
        navigation.goBack();
    };

    const hasLocationPermission = async () => {
        if (Platform.OS === 'ios') {
            const hasPermission = await hasPermissionIOS();
            return hasPermission;
        }
        if (Platform.OS === 'android' && Platform.Version < 23) {
            return true;
        }
        const hasPermission = await PermissionsAndroid.check(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        );
        if (hasPermission) {
            return true;
        }
        const status = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        );
        if (status === PermissionsAndroid.RESULTS.GRANTED) {
            return true;
        }
        if (status === PermissionsAndroid.RESULTS.DENIED) {
            messageService.showInfo("Location permission denied by user.")
        } else if (status === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
            messageService.showInfo("Location permission revoked by user.")
        }
        return false;
    };

    useEffect(() => {
        getPosition()
    }, []);

    const getPosition = async () => {
        const hasPermission = await hasLocationPermission();
        if (hasPermission) {
            Geolocation.getCurrentPosition(
                (position) => {
                    setLongitude(position.coords.longitude)
                    setLatitude(position.coords.latitude)
                    console.log(position);
                },
                (error) => {
                    console.log(error);
                },
                {
                    accuracy: {
                        android: 'high',
                        ios: 'best',
                    },
                    enableHighAccuracy: true,
                    timeout: 15000,
                    maximumAge: 10000,
                    distanceFilter: 0,
                    forceRequestLocation: true,
                    forceLocationManager: false,
                    showLocationDialog: true,
                },
            );
        };
    }

    const onClickApply = async () => {
        if (!checkDataApply())
            return;
        let body = {
            "phone": customer.phone,
            "name": customer.name,
            "street": customer.street ? customer.street : "",
            "street2": customer.street2 ? customer.street2 : "",
            // "ward_id": 1,
            "state_id": 1,
            "country_id": 1,
            "vehicle_route": 1,
            "name_store": customer.name_store ? customer.name_store : "",
            "code_ch_vg": customer.code_ch_vg ? customer.code_ch_vg : "",//"Ma cua hang vinhgiang",
            "code_ch_ncc1": customer.code_ch_ncc1 ? customer.code_ch_ncc1 : "", //"Ma cua hang ncc1",
            "code_ch_ncc2": customer.code_ch_ncc2 ? customer.code_ch_ncc2 : "",//"Ma cua hang ncc2",
            "code_ch_ncc3": customer.code_ch_ncc3 ? customer.code_ch_ncc3 : "",//"Ma cua hang ncc3",
            "date_localization": moment().format('YYYY-MM-DD'),
            "partner_latitude": latitude,
            "partner_longitude": longitude,
        }
        if (customer.id && customer.id != "") {
            body["id"] = customer.id
        }
        if (customer.id && customer.id != "") {
            await ApiService.editCustomer(body).then(res => {
                messageService.showSuccess(`${customer.id ? 'Cập nhật' : 'Thêm mới'} khách hàng thành công`);
                goBack()
            }).catch(err => {
                messageService.showError('Có lỗi trong quá trình xử lý');
                console.log("addCustomer err ", JSON.stringify(err));
            })
        } else {
            await ApiService.addCustomer(body).then(res => {
                messageService.showSuccess(`${customer.id ? 'Cập nhật' : 'Thêm mới'} khách hàng thành công`);
                goBack()
            }).catch(err => {
                messageService.showError('Có lỗi trong quá trình xử lý');
                console.log("addCustomer err ", JSON.stringify(err));
            })
        }
        // await ApiService.addCustomer(body).then(res => {
        //     messageService.showSuccess(`${customer.id ? 'Cập nhật' : 'Thêm mới'} khách hàng thành công`);
        //     goBack()
        // }).catch(err => {
        //     console.log("addCustomer err ", JSON.stringify(err));
        // })
    }

    const checkDataApply = () => {
        if (!customer.name || customer.name.trim() == "") {
            messageService.showError('Vui lòng nhập tên khách hàng');
            return false
        } else if (!customer.phone || customer.phone.trim() == "") {
            messageService.showError('Vui lòng nhập số điện thoại khách hàng');
            return false
        } else if (!customer.name_store || customer.name_store.trim() == "") {
            messageService.showError('Vui lòng nhập tên cửa hàng');
            return false
        } else if (!customer.code_ch_vg || customer.code_ch_vg.trim() == "") {
            messageService.showError('Vui lòng nhập mã cửa hàng Vĩnh Giang');
            return false
        }
        return true;
    }

    return (
        <Screen header={title} goBack={() => goBack()}>
            <View>
                <View style={Styles.detailCustomerViewTextInput}>
                    <TextInput value={customer.name} placeholder='Tên khách hàng' style={Styles.detailCustomerInput} onChangeText={(text) => setCustomer({ ...customer, name: text })} />
                </View>
                <View style={Styles.detailCustomerViewTextInput}>
                    <TextInput keyboardType='numeric' value={customer.phone ? `${customer.phone}` : ''} placeholder='Số điện thoại' style={Styles.detailCustomerInput} onChangeText={(text) => setCustomer({ ...customer, phone: text })} />
                </View>
                <View style={Styles.detailCustomerViewTextInput}>
                    <TextInput value={customer.street} placeholder='Địa chỉ 1' style={Styles.detailCustomerInput} onChangeText={(text) => setCustomer({ ...customer, street: text })} />
                </View>
                <View style={Styles.detailCustomerViewTextInput}>
                    <TextInput value={customer.street2} placeholder='Địa chỉ 2' style={Styles.detailCustomerInput} onChangeText={(text) => setCustomer({ ...customer, street2: text })} />
                </View>
                <View style={Styles.detailCustomerViewTextInput}>
                    <TextInput value={customer.name_store} placeholder='Tên cửa hàng' style={Styles.detailCustomerInput} onChangeText={(text) => setCustomer({ ...customer, name_store: text })} />
                </View>
                <View style={Styles.detailCustomerViewTextInput}>
                    <TextInput value={customer.code_ch_vg} placeholder='Mã cửa hàng Vĩnh Giang' style={Styles.detailCustomerInput} onChangeText={(text) => setCustomer({ ...customer, code_ch_vg: text })} />
                </View>
                <View style={Styles.detailCustomerViewTextInput}>
                    <TextInput value={customer.code_ch_ncc1} placeholder='Mã cửa hàng nhà cung cấp 1' style={Styles.detailCustomerInput} onChangeText={(text) => setCustomer({ ...customer, code_ch_ncc1: text })} />
                </View>
                <View style={Styles.detailCustomerViewTextInput}>
                    <TextInput value={customer.code_ch_ncc2} placeholder='Mã cửa hàng nhà cung cấp 2' style={Styles.detailCustomerInput} onChangeText={(text) => setCustomer({ ...customer, code_ch_ncc2: text })} />
                </View>
                <View style={Styles.detailCustomerViewTextInput}>
                    <TextInput value={customer.code_ch_ncc3} placeholder='Mã cửa hàng nhà cung cấp 3' style={Styles.detailCustomerInput} onChangeText={(text) => setCustomer({ ...customer, code_ch_nc3: text })} />
                </View>
                <TouchableOpacity onPress={() => onClickApply()} style={Styles.detailCustomerApply}>
                    <Text style={Styles.detailCustomerTextApply}>Áp dụng</Text>
                </TouchableOpacity>
            </View>

        </Screen>
    );
};

CustomerDetail.propTypes = {};

CustomerDetail.defaultProps = {};

CustomerDetail.route = 'CustomerDetail';

export default CustomerDetail;
