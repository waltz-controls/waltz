/**
 * Model tango_admin_device
 *
 * Extends {@link https://jmvc-15x.github.io/docs/classes/MVC.Model.html MVC.Model}
 * @class
 * @memberof tango
 * @property {TangoDevice} device
 */
TangoAdminDevice = MVC.Model.extend('tango_admin_device',
    /** @lends  tango.TangoAdminDevice */
    {

        attributes: {
            device: 'TangoDevice'
        },
        default_attributes: {}
    },
    /** @lends  tango.TangoAdminDevice.prototype */
    {
        /**
         * @param longStringValue
         * @returns {webix.promise}
         */
        addObjPolling: function (longStringValue) {
            return this.device.executeCommand('AddObjPolling', longStringValue)
        },
        /**
         * @param longStringValue
         * @returns {*|webix.promise}
         */
        updObjPollingPeriod: function (longStringValue) {
            return this.device.executeCommand('UpdObjPollingPeriod', longStringValue)
        },
        /**
         * @param args
         * @returns {*|webix.promise}
         */
        remObjPolling: function (args) {
            return this.device.executeCommand('RemObjPolling', args)
        },
        /**
         *
         * @param {string} device_name
         * @param {{polling_type:string, name:string,polled:boolean}} pollable
         * @param {boolean} polled - new polling state
         * @param {int} poll_rate - new poll rate
         * @return {polled:boolean, poll_rate:int} pollable
         */
        updatePolling(device_name, pollable, polled, poll_rate = 0){
            if (polled)
                if (!pollable.polled)
                    this.addObjPolling({
                        lvalue: [poll_rate],
                        svalue: [device_name, pollable.polling_type, pollable.name]
                    });
                else
                    this.updObjPollingPeriod({
                        lvalue: [poll_rate],
                        svalue: [device_name, pollable.polling_type, pollable.name]
                    });
            else if (pollable.polled)
                this.remObjPolling([device_name, pollable.polling_type, pollable.name]);

            return {
                polled,
                poll_rate
            };
        },
        /**
         * @param {} args
         * @returns {*|webix.promise}
         */
        getLoggingLevel: function (args) {
            return this.device.executeCommand("GetLoggingLevel", args)
        },
        /**
         * @param {string} arg - device name
         * @returns {*|webix.promise}
         */
        getLoggingTarget: function (arg) {
            return this.device.executeCommand("GetLoggingTarget", arg);
        },
        /**
         * @param device
         * @returns {Promise}
         */
        devPollStatus: function (device) {
            return this.device.executeCommand('DevPollStatus', device);
        }
    }
);