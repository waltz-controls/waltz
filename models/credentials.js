Credentials = MVC.Model.extend("credentials", {
    id: "name",
    attributes: {
        name: "string",
        password: "string"
    },
    default_attributes: {}
}, {
    toString: function () {
        return this.name + ":" + this.password;
    }
});