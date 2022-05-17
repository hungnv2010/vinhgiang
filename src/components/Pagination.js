import React from 'react';
import {Text, TextInput, TouchableOpacity, View} from 'react-native';
import {PropTypes} from '../base';
import {Button, Icon} from 'react-native-elements';
import {Styles} from '../configs';

const Pagination = (props) => {
    const {currentPage, totalPage, loading, onBack, onNext} = props;
    const showBack = currentPage !== 1;
    const showNext = currentPage !== totalPage;
    const onPageChange = (evt) => {
        evt.preventDefault();
        console.log(evt);
    };
    return <View style={Styles.paginationContainer}>
        <Button
            onPress={onBack}
            icon={<Icon name="arrow-right" size={20} color="white"/>}
            containerStyle={Styles.paginationButton}
            disabled={!showBack}/>
        <Text style={Styles.paginationInput}>
            {`${currentPage} / ${totalPage}`}
        </Text>
        <Button
            onPress={onNext}
            icon={<Icon name="arrow-right" size={20} color="white"/>}
            containerStyle={Styles.paginationButton}
            disabled={!showNext}/>
    </View>;
};

Pagination.propTypes = {
    loading: PropTypes.bool,
    currentPage: PropTypes.number,
    totalPage: PropTypes.number,
    onBack: PropTypes.func,
    onNext: PropTypes.func,
    onSelectPage: PropTypes.func,
};

Pagination.defaultProps = {
    currentPage: 1,
    totalPage: 1,
};

export default Pagination;
