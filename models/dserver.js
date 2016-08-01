/**
 * This file is generated using mtango cmd tool
 * Do not edit it manually!
 */
DServer = MVC.Model.extend('dserver',
    /* @Static */
    {
        //@Generated from tango server - a list of attributes, type mapping is defined in the generator
        attributes:{
            
            
            State : {
                label      : "State",
                description: "No description",
                isReadOnly : true,
                dataFormat : "SCALAR",
                dataType   : "State",
                unit       : "No unit",
                displayUnit: "No display unit",
                maxDimX    : 1,
                maxDimY    : 0,
                maxValue   : "Not specified",
                minValue   : "Not specified"
            } , 
            
            
            Status : {
                label      : "Status",
                description: "No description",
                isReadOnly : true,
                dataFormat : "SCALAR",
                dataType   : "DevString",
                unit       : "No unit",
                displayUnit: "No display unit",
                maxDimX    : 1,
                maxDimY    : 0,
                maxValue   : "Not specified",
                minValue   : "Not specified"
            } 
            
        },
        //@Genetrated from tango server
        commands:{
            
            
            AddLoggingTarget : {
                inputType   : "DevVarStringArray",
                inputDescription : "Str[i]=Device-name. Str[i+1]=Target-type::Target-name",
                outputType  : "DevVoid",
                outputDescription : "Uninitialised"
            }, 
            
            
            AddObjPolling : {
                inputType   : "DevVarLongStringArray",
                inputDescription : "Lg[0]=Upd period. Str[0]=Device name. Str[1]=Object type. Str[2]=Object name",
                outputType  : "DevVoid",
                outputDescription : "Uninitialised"
            }, 
            
            
            DevLockStatus : {
                inputType   : "DevString",
                inputDescription : "Device name",
                outputType  : "DevVarLongStringArray",
                outputDescription : "Device locking status"
            }, 
            
            
            DevPollStatus : {
                inputType   : "DevString",
                inputDescription : "Device name",
                outputType  : "DevVarStringArray",
                outputDescription : "Device polling status"
            }, 
            
            
            DevRestart : {
                inputType   : "DevString",
                inputDescription : "Device name",
                outputType  : "DevVoid",
                outputDescription : "Uninitialised"
            }, 
            
            
            EventConfirmSubscription : {
                inputType   : "DevVarStringArray",
                inputDescription : "Str[0] = dev1 name, Str[1] = att1 name, Str[2] = event name, Str[3] = dev2 name, Str[4] = att2 name, Str[5] = event name,...",
                outputType  : "DevVoid",
                outputDescription : "Uninitialised"
            }, 
            
            
            EventSubscriptionChange : {
                inputType   : "DevVarStringArray",
                inputDescription : "Event consumer wants to subscribe to",
                outputType  : "DevLong",
                outputDescription : "Tango lib release"
            }, 
            
            
            GetLoggingLevel : {
                inputType   : "DevVarStringArray",
                inputDescription : "Device list",
                outputType  : "DevVarLongStringArray",
                outputDescription : "Lg[i]=Logging Level. Str[i]=Device name."
            }, 
            
            
            GetLoggingTarget : {
                inputType   : "DevString",
                inputDescription : "Device name",
                outputType  : "DevVarStringArray",
                outputDescription : "Logging target list"
            }, 
            
            
            Init : {
                inputType   : "DevVoid",
                inputDescription : "Uninitialised",
                outputType  : "DevVoid",
                outputDescription : "Uninitialised"
            }, 
            
            
            Kill : {
                inputType   : "DevVoid",
                inputDescription : "Uninitialised",
                outputType  : "DevVoid",
                outputDescription : "Uninitialised"
            }, 
            
            
            LockDevice : {
                inputType   : "DevVarLongStringArray",
                inputDescription : "Str[0] = Device name. Lg[0] = Lock validity",
                outputType  : "DevVoid",
                outputDescription : "Uninitialised"
            }, 
            
            
            PolledDevice : {
                inputType   : "DevVoid",
                inputDescription : "Uninitialised",
                outputType  : "DevVarStringArray",
                outputDescription : "Polled device name list"
            }, 
            
            
            QueryClass : {
                inputType   : "DevVoid",
                inputDescription : "Uninitialised",
                outputType  : "DevVarStringArray",
                outputDescription : "Device server class(es) list"
            }, 
            
            
            QueryDevice : {
                inputType   : "DevVoid",
                inputDescription : "Uninitialised",
                outputType  : "DevVarStringArray",
                outputDescription : "Device server device(s) list"
            }, 
            
            
            QuerySubDevice : {
                inputType   : "DevVoid",
                inputDescription : "Uninitialised",
                outputType  : "DevVarStringArray",
                outputDescription : "Device server sub device(s) list"
            }, 
            
            
            QueryWizardClassProperty : {
                inputType   : "DevString",
                inputDescription : "Class name",
                outputType  : "DevVarStringArray",
                outputDescription : "Class property list (name - description and default value)"
            }, 
            
            
            QueryWizardDevProperty : {
                inputType   : "DevString",
                inputDescription : "Class name",
                outputType  : "DevVarStringArray",
                outputDescription : "Device property list (name - description and default value)"
            }, 
            
            
            ReLockDevices : {
                inputType   : "DevVarStringArray",
                inputDescription : "Device(s) name",
                outputType  : "DevVoid",
                outputDescription : "Uninitialised"
            }, 
            
            
            RemObjPolling : {
                inputType   : "DevVarStringArray",
                inputDescription : "Str[0]=Device name. Str[1]=Object type. Str[2]=Object name",
                outputType  : "DevVoid",
                outputDescription : "Uninitialised"
            }, 
            
            
            RemoveLoggingTarget : {
                inputType   : "DevVarStringArray",
                inputDescription : "Str[i]=Device-name. Str[i+1]=Target-type::Target-name",
                outputType  : "DevVoid",
                outputDescription : "Uninitialised"
            }, 
            
            
            RestartServer : {
                inputType   : "DevVoid",
                inputDescription : "Uninitialised",
                outputType  : "DevVoid",
                outputDescription : "Uninitialised"
            }, 
            
            
            SetLoggingLevel : {
                inputType   : "DevVarLongStringArray",
                inputDescription : "Lg[i]=Logging Level. Str[i]=Device name.",
                outputType  : "DevVoid",
                outputDescription : "Uninitialised"
            }, 
            
            
            StartLogging : {
                inputType   : "DevVoid",
                inputDescription : "Uninitialised",
                outputType  : "DevVoid",
                outputDescription : "Uninitialised"
            }, 
            
            
            StartPolling : {
                inputType   : "DevVoid",
                inputDescription : "Uninitialised",
                outputType  : "DevVoid",
                outputDescription : "Uninitialised"
            }, 
            
            
            State : {
                inputType   : "DevVoid",
                inputDescription : "Uninitialised",
                outputType  : "State",
                outputDescription : "Device state"
            }, 
            
            
            Status : {
                inputType   : "DevVoid",
                inputDescription : "Uninitialised",
                outputType  : "DevString",
                outputDescription : "Device status"
            }, 
            
            
            StopLogging : {
                inputType   : "DevVoid",
                inputDescription : "Uninitialised",
                outputType  : "DevVoid",
                outputDescription : "Uninitialised"
            }, 
            
            
            StopPolling : {
                inputType   : "DevVoid",
                inputDescription : "Uninitialised",
                outputType  : "DevVoid",
                outputDescription : "Uninitialised"
            }, 
            
            
            UnLockDevice : {
                inputType   : "DevVarLongStringArray",
                inputDescription : "Str[x] = Device name(s). Lg[0] = Force flag",
                outputType  : "DevLong",
                outputDescription : "Device global lock counter"
            }, 
            
            
            UpdObjPollingPeriod : {
                inputType   : "DevVarLongStringArray",
                inputDescription : "Lg[0]=Upd period. Str[0]=Device name. Str[1]=Object type. Str[2]=Object name",
                outputType  : "DevVoid",
                outputDescription : "Uninitialised"
            }, 
            
            
            ZmqEventSubscriptionChange : {
                inputType   : "DevVarStringArray",
                inputDescription : "Events consumer wants to subscribe to",
                outputType  : "DevVarLongStringArray",
                outputDescription : "Str[0] = Heartbeat pub endpoint - Str[1] = Event pub endpoint; Lg[0] = Tango lib release - Lg[1] = Device IDL release; Lg[2] = Subscriber HWM - Lg[3] = Multicast rate; Lg[4] = Multicast IVL - Lg[5] = ZMQ release"
            }
            
        }
    },
    /* @Prototype */
    {
        api: null,
        name: null,
        /**
         * @constructor
         *
         * Creates a new instance of DServer proxy
         *
         * @param {string} server -- server name, e.g. TestServer/test
         * @param {TangoRest} api -- rest api wrapper
         */
        init: function(server, api){
            this.api = api;
            this.name = "dserver/" + server
        },
        
        
        /**
         * Executes command AddLoggingTarget on the remote server
         *
         * @param {*} argin - argument for the command [optional]
         * @param {Object|Function} cbks: onSuccess - callback [required]; onFailure - panic callback [optional]
         */
        AddLoggingTarget : function(argin, cbks){
            var promise = this.api.devices(this.name).commands('AddLoggingTarget').exec.apply(this.api, argin);
            if (cbks) {
                var callbacks = this.Class._clean_callbacks(cbks);
                if (callbacks.onFailure) promise.fail(callbacks.onFailure);
                if (callbacks.onSuccess) return promise.then(callbacks.onSuccess);
            }
            else return promise;
        },

        /**
         * Executes command AddObjPolling on the remote server
         *
         * @param {*} argin - argument for the command [optional]
         * @param {Object|Function} cbks: onSuccess - callback [required]; onFailure - panic callback [optional]
         */
        AddObjPolling : function(argin, cbks){
            var promise = this.api.devices(this.name).commands('AddObjPolling').exec(argin);
            if (cbks) {
                var callbacks = this.Class._clean_callbacks(cbks);
                if (callbacks.onFailure) promise.fail(callbacks.onFailure);
                if (callbacks.onSuccess) return promise.then(callbacks.onSuccess);
            }
            else return promise;
        },
        /**
         * Executes command DevLockStatus on the remote server
         *
         * @param {*} argin - argument for the command [optional]
         * @param {Object|Function} cbks: onSuccess - callback [required]; onFailure - panic callback [optional]
         */
        DevLockStatus : function(argin, cbks){
            var promise = this.api.devices(this.name).commands('DevLockStatus').exec.apply(this.api, argin);
            if (cbks) {
                var callbacks = this.Class._clean_callbacks(cbks);
                if (callbacks.onFailure) promise.fail(callbacks.onFailure);
                if (callbacks.onSuccess) return promise.then(callbacks.onSuccess);
            }
            else return promise;
        },
        /**
         * Executes command DevPollStatus on the remote server
         *
         * @param {*} argin - argument for the command [optional]
         * @param {Object|Function} cbks: onSuccess - callback [required]; onFailure - panic callback [optional]
         */
        DevPollStatus : function(argin, cbks){
            var promise = this.api.devices(this.name).commands('DevPollStatus').exec(argin);
            if (cbks) {
                var callbacks = this.Class._clean_callbacks(cbks);
                if (callbacks.onFailure) promise.fail(callbacks.onFailure);
                if (callbacks.onSuccess) return promise.then(callbacks.onSuccess);
            }
            else return promise;
        },
        /**
         * Executes command DevRestart on the remote server
         *
         * @param {*} argin - argument for the command [optional]
         * @param {Object|Function} cbks: onSuccess - callback [required]; onFailure - panic callback [optional]
         */
        DevRestart : function(argin, cbks){
            var promise = this.api.devices(this.name).commands('DevRestart').exec.apply(this.api, argin);
            if (cbks) {
                var callbacks = this.Class._clean_callbacks(cbks);
                if (callbacks.onFailure) promise.fail(callbacks.onFailure);
                if (callbacks.onSuccess) return promise.then(callbacks.onSuccess);
            }
            else return promise;
        },
        /**
         * Executes command EventConfirmSubscription on the remote server
         *
         * @param {*} argin - argument for the command [optional]
         * @param {Object|Function} cbks: onSuccess - callback [required]; onFailure - panic callback [optional]
         */
        EventConfirmSubscription : function(argin, cbks){
            var promise = this.api.devices(this.name).commands('EventConfirmSubscription').exec.apply(this.api, argin);
            if (cbks) {
                var callbacks = this.Class._clean_callbacks(cbks);
                if (callbacks.onFailure) promise.fail(callbacks.onFailure);
                if (callbacks.onSuccess) return promise.then(callbacks.onSuccess);
            }
            else return promise;
        },
        /**
         * Executes command EventSubscriptionChange on the remote server
         *
         * @param {*} argin - argument for the command [optional]
         * @param {Object|Function} cbks: onSuccess - callback [required]; onFailure - panic callback [optional]
         */
        EventSubscriptionChange : function(argin, cbks){
            var promise = this.api.devices(this.name).commands('EventSubscriptionChange').exec.apply(this.api, argin);
            if (cbks) {
                var callbacks = this.Class._clean_callbacks(cbks);
                if (callbacks.onFailure) promise.fail(callbacks.onFailure);
                if (callbacks.onSuccess) return promise.then(callbacks.onSuccess);
            }
            else return promise;
        },
        /**
         * Executes command GetLoggingLevel on the remote server
         *
         * @param {*} argin - argument for the command [optional]
         * @param {Object|Function} cbks: onSuccess - callback [required]; onFailure - panic callback [optional]
         */
        GetLoggingLevel : function(argin, cbks){
            var promise = this.api.devices(this.name).commands('GetLoggingLevel').exec(argin);
            if (cbks) {
                var callbacks = this.Class._clean_callbacks(cbks);
                if (callbacks.onFailure) promise.fail(callbacks.onFailure);
                if (callbacks.onSuccess) return promise.then(callbacks.onSuccess);
            }
            else return promise;
        },
        /**
         * Executes command GetLoggingTarget on the remote server
         *
         * @param {*} argin - argument for the command [optional]
         * @param {Object|Function} cbks: onSuccess - callback [required]; onFailure - panic callback [optional]
         */
        GetLoggingTarget : function(argin, cbks){
            var promise = this.api.devices(this.name).commands('GetLoggingTarget').exec.apply(this.api, argin);
            if (cbks) {
                var callbacks = this.Class._clean_callbacks(cbks);
                if (callbacks.onFailure) promise.fail(callbacks.onFailure);
                if (callbacks.onSuccess) return promise.then(callbacks.onSuccess);
            }
            else return promise;
        },
        /**
         * Executes command Init on the remote server
         *
         * @param {*} argin - argument for the command [optional]
         * @param {Object|Function} cbks: onSuccess - callback [required]; onFailure - panic callback [optional]
         */
        Init : function(argin, cbks){
            var promise = this.api.devices(this.name).commands('Init').exec.apply(this.api, argin);
            if (cbks) {
                var callbacks = this.Class._clean_callbacks(cbks);
                if (callbacks.onFailure) promise.fail(callbacks.onFailure);
                if (callbacks.onSuccess) return promise.then(callbacks.onSuccess);
            }
            else return promise;
        },
        /**
         * Executes command Kill on the remote server
         *
         * @param {*} argin - argument for the command [optional]
         * @param {Object|Function} cbks: onSuccess - callback [required]; onFailure - panic callback [optional]
         */
        Kill : function(argin, cbks){
            var promise = this.api.devices(this.name).commands('Kill').exec.apply(this.api, argin);
            if (cbks) {
                var callbacks = this.Class._clean_callbacks(cbks);
                if (callbacks.onFailure) promise.fail(callbacks.onFailure);
                if (callbacks.onSuccess) return promise.then(callbacks.onSuccess);
            }
            else return promise;
        },
        /**
         * Executes command LockDevice on the remote server
         *
         * @param {*} argin - argument for the command [optional]
         * @param {Object|Function} cbks: onSuccess - callback [required]; onFailure - panic callback [optional]
         */
        LockDevice : function(argin, cbks){
            var promise = this.api.devices(this.name).commands('LockDevice').exec.apply(this.api, argin);
            if (cbks) {
                var callbacks = this.Class._clean_callbacks(cbks);
                if (callbacks.onFailure) promise.fail(callbacks.onFailure);
                if (callbacks.onSuccess) return promise.then(callbacks.onSuccess);
            }
            else return promise;
        },
        /**
         * Executes command PolledDevice on the remote server
         *
         * @param {*} argin - argument for the command [optional]
         * @param {Object|Function} cbks: onSuccess - callback [required]; onFailure - panic callback [optional]
         */
        PolledDevice : function(argin, cbks){
            var promise = this.api.devices(this.name).commands('PolledDevice').exec.apply(this.api, argin);
            if (cbks) {
                var callbacks = this.Class._clean_callbacks(cbks);
                if (callbacks.onFailure) promise.fail(callbacks.onFailure);
                if (callbacks.onSuccess) return promise.then(callbacks.onSuccess);
            }
            else return promise;
        },
        /**
         * Executes command QueryClass on the remote server
         *
         * @param {*} argin - argument for the command [optional]
         * @param {Object|Function} cbks: onSuccess - callback [required]; onFailure - panic callback [optional]
         */
        QueryClass : function(argin, cbks){
            var promise = this.api.devices(this.name).commands('QueryClass').exec.apply(this.api, argin);
            if (cbks) {
                var callbacks = this.Class._clean_callbacks(cbks);
                if (callbacks.onFailure) promise.fail(callbacks.onFailure);
                if (callbacks.onSuccess) return promise.then(callbacks.onSuccess);
            }
            else return promise;
        },
        /**
         * Executes command QueryDevice on the remote server
         *
         * @param {*} argin - argument for the command [optional]
         * @param {Object|Function} cbks: onSuccess - callback [required]; onFailure - panic callback [optional]
         */
        QueryDevice : function(argin, cbks){
            var promise = this.api.devices(this.name).commands('QueryDevice').exec.apply(this.api, argin);
            if (cbks) {
                var callbacks = this.Class._clean_callbacks(cbks);
                if (callbacks.onFailure) promise.fail(callbacks.onFailure);
                if (callbacks.onSuccess) return promise.then(callbacks.onSuccess);
            }
            else return promise;
        },
        /**
         * Executes command QuerySubDevice on the remote server
         *
         * @param {*} argin - argument for the command [optional]
         * @param {Object|Function} cbks: onSuccess - callback [required]; onFailure - panic callback [optional]
         */
        QuerySubDevice : function(argin, cbks){
            var promise = this.api.devices(this.name).commands('QuerySubDevice').exec.apply(this.api, argin);
            if (cbks) {
                var callbacks = this.Class._clean_callbacks(cbks);
                if (callbacks.onFailure) promise.fail(callbacks.onFailure);
                if (callbacks.onSuccess) return promise.then(callbacks.onSuccess);
            }
            else return promise;
        },
        /**
         * Executes command QueryWizardClassProperty on the remote server
         *
         * @param {*} argin - argument for the command [optional]
         * @param {Object|Function} cbks: onSuccess - callback [required]; onFailure - panic callback [optional]
         */
        QueryWizardClassProperty : function(argin, cbks){
            var promise = this.api.devices(this.name).commands('QueryWizardClassProperty').exec.apply(this.api, argin);
            if (cbks) {
                var callbacks = this.Class._clean_callbacks(cbks);
                if (callbacks.onFailure) promise.fail(callbacks.onFailure);
                if (callbacks.onSuccess) return promise.then(callbacks.onSuccess);
            }
            else return promise;
        },
        /**
         * Executes command QueryWizardDevProperty on the remote server
         *
         * @param {*} argin - argument for the command [optional]
         * @param {Object|Function} cbks: onSuccess - callback [required]; onFailure - panic callback [optional]
         */
        QueryWizardDevProperty : function(argin, cbks){
            var promise = this.api.devices(this.name).commands('QueryWizardDevProperty').exec.apply(this.api, argin);
            if (cbks) {
                var callbacks = this.Class._clean_callbacks(cbks);
                if (callbacks.onFailure) promise.fail(callbacks.onFailure);
                if (callbacks.onSuccess) return promise.then(callbacks.onSuccess);
            }
            else return promise;
        },
        /**
         * Executes command ReLockDevices on the remote server
         *
         * @param {*} argin - argument for the command [optional]
         * @param {Object|Function} cbks: onSuccess - callback [required]; onFailure - panic callback [optional]
         */
        ReLockDevices : function(argin, cbks){
            var promise = this.api.devices(this.name).commands('ReLockDevices').exec.apply(this.api, argin);
            if (cbks) {
                var callbacks = this.Class._clean_callbacks(cbks);
                if (callbacks.onFailure) promise.fail(callbacks.onFailure);
                if (callbacks.onSuccess) return promise.then(callbacks.onSuccess);
            }
            else return promise;
        },
        /**
         * Executes command RemObjPolling on the remote server
         *
         * @param {*} argin - argument for the command [optional]
         * @param {Object|Function} cbks: onSuccess - callback [required]; onFailure - panic callback [optional]
         */
        RemObjPolling : function(argin, cbks){
            var promise = this.api.devices(this.name).commands('RemObjPolling').exec.apply(this.api, argin);
            if (cbks) {
                var callbacks = this.Class._clean_callbacks(cbks);
                if (callbacks.onFailure) promise.fail(callbacks.onFailure);
                if (callbacks.onSuccess) return promise.then(callbacks.onSuccess);
            }
            else return promise;
        },
        /**
         * Executes command RemoveLoggingTarget on the remote server
         *
         * @param {*} argin - argument for the command [optional]
         * @param {Object|Function} cbks: onSuccess - callback [required]; onFailure - panic callback [optional]
         */
        RemoveLoggingTarget : function(argin, cbks){
            var promise = this.api.devices(this.name).commands('RemoveLoggingTarget').exec.apply(this.api, argin);
            if (cbks) {
                var callbacks = this.Class._clean_callbacks(cbks);
                if (callbacks.onFailure) promise.fail(callbacks.onFailure);
                if (callbacks.onSuccess) return promise.then(callbacks.onSuccess);
            }
            else return promise;
        },
        /**
         * Executes command RestartServer on the remote server
         *
         * @param {*} argin - argument for the command [optional]
         * @param {Object|Function} cbks: onSuccess - callback [required]; onFailure - panic callback [optional]
         */
        RestartServer : function(argin, cbks){
            var promise = this.api.devices(this.name).commands('RestartServer').exec.apply(this.api, argin);
            if (cbks) {
                var callbacks = this.Class._clean_callbacks(cbks);
                if (callbacks.onFailure) promise.fail(callbacks.onFailure);
                if (callbacks.onSuccess) return promise.then(callbacks.onSuccess);
            }
            else return promise;
        },
        /**
         * Executes command SetLoggingLevel on the remote server
         *
         * @param {*} argin - argument for the command [optional]
         * @param {Object|Function} cbks: onSuccess - callback [required]; onFailure - panic callback [optional]
         */
        SetLoggingLevel : function(argin, cbks){
            var promise = this.api.devices(this.name).commands('SetLoggingLevel').exec.apply(this.api, argin);
            if (cbks) {
                var callbacks = this.Class._clean_callbacks(cbks);
                if (callbacks.onFailure) promise.fail(callbacks.onFailure);
                if (callbacks.onSuccess) return promise.then(callbacks.onSuccess);
            }
            else return promise;
        },
        /**
         * Executes command StartLogging on the remote server
         *
         * @param {*} argin - argument for the command [optional]
         * @param {Object|Function} cbks: onSuccess - callback [required]; onFailure - panic callback [optional]
         */
        StartLogging : function(argin, cbks){
            var promise = this.api.devices(this.name).commands('StartLogging').exec.apply(this.api, argin);
            if (cbks) {
                var callbacks = this.Class._clean_callbacks(cbks);
                if (callbacks.onFailure) promise.fail(callbacks.onFailure);
                if (callbacks.onSuccess) return promise.then(callbacks.onSuccess);
            }
            else return promise;
        },
        /**
         * Executes command StartPolling on the remote server
         *
         * @param {*} argin - argument for the command [optional]
         * @param {Object|Function} cbks: onSuccess - callback [required]; onFailure - panic callback [optional]
         */
        StartPolling : function(argin, cbks){
            var promise = this.api.devices(this.name).commands('StartPolling').exec.apply(this.api, argin);
            if (cbks) {
                var callbacks = this.Class._clean_callbacks(cbks);
                if (callbacks.onFailure) promise.fail(callbacks.onFailure);
                if (callbacks.onSuccess) return promise.then(callbacks.onSuccess);
            }
            else return promise;
        },
        /**
         * Executes command State on the remote server
         *
         * @param {*} argin - argument for the command [optional]
         * @param {Object|Function} cbks: onSuccess - callback [required]; onFailure - panic callback [optional]
         */
        State : function(argin, cbks){
            var promise = this.api.devices(this.name).commands('State').exec.apply(this.api, argin);
            if (cbks) {
                var callbacks = this.Class._clean_callbacks(cbks);
                if (callbacks.onFailure) promise.fail(callbacks.onFailure);
                if (callbacks.onSuccess) return promise.then(callbacks.onSuccess);
            }
            else return promise;
        },
         /**
         * Executes command Status on the remote server
         *
         * @param {*} argin - argument for the command [optional]
         * @param {Object|Function} cbks: onSuccess - callback [required]; onFailure - panic callback [optional]
         */
        Status : function(argin, cbks){
            var promise = this.api.devices(this.name).commands('Status').exec.apply(this.api, argin);
            if (cbks) {
                var callbacks = this.Class._clean_callbacks(cbks);
                if (callbacks.onFailure) promise.fail(callbacks.onFailure);
                if (callbacks.onSuccess) return promise.then(callbacks.onSuccess);
            }
            else return promise;
        },
        /**
         * Executes command StopLogging on the remote server
         *
         * @param {*} argin - argument for the command [optional]
         * @param {Object|Function} cbks: onSuccess - callback [required]; onFailure - panic callback [optional]
         */
        StopLogging : function(argin, cbks){
            var promise = this.api.devices(this.name).commands('StopLogging').exec.apply(this.api, argin);
            if (cbks) {
                var callbacks = this.Class._clean_callbacks(cbks);
                if (callbacks.onFailure) promise.fail(callbacks.onFailure);
                if (callbacks.onSuccess) return promise.then(callbacks.onSuccess);
            }
            else return promise;
        },
        /**
         * Executes command StopPolling on the remote server
         *
         * @param {*} argin - argument for the command [optional]
         * @param {Object|Function} cbks: onSuccess - callback [required]; onFailure - panic callback [optional]
         */
        StopPolling : function(argin, cbks){
            var promise = this.api.devices(this.name).commands('StopPolling').exec.apply(this.api, argin);
            if (cbks) {
                var callbacks = this.Class._clean_callbacks(cbks);
                if (callbacks.onFailure) promise.fail(callbacks.onFailure);
                if (callbacks.onSuccess) return promise.then(callbacks.onSuccess);
            }
            else return promise;
        },
        /**
         * Executes command UnLockDevice on the remote server
         *
         * @param {*} argin - argument for the command [optional]
         * @param {Object|Function} cbks: onSuccess - callback [required]; onFailure - panic callback [optional]
         */
        UnLockDevice : function(argin, cbks){
            var promise = this.api.devices(this.name).commands('UnLockDevice').exec.apply(this.api, argin);
            if (cbks) {
                var callbacks = this.Class._clean_callbacks(cbks);
                if (callbacks.onFailure) promise.fail(callbacks.onFailure);
                if (callbacks.onSuccess) return promise.then(callbacks.onSuccess);
            }
            else return promise;
        },
        /**
         * Executes command UpdObjPollingPeriod on the remote server
         *
         * @param {*} argin - argument for the command [optional]
         * @param {Object|Function} cbks: onSuccess - callback [required]; onFailure - panic callback [optional]
         */
        UpdObjPollingPeriod : function(argin, cbks){
            var promise = this.api.devices(this.name).commands('UpdObjPollingPeriod').exec.apply(this.api, argin);
            if (cbks) {
                var callbacks = this.Class._clean_callbacks(cbks);
                if (callbacks.onFailure) promise.fail(callbacks.onFailure);
                if (callbacks.onSuccess) return promise.then(callbacks.onSuccess);
            }
            else return promise;
        },
        /**
         * Executes command ZmqEventSubscriptionChange on the remote server
         *
         * @param {*} argin - argument for the command [optional]
         * @param {Object|Function} cbks: onSuccess - callback [required]; onFailure - panic callback [optional]
         */
        ZmqEventSubscriptionChange : function(argin, cbks){
            var promise = this.api.devices(this.name).commands('ZmqEventSubscriptionChange').exec.apply(this.api, argin);
            if (cbks) {
                var callbacks = this.Class._clean_callbacks(cbks);
                if (callbacks.onFailure) promise.fail(callbacks.onFailure);
                if (callbacks.onSuccess) return promise.then(callbacks.onSuccess);
            }
            else return promise;
        },
        /**
         * Remote server commands
         *
         */
        commands:function(){
            return this.Class.commands;
        },
        
        
        /**
         * Remote server attributes
         *
         */
        attributes:function(){
            return this.Class.attributes;
        }
});