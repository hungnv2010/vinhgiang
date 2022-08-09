import React, {useEffect, useRef, useState} from 'react';
import {PropTypes} from '../base';
import {Icon, ListItem} from 'react-native-elements';
import {ActivityIndicator, FlatList, ScrollView, Text, TextInput, TouchableOpacity, View} from 'react-native';
import {Colors, Styles} from '../configs';
import PSModal from './PSModal';
import _ from 'lodash';
import {Loading} from '../containers';
import { NumberFormat } from '../configs/Utils';

const removeAccents = (str) => {
    var AccentsMap = [
        'aàảãáạăằẳẵắặâầẩẫấậ', 'AÀẢÃÁẠĂẰẲẴẮẶÂẦẨẪẤẬ',
        'dđ', 'DĐ',
        'eèẻẽéẹêềểễếệ', 'EÈẺẼÉẸÊỀỂỄẾỆ',
        'iìỉĩíị', 'IÌỈĨÍỊ',
        'oòỏõóọôồổỗốộơờởỡớợ', 'OÒỎÕÓỌÔỒỔỖỐỘƠỜỞỠỚỢ',
        'uùủũúụưừửữứự', 'UÙỦŨÚỤƯỪỬỮỨỰ',
        'yỳỷỹýỵ', 'YỲỶỸÝỴ',
    ];
    for (var i = 0; i < AccentsMap.length; i++) {
        var re = new RegExp('[' + AccentsMap[i].substr(1) + ']', 'g');
        var char = AccentsMap[i][0];
        str = str.replace(re, char);
    }
    return str;
};

// options : list(object) bắt buộc có trường 'name' (hiển thị), 'valueKey' là trường duy nhất tương ứng với trường 'current' (giá trị mặc định)
const SelectLoadmore = (props) => {
    const {onSelect, options, current, label, required, valueKey, reload, loading, search, isProduct} = props;
    const [showModal, setShowModal] = useState(false);
    const [showSearch, setShowSearch] = useState(false);
    const [keyword, setKeyword] = useState('');
    const [datas, setDatas] = useState([])

    const offset = useRef(0)
    const select = (item) => {
        if (onSelect) {
            onSelect(item);
        }
        setShowModal(false);
    };
    const haveData = (_.isArray(options) && options.length > 0)
        || (_.isObject(options) && Object.keys(options).length > 0);
    const getOptions = (limit) => {
        let start = offset.current
        let startPlusLimit = offset.current + limit;
        offset.current = (startPlusLimit > options.length) ? options.length - 1 : startPlusLimit;

        console.log("getOptions ", offset.current);

        const isFilter = search && showSearch && keyword.length > 1;
        if (_.isArray(options)) {
            if (isFilter) {
                return options.filter(item => removeAccents(item.name).includes(removeAccents(keyword)))
                    .slice(start, offset.current)
            }
            return options.slice(start, offset.current);
        }
        if (_.isObject(options)) {
            const opts = Object.keys(options).map(key => ({value: key, name: options[key]}));
            if (isFilter) {
                return opts.filter(item => removeAccents(isProduct? item.display_name : item.name).includes(removeAccents(keyword)))
                    .slice(start, offset.current);
            }
            return opts;
        }
        return [];
    };

    const getText = () => {
        if (!current) {
            return '';
        }
        if (_.isArray(options)) {
            for (let i = 0; i < options.length; i++) {
                if (options[i][valueKey] === current) {
                    return options[i].name;
                }
            }
            return '';
        }
        // Must let is object after is array because is array maybe is object
        if (_.isObject(options)) {
            return options[current];
        }
        return '';
    };

    useEffect(() => {
        if(showModal) reset();
    }, [showModal, keyword]);

    const filterMore = () => {
        if(offset.current > options.length) return;

        let opts = getOptions(20)

        setDatas([...datas, ...opts]) 
    }

    const reset = () => {
        offset.current = 0

        let opts = getOptions(20)

        setDatas(opts) 
    }

    const getItemView = (item, index) => {
        return  (
            item[valueKey]
            ? <TouchableOpacity
                key={index}
                onPress={() => select(item)}>
                <ListItem key={item[valueKey] + index}>
                    <ListItem.Content>
                        { isProduct ?
                        <ListItem.Title
                            style={item[valueKey] === current ? Styles.selectedSubItem : Styles.normalSubItem}>
                            {`[${item.code}]    -   Tồn kho: ${NumberFormat(item.qty_available)}`}
                        </ListItem.Title>
                        : null
                        }
                        <ListItem.Title
                            style={item[valueKey] === current ? Styles.selectedItem : Styles.normalItem}>
                            {item.name}
                        </ListItem.Title>
                    </ListItem.Content>
                </ListItem>
            </TouchableOpacity>
            : <></>
        )
    }


    const getModalContent = () => {
        if (haveData) {
            return <View style={{height: '100%'}}>
                <FlatList
                    data={datas}
                    onEndReachedThreshold={0.5}
                    onEndReached={filterMore}
                    renderItem={({ item, index }) => getItemView(item, index)}
                    keyExtractor={(item, index) => index.toString()}
                    // ListFooterComponent={loadMore ? <ActivityIndicator color={Colors.primary} /> : null}
                    style={Styles.productList}
                />
                {/* {opts.map((item, index) => getItemView(item, index))} */}
            </View> 
        }

        if (loading) {
            return <Loading/>;
        }

        return <TouchableOpacity
            style={Styles.centerContent}
            onPress={reload}>
            <Text style={Styles.touchToReload}>
                Không tải được dữ liệu, bẩm để tải lại
            </Text>
        </TouchableOpacity>;
    };

    return <>
        <View style={Styles.formItem}>
            <Text style={Styles.formLabel}>
                {label + (required ? ' *' : '')}
            </Text>
            <TouchableOpacity style={Styles.formSelectText} onPress={() => setShowModal(true)}>
                <Text style={Styles.formSelectInput}>{getText()}</Text>
                <Icon name="arrow-drop-down" size={22} />
            </TouchableOpacity>
        </View>
        <PSModal
            setModalVisible={setShowModal}
            visible={showModal}>
            <Text style={Styles.modalLabel}>{label}</Text>
            {search
            && <View style={Styles.floatingSearchButton}>
                <TouchableOpacity onPress={() => setShowSearch(!showSearch)}>
                    <Icon name={'search'}/>
                </TouchableOpacity>
            </View>}
            {(search && showSearch)
            && <TextInput
                value={keyword}
                autoFocus={true}
                onChangeText={(val) => setKeyword(val)}
                style={Styles.filterInput}/>}
            {getModalContent()}
        </PSModal>
    </>;
};

SelectLoadmore.propTypes = {
    reload: PropTypes.func,
    mode: PropTypes.oneOf(['edit', 'create']),
    type: PropTypes.oneOf(['text', 'number', 'object']),
    options: PropTypes.any,
    label: PropTypes.string,
    current: PropTypes.any,
    onSelect: PropTypes.func,
    required: PropTypes.bool,
    valueKey: PropTypes.string,
    loading: PropTypes.bool,
    search: PropTypes.bool,
    isProduct: PropTypes.bool,
};

SelectLoadmore.defaultProps = {
    mode: 'create',
    type: 'text',
    required: false,
    current: '',
    optionType: 'array',
    options: [],
    valueKey: 'value',
    loading: false,
};

export default SelectLoadmore;
