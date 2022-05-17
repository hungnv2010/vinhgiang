import React, {useState} from 'react';
import {PropTypes} from '../base';
import {Icon, ListItem} from 'react-native-elements';
import {ScrollView, Text, TextInput, TouchableOpacity, View} from 'react-native';
import {Styles} from '../configs';
import PSModal from './PSModal';
import _ from 'lodash';
import {Loading} from '../containers';

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

const Select = (props) => {
    const {onSelect, options, current, label, required, valueKey, reload, loading, search} = props;
    const [showModal, setShowModal] = useState(false);
    const [showSearch, setShowSearch] = useState(false);
    const [keyword, setKeyword] = useState('');
    const select = (item) => {
        if (onSelect) {
            onSelect(item);
        }
        setShowModal(false);
    };
    const haveData = (_.isArray(options) && options.length > 0)
        || (_.isObject(options) && Object.keys(options).length > 0);
    const getOptions = () => {
        const isFilter = search && showSearch && keyword.length > 2;
        if (_.isArray(options)) {
            if (isFilter) {
                return options.filter(item => removeAccents(item.name).includes(removeAccents(keyword)));
            }
            return options;
        }
        if (_.isObject(options)) {
            const opts = Object.keys(options).map(key => ({value: key, name: options[key]}));
            if (isFilter) {
                return opts.filter(item => removeAccents(item.name).includes(removeAccents(keyword)));
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


    const getModalContent = () => {
        const opts = getOptions();
        if (haveData) {
            return <ScrollView 
            keyboardShouldPersistTaps='always'
            showsVerticalScrollIndicator={false}>
                {opts.map((item, index) => (
                    item[valueKey]
                        ? <TouchableOpacity
                            key={index}
                            onPress={() => select(item)}>
                            <ListItem key={item[valueKey] + index}>
                                <ListItem.Content>
                                    <ListItem.Title
                                        style={item[valueKey] === current ? Styles.selectedItem : Styles.normalItem}>
                                        {item.name}
                                    </ListItem.Title>
                                </ListItem.Content>
                            </ListItem>
                        </TouchableOpacity>
                        : <></>
                ))}
            </ScrollView>;
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
            <Text style={Styles.formTextInput} onPress={() => setShowModal(true)}>
                <Text style={Styles.formSelectInput}>{getText()}</Text>
                <Icon name="arrow-drop-down" size={22} style={Styles.formSelectIcon}/>
            </Text>
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

Select.propTypes = {
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
};

Select.defaultProps = {
    mode: 'create',
    type: 'text',
    required: false,
    current: '',
    optionType: 'array',
    options: [],
    valueKey: 'value',
    loading: false,
};

export default Select;
