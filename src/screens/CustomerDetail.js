import React, { useCallback, useEffect, useRef, useState } from 'react';
import { OrderForm, Screen } from '../containers';
import { ApiService } from '../services';
import { NativeModules, Linking, Platform, ToastAndroid, PermissionsAndroid, ActivityIndicator, View, Text, Image, RefreshControl, TextInput, TouchableOpacity, FlatList } from 'react-native';
import { Asset, Colors, Styles } from '../configs';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
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
import { ScrollView } from 'react-native-gesture-handler';
import { forEach } from 'lodash';
// import ImagePicker from 'react-native-image-crop-picker';

const listImage = [
    { link: "https://vcdn1-dulich.vnecdn.net/2021/07/16/3-1-1626444927.jpg?w=1200&h=0&q=100&dpr=1&fit=crop&s=0nww5sftrDimoUxyn9lM5g" },
    { link: "https://1.bp.blogspot.com/-hN0NCoAmEDY/X8z1OcRjXmI/AAAAAAAAlc0/hHqbHzqOPhIABiVomzpYacPeEufV816QQCNcBGAsYHQ/w350-h265-p-k-no-nu/hinh-nen-may-cuc-dep.jpg" },
    { link: "https://media.travelmag.vn/files/thuannguyen/2020/04/25/cach-chup-anh-dep-tai-da-lat-1-2306.jpeg" },
    { link: "https://vcdn1-dulich.vnecdn.net/2021/07/16/3-1-1626444927.jpg?w=1200&h=0&q=100&dpr=1&fit=crop&s=0nww5sftrDimoUxyn9lM5g" },
    { link: "https://1.bp.blogspot.com/-hN0NCoAmEDY/X8z1OcRjXmI/AAAAAAAAlc0/hHqbHzqOPhIABiVomzpYacPeEufV816QQCNcBGAsYHQ/w350-h265-p-k-no-nu/hinh-nen-may-cuc-dep.jpg" },
    { link: "https://vcdn1-dulich.vnecdn.net/2021/07/16/3-1-1626444927.jpg?w=1200&h=0&q=100&dpr=1&fit=crop&s=0nww5sftrDimoUxyn9lM5g" },
    { link: "https://vcdn1-dulich.vnecdn.net/2021/07/16/3-1-1626444927.jpg?w=1200&h=0&q=100&dpr=1&fit=crop&s=0nww5sftrDimoUxyn9lM5g" },
]
var ImagePicker = NativeModules.ImageCropPicker;

const CustomerDetail = (props) => {
    const { navigation, route, params } = props;
    const title = 'Chi tiết khách hàng';
    const [latitude, setLatitude] = useState("")
    const [longitude, setLongitude] = useState("")
    const [customer, setCustomer] = useState(route.params ? route.params : {})
    const [showModal, setShowModal] = useState(false);

    const goBack = () => {
        if (route?.params?.goBack) {
            route.params.goBack();
        }
        navigation.goBack();
    };

    const hasPermissionIOS = async () => {
        const openSetting = () => {
            Linking.openSettings().catch(() => {
                Alert.alert('Unable to open settings');
            });
        };
        const status = await Geolocation.requestAuthorization('whenInUse');

        if (status === 'granted') {
            return true;
        }

        if (status === 'denied') {
            Alert.alert('Location permission denied');
        }

        if (status === 'disabled') {
            Alert.alert(
                `Turn on Location Services to allow "${appConfig.displayName}" to determine your location.`,
                '',
                [
                    { text: 'Go to Settings', onPress: openSetting },
                    { text: "Don't Use Location", onPress: () => { } },
                ],
            );
        }

        return false;
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

    const onClickUpImage = () => {
        // ImagePicker.openPicker({
        //     multiple: true
        // }).then(images => {
        //     console.log(images);
        // });
        // ImagePicker.openPicker({
        //     multiple: true,
        //     waitAnimationEnd: false,
        //     includeExif: true,
        //     forceJpg: true,
        // }).then(images => {
        //     this.setState({
        //         image: null,
        //         images: images.map(i => {
        //             console.log('received image', i);
        //             return {uri: i.path, width: i.width, height: i.height, mime: i.mime};
        //         })
        //     });
        // }).catch(e => alert(e));
        // ImagePicker.openPicker({
        //     width: 300,
        //     height: 400,
        //     cropping: true
        //   }).then(image => {
        //     console.log(image);
        //   });
        // ImagePicker.openCamera({
        //     width: 300,
        //     height: 400,
        //     cropping: true,
        // }).then(image => {
        //     console.log(image);
        // });
        setShowModal(true);
    }

    const onClickCamera = () => {
        ImagePicker.openCamera({
            width: 300,
            height: 300,
            cropping: true,
            includeBase64: true,

        }).then(image => {
            console.log("onClickCamera images ", image);
            uploadToServer([image]);
        });
    }

    const onClickGallery = () => {
        ImagePicker.openPicker({
            multiple: true,
            includeBase64: true,
            // waitAnimationEnd: false,
            includeExif: true,
            forceJpg: true,
        }).then(images => {
            console.log("onClickGallery images ", JSON.stringify(images));
            uploadToServer(images);
        }).catch(e => alert(e));
    }

    const uploadToServer = async (data) => {
        let files = [];
        data.forEach(element => {
            files.push({ datas: element.data, filename: data.filename != null && data.filename != '' ? data.filename : Math.random().toString() })
        });
        let body = {
            id: 3,
            files: files
        }

        let uploadToServer = await ApiService.uploadImage(body)
        console.log("uploadToServer ", JSON.stringify(uploadToServer));
    }

    const renderCategori = () => {
        return <View style={Styles.productViewModalCategori}>
            <MaterialCommunityIcons onPress={() => { setShowModal(false) }} style={Styles.productIconCloseModalCategori} name={"close"} color={Colors.gray_aaa} size={26} />
            <TouchableOpacity onPress={() => onClickCamera()} style={[Styles.productViewApply, { marginTop: 25, height: 50 }]}>
                <Text style={Styles.productTextApply}>Camera</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => onClickGallery()} style={[Styles.productViewApply, { marginVertical: 20, height: 50 }]}>
                <Text style={Styles.productTextApply}>Thư viện</Text>
            </TouchableOpacity>
        </View>
    }

    return (
        <Screen header={title} goBack={() => goBack()}>
            <ScrollView>
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
                <ScrollView
                    style={{ padding: 10 }}
                    horizontal={true}
                >
                    <TouchableOpacity onPress={() => onClickUpImage()} style={{ width: 100, height: 100, borderStyle: 'dashed', justifyContent: "center", alignItems: "center", borderColor: "#ddd", borderWidth: 1, borderRadius: 5 }}>
                        <SimpleLineIcons name={"cloud-upload"} color={Colors.gray_aaa} size={40} />
                    </TouchableOpacity>
                    {
                        listImage.map(item => {
                            return <TouchableOpacity style={{ marginLeft: 10, borderColor: "#ddd", borderWidth: 1, borderRadius: 5 }}>
                                <Image style={{ borderRadius: 5, width: 100, height: 100 }} source={{ uri: item.link }} />
                            </TouchableOpacity>
                        })
                    }
                </ScrollView>
                <TouchableOpacity onPress={() => onClickApply()} style={Styles.detailCustomerApply}>
                    <Text style={Styles.detailCustomerTextApply}>Áp dụng</Text>
                </TouchableOpacity>
            </ScrollView>
            <FSModal visible={showModal} children={renderCategori()} />

        </Screen>
    );
};

CustomerDetail.propTypes = {};

CustomerDetail.defaultProps = {};

CustomerDetail.route = 'CustomerDetail';

export default CustomerDetail;
