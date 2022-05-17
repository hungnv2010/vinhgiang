export default class InvalidAccessToken extends Error {
    type: 'InvalidAccessToken';

    static compare(e) {
        if (e.type === 'InvalidAccessToken') {
            return true;
        }
        if (e instanceof InvalidAccessToken) {
            return true;
        }
        return !!e.message?.includes('Accesstoken is not valid');
    }
}
