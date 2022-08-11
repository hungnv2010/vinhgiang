import { StyleSheet } from 'react-native';
import Colors from './colors';

const FORM_INPUT_HEIGHT = 38;
const FORM_TEXT_AREA_HEIGHT = 100;
const FORM_LABEL_WIDTH = '35%';

const Styles = StyleSheet.create({
    textNormal: {
        color: Colors.black,
    },
    loadingContainer: {
        height: '100%',
        width: '100%',
        alignItems: 'center',
        textAlignVertical: 'center',
    },
    noOrder: {
        alignItems: 'center',
        textAlignVertical: 'center',
        justifyContent: 'center',
        flexGrow: 1,
        paddingVertical: 10,
        fontWeight: 'bold',
    },
    loginBg: {
        flex: 1,
    },
    screenContainer: {
        flex: 1,
        backgroundColor: Colors.white
    },
    centerContent: {
        alignItems: 'center',
        color: Colors.white
    },
    logoBanner: {
        height: 120,
        marginVertical: 100,
    },
    fullWidth: {
        width: '100%',
        paddingHorizontal: 10,
    },
    fullscreenModal: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    infoBox: {
        height: FORM_TEXT_AREA_HEIGHT,
    },
    screenContent: {
        paddingTop: 0,
        paddingHorizontal: 20,
        alignItems: 'center',
    },
    viewInput: {
        width: '100%',
    },
    selectContainer: {
        marginBottom: 0,
    },
    selectMethod: {
        minHeight: 30,
        paddingVertical: 0,
        paddingHorizontal: 0,
        margin: 0,
    },
    headerText: {
        color: Colors.white,
        textTransform: 'uppercase',
        fontWeight: 'bold',
    },
    headerIcon: {
        color: Colors.white,
    },
    sectionHeader: {
        flexDirection: 'row',
        flex: 1,
        width: '100%',
    },
    sectionTitle: {
        color: Colors.primary,
        lineHeight: 46,
        fontWeight: 'bold',
        fontSize: 20,
    },
    sectionTitleSmall: {
        color: Colors.primary,
        lineHeight: 30,
        fontWeight: 'bold',
        fontSize: 16,
    },
    leftItem: {
        alignItems: 'flex-start',
        lineHeight: 46,
    },
    rightItem: {
        flex: 1,
        position: 'absolute',
        alignItems: 'flex-end',
        right: 0,
    },
    container: {
        paddingVertical: 7,
        paddingHorizontal: 17,
        minHeight: 46,
        flexDirection: 'row',
        alignItems: 'center',
    },
    text: {
        flex: 1,
        marginRight: 10,
    },
    textInput: {
        marginTop: 5,
        borderWidth: 1,
        borderRadius: 8,
        marginBottom: 20,
        paddingVertical: 10,
    },
    textInputUnderline: {
        paddingVertical: 7,
        minHeight: 38,
        flexDirection: 'row',
        alignItems: 'center',
    },
    label: { flexDirection: 'row', justifyContent: 'space-between' },
    button: {
        backgroundColor: Colors.primary,
    },
    buttonLarge: {
        width: 295,
    },
    buttonFull: {
        width: '100%',
    },
    buttonTitleLarge: {
        textTransform: 'uppercase',
    },
    buttonCustom: {
        height: 80,
        textAlignVertical: 'top',
        paddingHorizontal: 10,
        flex: 1,
        borderColor: Colors.primary,
        backgroundColor: Colors.white_t,
        borderWidth: 1,
        borderRadius: 8,
    },
    rightButton: {
        lineHeight: 46,
        borderWidth: 1,
        borderRadius: 20,
        paddingHorizontal: 10,
        position: 'absolute',
        backgroundColor: Colors.primary,
        right: 0,
        marginVertical: 11,
    },
    rightButtonContainer: {
        margin: 0,
        padding: 0,
        height: 46,
        width: '100%',
        alignItems: 'flex-end',
    },
    smallButton: {
        lineHeight: 46,
        borderWidth: 1,
        borderRadius: 20,
        paddingHorizontal: 10,
        backgroundColor: Colors.primary,
    },
    buttonText: {
        color: Colors.white,
    },
    rightButtonText: {
        color: Colors.white,
        lineHeight: 24,
    },
    buttonContainer: {
        marginVertical: 26,
        marginHorizontal: 17,
    },
    inputLabel: {},
    inputContainer: {
        backgroundColor: Colors.white_t,
        borderRadius: 10,
        paddingHorizontal: 10,
        borderColor: Colors.gray_aaa,
    },
    inputLeftIcon: {
        backgroundColor: Colors.white_t,
        height: 46,
    },
    floatingIcon: {
        position: 'absolute',
        bottom: 25,
        right: 25,
    },
    floatingSearchButton: {
        position: 'absolute',
        top: 30,
        right: 25,
    },
    centerHeader: {
        flex: 1,
    },
    iconAdd: {
        elevation: 4,
        shadowOffset: {
            width: 0,
            height: 9,
        },
        shadowOpacity: 0.25,
        shadowRadius: 9,
    },
    header: {
        marginBottom: 40,
        paddingTop: 20,
        flexDirection: 'row',
        backgroundColor: Colors.primary,
    },
    formItem: {
        flexDirection: 'row',
        paddingBottom: 10,
        color: Colors.black,
        // marginVertical: 0,
    },
    formLabel: {
        width: FORM_LABEL_WIDTH,
        lineHeight: FORM_INPUT_HEIGHT,
        color: Colors.black,
    },
    formTextAreaContainer: {
        flexDirection: 'column',
    },
    formTextAreaLabel: {
        color: Colors.black,
        paddingBottom: 5,
    },
    formTextArea: {
        height: FORM_TEXT_AREA_HEIGHT,
        textAlignVertical: 'top',
        paddingHorizontal: 10,
        flex: 1,
        borderColor: Colors.primary,
        backgroundColor: Colors.white_t,
        borderWidth: 1,
        borderRadius: 8,
    },
    formTextAreaSmall: {
        minHeight:40,
        maxHeight:100,
        textAlignVertical: 'top',
        paddingHorizontal: 10,
        marginHorizontal: 10,
        flex: 1,
        borderColor: Colors.primary,
        backgroundColor: Colors.white_t,
        borderWidth: 0.5,
        borderRadius: 8,
    },
    formInputContainer: {
        flex: 1,
        padding: 0,
        margin: 0,
        height: FORM_INPUT_HEIGHT,
    },
    formInput: {
        height: FORM_INPUT_HEIGHT,
        paddingHorizontal: 10,
        color: Colors.black,
        flex: 1,
        textAlignVertical: 'center',
        borderColor: Colors.primary,
        backgroundColor: Colors.white_t,
        borderWidth: 1,
        borderRadius: 8,
    },
    formText: {
        height: FORM_INPUT_HEIGHT,
        paddingHorizontal: 10,
        color: Colors.black,
        flex: 1,
        textAlignVertical: 'center',
        textAlign:'center',
        borderColor: Colors.gray4,
        backgroundColor: Colors.white_t,
        borderWidth: 0.4,
        borderRadius: 8,
    },
    formSelectContainer: {
        flex: 1,
        flexDirection: 'row',
    },
    formSelectInput: {
        lineHeight: FORM_INPUT_HEIGHT,
    },
    formSelectIcon: {
        position: 'absolute',
        right: -10,
    },
    loadingItem: {
        paddingHorizontal: 25,
    },
    formTextInput: {
        flex: 1,
        borderColor: Colors.primary,
        color: Colors.black,
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 10,
        height: 36,
    },
    formSelectText: {
        flex: 1,
        flexDirection: 'row',
        justifyContent:'space-between',
        alignItems:'center',
        borderColor: Colors.primary,
        color: Colors.black,
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 10,
        height: 36,
    },
    formTextView: {
        flex: 1,
        borderColor: Colors.primary,
        borderWidth: 1,
        borderRadius: 8,
        textAlign: 'right',
        paddingHorizontal: 10,
        height: 36,
        backgroundColor: Colors.gray_t,
    },
    formTouchContent: {
        width: '100%',
    },
    touchContent: {
        color: Colors.black,
        textAlign: 'center',
        margin: 0,
        lineHeight: 30,
    },
    orderProducts: {
        width: '100%',
    },
    bottomPadding: {
        paddingBottom: 100,
    },
    bottomMargin: {
        marginBottom: 100,
    },
    listItemContainer: {
        width: '100%',
        flex: 1,
        borderBottomColor: Colors.primary,
        borderBottomWidth: 1,
        padding: 10,
        backgroundColor: Colors.white,
    },
    listItemTitle: {
        color: Colors.secondary,
        fontWeight: 'bold',
    },
    listItemContent: {},
    itemDd: {
        flex: 2,
        color: Colors.blue,
    },
    itemDt: {
        flex: 3,
        color: Colors.black,
        textAlignVertical: 'center'
    },
    itemDl: {
        flexDirection: 'row',
    },
    viewHiddenItem: {
        alignItems: 'flex-start',
    },
    touchDelete: {
        width: 68,
        height: '100%',
        justifyContent: 'center',
        borderWidth: 0,
    },
    subInfoContainer: {
        borderRadius: 10,
        borderColor: 'blue',
        borderWidth: 1,
        width: '100%',
        alignContent: 'flex-start',
        padding: 10,
    },
    subInfoTitle: {
        color: Colors.primary,
        fontWeight: 'bold',
    },
    productInfoContainer: {
        backgroundColor: '#55225555',
    },
    switchContainer: {
        alignItems: 'flex-end',
        width: '60%',
    },
    errorContainer: {
        backgroundColor: Colors.gray6,
        paddingHorizontal: 30,
        elevation: 5,
        alignItems: 'center',
    },
    errorItem: {
        color: Colors.primary,
    },
    tabBar: {
        paddingBottom: 20,
    },
    modalLabel: {
        textTransform: 'uppercase',
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 16,
        color: Colors.primary,
        paddingBottom: 20,
    },
    accordionContent: {
        padding: 10,
        backgroundColor: Colors.secondary,
    },
    accordionCollapseContent: {
        height: 0,
    },
    alert: {
        color: Colors.primary,
    },
    touchToReload: {
        textAlignVertical: 'center',
        marginVertical: 50,
        color: Colors.red,
        fontWeight: 'bold',
    },
    selectedSubItem: {
        fontWeight: 'bold',
        fontSize: 14,
        color: Colors.primary,
    },
    selectedItem: {
        fontWeight: 'bold',
        color: Colors.primary,
    },
    normalSubItem: {
        color: Colors.gray4,
        fontSize: 14,
    },
    normalItem: {},
    filterInput: {
        color: Colors.black,
        height: 38,
        borderWidth: 1,
        borderRadius: 10,
        marginHorizontal: 20,
        borderColor: Colors.primary,
    },
    paginationContainer: {
        marginTop: 10,
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        alignContent: 'center',
    },
    paginationButton: {
        width: '30%',
        height: FORM_INPUT_HEIGHT,
    },
    paginationButtonDisabled: {
        width: '30%',
        alignItems: 'center',
        height: FORM_INPUT_HEIGHT,
        textAlignVertical: 'center',
        paddingHorizontal: 10,
        borderColor: Colors.gray,
        backgroundColor: Colors.gray_t,
    },
    paginationInput: {
        textAlign: 'center',
        height: FORM_INPUT_HEIGHT,
        lineHeight: FORM_INPUT_HEIGHT,
        paddingHorizontal: 10,
        borderColor: Colors.primary,
        backgroundColor: Colors.white_t,
        borderWidth: 1,
        borderRadius: 8,
        marginHorizontal: '5%',
        width: '30%',
    },
    paginationIcon: {
        color: Colors.white,
        lineHeight: FORM_INPUT_HEIGHT,
    },
    checkBoxContainer: {
        backgroundColor: Colors.transparent,
        borderWidth: 0,
    },
    checkBox: {
        color: Colors.white,
    },

    productList: { flex: 1, padding: 5 },
    productViewNoList: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    productViewFilter: { flexDirection: "row" },
    productViewFilterCategori: { padding: 5, flexDirection: "row", alignItems: "center", justifyContent: "center", borderWidth: 0.5, borderColor: "#aaa", borderRadius: 7, height: 40, margin: 10, marginBottom: 0, marginRight: 0 },
    productViewSearch: { flexDirection: "row", paddingHorizontal: 5, alignItems: "center", justifyContent: "center", borderWidth: 0.5, borderColor: "#aaa", borderRadius: 7, height: 40, margin: 10, marginBottom: 0, flex: 1 },
    productInputSearch: { flex: 1 },
    productTextFilterCategori: { paddingHorizontal: 5, alignSelf: "center" },
    productViewApply: { padding: 5, flexDirection: "row", alignItems: "center", justifyContent: "center", borderWidth: 0, backgroundColor: Colors.primary, borderRadius: 7, height: 40, margin: 10, marginBottom: 0, marginRight: 0 },
    productTextApply: { color: Colors.white },
    productViewModalCategori: { padding: 20, paddingTop: 0, zIndex: 9999999 },
    productIconCloseModalCategori: { alignSelf: "flex-end", padding: 0 },
    productViewItemModalCategori: { padding: 0, flexDirection: "row", alignItems: "center", justifyContent: "center", },
    productItemNameCategori: { padding: 0, alignSelf: "center", flex: 1 },
    productCheckBox: { padding: 0, margin: 10 },
    detailCustomerViewTextInput: { flexDirection: "row", paddingHorizontal: 5, alignItems: "center", justifyContent: "center", borderWidth: 0.5, borderColor: "#aaa", borderRadius: 7, height: 40, margin: 5, marginBottom: 0 },
    detailCustomerInput: { flex: 1 },
    detailCustomerApply: { padding: 5, flexDirection: "row", alignItems: "center", justifyContent: "center", borderWidth: 0, backgroundColor: Colors.primary, borderRadius: 7, height: 40, margin: 10 },
    detailCustomerTextApply: { color: Colors.white },
    customerAdd: { right: 20, bottom: 15, position: "absolute" },
    customerButonAdd: { borderRadius: 1000 },
    backgroundColorF5F5F5: { backgroundColor: '#F5F5F5' },
    viewItemProduct: { padding: 3, margin: 5, borderRadius: 10, borderColor: 'silver', borderWidth: 0.5, },
    viewItemProductOrder: { padding: 3, borderRadius: 0, borderColor: 'silver', borderWidth: 0.5, },
    flexDirection: { flexDirection: 'row' },
    itemViewContent: { flexDirection: 'column', justifyContent: 'space-between', flex: 1, padding: 5, marginLeft: 5 },
    itemViewIcon: { flexDirection: 'column', justifyContent: 'center', alignItems: "center" },
    itemProductText: { color: Colors.gray_aaa, marginTop: 5, fontSize: 12 },
    textSize14: { fontSize: 14 },
    salesmanStyle: { padding: 5, flexDirection: "row", alignItems: "center", justifyContent: "center", borderWidth: 0.5, borderColor: "#aaa", borderRadius: 10, height: 40, margin: 10, marginBottom: 0, marginRight: 0 },
});

export default Styles;
