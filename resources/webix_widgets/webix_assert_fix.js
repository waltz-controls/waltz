webix.assert = function (expression, message) {
    if(!expression)
        webix.message(message,"error");
};
