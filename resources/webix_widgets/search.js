/**
 *
 * @param {string} target
 * @param {string|function} filter
 */
export default function newSearch(target, filter){
    return {
        view: "search",
        placeholder: "type to filter",
        borderless: true,
        value: "",
        on: {
            onTimedKeyPress: function () {
                this.getTopParentView().$$(target).filter(filter, this.getValue());
            },
            onFocus: function () {
                this.getTopParentView().$$(target).filter(filter, this.getValue());
            }
        }
    }
}

/**
 *
 * @param {function} filter
 */
export function newComplexSearch(filter){
    return {
        view: "search",
        placeholder: "type to filter",
        borderless: true,
        value: "",
        on: {
            onTimedKeyPress: filter,
            onFocus: filter
        }
    }
}