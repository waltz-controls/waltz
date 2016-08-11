/**
 * This file is generated using mtango cmd tool
 * Do not edit it manually!
 */
DataBase = MVC.Model.extend('DataBase',
    /* @Static */
    {
        id: 'url',
        //@Generated from tango server - a list of attributes, type mapping is defined in the generator
        attributes:{
            
            
            StoredProcedureRelease : {
                label      : "StoredProcedureRelease",
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
            } , 
            
            
            Timing_average : {
                label      : "Timing_average",
                description: "No description",
                isReadOnly : true,
                dataFormat : "SPECTRUM",
                dataType   : "DevDouble",
                unit       : "No unit",
                displayUnit: "No display unit",
                maxDimX    : 64,
                maxDimY    : 0,
                maxValue   : "Not specified",
                minValue   : "Not specified"
            } , 
            
            
            Timing_minimum : {
                label      : "Timing_minimum",
                description: "No description",
                isReadOnly : true,
                dataFormat : "SPECTRUM",
                dataType   : "DevDouble",
                unit       : "No unit",
                displayUnit: "No display unit",
                maxDimX    : 64,
                maxDimY    : 0,
                maxValue   : "Not specified",
                minValue   : "Not specified"
            } , 
            
            
            Timing_maximum : {
                label      : "Timing_maximum",
                description: "No description",
                isReadOnly : true,
                dataFormat : "SPECTRUM",
                dataType   : "DevDouble",
                unit       : "No unit",
                displayUnit: "No display unit",
                maxDimX    : 64,
                maxDimY    : 0,
                maxValue   : "Not specified",
                minValue   : "Not specified"
            } , 
            
            
            Timing_calls : {
                label      : "Timing_calls",
                description: "No description",
                isReadOnly : true,
                dataFormat : "SPECTRUM",
                dataType   : "DevDouble",
                unit       : "No unit",
                displayUnit: "No display unit",
                maxDimX    : 64,
                maxDimY    : 0,
                maxValue   : "Not specified",
                minValue   : "Not specified"
            } , 
            
            
            Timing_index : {
                label      : "Timing_index",
                description: "No description",
                isReadOnly : true,
                dataFormat : "SPECTRUM",
                dataType   : "DevString",
                unit       : "No unit",
                displayUnit: "No display unit",
                maxDimX    : 64,
                maxDimY    : 0,
                maxValue   : "Not specified",
                minValue   : "Not specified"
            } , 
            
            
            Timing_info : {
                label      : "Timing_info",
                description: "No description",
                isReadOnly : true,
                dataFormat : "SPECTRUM",
                dataType   : "DevString",
                unit       : "No unit",
                displayUnit: "No display unit",
                maxDimX    : 64,
                maxDimY    : 0,
                maxValue   : "Not specified",
                minValue   : "Not specified"
            } , 
            
            
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
            
            
            DbAddDevice : {
                inputType   : "DevVarStringArray",
                inputDescription : "Str[0] = Full device server process name; Str[1] = Device name; Str[2] = Tango class name",
                outputType  : "DevVoid",
                outputDescription : "Uninitialised"
            }, 
            
            
            DbAddServer : {
                inputType   : "DevVarStringArray",
                inputDescription : "Str[0] = Full device server name; Str[1] = Device(s) name; Str[2] = Tango class name; Str[n] = Device name; Str[n + 1] = Tango class name",
                outputType  : "DevVoid",
                outputDescription : "Uninitialised"
            }, 
            
            
            DbDeleteAllDeviceAttributeProperty : {
                inputType   : "DevVarStringArray",
                inputDescription : "str[0] = device name; Str[1]...str[n] = attribute name(s)",
                outputType  : "DevVoid",
                outputDescription : "Uninitialised"
            }, 
            
            
            DbDeleteAttributeAlias : {
                inputType   : "DevString",
                inputDescription : "Attriibute alias name.",
                outputType  : "DevVoid",
                outputDescription : "Uninitialised"
            }, 
            
            
            DbDeleteClassAttribute : {
                inputType   : "DevVarStringArray",
                inputDescription : "Str[0] = Tango class name; Str[1] = Attribute name",
                outputType  : "DevVoid",
                outputDescription : "Uninitialised"
            }, 
            
            
            DbDeleteClassAttributeProperty : {
                inputType   : "DevVarStringArray",
                inputDescription : "Str[0] = Tango class name; Str[1] = Attribute name; Str[2] = Property name; Str[n] = Property name",
                outputType  : "DevVoid",
                outputDescription : "Uninitialised"
            }, 
            
            
            DbDeleteClassProperty : {
                inputType   : "DevVarStringArray",
                inputDescription : "Str[0] = Tango class name; Str[1] = Property name; Str[n] = Property name",
                outputType  : "DevVoid",
                outputDescription : "Uninitialised"
            }, 
            
            
            DbDeleteDevice : {
                inputType   : "DevString",
                inputDescription : "device name",
                outputType  : "DevVoid",
                outputDescription : "Uninitialised"
            }, 
            
            
            DbDeleteDeviceAlias : {
                inputType   : "DevString",
                inputDescription : "device alias name",
                outputType  : "DevVoid",
                outputDescription : "Uninitialised"
            }, 
            
            
            DbDeleteDeviceAttribute : {
                inputType   : "DevVarStringArray",
                inputDescription : "Str[0] = Device name; Str[1] = Attribute name",
                outputType  : "DevVoid",
                outputDescription : "Uninitialised"
            }, 
            
            
            DbDeleteDeviceAttributeProperty : {
                inputType   : "DevVarStringArray",
                inputDescription : "Str[0] = Device name; Str[1] = Attribute name; Str[2] = Property name; Str[n] = Property name",
                outputType  : "DevVoid",
                outputDescription : "Uninitialised"
            }, 
            
            
            DbDeleteDeviceProperty : {
                inputType   : "DevVarStringArray",
                inputDescription : "Str[0] = Device name; Str[1] = Property name; Str[n] = Property name",
                outputType  : "DevVoid",
                outputDescription : "Uninitialised"
            }, 
            
            
            DbDeleteProperty : {
                inputType   : "DevVarStringArray",
                inputDescription : "Str[0]  = Object name; Str[1] = Property name; Str[n] = Property name",
                outputType  : "DevVoid",
                outputDescription : "Uninitialised"
            }, 
            
            
            DbDeleteServer : {
                inputType   : "DevString",
                inputDescription : "Device server name",
                outputType  : "DevVoid",
                outputDescription : "Uninitialised"
            }, 
            
            
            DbDeleteServerInfo : {
                inputType   : "DevString",
                inputDescription : "Device server name",
                outputType  : "DevVoid",
                outputDescription : "Uninitialised"
            }, 
            
            
            DbExportDevice : {
                inputType   : "DevVarStringArray",
                inputDescription : "Str[0] = Device name; Str[1] = CORBA IOR; Str[2] = Device server process host name; Str[3] = Device server process PID or string ``null``; Str[4] = Device server process version",
                outputType  : "DevVoid",
                outputDescription : "Uninitialised"
            }, 
            
            
            DbExportEvent : {
                inputType   : "DevVarStringArray",
                inputDescription : "Str[0] = event channel name (or factory name); Str[1] = CORBA IOR; Str[2] = Notifd host name; Str[3] = Notifd pid; Str[4] = Notifd version",
                outputType  : "DevVoid",
                outputDescription : "Uninitialised"
            }, 
            
            
            DbGetAliasAttribute : {
                inputType   : "DevString",
                inputDescription : "The attribute alias",
                outputType  : "DevString",
                outputDescription : "The attribute name (dev_name/att_name)"
            }, 
            
            
            DbGetAliasDevice : {
                inputType   : "DevString",
                inputDescription : "Alias name",
                outputType  : "DevString",
                outputDescription : "Device name"
            }, 
            
            
            DbGetAttributeAlias : {
                inputType   : "DevString",
                inputDescription : "The attribute alias name",
                outputType  : "DevString",
                outputDescription : "The attribute name (device/attribute)"
            }, 
            
            
            DbGetAttributeAlias2 : {
                inputType   : "DevString",
                inputDescription : "The attribute name (dev_name/att_name)",
                outputType  : "DevString",
                outputDescription : "The attribute alias name (or empty string)"
            }, 
            
            
            DbGetAttributeAliasList : {
                inputType   : "DevString",
                inputDescription : "attribute alias filter string (eg: att*)",
                outputType  : "DevVarStringArray",
                outputDescription : "attribute aliases"
            }, 
            
            
            DbGetCSDbServerList : {
                inputType   : "DevVoid",
                inputDescription : "Uninitialised",
                outputType  : "DevVarStringArray",
                outputDescription : "List of host:port with one element for each database server"
            }, 
            
            
            DbGetClassAttributeList : {
                inputType   : "DevVarStringArray",
                inputDescription : "Str[0] = Tango class name; Str[1] = Attribute name filter (eg: att*)",
                outputType  : "DevVarStringArray",
                outputDescription : "Str[0] = Class attribute name; Str[n] = Class attribute name"
            }, 
            
            
            DbGetClassAttributeProperty : {
                inputType   : "DevVarStringArray",
                inputDescription : "Str[0] = Tango class name; Str[1] = Attribute name; Str[n] = Attribute name",
                outputType  : "DevVarStringArray",
                outputDescription : "Str[0] = Tango class name; Str[1] = Attribute property  number; Str[2] = Attribute property 1 name; Str[3] = Attribute property 1 value; Str[n + 1] = Attribute property 2 name; Str[n + 2] = Attribute property 2 value"
            }, 
            
            
            DbGetClassAttributeProperty2 : {
                inputType   : "DevVarStringArray",
                inputDescription : "Str[0] = Tango class name; Str[1] = Attribute name; Str[n] = Attribute name",
                outputType  : "DevVarStringArray",
                outputDescription : "Str[0] = Tango class name; Str[1] = Attribute property  number; Str[2] = Attribute property 1 name; Str[3] = Attribute property 1 value number (array case); Str[4] = Attribute property 1 value; Str[n] = Attribute property 1 value (array case); Str[n + 1] = Attribute property 2 name; Str[n + 2] = Attribute property 2 value number (array case); Str[n + 3] = Attribute property 2 value; Str[n + m] = Attribute property 2 value (array case)"
            }, 
            
            
            DbGetClassAttributePropertyHist : {
                inputType   : "DevVarStringArray",
                inputDescription : "Str[0] = Tango class; Str[1] = Attribute name; Str[2] = Property name",
                outputType  : "DevVarStringArray",
                outputDescription : "Str[0] = Attribute name; Str[1] = Property name; Str[2] = date; Str[3] = Property value number (array case); Str[4] = Property value 1; Str[n] = Property value n"
            }, 
            
            
            DbGetClassForDevice : {
                inputType   : "DevString",
                inputDescription : "Device name",
                outputType  : "DevString",
                outputDescription : "Device Tango class"
            }, 
            
            
            DbGetClassInheritanceForDevice : {
                inputType   : "DevString",
                inputDescription : "Device name",
                outputType  : "DevVarStringArray",
                outputDescription : "Classes off the specified device.; [0] - is the class of the device.; [1] - is the class from the device class is inherited.; ........and so on"
            }, 
            
            
            DbGetClassList : {
                inputType   : "DevString",
                inputDescription : "Filter",
                outputType  : "DevVarStringArray",
                outputDescription : "Class list"
            }, 
            
            
            DbGetClassProperty : {
                inputType   : "DevVarStringArray",
                inputDescription : "Str[0] = Tango class; Str[1] = Property name; Str[2] = Property name",
                outputType  : "DevVarStringArray",
                outputDescription : "Str[0] = Tango class; Str[1] = Property number; Str[2] = Property name; Str[3] = Property value number (array case); Str[4] = Property value; Str[n] = Propery value (array case); ...."
            }, 
            
            
            DbGetClassPropertyHist : {
                inputType   : "DevVarStringArray",
                inputDescription : "Str[0] = Tango class; Str[1] = Property name",
                outputType  : "DevVarStringArray",
                outputDescription : "Str[0] = Property name; Str[1] = date; Str[2] = Property value number (array case); Str[3] = Property value 1; Str[n] = Property value n"
            }, 
            
            
            DbGetClassPropertyList : {
                inputType   : "DevString",
                inputDescription : "The filter",
                outputType  : "DevVarStringArray",
                outputDescription : "Property name list"
            }, 
            
            
            DbGetDataForServerCache : {
                inputType   : "DevVarStringArray",
                inputDescription : "Elt[0] = DS name (exec_name/inst_name), Elt[1] = Host name",
                outputType  : "DevVarStringArray",
                outputDescription : "All the data needed by the device server during its startup sequence. Precise list depend on the device server"
            }, 
            
            
            DbGetDeviceAlias : {
                inputType   : "DevString",
                inputDescription : "The device name",
                outputType  : "DevString",
                outputDescription : "The alias found"
            }, 
            
            
            DbGetDeviceAliasList : {
                inputType   : "DevString",
                inputDescription : "The filter",
                outputType  : "DevVarStringArray",
                outputDescription : "Device alias list"
            }, 
            
            
            DbGetDeviceAttributeList : {
                inputType   : "DevVarStringArray",
                inputDescription : "Str[0] = Device name; Str[1] = Wildcard",
                outputType  : "DevVarStringArray",
                outputDescription : "attribute name list"
            }, 
            
            
            DbGetDeviceAttributeProperty : {
                inputType   : "DevVarStringArray",
                inputDescription : "Str[0] = Device name; Str[1] = Attribute name; Str[n] = Attribute name",
                outputType  : "DevVarStringArray",
                outputDescription : "Str[0] = Device name; Str[1] = Attribute property  number; Str[2] = Attribute property 1 name; Str[3] = Attribute property 1 value; Str[n + 1] = Attribute property 2 name; Str[n + 2] = Attribute property 2 value"
            }, 
            
            
            DbGetDeviceAttributeProperty2 : {
                inputType   : "DevVarStringArray",
                inputDescription : "Str[0] = Device name; Str[1] = Attribute name; Str[n] = Attribute name",
                outputType  : "DevVarStringArray",
                outputDescription : "Str[0] = Device name; Str[1] = Attribute property  number; Str[2] = Attribute property 1 name; Str[3] = Attribute property 1 value number (array case); Str[4] = Attribute property 1 value; Str[n] = Attribute property 1 value (array case); Str[n + 1] = Attribute property 2 name; Str[n + 2] = Attribute property 2 value number (array case); Str[n + 3] = Attribute property 2 value; Str[n + m] = Attribute property 2 value (array case)"
            }, 
            
            
            DbGetDeviceAttributePropertyHist : {
                inputType   : "DevVarStringArray",
                inputDescription : "Str[0] = Device name; Str[1] = Attribute name; Str[2] = Property name",
                outputType  : "DevVarStringArray",
                outputDescription : "Str[0] = Attribute name; Str[1] = Property name; Str[2] = date; Str[3] = Property value number (array case); Str[4] = Property value 1; Str[n] = Property value n"
            }, 
            
            
            DbGetDeviceClassList : {
                inputType   : "DevString",
                inputDescription : "Device server process name",
                outputType  : "DevVarStringArray",
                outputDescription : "Str[0] = Device name; Str[1] = Tango class; Str[n] = Device name; Str[n + 1] = Tango class"
            }, 
            
            
            DbGetDeviceDomainList : {
                inputType   : "DevString",
                inputDescription : "The wildcard",
                outputType  : "DevVarStringArray",
                outputDescription : "Device name domain list"
            }, 
            
            
            DbGetDeviceExportedList : {
                inputType   : "DevString",
                inputDescription : "filter",
                outputType  : "DevVarStringArray",
                outputDescription : "list of exported devices"
            }, 
            
            
            DbGetDeviceFamilyList : {
                inputType   : "DevString",
                inputDescription : "The wildcard",
                outputType  : "DevVarStringArray",
                outputDescription : "Family list"
            }, 
            
            
            DbGetDeviceInfo : {
                inputType   : "DevString",
                inputDescription : "Device name",
                outputType  : "DevVarLongStringArray",
                outputDescription : "Str[0] = Device name; Str[1] = CORBA IOR; Str[2] = Device version; Str[3] = Device Server name; Str[4] = Device Server process host name; Str[5] = Started date (or ? if not set); Str[6] = Stopped date (or ? if not set); Str[7] = Device class; ; Lg[0] = Device exported flag; Lg[1] = Device Server process PID (or -1 if not set)"
            }, 
            
            
            DbGetDeviceList : {
                inputType   : "DevVarStringArray",
                inputDescription : "argin[0] : server name; argin[1] : class name",
                outputType  : "DevVarStringArray",
                outputDescription : "The list of devices for specified server and class."
            }, 
            
            
            DbGetDeviceMemberList : {
                inputType   : "DevString",
                inputDescription : "The filter",
                outputType  : "DevVarStringArray",
                outputDescription : "Device names member list"
            }, 
            
            
            DbGetDeviceProperty : {
                inputType   : "DevVarStringArray",
                inputDescription : "Str[0] = Device name; Str[1] = Property name; Str[n] = Property name",
                outputType  : "DevVarStringArray",
                outputDescription : "Str[0] = Device name; Str[1] = Property number; Str[2] = Property name; Str[3] = Property value number (array case); Str[4] = Property value 1; Str[n] = Property value n (array case); Str[n + 1] = Property name; Str[n + 2] = Property value number (array case); Str[n + 3] = Property value 1; Str[n + m] = Property value m"
            }, 
            
            
            DbGetDevicePropertyHist : {
                inputType   : "DevVarStringArray",
                inputDescription : "Str[0] = Device name; Str[2] = Property name",
                outputType  : "DevVarStringArray",
                outputDescription : "Str[0] = Property name; Str[1] = date; Str[2] = Property value number (array case); Str[3] = Property value 1; Str[n] = Property value n"
            }, 
            
            
            DbGetDevicePropertyList : {
                inputType   : "DevVarStringArray",
                inputDescription : "Str[0] = device name; Str[1] = Filter",
                outputType  : "DevVarStringArray",
                outputDescription : "Property name list"
            }, 
            
            
            DbGetDeviceServerClassList : {
                inputType   : "DevString",
                inputDescription : "device server process name",
                outputType  : "DevVarStringArray",
                outputDescription : "list of classes for this device server"
            }, 
            
            
            DbGetDeviceWideList : {
                inputType   : "DevString",
                inputDescription : "filter",
                outputType  : "DevVarStringArray",
                outputDescription : "list of exported devices"
            }, 
            
            
            DbGetExportdDeviceListForClass : {
                inputType   : "DevString",
                inputDescription : "Class name",
                outputType  : "DevVarStringArray",
                outputDescription : "Device exported list"
            }, 
            
            
            DbGetHostList : {
                inputType   : "DevString",
                inputDescription : "The filter",
                outputType  : "DevVarStringArray",
                outputDescription : "Host name list"
            }, 
            
            
            DbGetHostServerList : {
                inputType   : "DevString",
                inputDescription : "The filter",
                outputType  : "DevVarStringArray",
                outputDescription : "Device server process name list"
            }, 
            
            
            DbGetHostServersInfo : {
                inputType   : "DevString",
                inputDescription : "Host name",
                outputType  : "DevVarStringArray",
                outputDescription : "Server info for all servers running on specified host"
            }, 
            
            
            DbGetInstanceNameList : {
                inputType   : "DevString",
                inputDescription : "Server name",
                outputType  : "DevVarStringArray",
                outputDescription : "The instance names found for specified server."
            }, 
            
            
            DbGetObjectList : {
                inputType   : "DevString",
                inputDescription : "The filter",
                outputType  : "DevVarStringArray",
                outputDescription : "Object name list"
            }, 
            
            
            DbGetProperty : {
                inputType   : "DevVarStringArray",
                inputDescription : "Str[0] = Object name; Str[1] = Property name; Str[n] = Property name",
                outputType  : "DevVarStringArray",
                outputDescription : "Str[0] = Object name; Str[1] = Property number; Str[2] = Property name; Str[3] = Property value number (array case); Str[4] = Property value 1; Str[n] = Property value n (array case); Str[n + 1] = Property name; Str[n + 2] = Property value number (array case); Str[n + 3] = Property value 1; Str[n + m] = Property value m"
            }, 
            
            
            DbGetPropertyHist : {
                inputType   : "DevVarStringArray",
                inputDescription : "Str[0] = Object name; Str[2] = Property name",
                outputType  : "DevVarStringArray",
                outputDescription : "Str[0] = Property name; Str[1] = date; Str[2] = Property value number (array case); Str[3] = Property value 1; Str[n] = Property value n"
            }, 
            
            
            DbGetPropertyList : {
                inputType   : "DevVarStringArray",
                inputDescription : "Str[0] = Object name; Str[1] = filter",
                outputType  : "DevVarStringArray",
                outputDescription : "Property name list"
            }, 
            
            
            DbGetServerInfo : {
                inputType   : "DevString",
                inputDescription : "server name",
                outputType  : "DevVarStringArray",
                outputDescription : "server info"
            }, 
            
            
            DbGetServerList : {
                inputType   : "DevString",
                inputDescription : "The filter",
                outputType  : "DevVarStringArray",
                outputDescription : "Device server process name list"
            }, 
            
            
            DbGetServerNameList : {
                inputType   : "DevString",
                inputDescription : "wildcard for server names.",
                outputType  : "DevVarStringArray",
                outputDescription : "server names found."
            }, 
            
            
            DbImportDevice : {
                inputType   : "DevString",
                inputDescription : "Device name (or alias)",
                outputType  : "DevVarLongStringArray",
                outputDescription : "Str[0] = device name; Str[1] = CORBA IOR; Str[2] = device version; Str[3] = device server process name; Str[4] = host name; Str[5] = Tango class name; ; Lg[0] = Exported flag; Lg[1] = Device server process PID"
            }, 
            
            
            DbImportEvent : {
                inputType   : "DevString",
                inputDescription : "name of event channel or factory",
                outputType  : "DevVarLongStringArray",
                outputDescription : "export information e.g. IOR"
            }, 
            
            
            DbInfo : {
                inputType   : "DevVoid",
                inputDescription : "Uninitialised",
                outputType  : "DevVarStringArray",
                outputDescription : "Miscellaneous info like:; - Device defined in database; - Device marked as exported in database; - Device server process defined in database; - Device server process marked as exported in database; - Device properties defined in database; - Class properties defined in database; - Device attribute properties defined in database; - Class attribute properties defined in database; - Object properties defined in database"
            }, 
            
            
            DbMySqlSelect : {
                inputType   : "DevString",
                inputDescription : "MySql Select command",
                outputType  : "DevVarLongStringArray",
                outputDescription : "MySql Select command result;  - svalues : select results;  - lvalue[n] : =0 if svalue[n] is null else =1;  (last lvalue -1) is number of rows, (last lvalue) is number of fields"
            }, 
            
            
            DbPutAttributeAlias : {
                inputType   : "DevVarStringArray",
                inputDescription : "Str[0] = attribute name; Str[1] = attribute alias",
                outputType  : "DevVoid",
                outputDescription : "Uninitialised"
            }, 
            
            
            DbPutClassAttributeProperty : {
                inputType   : "DevVarStringArray",
                inputDescription : "Str[0] = Tango class name; Str[1] = Attribute number; Str[2] = Attribute name; Str[3] = Property number; Str[4] = Property name; Str[5] = Property value; .....",
                outputType  : "DevVoid",
                outputDescription : "Uninitialised"
            }, 
            
            
            DbPutClassAttributeProperty2 : {
                inputType   : "DevVarStringArray",
                inputDescription : "Str[0] = Tango class name; Str[1] = Attribute number; Str[2] = Attribute name; Str[3] = Property number; Str[4] = Property name; Str[5] = Property value number (array case); Str[5] = Property value 1; Str[n] = Property value n (array case); .....",
                outputType  : "DevVoid",
                outputDescription : "Uninitialised"
            }, 
            
            
            DbPutClassProperty : {
                inputType   : "DevVarStringArray",
                inputDescription : "Str[0] = Tango class name; Str[1] = Property number; Str[2] = Property name; Str[3] = Property value number; Str[4] = Property value 1; Str[n] = Property value n; ....",
                outputType  : "DevVoid",
                outputDescription : "Uninitialised"
            }, 
            
            
            DbPutDeviceAlias : {
                inputType   : "DevVarStringArray",
                inputDescription : "Str[0] = device name; Str[1] = alias name",
                outputType  : "DevVoid",
                outputDescription : "Uninitialised"
            }, 
            
            
            DbPutDeviceAttributeProperty : {
                inputType   : "DevVarStringArray",
                inputDescription : "Str[0] = Device name; Str[1] = Attribute number; Str[2] = Attribute name; Str[3] = Property number; Str[4] = Property name; Str[5] = Property value; .....",
                outputType  : "DevVoid",
                outputDescription : "Uninitialised"
            }, 
            
            
            DbPutDeviceAttributeProperty2 : {
                inputType   : "DevVarStringArray",
                inputDescription : "Str[0] = Device name; Str[1] = Attribute number; Str[2] = Attribute name; Str[3] = Property number; Str[4] = Property name; Str[5] = Property value number (array case); Str[5] = Property value 1; Str[n] = Property value n (array case); .....",
                outputType  : "DevVoid",
                outputDescription : "Uninitialised"
            }, 
            
            
            DbPutDeviceProperty : {
                inputType   : "DevVarStringArray",
                inputDescription : "Str[0] = Tango device name; Str[1] = Property number; Str[2] = Property name; Str[3] = Property value number; Str[4] = Property value 1; Str[n] = Property value n; ....",
                outputType  : "DevVoid",
                outputDescription : "Uninitialised"
            }, 
            
            
            DbPutProperty : {
                inputType   : "DevVarStringArray",
                inputDescription : "Str[0] = Object name; Str[1] = Property number; Str[2] = Property name; Str[3] = Property value number; Str[4] = Property value 1; Str[n] = Property value n; ....",
                outputType  : "DevVoid",
                outputDescription : "Uninitialised"
            }, 
            
            
            DbPutServerInfo : {
                inputType   : "DevVarStringArray",
                inputDescription : "server info",
                outputType  : "DevVoid",
                outputDescription : "Uninitialised"
            }, 
            
            
            DbRenameServer : {
                inputType   : "DevVarStringArray",
                inputDescription : "s[0] = old device server name (exec/instance); s[1] = new device server name (exec/instance)",
                outputType  : "DevVoid",
                outputDescription : "Uninitialised"
            }, 
            
            
            DbUnExportDevice : {
                inputType   : "DevString",
                inputDescription : "Device name",
                outputType  : "DevVoid",
                outputDescription : "Uninitialised"
            }, 
            
            
            DbUnExportEvent : {
                inputType   : "DevString",
                inputDescription : "name of event channel or factory to unexport",
                outputType  : "DevVoid",
                outputDescription : "none"
            }, 
            
            
            DbUnExportServer : {
                inputType   : "DevString",
                inputDescription : "Device server name (executable/instance)",
                outputType  : "DevVoid",
                outputDescription : "Uninitialised"
            }, 
            
            
            Init : {
                inputType   : "DevVoid",
                inputDescription : "Uninitialised",
                outputType  : "DevVoid",
                outputDescription : "Uninitialised"
            }, 
            
            
            ResetTimingValues : {
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
            }
            
        }
    },
    /* @Prototype */
    {
        id: null, //unique id used for data storage,
        /**
         * @constructor
         *
         * Creates a new instance of DataBase proxy
         *
         * This model is a thin wrapper around mtango.DeviceProxy that provides device's specific interface, i.e. attributes and commands.
         *
         * All instances of this model dedicated to a single device utilize single DeviceProxy.
         *
         * TangoWebapp.consts must be defined before using this constructor
         */
        init: function(){
            this.host = TangoWebapp.consts.TANGO_HOST.replace(":","/");
            var url = TangoWebapp.consts.REST_API_URL + "/" + TangoWebapp.consts.REST_API_VERSION + "/hosts/" + this.host;
            this.url = url;
            this.api = new TangoREST(url);
            this.name = TangoWebapp.consts.DATABASE;
        },
        
        
        /**
         * Executes command DbAddDevice on the remote server
         *
         * @param {*} argin - argument for the command [optional]
         * @param {Object|Function} cbks: onSuccess - callback [required]; onFailure - panic callback [optional]
         */
        DbAddDevice : function(argin, cbks){
            var promise = this.api.devices(this.name).commands('DbAddDevice').exec(argin);
            if (cbks) {
                var callbacks = this.Class._clean_callbacks(cbks);
                if (callbacks.onFailure) promise.fail(callbacks.onFailure);
                if (callbacks.onSuccess) return promise.then(callbacks.onSuccess);
            }
            else return promise;
        },
        
        
        /**
         * Executes command DbAddServer on the remote server
         *
         * @param {*} argin - argument for the command [optional]
         * @param {Object|Function} cbks: onSuccess - callback [required]; onFailure - panic callback [optional]
         */
        DbAddServer : function(argin, cbks){
            throw "Not yet implemented!";
        },
        
        
        /**
         * Executes command DbDeleteAllDeviceAttributeProperty on the remote server
         *
         * @param {*} argin - argument for the command [optional]
         * @param {Object|Function} cbks: onSuccess - callback [required]; onFailure - panic callback [optional]
         */
        DbDeleteAllDeviceAttributeProperty : function(argin, cbks){
            throw "Not yet implemented!";
        },
        
        
        /**
         * Executes command DbDeleteAttributeAlias on the remote server
         *
         * @param {*} argin - argument for the command [optional]
         * @param {Object|Function} cbks: onSuccess - callback [required]; onFailure - panic callback [optional]
         */
        DbDeleteAttributeAlias : function(argin, cbks){
            throw "Not yet implemented!";
        },
        
        
        /**
         * Executes command DbDeleteClassAttribute on the remote server
         *
         * @param {*} argin - argument for the command [optional]
         * @param {Object|Function} cbks: onSuccess - callback [required]; onFailure - panic callback [optional]
         */
        DbDeleteClassAttribute : function(argin, cbks){
            throw "Not yet implemented!";
        },
        
        
        /**
         * Executes command DbDeleteClassAttributeProperty on the remote server
         *
         * @param {*} argin - argument for the command [optional]
         * @param {Object|Function} cbks: onSuccess - callback [required]; onFailure - panic callback [optional]
         */
        DbDeleteClassAttributeProperty : function(argin, cbks){
            throw "Not yet implemented!";
        },
        
        
        /**
         * Executes command DbDeleteClassProperty on the remote server
         *
         * @param {*} argin - argument for the command [optional]
         * @param {Object|Function} cbks: onSuccess - callback [required]; onFailure - panic callback [optional]
         */
        DbDeleteClassProperty : function(argin, cbks){
            throw "Not yet implemented!";
        },
        
        
        /**
         * Executes command DbDeleteDevice on the remote server
         *
         * @param {*} argin - argument for the command [optional]
         * @param {Object|Function} cbks: onSuccess - callback [required]; onFailure - panic callback [optional]
         */
        DbDeleteDevice : function(argin, cbks){
            var promise = this.api.devices(this.name).commands('DbDeleteDevice').exec(argin);
            if (cbks) {
                var callbacks = this.Class._clean_callbacks(cbks);
                if (callbacks.onFailure) promise.fail(callbacks.onFailure);
                if (callbacks.onSuccess) return promise.then(callbacks.onSuccess);
            }
            else return promise;
        },
        
        
        /**
         * Executes command DbDeleteDeviceAlias on the remote server
         *
         * @param {*} argin - argument for the command [optional]
         * @param {Object|Function} cbks: onSuccess - callback [required]; onFailure - panic callback [optional]
         */
        DbDeleteDeviceAlias : function(argin, cbks){
            throw "Not yet implemented!";
        },
        
        
        /**
         * Executes command DbDeleteDeviceAttribute on the remote server
         *
         * @param {*} argin - argument for the command [optional]
         * @param {Object|Function} cbks: onSuccess - callback [required]; onFailure - panic callback [optional]
         */
        DbDeleteDeviceAttribute : function(argin, cbks){
            throw "Not yet implemented!";
        },
        
        
        /**
         * Executes command DbDeleteDeviceAttributeProperty on the remote server
         *
         * @param {*} argin - argument for the command [optional]
         * @param {Object|Function} cbks: onSuccess - callback [required]; onFailure - panic callback [optional]
         */
        DbDeleteDeviceAttributeProperty : function(argin, cbks){
            throw "Not yet implemented!";
        },
        
        
        /**
         * Executes command DbDeleteDeviceProperty on the remote server
         *
         * @param {*} argin - argument for the command [optional]
         * @param {Object|Function} cbks: onSuccess - callback [required]; onFailure - panic callback [optional]
         */
        DbDeleteDeviceProperty : function(argin, cbks){
            throw "Not yet implemented!";
        },
        
        
        /**
         * Executes command DbDeleteProperty on the remote server
         *
         * @param {*} argin - argument for the command [optional]
         * @param {Object|Function} cbks: onSuccess - callback [required]; onFailure - panic callback [optional]
         */
        DbDeleteProperty : function(argin, cbks){
            throw "Not yet implemented!";
        },
        
        
        /**
         * Executes command DbDeleteServer on the remote server
         *
         * @param {*} argin - argument for the command [optional]
         * @param {Object|Function} cbks: onSuccess - callback [required]; onFailure - panic callback [optional]
         */
        DbDeleteServer : function(argin, cbks){
            throw "Not yet implemented!";
        },
        
        
        /**
         * Executes command DbDeleteServerInfo on the remote server
         *
         * @param {*} argin - argument for the command [optional]
         * @param {Object|Function} cbks: onSuccess - callback [required]; onFailure - panic callback [optional]
         */
        DbDeleteServerInfo : function(argin, cbks){
            throw "Not yet implemented!";
        },
        
        
        /**
         * Executes command DbExportDevice on the remote server
         *
         * @param {*} argin - argument for the command [optional]
         * @param {Object|Function} cbks: onSuccess - callback [required]; onFailure - panic callback [optional]
         */
        DbExportDevice : function(argin, cbks){
            throw "Not yet implemented!";
        },
        
        
        /**
         * Executes command DbExportEvent on the remote server
         *
         * @param {*} argin - argument for the command [optional]
         * @param {Object|Function} cbks: onSuccess - callback [required]; onFailure - panic callback [optional]
         */
        DbExportEvent : function(argin, cbks){
            throw "Not yet implemented!";
        },
        
        
        /**
         * Executes command DbGetAliasAttribute on the remote server
         *
         * @param {*} argin - argument for the command [optional]
         * @param {Object|Function} cbks: onSuccess - callback [required]; onFailure - panic callback [optional]
         */
        DbGetAliasAttribute : function(argin, cbks){
            throw "Not yet implemented!";
        },
        
        
        /**
         * Executes command DbGetAliasDevice on the remote server
         *
         * @param {*} argin - argument for the command [optional]
         * @param {Object|Function} cbks: onSuccess - callback [required]; onFailure - panic callback [optional]
         */
        DbGetAliasDevice : function(argin, cbks){
            throw "Not yet implemented!";
        },
        
        
        /**
         * Executes command DbGetAttributeAlias on the remote server
         *
         * @param {*} argin - argument for the command [optional]
         * @param {Object|Function} cbks: onSuccess - callback [required]; onFailure - panic callback [optional]
         */
        DbGetAttributeAlias : function(argin, cbks){
            throw "Not yet implemented!";
        },
        
        
        /**
         * Executes command DbGetAttributeAlias2 on the remote server
         *
         * @param {*} argin - argument for the command [optional]
         * @param {Object|Function} cbks: onSuccess - callback [required]; onFailure - panic callback [optional]
         */
        DbGetAttributeAlias2 : function(argin, cbks){
            throw "Not yet implemented!";
        },
        
        
        /**
         * Executes command DbGetAttributeAliasList on the remote server
         *
         * @param {*} argin - argument for the command [optional]
         * @param {Object|Function} cbks: onSuccess - callback [required]; onFailure - panic callback [optional]
         */
        DbGetAttributeAliasList : function(argin, cbks){
            throw "Not yet implemented!";
        },
        
        
        /**
         * Executes command DbGetCSDbServerList on the remote server
         *
         * @param {*} argin - argument for the command [optional]
         * @param {Object|Function} cbks: onSuccess - callback [required]; onFailure - panic callback [optional]
         */
        DbGetCSDbServerList : function(argin, cbks){
            throw "Not yet implemented!";
        },
        
        
        /**
         * Executes command DbGetClassAttributeList on the remote server
         *
         * @param {*} argin - argument for the command [optional]
         * @param {Object|Function} cbks: onSuccess - callback [required]; onFailure - panic callback [optional]
         */
        DbGetClassAttributeList : function(argin, cbks){
            throw "Not yet implemented!";
        },
        
        
        /**
         * Executes command DbGetClassAttributeProperty on the remote server
         *
         * @param {*} argin - argument for the command [optional]
         * @param {Object|Function} cbks: onSuccess - callback [required]; onFailure - panic callback [optional]
         */
        DbGetClassAttributeProperty : function(argin, cbks){
            throw "Not yet implemented!";
        },
        
        
        /**
         * Executes command DbGetClassAttributeProperty2 on the remote server
         *
         * @param {*} argin - argument for the command [optional]
         * @param {Object|Function} cbks: onSuccess - callback [required]; onFailure - panic callback [optional]
         */
        DbGetClassAttributeProperty2 : function(argin, cbks){
            throw "Not yet implemented!";
        },
        
        
        /**
         * Executes command DbGetClassAttributePropertyHist on the remote server
         *
         * @param {*} argin - argument for the command [optional]
         * @param {Object|Function} cbks: onSuccess - callback [required]; onFailure - panic callback [optional]
         */
        DbGetClassAttributePropertyHist : function(argin, cbks){
            throw "Not yet implemented!";
        },
        
        
        /**
         * Executes command DbGetClassForDevice on the remote server
         *
         * @param {*} argin - argument for the command [optional]
         * @param {Object|Function} cbks: onSuccess - callback [required]; onFailure - panic callback [optional]
         */
        DbGetClassForDevice : function(argin, cbks){
            var promise = this.api.devices(this.name).commands('DbGetClassForDevice').exec(argin);
            if (cbks) {
                var callbacks = this.Class._clean_callbacks(cbks);
                if (callbacks.onFailure) promise.fail(callbacks.onFailure);
                if (callbacks.onSuccess) return promise.then(callbacks.onSuccess);
            }
            else return promise;
        },
        
        
        /**
         * Executes command DbGetClassInheritanceForDevice on the remote server
         *
         * @param {*} argin - argument for the command [optional]
         * @param {Object|Function} cbks: onSuccess - callback [required]; onFailure - panic callback [optional]
         */
        DbGetClassInheritanceForDevice : function(argin, cbks){
            throw "Not yet implemented!";
        },
        
        
        /**
         * Executes command DbGetClassList on the remote server
         *
         * @param {*} argin - argument for the command [optional]
         * @param {Object|Function} cbks: onSuccess - callback [required]; onFailure - panic callback [optional]
         */
        DbGetClassList : function(argin, cbks){
            throw "Not yet implemented!";
        },
        
        
        /**
         * Executes command DbGetClassProperty on the remote server
         *
         * @param {*} argin - argument for the command [optional]
         * @param {Object|Function} cbks: onSuccess - callback [required]; onFailure - panic callback [optional]
         */
        DbGetClassProperty : function(argin, cbks){
            throw "Not yet implemented!";
        },
        
        
        /**
         * Executes command DbGetClassPropertyHist on the remote server
         *
         * @param {*} argin - argument for the command [optional]
         * @param {Object|Function} cbks: onSuccess - callback [required]; onFailure - panic callback [optional]
         */
        DbGetClassPropertyHist : function(argin, cbks){
            throw "Not yet implemented!";
        },
        
        
        /**
         * Executes command DbGetClassPropertyList on the remote server
         *
         * @param {*} argin - argument for the command [optional]
         * @param {Object|Function} cbks: onSuccess - callback [required]; onFailure - panic callback [optional]
         */
        DbGetClassPropertyList : function(argin, cbks){
            throw "Not yet implemented!";
        },
        
        
        /**
         * Executes command DbGetDataForServerCache on the remote server
         *
         * @param {*} argin - argument for the command [optional]
         * @param {Object|Function} cbks: onSuccess - callback [required]; onFailure - panic callback [optional]
         */
        DbGetDataForServerCache : function(argin, cbks){
            throw "Not yet implemented!";
        },
        
        
        /**
         * Executes command DbGetDeviceAlias on the remote server
         *
         * @param {*} argin - argument for the command [optional]
         * @param {Object|Function} cbks: onSuccess - callback [required]; onFailure - panic callback [optional]
         */
        DbGetDeviceAlias : function(argin, cbks){
            throw "Not yet implemented!";
        },
        
        
        /**
         * Executes command DbGetDeviceAliasList on the remote server
         *
         * @param {*} argin - argument for the command [optional]
         * @param {Object|Function} cbks: onSuccess - callback [required]; onFailure - panic callback [optional]
         */
        DbGetDeviceAliasList : function(argin, cbks){
            throw "Not yet implemented!";
        },
        
        
        /**
         * Executes command DbGetDeviceAttributeList on the remote server
         *
         * @param {*} argin - argument for the command [optional]
         * @param {Object|Function} cbks: onSuccess - callback [required]; onFailure - panic callback [optional]
         */
        DbGetDeviceAttributeList : function(argin, cbks){
            throw "Not yet implemented!";
        },
        
        
        /**
         * Executes command DbGetDeviceAttributeProperty on the remote server
         *
         * @param {*} argin - argument for the command [optional]
         * @param {Object|Function} cbks: onSuccess - callback [required]; onFailure - panic callback [optional]
         */
        DbGetDeviceAttributeProperty : function(argin, cbks){
            throw "Not yet implemented!";
        },
        
        
        /**
         * Executes command DbGetDeviceAttributeProperty2 on the remote server
         *
         * @param {*} argin - argument for the command [optional]
         * @param {Object|Function} cbks: onSuccess - callback [required]; onFailure - panic callback [optional]
         */
        DbGetDeviceAttributeProperty2 : function(argin, cbks){
            throw "Not yet implemented!";
        },
        
        
        /**
         * Executes command DbGetDeviceAttributePropertyHist on the remote server
         *
         * @param {*} argin - argument for the command [optional]
         * @param {Object|Function} cbks: onSuccess - callback [required]; onFailure - panic callback [optional]
         */
        DbGetDeviceAttributePropertyHist : function(argin, cbks){
            throw "Not yet implemented!";
        },
        
        
        /**
         * Executes command DbGetDeviceClassList on the remote server
         *
         * @param {*} argin - argument for the command [optional]
         * @param {Object|Function} cbks: onSuccess - callback [required]; onFailure - panic callback [optional]
         */
        DbGetDeviceClassList : function(argin, cbks){
            throw "Not yet implemented!";
        },
        
        
        /**
         * Executes command DbGetDeviceDomainList on the remote server
         *
         * @param {*} argin - argument for the command [optional]
         * @param {Object|Function} cbks: onSuccess - callback [required]; onFailure - panic callback [optional]
         */
        DbGetDeviceDomainList : function(argin, cbks){
            var promise = this.api.devices(this.name).commands("DbGetDeviceDomainList").exec(argin);
            if(cbks) {
                var callbacks = this.Class._clean_callbacks(cbks);
                if (callbacks.onFailure) promise.fail(callbacks.onFailure);
                if (callbacks.onSuccess) return promise.then(callbacks.onSuccess);
            }
            else return promise;
        },
        /**
         * Executes command DbGetDeviceExportedList on the remote server
         *
         * @param {*} argin - argument for the command [optional]
         * @param {Object|Function} cbks: onSuccess - callback [required]; onFailure - panic callback [optional]
         */
        DbGetDeviceExportedList : function(argin, cbks){
            throw "Not yet implemented!";
        },
        
        
        /**
         * Executes command DbGetDeviceFamilyList on the remote server
         *
         * @param {*} argin - argument for the command [optional]
         * @param {Object|Function} cbks: onSuccess - callback [required]; onFailure - panic callback [optional]
         */
        DbGetDeviceFamilyList : function(argin, cbks){
            var promise = this.api.devices(this.name).commands("DbGetDeviceFamilyList").exec(argin);
            if(cbks) {
                var callbacks = this.Class._clean_callbacks(cbks);
                if (callbacks.onFailure) promise.fail(callbacks.onFailure);
                if (callbacks.onSuccess) return promise.then(callbacks.onSuccess);
            }
            else return promise;
        },
        /**
         * Executes command DbGetDeviceInfo on the remote server
         *
         * @param {*} argin - argument for the command [optional]
         * @param {Object|Function} cbks: onSuccess - callback [required]; onFailure - panic callback [optional]
         */
        DbGetDeviceInfo : function(argin, cbks){
            var promise = this.api.devices(this.name).commands('DbGetDeviceInfo').exec(argin);
            if(cbks) {
                var callbacks = this.Class._clean_callbacks(cbks);
                if (callbacks.onFailure) promise.fail(callbacks.onFailure);
                if (callbacks.onSuccess) return promise.then(callbacks.onSuccess);
            }
            else return promise;
        },

        /**
         * Executes command DbGetDeviceList on the remote server
         *
         * @param {*} argin - argument for the command [optional]
         * @param {Object|Function} cbks: onSuccess - callback [required]; onFailure - panic callback [optional]
         */
        DbGetDeviceList : function(argin, cbks){
            throw "Not yet implemented!";
        },
        
        
        /**
         * Executes command DbGetDeviceMemberList on the remote server
         *
         * @param {*} argin - argument for the command [optional]
         * @param {Object|Function} cbks: onSuccess - callback [required]; onFailure - panic callback [optional]
         */
        DbGetDeviceMemberList : function(argin, cbks){
            var promise = this.api.devices(this.name).commands('DbGetDeviceMemberList').exec(argin);
            if(cbks) {
                var callbacks = this.Class._clean_callbacks(cbks);
                if (callbacks.onFailure) promise.fail(callbacks.onFailure);
                if (callbacks.onSuccess) return promise.then(callbacks.onSuccess);
            }
            else return promise;
        },
        /**
         * Executes command DbGetDeviceProperty on the remote server
         *
         * @param {*} argin - argument for the command [optional]
         * @param {Object|Function} cbks: onSuccess - callback [required]; onFailure - panic callback [optional]
         */
        DbGetDeviceProperty : function(argin, cbks){
            var promise = this.api.devices(this.name).commands('DbGetDeviceProperty').exec('input', argin);
            if(cbks) {
                var callbacks = this.Class._clean_callbacks(cbks);
                if (callbacks.onFailure) promise.fail(callbacks.onFailure);
                if (callbacks.onSuccess) return promise.then(callbacks.onSuccess);
            }
            else return promise;
        },
        
        
        /**
         * Executes command DbGetDevicePropertyHist on the remote server
         *
         * @param {*} argin - argument for the command [optional]
         * @param {Object|Function} cbks: onSuccess - callback [required]; onFailure - panic callback [optional]
         */
        DbGetDevicePropertyHist : function(argin, cbks){
            throw "Not yet implemented!";
        },
        
        
        /**
         * Executes command DbGetDevicePropertyList on the remote server
         *
         * @param {*} argin - argument for the command [optional]
         * @param {Object|Function} cbks: onSuccess - callback [required]; onFailure - panic callback [optional]
         */
        DbGetDevicePropertyList : function(argin, cbks){
            throw "Not yet implemented!";
        },
        
        
        /**
         * Executes command DbGetDeviceServerClassList on the remote server
         *
         * @param {*} argin - argument for the command [optional]
         * @param {Object|Function} cbks: onSuccess - callback [required]; onFailure - panic callback [optional]
         */
        DbGetDeviceServerClassList : function(argin, cbks){
            throw "Not yet implemented!";
        },
        
        
        /**
         * Executes command DbGetDeviceWideList on the remote server
         *
         * @param {*} argin - argument for the command [optional]
         * @param {Object|Function} cbks: onSuccess - callback [required]; onFailure - panic callback [optional]
         */
        DbGetDeviceWideList : function(argin, cbks){
            throw "Not yet implemented!";
        },
        
        
        /**
         * Executes command DbGetExportdDeviceListForClass on the remote server
         *
         * @param {*} argin - argument for the command [optional]
         * @param {Object|Function} cbks: onSuccess - callback [required]; onFailure - panic callback [optional]
         */
        DbGetExportdDeviceListForClass : function(argin, cbks){
            throw "Not yet implemented!";
        },
        
        
        /**
         * Executes command DbGetHostList on the remote server
         *
         * @param {*} argin - argument for the command [optional]
         * @param {Object|Function} cbks: onSuccess - callback [required]; onFailure - panic callback [optional]
         */
        DbGetHostList : function(argin, cbks){
            throw "Not yet implemented!";
        },
        
        
        /**
         * Executes command DbGetHostServerList on the remote server
         *
         * @param {*} argin - argument for the command [optional]
         * @param {Object|Function} cbks: onSuccess - callback [required]; onFailure - panic callback [optional]
         */
        DbGetHostServerList : function(argin, cbks){
            throw "Not yet implemented!";
        },
        
        
        /**
         * Executes command DbGetHostServersInfo on the remote server
         *
         * @param {*} argin - argument for the command [optional]
         * @param {Object|Function} cbks: onSuccess - callback [required]; onFailure - panic callback [optional]
         */
        DbGetHostServersInfo : function(argin, cbks){
            throw "Not yet implemented!";
        },
        
        
        /**
         * Executes command DbGetInstanceNameList on the remote server
         *
         * @param {*} argin - argument for the command [optional]
         * @param {Object|Function} cbks: onSuccess - callback [required]; onFailure - panic callback [optional]
         */
        DbGetInstanceNameList : function(argin, cbks){
            throw "Not yet implemented!";
        },
        
        
        /**
         * Executes command DbGetObjectList on the remote server
         *
         * @param {*} argin - argument for the command [optional]
         * @param {Object|Function} cbks: onSuccess - callback [required]; onFailure - panic callback [optional]
         */
        DbGetObjectList : function(argin, cbks){
            throw "Not yet implemented!";
        },
        
        
        /**
         * Executes command DbGetProperty on the remote server
         *
         * @param {*} argin - argument for the command [optional]
         * @param {Object|Function} cbks: onSuccess - callback [required]; onFailure - panic callback [optional]
         */
        DbGetProperty : function(argin, cbks){
            throw "Not yet implemented!";
        },
        
        
        /**
         * Executes command DbGetPropertyHist on the remote server
         *
         * @param {*} argin - argument for the command [optional]
         * @param {Object|Function} cbks: onSuccess - callback [required]; onFailure - panic callback [optional]
         */
        DbGetPropertyHist : function(argin, cbks){
            throw "Not yet implemented!";
        },
        
        
        /**
         * Executes command DbGetPropertyList on the remote server
         *
         * @param {*} argin - argument for the command [optional]
         * @param {Object|Function} cbks: onSuccess - callback [required]; onFailure - panic callback [optional]
         */
        DbGetPropertyList : function(argin, cbks){
            throw "Not yet implemented!";
        },
        
        
        /**
         * Executes command DbGetServerInfo on the remote server
         *
         * @param {*} argin - argument for the command [optional]
         * @param {Object|Function} cbks: onSuccess - callback [required]; onFailure - panic callback [optional]
         */
        DbGetServerInfo : function(argin, cbks){
            throw "Not yet implemented!";
        },
        
        
        /**
         * Executes command DbGetServerList on the remote server
         *
         * @param {*} argin - argument for the command [optional]
         * @param {Object|Function} cbks: onSuccess - callback [required]; onFailure - panic callback [optional]
         */
        DbGetServerList : function(argin, cbks){
            throw "Not yet implemented!";
        },
        
        
        /**
         * Executes command DbGetServerNameList on the remote server
         *
         * @param {*} argin - argument for the command [optional]
         * @param {Object|Function} cbks: onSuccess - callback [required]; onFailure - panic callback [optional]
         */
        DbGetServerNameList : function(argin, cbks){
            throw "Not yet implemented!";
        },
        
        
        /**
         * Executes command DbImportDevice on the remote server
         *
         * @param {*} argin - argument for the command [optional]
         * @param {Object|Function} cbks: onSuccess - callback [required]; onFailure - panic callback [optional]
         */
        DbImportDevice : function(argin, cbks){
            throw "Not yet implemented!";
        },
        
        
        /**
         * Executes command DbImportEvent on the remote server
         *
         * @param {*} argin - argument for the command [optional]
         * @param {Object|Function} cbks: onSuccess - callback [required]; onFailure - panic callback [optional]
         */
        DbImportEvent : function(argin, cbks){
            throw "Not yet implemented!";
        },
        
        
        /**
         * Executes command DbInfo on the remote server
         *
         * @param {*} argin - argument for the command [optional]
         * @param {Object|Function} cbks: onSuccess - callback [required]; onFailure - panic callback [optional]
         */
        DbInfo : function(argin, cbks){
            throw "Not yet implemented!";
        },
        
        
        /**
         * Executes command DbMySqlSelect on the remote server
         *
         * @param {*} argin - argument for the command [optional]
         * @param {Object|Function} cbks: onSuccess - callback [required]; onFailure - panic callback [optional]
         */
        DbMySqlSelect : function(argin, cbks){
            throw "Not yet implemented!";
        },
        
        
        /**
         * Executes command DbPutAttributeAlias on the remote server
         *
         * @param {*} argin - argument for the command [optional]
         * @param {Object|Function} cbks: onSuccess - callback [required]; onFailure - panic callback [optional]
         */
        DbPutAttributeAlias : function(argin, cbks){
            throw "Not yet implemented!";
        },
        
        
        /**
         * Executes command DbPutClassAttributeProperty on the remote server
         *
         * @param {*} argin - argument for the command [optional]
         * @param {Object|Function} cbks: onSuccess - callback [required]; onFailure - panic callback [optional]
         */
        DbPutClassAttributeProperty : function(argin, cbks){
            throw "Not yet implemented!";
        },
        
        
        /**
         * Executes command DbPutClassAttributeProperty2 on the remote server
         *
         * @param {*} argin - argument for the command [optional]
         * @param {Object|Function} cbks: onSuccess - callback [required]; onFailure - panic callback [optional]
         */
        DbPutClassAttributeProperty2 : function(argin, cbks){
            throw "Not yet implemented!";
        },
        
        
        /**
         * Executes command DbPutClassProperty on the remote server
         *
         * @param {*} argin - argument for the command [optional]
         * @param {Object|Function} cbks: onSuccess - callback [required]; onFailure - panic callback [optional]
         */
        DbPutClassProperty : function(argin, cbks){
            throw "Not yet implemented!";
        },
        
        
        /**
         * Executes command DbPutDeviceAlias on the remote server
         *
         * @param {*} argin - argument for the command [optional]
         * @param {Object|Function} cbks: onSuccess - callback [required]; onFailure - panic callback [optional]
         */
        DbPutDeviceAlias : function(argin, cbks){
            throw "Not yet implemented!";
        },
        
        
        /**
         * Executes command DbPutDeviceAttributeProperty on the remote server
         *
         * @param {*} argin - argument for the command [optional]
         * @param {Object|Function} cbks: onSuccess - callback [required]; onFailure - panic callback [optional]
         */
        DbPutDeviceAttributeProperty : function(argin, cbks){
            throw "Not yet implemented!";
        },
        
        
        /**
         * Executes command DbPutDeviceAttributeProperty2 on the remote server
         *
         * @param {*} argin - argument for the command [optional]
         * @param {Object|Function} cbks: onSuccess - callback [required]; onFailure - panic callback [optional]
         */
        DbPutDeviceAttributeProperty2 : function(argin, cbks){
            throw "Not yet implemented!";
        },
        
        
        /**
         * Executes command DbPutDeviceProperty on the remote server
         *
         * @param {*} argin - argument for the command [optional]
         * @param {Object|Function} cbks: onSuccess - callback [required]; onFailure - panic callback [optional]
         */
        DbPutDeviceProperty : function(argin, cbks){
            throw "Not yet implemented!";
        },
        
        
        /**
         * Executes command DbPutProperty on the remote server
         *
         * @param {*} argin - argument for the command [optional]
         * @param {Object|Function} cbks: onSuccess - callback [required]; onFailure - panic callback [optional]
         */
        DbPutProperty : function(argin, cbks){
            throw "Not yet implemented!";
        },
        
        
        /**
         * Executes command DbPutServerInfo on the remote server
         *
         * @param {*} argin - argument for the command [optional]
         * @param {Object|Function} cbks: onSuccess - callback [required]; onFailure - panic callback [optional]
         */
        DbPutServerInfo : function(argin, cbks){
            throw "Not yet implemented!";
        },
        
        
        /**
         * Executes command DbRenameServer on the remote server
         *
         * @param {*} argin - argument for the command [optional]
         * @param {Object|Function} cbks: onSuccess - callback [required]; onFailure - panic callback [optional]
         */
        DbRenameServer : function(argin, cbks){
            throw "Not yet implemented!";
        },
        
        
        /**
         * Executes command DbUnExportDevice on the remote server
         *
         * @param {*} argin - argument for the command [optional]
         * @param {Object|Function} cbks: onSuccess - callback [required]; onFailure - panic callback [optional]
         */
        DbUnExportDevice : function(argin, cbks){
            throw "Not yet implemented!";
        },
        
        
        /**
         * Executes command DbUnExportEvent on the remote server
         *
         * @param {*} argin - argument for the command [optional]
         * @param {Object|Function} cbks: onSuccess - callback [required]; onFailure - panic callback [optional]
         */
        DbUnExportEvent : function(argin, cbks){
            throw "Not yet implemented!";
        },
        
        
        /**
         * Executes command DbUnExportServer on the remote server
         *
         * @param {*} argin - argument for the command [optional]
         * @param {Object|Function} cbks: onSuccess - callback [required]; onFailure - panic callback [optional]
         */
        DbUnExportServer : function(argin, cbks){
            throw "Not yet implemented!";
        },
        
        
        /**
         * Executes command Init on the remote server
         *
         * @param {*} argin - argument for the command [optional]
         * @param {Object|Function} cbks: onSuccess - callback [required]; onFailure - panic callback [optional]
         */
        Init : function(argin, cbks){
            throw "Not yet implemented!";
        },
        
        
        /**
         * Executes command ResetTimingValues on the remote server
         *
         * @param {*} argin - argument for the command [optional]
         * @param {Object|Function} cbks: onSuccess - callback [required]; onFailure - panic callback [optional]
         */
        ResetTimingValues : function(argin, cbks){
            throw "Not yet implemented!";
        },
        
        
        /**
         * Executes command State on the remote server
         *
         * @param {*} argin - argument for the command [optional]
         * @param {Object|Function} cbks: onSuccess - callback [required]; onFailure - panic callback [optional]
         */
        State : function(argin, cbks){
            throw "Not yet implemented!";
        },
        
        
        /**
         * Executes command Status on the remote server
         *
         * @param {*} argin - argument for the command [optional]
         * @param {Object|Function} cbks: onSuccess - callback [required]; onFailure - panic callback [optional]
         */
        Status : function(argin, cbks){
            throw "Not yet implemented!";
        },
        
        /**
         * Remote server commands
         *
         */
        commands:function(){
            return this.Class.commands;
        },
        
        
        /**
         * Reads attribute StoredProcedureRelease on the remote server
         *
         * @param {Object|Function} cbks: onSuccess - callback [required]; onFailure - panic callback [optional]
         */
        get_StoredProcedureRelease: function(cbks){
            if(!cbks.onComplete || typeof(cbks.onComplete) != 'function') throw "a valid onComplete function must be provided";
            this.deviceProxy.readAttribute("StoredProcedureRelease",{argin:null},cbks);
        },
        /**
         * Creates a new instance of DeviceAttribute
         */
        create_new_DeviceAttribute_StoredProcedureRelease: function(){
            var attributes = {
                name : 'StoredProcedureRelease',
                proxy: this.deviceProxy
            };
            var properties = this.Class.attributes['StoredProcedureRelease'];
            MVC.Object.extend(attributes,properties);
            return new DeviceAttribute(attributes);
        },
        
        
        
        /**
         * Reads attribute Timing_average on the remote server
         *
         * @param {Object|Function} cbks: onSuccess - callback [required]; onFailure - panic callback [optional]
         */
        get_Timing_average: function(cbks){
            if(!cbks.onComplete || typeof(cbks.onComplete) != 'function') throw "a valid onComplete function must be provided";
            this.deviceProxy.readAttribute("Timing_average",{argin:null},cbks);
        },
        /**
         * Creates a new instance of DeviceAttribute
         */
        create_new_DeviceAttribute_Timing_average: function(){
            var attributes = {
                name : 'Timing_average',
                proxy: this.deviceProxy
            };
            var properties = this.Class.attributes['Timing_average'];
            MVC.Object.extend(attributes,properties);
            return new DeviceAttribute(attributes);
        },
        
        
        
        /**
         * Reads attribute Timing_minimum on the remote server
         *
         * @param {Object|Function} cbks: onSuccess - callback [required]; onFailure - panic callback [optional]
         */
        get_Timing_minimum: function(cbks){
            if(!cbks.onComplete || typeof(cbks.onComplete) != 'function') throw "a valid onComplete function must be provided";
            this.deviceProxy.readAttribute("Timing_minimum",{argin:null},cbks);
        },
        /**
         * Creates a new instance of DeviceAttribute
         */
        create_new_DeviceAttribute_Timing_minimum: function(){
            var attributes = {
                name : 'Timing_minimum',
                proxy: this.deviceProxy
            };
            var properties = this.Class.attributes['Timing_minimum'];
            MVC.Object.extend(attributes,properties);
            return new DeviceAttribute(attributes);
        },
        
        
        
        /**
         * Reads attribute Timing_maximum on the remote server
         *
         * @param {Object|Function} cbks: onSuccess - callback [required]; onFailure - panic callback [optional]
         */
        get_Timing_maximum: function(cbks){
            if(!cbks.onComplete || typeof(cbks.onComplete) != 'function') throw "a valid onComplete function must be provided";
            this.deviceProxy.readAttribute("Timing_maximum",{argin:null},cbks);
        },
        /**
         * Creates a new instance of DeviceAttribute
         */
        create_new_DeviceAttribute_Timing_maximum: function(){
            var attributes = {
                name : 'Timing_maximum',
                proxy: this.deviceProxy
            };
            var properties = this.Class.attributes['Timing_maximum'];
            MVC.Object.extend(attributes,properties);
            return new DeviceAttribute(attributes);
        },
        
        
        
        /**
         * Reads attribute Timing_calls on the remote server
         *
         * @param {Object|Function} cbks: onSuccess - callback [required]; onFailure - panic callback [optional]
         */
        get_Timing_calls: function(cbks){
            if(!cbks.onComplete || typeof(cbks.onComplete) != 'function') throw "a valid onComplete function must be provided";
            this.deviceProxy.readAttribute("Timing_calls",{argin:null},cbks);
        },
        /**
         * Creates a new instance of DeviceAttribute
         */
        create_new_DeviceAttribute_Timing_calls: function(){
            var attributes = {
                name : 'Timing_calls',
                proxy: this.deviceProxy
            };
            var properties = this.Class.attributes['Timing_calls'];
            MVC.Object.extend(attributes,properties);
            return new DeviceAttribute(attributes);
        },
        
        
        
        /**
         * Reads attribute Timing_index on the remote server
         *
         * @param {Object|Function} cbks: onSuccess - callback [required]; onFailure - panic callback [optional]
         */
        get_Timing_index: function(cbks){
            if(!cbks.onComplete || typeof(cbks.onComplete) != 'function') throw "a valid onComplete function must be provided";
            this.deviceProxy.readAttribute("Timing_index",{argin:null},cbks);
        },
        /**
         * Creates a new instance of DeviceAttribute
         */
        create_new_DeviceAttribute_Timing_index: function(){
            var attributes = {
                name : 'Timing_index',
                proxy: this.deviceProxy
            };
            var properties = this.Class.attributes['Timing_index'];
            MVC.Object.extend(attributes,properties);
            return new DeviceAttribute(attributes);
        },
        
        
        
        /**
         * Reads attribute Timing_info on the remote server
         *
         * @param {Object|Function} cbks: onSuccess - callback [required]; onFailure - panic callback [optional]
         */
        get_Timing_info: function(cbks){
            if(!cbks.onComplete || typeof(cbks.onComplete) != 'function') throw "a valid onComplete function must be provided";
            this.deviceProxy.readAttribute("Timing_info",{argin:null},cbks);
        },
        /**
         * Creates a new instance of DeviceAttribute
         */
        create_new_DeviceAttribute_Timing_info: function(){
            var attributes = {
                name : 'Timing_info',
                proxy: this.deviceProxy
            };
            var properties = this.Class.attributes['Timing_info'];
            MVC.Object.extend(attributes,properties);
            return new DeviceAttribute(attributes);
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