/**
 * This file is generated using mtango cmd tool
 * Do not edit it manually!
 */
DServer = MVC.Class.extend('dserver',
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
        deviceProxy: null,
        /**
         * @constructor
         *
         * Creates a new instance of DServer proxy
         *
         * This model is a thin wrapper around mtango.DeviceProxy that provides device's specific interface, i.e. attributes and commands.
         *
         * All instances of this model dedicated to a single device utilize single DeviceProxy.
         *
         * @param {string} url -- an url of mtango.server, e.g. http://localhost:8080/mtango
         * @param {string} device -- tango device, e.g. dserver/DatabaseDs/2
         */
        init: function(url, device){
            if(!url || !device) throw "IllegalArgument: this constructor accepts exactly two arguments: an url to mtango.server[e.g. http://localhost:8080/mtango] and a tango device[e.g. dserver/DatabaseDs/2]!"
            var deviceProxy = mtango.DeviceProxy.find_one(device);
            if(!deviceProxy) deviceProxy = new mtango.DeviceProxy({url:url,device:device});
            this.deviceProxy = deviceProxy;
            deviceProxy.wrapped_by = this;
        },
        
        
        /**
         * Executes command AddLoggingTarget on the remote server
         *
         * @param {*} argin - argument for the command [optional]
         * @param {Object|Function} cbks: onSuccess - callback [required]; onFailure - panic callback [optional]
         */
        AddLoggingTarget : function(argin, cbks){
            if(argin.onSuccess || argin.onFailure || argin.onComplete){
                cbks = argin;
                argin = null;
            }
            if(!(cbks.onSuccess || cbks.onComplete)) cbks.onSuccess =
                function(response){
                    console.debug("Command[dserver/DatabaseDs/2/AddLoggingTarget] has succeed with argout[" + response.argout + "] on " + new Date(response.timestamp))
                };
            this.deviceProxy.executeCommand("AddLoggingTarget",{argin:argin},cbks);
        },
        /**
         * @returns {mtango.DeviceCommand} a new DeviceCommand instance
         */
        create_new_DeviceCommand_AddLoggingTarget : function(){
            var attributes = {
                name: 'AddLoggingTarget',
                proxy: this.deviceProxy
            }
            MVC.Object.extend(attributes, this.Class.commands['AddLoggingTarget']);
            return new mtango.DeviceCommand(attributes);
        },
        
        
        /**
         * Executes command AddObjPolling on the remote server
         *
         * @param {*} argin - argument for the command [optional]
         * @param {Object|Function} cbks: onSuccess - callback [required]; onFailure - panic callback [optional]
         */
        AddObjPolling : function(argin, cbks){
            if(argin.onSuccess || argin.onFailure || argin.onComplete){
                cbks = argin;
                argin = null;
            }
            if(!(cbks.onSuccess || cbks.onComplete)) cbks.onSuccess =
                function(response){
                    console.debug("Command[dserver/DatabaseDs/2/AddObjPolling] has succeed with argout[" + response.argout + "] on " + new Date(response.timestamp))
                };
            this.deviceProxy.executeCommand("AddObjPolling",{argin:argin},cbks);
        },
        /**
         * @returns {mtango.DeviceCommand} a new DeviceCommand instance
         */
        create_new_DeviceCommand_AddObjPolling : function(){
            var attributes = {
                name: 'AddObjPolling',
                proxy: this.deviceProxy
            }
            MVC.Object.extend(attributes, this.Class.commands['AddObjPolling']);
            return new mtango.DeviceCommand(attributes);
        },
        
        
        /**
         * Executes command DevLockStatus on the remote server
         *
         * @param {*} argin - argument for the command [optional]
         * @param {Object|Function} cbks: onSuccess - callback [required]; onFailure - panic callback [optional]
         */
        DevLockStatus : function(argin, cbks){
            if(argin.onSuccess || argin.onFailure || argin.onComplete){
                cbks = argin;
                argin = null;
            }
            if(!(cbks.onSuccess || cbks.onComplete)) cbks.onSuccess =
                function(response){
                    console.debug("Command[dserver/DatabaseDs/2/DevLockStatus] has succeed with argout[" + response.argout + "] on " + new Date(response.timestamp))
                };
            this.deviceProxy.executeCommand("DevLockStatus",{argin:argin},cbks);
        },
        /**
         * @returns {mtango.DeviceCommand} a new DeviceCommand instance
         */
        create_new_DeviceCommand_DevLockStatus : function(){
            var attributes = {
                name: 'DevLockStatus',
                proxy: this.deviceProxy
            }
            MVC.Object.extend(attributes, this.Class.commands['DevLockStatus']);
            return new mtango.DeviceCommand(attributes);
        },
        
        
        /**
         * Executes command DevPollStatus on the remote server
         *
         * @param {*} argin - argument for the command [optional]
         * @param {Object|Function} cbks: onSuccess - callback [required]; onFailure - panic callback [optional]
         */
        DevPollStatus : function(argin, cbks){
            if(argin.onSuccess || argin.onFailure || argin.onComplete){
                cbks = argin;
                argin = null;
            }
            if(!(cbks.onSuccess || cbks.onComplete)) cbks.onSuccess =
                function(response){
                    console.debug("Command[dserver/DatabaseDs/2/DevPollStatus] has succeed with argout[" + response.argout + "] on " + new Date(response.timestamp))
                };
            this.deviceProxy.executeCommand("DevPollStatus",{argin:argin},cbks);
        },
        /**
         * @returns {mtango.DeviceCommand} a new DeviceCommand instance
         */
        create_new_DeviceCommand_DevPollStatus : function(){
            var attributes = {
                name: 'DevPollStatus',
                proxy: this.deviceProxy
            }
            MVC.Object.extend(attributes, this.Class.commands['DevPollStatus']);
            return new mtango.DeviceCommand(attributes);
        },
        
        
        /**
         * Executes command DevRestart on the remote server
         *
         * @param {*} argin - argument for the command [optional]
         * @param {Object|Function} cbks: onSuccess - callback [required]; onFailure - panic callback [optional]
         */
        DevRestart : function(argin, cbks){
            if(argin.onSuccess || argin.onFailure || argin.onComplete){
                cbks = argin;
                argin = null;
            }
            if(!(cbks.onSuccess || cbks.onComplete)) cbks.onSuccess =
                function(response){
                    console.debug("Command[dserver/DatabaseDs/2/DevRestart] has succeed with argout[" + response.argout + "] on " + new Date(response.timestamp))
                };
            this.deviceProxy.executeCommand("DevRestart",{argin:argin},cbks);
        },
        /**
         * @returns {mtango.DeviceCommand} a new DeviceCommand instance
         */
        create_new_DeviceCommand_DevRestart : function(){
            var attributes = {
                name: 'DevRestart',
                proxy: this.deviceProxy
            }
            MVC.Object.extend(attributes, this.Class.commands['DevRestart']);
            return new mtango.DeviceCommand(attributes);
        },
        
        
        /**
         * Executes command EventConfirmSubscription on the remote server
         *
         * @param {*} argin - argument for the command [optional]
         * @param {Object|Function} cbks: onSuccess - callback [required]; onFailure - panic callback [optional]
         */
        EventConfirmSubscription : function(argin, cbks){
            if(argin.onSuccess || argin.onFailure || argin.onComplete){
                cbks = argin;
                argin = null;
            }
            if(!(cbks.onSuccess || cbks.onComplete)) cbks.onSuccess =
                function(response){
                    console.debug("Command[dserver/DatabaseDs/2/EventConfirmSubscription] has succeed with argout[" + response.argout + "] on " + new Date(response.timestamp))
                };
            this.deviceProxy.executeCommand("EventConfirmSubscription",{argin:argin},cbks);
        },
        /**
         * @returns {mtango.DeviceCommand} a new DeviceCommand instance
         */
        create_new_DeviceCommand_EventConfirmSubscription : function(){
            var attributes = {
                name: 'EventConfirmSubscription',
                proxy: this.deviceProxy
            }
            MVC.Object.extend(attributes, this.Class.commands['EventConfirmSubscription']);
            return new mtango.DeviceCommand(attributes);
        },
        
        
        /**
         * Executes command EventSubscriptionChange on the remote server
         *
         * @param {*} argin - argument for the command [optional]
         * @param {Object|Function} cbks: onSuccess - callback [required]; onFailure - panic callback [optional]
         */
        EventSubscriptionChange : function(argin, cbks){
            if(argin.onSuccess || argin.onFailure || argin.onComplete){
                cbks = argin;
                argin = null;
            }
            if(!(cbks.onSuccess || cbks.onComplete)) cbks.onSuccess =
                function(response){
                    console.debug("Command[dserver/DatabaseDs/2/EventSubscriptionChange] has succeed with argout[" + response.argout + "] on " + new Date(response.timestamp))
                };
            this.deviceProxy.executeCommand("EventSubscriptionChange",{argin:argin},cbks);
        },
        /**
         * @returns {mtango.DeviceCommand} a new DeviceCommand instance
         */
        create_new_DeviceCommand_EventSubscriptionChange : function(){
            var attributes = {
                name: 'EventSubscriptionChange',
                proxy: this.deviceProxy
            }
            MVC.Object.extend(attributes, this.Class.commands['EventSubscriptionChange']);
            return new mtango.DeviceCommand(attributes);
        },
        
        
        /**
         * Executes command GetLoggingLevel on the remote server
         *
         * @param {*} argin - argument for the command [optional]
         * @param {Object|Function} cbks: onSuccess - callback [required]; onFailure - panic callback [optional]
         */
        GetLoggingLevel : function(argin, cbks){
            if(argin.onSuccess || argin.onFailure || argin.onComplete){
                cbks = argin;
                argin = null;
            }
            if(!(cbks.onSuccess || cbks.onComplete)) cbks.onSuccess =
                function(response){
                    console.debug("Command[dserver/DatabaseDs/2/GetLoggingLevel] has succeed with argout[" + response.argout + "] on " + new Date(response.timestamp))
                };
            this.deviceProxy.executeCommand("GetLoggingLevel",{argin:argin},cbks);
        },
        /**
         * @returns {mtango.DeviceCommand} a new DeviceCommand instance
         */
        create_new_DeviceCommand_GetLoggingLevel : function(){
            var attributes = {
                name: 'GetLoggingLevel',
                proxy: this.deviceProxy
            }
            MVC.Object.extend(attributes, this.Class.commands['GetLoggingLevel']);
            return new mtango.DeviceCommand(attributes);
        },
        
        
        /**
         * Executes command GetLoggingTarget on the remote server
         *
         * @param {*} argin - argument for the command [optional]
         * @param {Object|Function} cbks: onSuccess - callback [required]; onFailure - panic callback [optional]
         */
        GetLoggingTarget : function(argin, cbks){
            if(argin.onSuccess || argin.onFailure || argin.onComplete){
                cbks = argin;
                argin = null;
            }
            if(!(cbks.onSuccess || cbks.onComplete)) cbks.onSuccess =
                function(response){
                    console.debug("Command[dserver/DatabaseDs/2/GetLoggingTarget] has succeed with argout[" + response.argout + "] on " + new Date(response.timestamp))
                };
            this.deviceProxy.executeCommand("GetLoggingTarget",{argin:argin},cbks);
        },
        /**
         * @returns {mtango.DeviceCommand} a new DeviceCommand instance
         */
        create_new_DeviceCommand_GetLoggingTarget : function(){
            var attributes = {
                name: 'GetLoggingTarget',
                proxy: this.deviceProxy
            }
            MVC.Object.extend(attributes, this.Class.commands['GetLoggingTarget']);
            return new mtango.DeviceCommand(attributes);
        },
        
        
        /**
         * Executes command Init on the remote server
         *
         * @param {*} argin - argument for the command [optional]
         * @param {Object|Function} cbks: onSuccess - callback [required]; onFailure - panic callback [optional]
         */
        Init : function(argin, cbks){
            if(argin.onSuccess || argin.onFailure || argin.onComplete){
                cbks = argin;
                argin = null;
            }
            if(!(cbks.onSuccess || cbks.onComplete)) cbks.onSuccess =
                function(response){
                    console.debug("Command[dserver/DatabaseDs/2/Init] has succeed with argout[" + response.argout + "] on " + new Date(response.timestamp))
                };
            this.deviceProxy.executeCommand("Init",{argin:argin},cbks);
        },
        /**
         * @returns {mtango.DeviceCommand} a new DeviceCommand instance
         */
        create_new_DeviceCommand_Init : function(){
            var attributes = {
                name: 'Init',
                proxy: this.deviceProxy
            }
            MVC.Object.extend(attributes, this.Class.commands['Init']);
            return new mtango.DeviceCommand(attributes);
        },
        
        
        /**
         * Executes command Kill on the remote server
         *
         * @param {*} argin - argument for the command [optional]
         * @param {Object|Function} cbks: onSuccess - callback [required]; onFailure - panic callback [optional]
         */
        Kill : function(argin, cbks){
            if(argin.onSuccess || argin.onFailure || argin.onComplete){
                cbks = argin;
                argin = null;
            }
            if(!(cbks.onSuccess || cbks.onComplete)) cbks.onSuccess =
                function(response){
                    console.debug("Command[dserver/DatabaseDs/2/Kill] has succeed with argout[" + response.argout + "] on " + new Date(response.timestamp))
                };
            this.deviceProxy.executeCommand("Kill",{argin:argin},cbks);
        },
        /**
         * @returns {mtango.DeviceCommand} a new DeviceCommand instance
         */
        create_new_DeviceCommand_Kill : function(){
            var attributes = {
                name: 'Kill',
                proxy: this.deviceProxy
            }
            MVC.Object.extend(attributes, this.Class.commands['Kill']);
            return new mtango.DeviceCommand(attributes);
        },
        
        
        /**
         * Executes command LockDevice on the remote server
         *
         * @param {*} argin - argument for the command [optional]
         * @param {Object|Function} cbks: onSuccess - callback [required]; onFailure - panic callback [optional]
         */
        LockDevice : function(argin, cbks){
            if(argin.onSuccess || argin.onFailure || argin.onComplete){
                cbks = argin;
                argin = null;
            }
            if(!(cbks.onSuccess || cbks.onComplete)) cbks.onSuccess =
                function(response){
                    console.debug("Command[dserver/DatabaseDs/2/LockDevice] has succeed with argout[" + response.argout + "] on " + new Date(response.timestamp))
                };
            this.deviceProxy.executeCommand("LockDevice",{argin:argin},cbks);
        },
        /**
         * @returns {mtango.DeviceCommand} a new DeviceCommand instance
         */
        create_new_DeviceCommand_LockDevice : function(){
            var attributes = {
                name: 'LockDevice',
                proxy: this.deviceProxy
            }
            MVC.Object.extend(attributes, this.Class.commands['LockDevice']);
            return new mtango.DeviceCommand(attributes);
        },
        
        
        /**
         * Executes command PolledDevice on the remote server
         *
         * @param {*} argin - argument for the command [optional]
         * @param {Object|Function} cbks: onSuccess - callback [required]; onFailure - panic callback [optional]
         */
        PolledDevice : function(argin, cbks){
            if(argin.onSuccess || argin.onFailure || argin.onComplete){
                cbks = argin;
                argin = null;
            }
            if(!(cbks.onSuccess || cbks.onComplete)) cbks.onSuccess =
                function(response){
                    console.debug("Command[dserver/DatabaseDs/2/PolledDevice] has succeed with argout[" + response.argout + "] on " + new Date(response.timestamp))
                };
            this.deviceProxy.executeCommand("PolledDevice",{argin:argin},cbks);
        },
        /**
         * @returns {mtango.DeviceCommand} a new DeviceCommand instance
         */
        create_new_DeviceCommand_PolledDevice : function(){
            var attributes = {
                name: 'PolledDevice',
                proxy: this.deviceProxy
            }
            MVC.Object.extend(attributes, this.Class.commands['PolledDevice']);
            return new mtango.DeviceCommand(attributes);
        },
        
        
        /**
         * Executes command QueryClass on the remote server
         *
         * @param {*} argin - argument for the command [optional]
         * @param {Object|Function} cbks: onSuccess - callback [required]; onFailure - panic callback [optional]
         */
        QueryClass : function(argin, cbks){
            if(argin.onSuccess || argin.onFailure || argin.onComplete){
                cbks = argin;
                argin = null;
            }
            if(!(cbks.onSuccess || cbks.onComplete)) cbks.onSuccess =
                function(response){
                    console.debug("Command[dserver/DatabaseDs/2/QueryClass] has succeed with argout[" + response.argout + "] on " + new Date(response.timestamp))
                };
            this.deviceProxy.executeCommand("QueryClass",{argin:argin},cbks);
        },
        /**
         * @returns {mtango.DeviceCommand} a new DeviceCommand instance
         */
        create_new_DeviceCommand_QueryClass : function(){
            var attributes = {
                name: 'QueryClass',
                proxy: this.deviceProxy
            }
            MVC.Object.extend(attributes, this.Class.commands['QueryClass']);
            return new mtango.DeviceCommand(attributes);
        },
        
        
        /**
         * Executes command QueryDevice on the remote server
         *
         * @param {*} argin - argument for the command [optional]
         * @param {Object|Function} cbks: onSuccess - callback [required]; onFailure - panic callback [optional]
         */
        QueryDevice : function(argin, cbks){
            if(argin.onSuccess || argin.onFailure || argin.onComplete){
                cbks = argin;
                argin = null;
            }
            if(!(cbks.onSuccess || cbks.onComplete)) cbks.onSuccess =
                function(response){
                    console.debug("Command[dserver/DatabaseDs/2/QueryDevice] has succeed with argout[" + response.argout + "] on " + new Date(response.timestamp))
                };
            this.deviceProxy.executeCommand("QueryDevice",{argin:argin},cbks);
        },
        /**
         * @returns {mtango.DeviceCommand} a new DeviceCommand instance
         */
        create_new_DeviceCommand_QueryDevice : function(){
            var attributes = {
                name: 'QueryDevice',
                proxy: this.deviceProxy
            }
            MVC.Object.extend(attributes, this.Class.commands['QueryDevice']);
            return new mtango.DeviceCommand(attributes);
        },
        
        
        /**
         * Executes command QuerySubDevice on the remote server
         *
         * @param {*} argin - argument for the command [optional]
         * @param {Object|Function} cbks: onSuccess - callback [required]; onFailure - panic callback [optional]
         */
        QuerySubDevice : function(argin, cbks){
            if(argin.onSuccess || argin.onFailure || argin.onComplete){
                cbks = argin;
                argin = null;
            }
            if(!(cbks.onSuccess || cbks.onComplete)) cbks.onSuccess =
                function(response){
                    console.debug("Command[dserver/DatabaseDs/2/QuerySubDevice] has succeed with argout[" + response.argout + "] on " + new Date(response.timestamp))
                };
            this.deviceProxy.executeCommand("QuerySubDevice",{argin:argin},cbks);
        },
        /**
         * @returns {mtango.DeviceCommand} a new DeviceCommand instance
         */
        create_new_DeviceCommand_QuerySubDevice : function(){
            var attributes = {
                name: 'QuerySubDevice',
                proxy: this.deviceProxy
            }
            MVC.Object.extend(attributes, this.Class.commands['QuerySubDevice']);
            return new mtango.DeviceCommand(attributes);
        },
        
        
        /**
         * Executes command QueryWizardClassProperty on the remote server
         *
         * @param {*} argin - argument for the command [optional]
         * @param {Object|Function} cbks: onSuccess - callback [required]; onFailure - panic callback [optional]
         */
        QueryWizardClassProperty : function(argin, cbks){
            if(argin.onSuccess || argin.onFailure || argin.onComplete){
                cbks = argin;
                argin = null;
            }
            if(!(cbks.onSuccess || cbks.onComplete)) cbks.onSuccess =
                function(response){
                    console.debug("Command[dserver/DatabaseDs/2/QueryWizardClassProperty] has succeed with argout[" + response.argout + "] on " + new Date(response.timestamp))
                };
            this.deviceProxy.executeCommand("QueryWizardClassProperty",{argin:argin},cbks);
        },
        /**
         * @returns {mtango.DeviceCommand} a new DeviceCommand instance
         */
        create_new_DeviceCommand_QueryWizardClassProperty : function(){
            var attributes = {
                name: 'QueryWizardClassProperty',
                proxy: this.deviceProxy
            }
            MVC.Object.extend(attributes, this.Class.commands['QueryWizardClassProperty']);
            return new mtango.DeviceCommand(attributes);
        },
        
        
        /**
         * Executes command QueryWizardDevProperty on the remote server
         *
         * @param {*} argin - argument for the command [optional]
         * @param {Object|Function} cbks: onSuccess - callback [required]; onFailure - panic callback [optional]
         */
        QueryWizardDevProperty : function(argin, cbks){
            if(argin.onSuccess || argin.onFailure || argin.onComplete){
                cbks = argin;
                argin = null;
            }
            if(!(cbks.onSuccess || cbks.onComplete)) cbks.onSuccess =
                function(response){
                    console.debug("Command[dserver/DatabaseDs/2/QueryWizardDevProperty] has succeed with argout[" + response.argout + "] on " + new Date(response.timestamp))
                };
            this.deviceProxy.executeCommand("QueryWizardDevProperty",{argin:argin},cbks);
        },
        /**
         * @returns {mtango.DeviceCommand} a new DeviceCommand instance
         */
        create_new_DeviceCommand_QueryWizardDevProperty : function(){
            var attributes = {
                name: 'QueryWizardDevProperty',
                proxy: this.deviceProxy
            }
            MVC.Object.extend(attributes, this.Class.commands['QueryWizardDevProperty']);
            return new mtango.DeviceCommand(attributes);
        },
        
        
        /**
         * Executes command ReLockDevices on the remote server
         *
         * @param {*} argin - argument for the command [optional]
         * @param {Object|Function} cbks: onSuccess - callback [required]; onFailure - panic callback [optional]
         */
        ReLockDevices : function(argin, cbks){
            if(argin.onSuccess || argin.onFailure || argin.onComplete){
                cbks = argin;
                argin = null;
            }
            if(!(cbks.onSuccess || cbks.onComplete)) cbks.onSuccess =
                function(response){
                    console.debug("Command[dserver/DatabaseDs/2/ReLockDevices] has succeed with argout[" + response.argout + "] on " + new Date(response.timestamp))
                };
            this.deviceProxy.executeCommand("ReLockDevices",{argin:argin},cbks);
        },
        /**
         * @returns {mtango.DeviceCommand} a new DeviceCommand instance
         */
        create_new_DeviceCommand_ReLockDevices : function(){
            var attributes = {
                name: 'ReLockDevices',
                proxy: this.deviceProxy
            }
            MVC.Object.extend(attributes, this.Class.commands['ReLockDevices']);
            return new mtango.DeviceCommand(attributes);
        },
        
        
        /**
         * Executes command RemObjPolling on the remote server
         *
         * @param {*} argin - argument for the command [optional]
         * @param {Object|Function} cbks: onSuccess - callback [required]; onFailure - panic callback [optional]
         */
        RemObjPolling : function(argin, cbks){
            if(argin.onSuccess || argin.onFailure || argin.onComplete){
                cbks = argin;
                argin = null;
            }
            if(!(cbks.onSuccess || cbks.onComplete)) cbks.onSuccess =
                function(response){
                    console.debug("Command[dserver/DatabaseDs/2/RemObjPolling] has succeed with argout[" + response.argout + "] on " + new Date(response.timestamp))
                };
            this.deviceProxy.executeCommand("RemObjPolling",{argin:argin},cbks);
        },
        /**
         * @returns {mtango.DeviceCommand} a new DeviceCommand instance
         */
        create_new_DeviceCommand_RemObjPolling : function(){
            var attributes = {
                name: 'RemObjPolling',
                proxy: this.deviceProxy
            }
            MVC.Object.extend(attributes, this.Class.commands['RemObjPolling']);
            return new mtango.DeviceCommand(attributes);
        },
        
        
        /**
         * Executes command RemoveLoggingTarget on the remote server
         *
         * @param {*} argin - argument for the command [optional]
         * @param {Object|Function} cbks: onSuccess - callback [required]; onFailure - panic callback [optional]
         */
        RemoveLoggingTarget : function(argin, cbks){
            if(argin.onSuccess || argin.onFailure || argin.onComplete){
                cbks = argin;
                argin = null;
            }
            if(!(cbks.onSuccess || cbks.onComplete)) cbks.onSuccess =
                function(response){
                    console.debug("Command[dserver/DatabaseDs/2/RemoveLoggingTarget] has succeed with argout[" + response.argout + "] on " + new Date(response.timestamp))
                };
            this.deviceProxy.executeCommand("RemoveLoggingTarget",{argin:argin},cbks);
        },
        /**
         * @returns {mtango.DeviceCommand} a new DeviceCommand instance
         */
        create_new_DeviceCommand_RemoveLoggingTarget : function(){
            var attributes = {
                name: 'RemoveLoggingTarget',
                proxy: this.deviceProxy
            }
            MVC.Object.extend(attributes, this.Class.commands['RemoveLoggingTarget']);
            return new mtango.DeviceCommand(attributes);
        },
        
        
        /**
         * Executes command RestartServer on the remote server
         *
         * @param {*} argin - argument for the command [optional]
         * @param {Object|Function} cbks: onSuccess - callback [required]; onFailure - panic callback [optional]
         */
        RestartServer : function(argin, cbks){
            if(argin.onSuccess || argin.onFailure || argin.onComplete){
                cbks = argin;
                argin = null;
            }
            if(!(cbks.onSuccess || cbks.onComplete)) cbks.onSuccess =
                function(response){
                    console.debug("Command[dserver/DatabaseDs/2/RestartServer] has succeed with argout[" + response.argout + "] on " + new Date(response.timestamp))
                };
            this.deviceProxy.executeCommand("RestartServer",{argin:argin},cbks);
        },
        /**
         * @returns {mtango.DeviceCommand} a new DeviceCommand instance
         */
        create_new_DeviceCommand_RestartServer : function(){
            var attributes = {
                name: 'RestartServer',
                proxy: this.deviceProxy
            }
            MVC.Object.extend(attributes, this.Class.commands['RestartServer']);
            return new mtango.DeviceCommand(attributes);
        },
        
        
        /**
         * Executes command SetLoggingLevel on the remote server
         *
         * @param {*} argin - argument for the command [optional]
         * @param {Object|Function} cbks: onSuccess - callback [required]; onFailure - panic callback [optional]
         */
        SetLoggingLevel : function(argin, cbks){
            if(argin.onSuccess || argin.onFailure || argin.onComplete){
                cbks = argin;
                argin = null;
            }
            if(!(cbks.onSuccess || cbks.onComplete)) cbks.onSuccess =
                function(response){
                    console.debug("Command[dserver/DatabaseDs/2/SetLoggingLevel] has succeed with argout[" + response.argout + "] on " + new Date(response.timestamp))
                };
            this.deviceProxy.executeCommand("SetLoggingLevel",{argin:argin},cbks);
        },
        /**
         * @returns {mtango.DeviceCommand} a new DeviceCommand instance
         */
        create_new_DeviceCommand_SetLoggingLevel : function(){
            var attributes = {
                name: 'SetLoggingLevel',
                proxy: this.deviceProxy
            }
            MVC.Object.extend(attributes, this.Class.commands['SetLoggingLevel']);
            return new mtango.DeviceCommand(attributes);
        },
        
        
        /**
         * Executes command StartLogging on the remote server
         *
         * @param {*} argin - argument for the command [optional]
         * @param {Object|Function} cbks: onSuccess - callback [required]; onFailure - panic callback [optional]
         */
        StartLogging : function(argin, cbks){
            if(argin.onSuccess || argin.onFailure || argin.onComplete){
                cbks = argin;
                argin = null;
            }
            if(!(cbks.onSuccess || cbks.onComplete)) cbks.onSuccess =
                function(response){
                    console.debug("Command[dserver/DatabaseDs/2/StartLogging] has succeed with argout[" + response.argout + "] on " + new Date(response.timestamp))
                };
            this.deviceProxy.executeCommand("StartLogging",{argin:argin},cbks);
        },
        /**
         * @returns {mtango.DeviceCommand} a new DeviceCommand instance
         */
        create_new_DeviceCommand_StartLogging : function(){
            var attributes = {
                name: 'StartLogging',
                proxy: this.deviceProxy
            }
            MVC.Object.extend(attributes, this.Class.commands['StartLogging']);
            return new mtango.DeviceCommand(attributes);
        },
        
        
        /**
         * Executes command StartPolling on the remote server
         *
         * @param {*} argin - argument for the command [optional]
         * @param {Object|Function} cbks: onSuccess - callback [required]; onFailure - panic callback [optional]
         */
        StartPolling : function(argin, cbks){
            if(argin.onSuccess || argin.onFailure || argin.onComplete){
                cbks = argin;
                argin = null;
            }
            if(!(cbks.onSuccess || cbks.onComplete)) cbks.onSuccess =
                function(response){
                    console.debug("Command[dserver/DatabaseDs/2/StartPolling] has succeed with argout[" + response.argout + "] on " + new Date(response.timestamp))
                };
            this.deviceProxy.executeCommand("StartPolling",{argin:argin},cbks);
        },
        /**
         * @returns {mtango.DeviceCommand} a new DeviceCommand instance
         */
        create_new_DeviceCommand_StartPolling : function(){
            var attributes = {
                name: 'StartPolling',
                proxy: this.deviceProxy
            }
            MVC.Object.extend(attributes, this.Class.commands['StartPolling']);
            return new mtango.DeviceCommand(attributes);
        },
        
        
        /**
         * Executes command State on the remote server
         *
         * @param {*} argin - argument for the command [optional]
         * @param {Object|Function} cbks: onSuccess - callback [required]; onFailure - panic callback [optional]
         */
        State : function(argin, cbks){
            if(argin.onSuccess || argin.onFailure || argin.onComplete){
                cbks = argin;
                argin = null;
            }
            if(!(cbks.onSuccess || cbks.onComplete)) cbks.onSuccess =
                function(response){
                    console.debug("Command[dserver/DatabaseDs/2/State] has succeed with argout[" + response.argout + "] on " + new Date(response.timestamp))
                };
            this.deviceProxy.executeCommand("State",{argin:argin},cbks);
        },
        /**
         * @returns {mtango.DeviceCommand} a new DeviceCommand instance
         */
        create_new_DeviceCommand_State : function(){
            var attributes = {
                name: 'State',
                proxy: this.deviceProxy
            }
            MVC.Object.extend(attributes, this.Class.commands['State']);
            return new mtango.DeviceCommand(attributes);
        },
        
        
        /**
         * Executes command Status on the remote server
         *
         * @param {*} argin - argument for the command [optional]
         * @param {Object|Function} cbks: onSuccess - callback [required]; onFailure - panic callback [optional]
         */
        Status : function(argin, cbks){
            if(argin.onSuccess || argin.onFailure || argin.onComplete){
                cbks = argin;
                argin = null;
            }
            if(!(cbks.onSuccess || cbks.onComplete)) cbks.onSuccess =
                function(response){
                    console.debug("Command[dserver/DatabaseDs/2/Status] has succeed with argout[" + response.argout + "] on " + new Date(response.timestamp))
                };
            this.deviceProxy.executeCommand("Status",{argin:argin},cbks);
        },
        /**
         * @returns {mtango.DeviceCommand} a new DeviceCommand instance
         */
        create_new_DeviceCommand_Status : function(){
            var attributes = {
                name: 'Status',
                proxy: this.deviceProxy
            }
            MVC.Object.extend(attributes, this.Class.commands['Status']);
            return new mtango.DeviceCommand(attributes);
        },
        
        
        /**
         * Executes command StopLogging on the remote server
         *
         * @param {*} argin - argument for the command [optional]
         * @param {Object|Function} cbks: onSuccess - callback [required]; onFailure - panic callback [optional]
         */
        StopLogging : function(argin, cbks){
            if(argin.onSuccess || argin.onFailure || argin.onComplete){
                cbks = argin;
                argin = null;
            }
            if(!(cbks.onSuccess || cbks.onComplete)) cbks.onSuccess =
                function(response){
                    console.debug("Command[dserver/DatabaseDs/2/StopLogging] has succeed with argout[" + response.argout + "] on " + new Date(response.timestamp))
                };
            this.deviceProxy.executeCommand("StopLogging",{argin:argin},cbks);
        },
        /**
         * @returns {mtango.DeviceCommand} a new DeviceCommand instance
         */
        create_new_DeviceCommand_StopLogging : function(){
            var attributes = {
                name: 'StopLogging',
                proxy: this.deviceProxy
            }
            MVC.Object.extend(attributes, this.Class.commands['StopLogging']);
            return new mtango.DeviceCommand(attributes);
        },
        
        
        /**
         * Executes command StopPolling on the remote server
         *
         * @param {*} argin - argument for the command [optional]
         * @param {Object|Function} cbks: onSuccess - callback [required]; onFailure - panic callback [optional]
         */
        StopPolling : function(argin, cbks){
            if(argin.onSuccess || argin.onFailure || argin.onComplete){
                cbks = argin;
                argin = null;
            }
            if(!(cbks.onSuccess || cbks.onComplete)) cbks.onSuccess =
                function(response){
                    console.debug("Command[dserver/DatabaseDs/2/StopPolling] has succeed with argout[" + response.argout + "] on " + new Date(response.timestamp))
                };
            this.deviceProxy.executeCommand("StopPolling",{argin:argin},cbks);
        },
        /**
         * @returns {mtango.DeviceCommand} a new DeviceCommand instance
         */
        create_new_DeviceCommand_StopPolling : function(){
            var attributes = {
                name: 'StopPolling',
                proxy: this.deviceProxy
            }
            MVC.Object.extend(attributes, this.Class.commands['StopPolling']);
            return new mtango.DeviceCommand(attributes);
        },
        
        
        /**
         * Executes command UnLockDevice on the remote server
         *
         * @param {*} argin - argument for the command [optional]
         * @param {Object|Function} cbks: onSuccess - callback [required]; onFailure - panic callback [optional]
         */
        UnLockDevice : function(argin, cbks){
            if(argin.onSuccess || argin.onFailure || argin.onComplete){
                cbks = argin;
                argin = null;
            }
            if(!(cbks.onSuccess || cbks.onComplete)) cbks.onSuccess =
                function(response){
                    console.debug("Command[dserver/DatabaseDs/2/UnLockDevice] has succeed with argout[" + response.argout + "] on " + new Date(response.timestamp))
                };
            this.deviceProxy.executeCommand("UnLockDevice",{argin:argin},cbks);
        },
        /**
         * @returns {mtango.DeviceCommand} a new DeviceCommand instance
         */
        create_new_DeviceCommand_UnLockDevice : function(){
            var attributes = {
                name: 'UnLockDevice',
                proxy: this.deviceProxy
            }
            MVC.Object.extend(attributes, this.Class.commands['UnLockDevice']);
            return new mtango.DeviceCommand(attributes);
        },
        
        
        /**
         * Executes command UpdObjPollingPeriod on the remote server
         *
         * @param {*} argin - argument for the command [optional]
         * @param {Object|Function} cbks: onSuccess - callback [required]; onFailure - panic callback [optional]
         */
        UpdObjPollingPeriod : function(argin, cbks){
            if(argin.onSuccess || argin.onFailure || argin.onComplete){
                cbks = argin;
                argin = null;
            }
            if(!(cbks.onSuccess || cbks.onComplete)) cbks.onSuccess =
                function(response){
                    console.debug("Command[dserver/DatabaseDs/2/UpdObjPollingPeriod] has succeed with argout[" + response.argout + "] on " + new Date(response.timestamp))
                };
            this.deviceProxy.executeCommand("UpdObjPollingPeriod",{argin:argin},cbks);
        },
        /**
         * @returns {mtango.DeviceCommand} a new DeviceCommand instance
         */
        create_new_DeviceCommand_UpdObjPollingPeriod : function(){
            var attributes = {
                name: 'UpdObjPollingPeriod',
                proxy: this.deviceProxy
            }
            MVC.Object.extend(attributes, this.Class.commands['UpdObjPollingPeriod']);
            return new mtango.DeviceCommand(attributes);
        },
        
        
        /**
         * Executes command ZmqEventSubscriptionChange on the remote server
         *
         * @param {*} argin - argument for the command [optional]
         * @param {Object|Function} cbks: onSuccess - callback [required]; onFailure - panic callback [optional]
         */
        ZmqEventSubscriptionChange : function(argin, cbks){
            if(argin.onSuccess || argin.onFailure || argin.onComplete){
                cbks = argin;
                argin = null;
            }
            if(!(cbks.onSuccess || cbks.onComplete)) cbks.onSuccess =
                function(response){
                    console.debug("Command[dserver/DatabaseDs/2/ZmqEventSubscriptionChange] has succeed with argout[" + response.argout + "] on " + new Date(response.timestamp))
                };
            this.deviceProxy.executeCommand("ZmqEventSubscriptionChange",{argin:argin},cbks);
        },
        /**
         * @returns {mtango.DeviceCommand} a new DeviceCommand instance
         */
        create_new_DeviceCommand_ZmqEventSubscriptionChange : function(){
            var attributes = {
                name: 'ZmqEventSubscriptionChange',
                proxy: this.deviceProxy
            }
            MVC.Object.extend(attributes, this.Class.commands['ZmqEventSubscriptionChange']);
            return new mtango.DeviceCommand(attributes);
        },
        
        /**
         * Remote server commands
         *
         */
        commands:function(){
            return this.Class.commands;
        },
        
        
        /**
         * Reads attribute State on the remote server
         *
         * @param {Object|Function} cbks: onSuccess - callback [required]; onFailure - panic callback [optional]
         */
        get_State: function(cbks){
            if(!cbks.onComplete || typeof(cbks.onComplete) != 'function') throw "a valid onComplete function must be provided";
            this.deviceProxy.readAttribute("State",{argin:null},cbks);
        },
        /**
         * Creates a new instance of DeviceAttribute
         */
        create_new_DeviceAttribute_State: function(){
            var attributes = {
                name : 'State',
                proxy: this.deviceProxy
            };
            var properties = this.Class.attributes['State'];
            MVC.Object.extend(attributes,properties);
            return new DeviceAttribute(attributes);
        },
        
        
        
        /**
         * Reads attribute Status on the remote server
         *
         * @param {Object|Function} cbks: onSuccess - callback [required]; onFailure - panic callback [optional]
         */
        get_Status: function(cbks){
            if(!cbks.onComplete || typeof(cbks.onComplete) != 'function') throw "a valid onComplete function must be provided";
            this.deviceProxy.readAttribute("Status",{argin:null},cbks);
        },
        /**
         * Creates a new instance of DeviceAttribute
         */
        create_new_DeviceAttribute_Status: function(){
            var attributes = {
                name : 'Status',
                proxy: this.deviceProxy
            };
            var properties = this.Class.attributes['Status'];
            MVC.Object.extend(attributes,properties);
            return new DeviceAttribute(attributes);
        },
        
        
        /**
         * Remote server attributes
         *
         */
        attributes:function(){
            return this.Class.attributes;
        }
});