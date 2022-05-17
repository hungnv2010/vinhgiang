import _ from 'lodash';

export default class InvalidRequest extends Error {
    type: 'InvalidRequest';

    constructor(props) {
        super(props);
        console.log('InvalidRequest', JSON.stringify(props), _.isString(props));
        Object.assign(this, props);
        if (props.data?.error) {
            this.message = props.data.error;
        }
    }


    static compare(e) {
        if (e.type === 'InvalidRequest') {
            return true;
        }
        return e instanceof InvalidRequest;

    }
}
