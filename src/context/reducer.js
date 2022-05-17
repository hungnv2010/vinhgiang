export const REQUEST_LOGIN = 'REQUEST_LOGIN';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_ERROR = 'LOGIN_ERROR';
export const LOGOUT = 'LOGOUT';

export const defaultInitialState = {
    user: '',
    token: '',
    loading: false,
    errorMessage: null,
};

export const AuthReducer = (initialState, action) => {
    switch (action.type) {
        case REQUEST_LOGIN:
            return {
                ...initialState,
                loading: true,
            };
        case LOGIN_SUCCESS:
            return {
                ...initialState,
                errorMessage: '',
                user: action.payload.user,
                token: action.payload.token,
                loading: false,
            };
        case LOGIN_ERROR:
            return {
                ...initialState,
                user: '',
                token: '',
                errorMessage: action.payload.message,
                loading: false,
            };
        case 'LOGOUT':
            return {
                ...initialState,
                user: '',
                token: '',
            };
        default:
            throw new Error(`Unhandled action type: ${action.type}`);
    }
};
