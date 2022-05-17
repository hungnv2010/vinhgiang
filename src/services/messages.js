import {showMessage} from 'react-native-flash-message';
import {StatusBar} from 'react-native';


const messageService = {
    showError: (message) => {
        showMessage({
            message,
            type: 'danger',
            hideStatusBar:false,
            floating:true,
            statusBarHeight:StatusBar.currentHeight
        });
    },
    showInfo: (message) => {
        showMessage({
            message,
            type: 'info',
            hideStatusBar:false,
            floating:true,
            statusBarHeight:StatusBar.currentHeight
        });
    },
    showSuccess: (message) => {
        showMessage({
            message,
            type:'success',
            hideStatusBar:false,
            floating:true,
            statusBarHeight:StatusBar.currentHeight
        });
    },
};

export default messageService;
