;
/**
 *
 * User: ingvord
 * Date: 3/8/14
 */
window.noty.error = function (msg) {
    noty({
        text: msg,
        type: 'error',
        timeout: 6000
    });
};
window.noty.alert = function (msg) {
    noty({
        text: msg,
        timeout: 1500
    });
};
window.noty.success = function (msg) {
    noty({
        text: msg,
        type: 'success',
        timeout: 1500
    });
};