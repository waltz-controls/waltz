/**
 * Created by
 * User: khokhria
 * Date: 13.01.12
 */
String.prototype.contains = function(value) {
    if ((typeof value).toLowerCase() != 'string') return false;
    return this.indexOf(value) > -1;
};