export class StringUtils {
    static capitalize(str){
        return str.charAt(0).toUpperCase()+str.substr(1).toLowerCase();
    }

    static classize(str) {
        return str.split(/_|-/).map(part => StringUtils.capitalize(part)).join('');
    }

    static camelize(str){
        const [head, ...tail] = str.split(/_|-/);
        return [head].concat(tail.map(part => StringUtils.capitalize(part))).join('');
    }
}