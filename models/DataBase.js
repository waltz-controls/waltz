/**
 * This file is generated using mtango cmd tool
 * Do not edit it manually!
 */
DataBase = MVC.Class.extend('DataBase',
    /* @Static */
    {
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
        deviceProxy: null,
        /**
         * @constructor
         *
         * Creates a new instance of DataBase proxy
         *
         * This model is a thin wrapper around mtango.DeviceProxy that provides device's specific interface, i.e. attributes and commands.
         *
         * All instances of this model dedicated to a single device utilize single DeviceProxy.
         *
         * @param {string} url -- an url of mtango.server, e.g. http://localhost:8080/mtango
         * @param {string} device -- tango device, e.g. sys/database/2
         */
        init: function(url, device){
            if(!url || !device) throw "IllegalArgument: this constructor accepts exactly two arguments: an url to mtango.server[e.g. http://localhost:8080/mtango] and a tango device[e.g. sys/database/2]!"
            var deviceProxy = mtango.DeviceProxy.find_one(device);
            if(!deviceProxy) deviceProxy = new mtango.DeviceProxy({url:url,device:device});
            this.deviceProxy = deviceProxy;
            deviceProxy.wrapped_by = this;
        },
        
        
        /**
         * Executes command DbAddDevice on the remote server
         *
         * @param {*} argin - argument for the command [optional]
         * @param {Object|Function} cbks: onSuccess - callback [required]; onFailure - panic callback [optional]
         */
        DbAddDevice : function(argin, cbks){
            if(argin.onSuccess || argin.onFailure || argin.onComplete){
                cbks = argin;
                argin = null;
            }
            if(!(cbks.onSuccess || cbks.onComplete)) cbks.onSuccess =
                function(response){
                    console.debug("Command[sys/database/2/DbAddDevice] has succeed with argout[" + response.argout + "] on " + new Date(response.timestamp))
                };
            this.deviceProxy.executeCommand("DbAddDevice",{argin:argin},cbks);
        },
        /**
         * @returns {mtango.DeviceCommand} a new DeviceCommand instance
         */
        create_new_DeviceCommand_DbAddDevice : function(){
            var attributes = {
                name: 'DbAddDevice',
                proxy: this.deviceProxy
            }
            MVC.Object.extend(attributes, this.Class.commands['DbAddDevice']);
            return new mtango.DeviceCommand(attributes);
        },
        
        
        /**
         * Executes command DbAddServer on the remote server
         *
         * @param {*} argin - argument for the command [optional]
         * @param {Object|Function} cbks: onSuccess - callback [required]; onFailure - panic callback [optional]
         */
        DbAddServer : function(argin, cbks){
            if(argin.onSuccess || argin.onFailure || argin.onComplete){
                cbks = argin;
                argin = null;
            }
            if(!(cbks.onSuccess || cbks.onComplete)) cbks.onSuccess =
                function(response){
                    console.debug("Command[sys/database/2/DbAddServer] has succeed with argout[" + response.argout + "] on " + new Date(response.timestamp))
                };
            this.deviceProxy.executeCommand("DbAddServer",{argin:argin},cbks);
        },
        /**
         * @returns {mtango.DeviceCommand} a new DeviceCommand instance
         */
        create_new_DeviceCommand_DbAddServer : function(){
            var attributes = {
                name: 'DbAddServer',
                proxy: this.deviceProxy
            }
            MVC.Object.extend(attributes, this.Class.commands['DbAddServer']);
            return new mtango.DeviceCommand(attributes);
        },
        
        
        /**
         * Executes command DbDeleteAllDeviceAttributeProperty on the remote server
         *
         * @param {*} argin - argument for the command [optional]
         * @param {Object|Function} cbks: onSuccess - callback [required]; onFailure - panic callback [optional]
         */
        DbDeleteAllDeviceAttributeProperty : function(argin, cbks){
            if(argin.onSuccess || argin.onFailure || argin.onComplete){
                cbks = argin;
                argin = null;
            }
            if(!(cbks.onSuccess || cbks.onComplete)) cbks.onSuccess =
                function(response){
                    console.debug("Command[sys/database/2/DbDeleteAllDeviceAttributeProperty] has succeed with argout[" + response.argout + "] on " + new Date(response.timestamp))
                };
            this.deviceProxy.executeCommand("DbDeleteAllDeviceAttributeProperty",{argin:argin},cbks);
        },
        /**
         * @returns {mtango.DeviceCommand} a new DeviceCommand instance
         */
        create_new_DeviceCommand_DbDeleteAllDeviceAttributeProperty : function(){
            var attributes = {
                name: 'DbDeleteAllDeviceAttributeProperty',
                proxy: this.deviceProxy
            }
            MVC.Object.extend(attributes, this.Class.commands['DbDeleteAllDeviceAttributeProperty']);
            return new mtango.DeviceCommand(attributes);
        },
        
        
        /**
         * Executes command DbDeleteAttributeAlias on the remote server
         *
         * @param {*} argin - argument for the command [optional]
         * @param {Object|Function} cbks: onSuccess - callback [required]; onFailure - panic callback [optional]
         */
        DbDeleteAttributeAlias : function(argin, cbks){
            if(argin.onSuccess || argin.onFailure || argin.onComplete){
                cbks = argin;
                argin = null;
            }
            if(!(cbks.onSuccess || cbks.onComplete)) cbks.onSuccess =
                function(response){
                    console.debug("Command[sys/database/2/DbDeleteAttributeAlias] has succeed with argout[" + response.argout + "] on " + new Date(response.timestamp))
                };
            this.deviceProxy.executeCommand("DbDeleteAttributeAlias",{argin:argin},cbks);
        },
        /**
         * @returns {mtango.DeviceCommand} a new DeviceCommand instance
         */
        create_new_DeviceCommand_DbDeleteAttributeAlias : function(){
            var attributes = {
                name: 'DbDeleteAttributeAlias',
                proxy: this.deviceProxy
            }
            MVC.Object.extend(attributes, this.Class.commands['DbDeleteAttributeAlias']);
            return new mtango.DeviceCommand(attributes);
        },
        
        
        /**
         * Executes command DbDeleteClassAttribute on the remote server
         *
         * @param {*} argin - argument for the command [optional]
         * @param {Object|Function} cbks: onSuccess - callback [required]; onFailure - panic callback [optional]
         */
        DbDeleteClassAttribute : function(argin, cbks){
            if(argin.onSuccess || argin.onFailure || argin.onComplete){
                cbks = argin;
                argin = null;
            }
            if(!(cbks.onSuccess || cbks.onComplete)) cbks.onSuccess =
                function(response){
                    console.debug("Command[sys/database/2/DbDeleteClassAttribute] has succeed with argout[" + response.argout + "] on " + new Date(response.timestamp))
                };
            this.deviceProxy.executeCommand("DbDeleteClassAttribute",{argin:argin},cbks);
        },
        /**
         * @returns {mtango.DeviceCommand} a new DeviceCommand instance
         */
        create_new_DeviceCommand_DbDeleteClassAttribute : function(){
            var attributes = {
                name: 'DbDeleteClassAttribute',
                proxy: this.deviceProxy
            }
            MVC.Object.extend(attributes, this.Class.commands['DbDeleteClassAttribute']);
            return new mtango.DeviceCommand(attributes);
        },
        
        
        /**
         * Executes command DbDeleteClassAttributeProperty on the remote server
         *
         * @param {*} argin - argument for the command [optional]
         * @param {Object|Function} cbks: onSuccess - callback [required]; onFailure - panic callback [optional]
         */
        DbDeleteClassAttributeProperty : function(argin, cbks){
            if(argin.onSuccess || argin.onFailure || argin.onComplete){
                cbks = argin;
                argin = null;
            }
            if(!(cbks.onSuccess || cbks.onComplete)) cbks.onSuccess =
                function(response){
                    console.debug("Command[sys/database/2/DbDeleteClassAttributeProperty] has succeed with argout[" + response.argout + "] on " + new Date(response.timestamp))
                };
            this.deviceProxy.executeCommand("DbDeleteClassAttributeProperty",{argin:argin},cbks);
        },
        /**
         * @returns {mtango.DeviceCommand} a new DeviceCommand instance
         */
        create_new_DeviceCommand_DbDeleteClassAttributeProperty : function(){
            var attributes = {
                name: 'DbDeleteClassAttributeProperty',
                proxy: this.deviceProxy
            }
            MVC.Object.extend(attributes, this.Class.commands['DbDeleteClassAttributeProperty']);
            return new mtango.DeviceCommand(attributes);
        },
        
        
        /**
         * Executes command DbDeleteClassProperty on the remote server
         *
         * @param {*} argin - argument for the command [optional]
         * @param {Object|Function} cbks: onSuccess - callback [required]; onFailure - panic callback [optional]
         */
        DbDeleteClassProperty : function(argin, cbks){
            if(argin.onSuccess || argin.onFailure || argin.onComplete){
                cbks = argin;
                argin = null;
            }
            if(!(cbks.onSuccess || cbks.onComplete)) cbks.onSuccess =
                function(response){
                    console.debug("Command[sys/database/2/DbDeleteClassProperty] has succeed with argout[" + response.argout + "] on " + new Date(response.timestamp))
                };
            this.deviceProxy.executeCommand("DbDeleteClassProperty",{argin:argin},cbks);
        },
        /**
         * @returns {mtango.DeviceCommand} a new DeviceCommand instance
         */
        create_new_DeviceCommand_DbDeleteClassProperty : function(){
            var attributes = {
                name: 'DbDeleteClassProperty',
                proxy: this.deviceProxy
            }
            MVC.Object.extend(attributes, this.Class.commands['DbDeleteClassProperty']);
            return new mtango.DeviceCommand(attributes);
        },
        
        
        /**
         * Executes command DbDeleteDevice on the remote server
         *
         * @param {*} argin - argument for the command [optional]
         * @param {Object|Function} cbks: onSuccess - callback [required]; onFailure - panic callback [optional]
         */
        DbDeleteDevice : function(argin, cbks){
            if(argin.onSuccess || argin.onFailure || argin.onComplete){
                cbks = argin;
                argin = null;
            }
            if(!(cbks.onSuccess || cbks.onComplete)) cbks.onSuccess =
                function(response){
                    console.debug("Command[sys/database/2/DbDeleteDevice] has succeed with argout[" + response.argout + "] on " + new Date(response.timestamp))
                };
            this.deviceProxy.executeCommand("DbDeleteDevice",{argin:argin},cbks);
        },
        /**
         * @returns {mtango.DeviceCommand} a new DeviceCommand instance
         */
        create_new_DeviceCommand_DbDeleteDevice : function(){
            var attributes = {
                name: 'DbDeleteDevice',
                proxy: this.deviceProxy
            }
            MVC.Object.extend(attributes, this.Class.commands['DbDeleteDevice']);
            return new mtango.DeviceCommand(attributes);
        },
        
        
        /**
         * Executes command DbDeleteDeviceAlias on the remote server
         *
         * @param {*} argin - argument for the command [optional]
         * @param {Object|Function} cbks: onSuccess - callback [required]; onFailure - panic callback [optional]
         */
        DbDeleteDeviceAlias : function(argin, cbks){
            if(argin.onSuccess || argin.onFailure || argin.onComplete){
                cbks = argin;
                argin = null;
            }
            if(!(cbks.onSuccess || cbks.onComplete)) cbks.onSuccess =
                function(response){
                    console.debug("Command[sys/database/2/DbDeleteDeviceAlias] has succeed with argout[" + response.argout + "] on " + new Date(response.timestamp))
                };
            this.deviceProxy.executeCommand("DbDeleteDeviceAlias",{argin:argin},cbks);
        },
        /**
         * @returns {mtango.DeviceCommand} a new DeviceCommand instance
         */
        create_new_DeviceCommand_DbDeleteDeviceAlias : function(){
            var attributes = {
                name: 'DbDeleteDeviceAlias',
                proxy: this.deviceProxy
            }
            MVC.Object.extend(attributes, this.Class.commands['DbDeleteDeviceAlias']);
            return new mtango.DeviceCommand(attributes);
        },
        
        
        /**
         * Executes command DbDeleteDeviceAttribute on the remote server
         *
         * @param {*} argin - argument for the command [optional]
         * @param {Object|Function} cbks: onSuccess - callback [required]; onFailure - panic callback [optional]
         */
        DbDeleteDeviceAttribute : function(argin, cbks){
            if(argin.onSuccess || argin.onFailure || argin.onComplete){
                cbks = argin;
                argin = null;
            }
            if(!(cbks.onSuccess || cbks.onComplete)) cbks.onSuccess =
                function(response){
                    console.debug("Command[sys/database/2/DbDeleteDeviceAttribute] has succeed with argout[" + response.argout + "] on " + new Date(response.timestamp))
                };
            this.deviceProxy.executeCommand("DbDeleteDeviceAttribute",{argin:argin},cbks);
        },
        /**
         * @returns {mtango.DeviceCommand} a new DeviceCommand instance
         */
        create_new_DeviceCommand_DbDeleteDeviceAttribute : function(){
            var attributes = {
                name: 'DbDeleteDeviceAttribute',
                proxy: this.deviceProxy
            }
            MVC.Object.extend(attributes, this.Class.commands['DbDeleteDeviceAttribute']);
            return new mtango.DeviceCommand(attributes);
        },
        
        
        /**
         * Executes command DbDeleteDeviceAttributeProperty on the remote server
         *
         * @param {*} argin - argument for the command [optional]
         * @param {Object|Function} cbks: onSuccess - callback [required]; onFailure - panic callback [optional]
         */
        DbDeleteDeviceAttributeProperty : function(argin, cbks){
            if(argin.onSuccess || argin.onFailure || argin.onComplete){
                cbks = argin;
                argin = null;
            }
            if(!(cbks.onSuccess || cbks.onComplete)) cbks.onSuccess =
                function(response){
                    console.debug("Command[sys/database/2/DbDeleteDeviceAttributeProperty] has succeed with argout[" + response.argout + "] on " + new Date(response.timestamp))
                };
            this.deviceProxy.executeCommand("DbDeleteDeviceAttributeProperty",{argin:argin},cbks);
        },
        /**
         * @returns {mtango.DeviceCommand} a new DeviceCommand instance
         */
        create_new_DeviceCommand_DbDeleteDeviceAttributeProperty : function(){
            var attributes = {
                name: 'DbDeleteDeviceAttributeProperty',
                proxy: this.deviceProxy
            }
            MVC.Object.extend(attributes, this.Class.commands['DbDeleteDeviceAttributeProperty']);
            return new mtango.DeviceCommand(attributes);
        },
        
        
        /**
         * Executes command DbDeleteDeviceProperty on the remote server
         *
         * @param {*} argin - argument for the command [optional]
         * @param {Object|Function} cbks: onSuccess - callback [required]; onFailure - panic callback [optional]
         */
        DbDeleteDeviceProperty : function(argin, cbks){
            if(argin.onSuccess || argin.onFailure || argin.onComplete){
                cbks = argin;
                argin = null;
            }
            if(!(cbks.onSuccess || cbks.onComplete)) cbks.onSuccess =
                function(response){
                    console.debug("Command[sys/database/2/DbDeleteDeviceProperty] has succeed with argout[" + response.argout + "] on " + new Date(response.timestamp))
                };
            this.deviceProxy.executeCommand("DbDeleteDeviceProperty",{argin:argin},cbks);
        },
        /**
         * @returns {mtango.DeviceCommand} a new DeviceCommand instance
         */
        create_new_DeviceCommand_DbDeleteDeviceProperty : function(){
            var attributes = {
                name: 'DbDeleteDeviceProperty',
                proxy: this.deviceProxy
            }
            MVC.Object.extend(attributes, this.Class.commands['DbDeleteDeviceProperty']);
            return new mtango.DeviceCommand(attributes);
        },
        
        
        /**
         * Executes command DbDeleteProperty on the remote server
         *
         * @param {*} argin - argument for the command [optional]
         * @param {Object|Function} cbks: onSuccess - callback [required]; onFailure - panic callback [optional]
         */
        DbDeleteProperty : function(argin, cbks){
            if(argin.onSuccess || argin.onFailure || argin.onComplete){
                cbks = argin;
                argin = null;
            }
            if(!(cbks.onSuccess || cbks.onComplete)) cbks.onSuccess =
                function(response){
                    console.debug("Command[sys/database/2/DbDeleteProperty] has succeed with argout[" + response.argout + "] on " + new Date(response.timestamp))
                };
            this.deviceProxy.executeCommand("DbDeleteProperty",{argin:argin},cbks);
        },
        /**
         * @returns {mtango.DeviceCommand} a new DeviceCommand instance
         */
        create_new_DeviceCommand_DbDeleteProperty : function(){
            var attributes = {
                name: 'DbDeleteProperty',
                proxy: this.deviceProxy
            }
            MVC.Object.extend(attributes, this.Class.commands['DbDeleteProperty']);
            return new mtango.DeviceCommand(attributes);
        },
        
        
        /**
         * Executes command DbDeleteServer on the remote server
         *
         * @param {*} argin - argument for the command [optional]
         * @param {Object|Function} cbks: onSuccess - callback [required]; onFailure - panic callback [optional]
         */
        DbDeleteServer : function(argin, cbks){
            if(argin.onSuccess || argin.onFailure || argin.onComplete){
                cbks = argin;
                argin = null;
            }
            if(!(cbks.onSuccess || cbks.onComplete)) cbks.onSuccess =
                function(response){
                    console.debug("Command[sys/database/2/DbDeleteServer] has succeed with argout[" + response.argout + "] on " + new Date(response.timestamp))
                };
            this.deviceProxy.executeCommand("DbDeleteServer",{argin:argin},cbks);
        },
        /**
         * @returns {mtango.DeviceCommand} a new DeviceCommand instance
         */
        create_new_DeviceCommand_DbDeleteServer : function(){
            var attributes = {
                name: 'DbDeleteServer',
                proxy: this.deviceProxy
            }
            MVC.Object.extend(attributes, this.Class.commands['DbDeleteServer']);
            return new mtango.DeviceCommand(attributes);
        },
        
        
        /**
         * Executes command DbDeleteServerInfo on the remote server
         *
         * @param {*} argin - argument for the command [optional]
         * @param {Object|Function} cbks: onSuccess - callback [required]; onFailure - panic callback [optional]
         */
        DbDeleteServerInfo : function(argin, cbks){
            if(argin.onSuccess || argin.onFailure || argin.onComplete){
                cbks = argin;
                argin = null;
            }
            if(!(cbks.onSuccess || cbks.onComplete)) cbks.onSuccess =
                function(response){
                    console.debug("Command[sys/database/2/DbDeleteServerInfo] has succeed with argout[" + response.argout + "] on " + new Date(response.timestamp))
                };
            this.deviceProxy.executeCommand("DbDeleteServerInfo",{argin:argin},cbks);
        },
        /**
         * @returns {mtango.DeviceCommand} a new DeviceCommand instance
         */
        create_new_DeviceCommand_DbDeleteServerInfo : function(){
            var attributes = {
                name: 'DbDeleteServerInfo',
                proxy: this.deviceProxy
            }
            MVC.Object.extend(attributes, this.Class.commands['DbDeleteServerInfo']);
            return new mtango.DeviceCommand(attributes);
        },
        
        
        /**
         * Executes command DbExportDevice on the remote server
         *
         * @param {*} argin - argument for the command [optional]
         * @param {Object|Function} cbks: onSuccess - callback [required]; onFailure - panic callback [optional]
         */
        DbExportDevice : function(argin, cbks){
            if(argin.onSuccess || argin.onFailure || argin.onComplete){
                cbks = argin;
                argin = null;
            }
            if(!(cbks.onSuccess || cbks.onComplete)) cbks.onSuccess =
                function(response){
                    console.debug("Command[sys/database/2/DbExportDevice] has succeed with argout[" + response.argout + "] on " + new Date(response.timestamp))
                };
            this.deviceProxy.executeCommand("DbExportDevice",{argin:argin},cbks);
        },
        /**
         * @returns {mtango.DeviceCommand} a new DeviceCommand instance
         */
        create_new_DeviceCommand_DbExportDevice : function(){
            var attributes = {
                name: 'DbExportDevice',
                proxy: this.deviceProxy
            }
            MVC.Object.extend(attributes, this.Class.commands['DbExportDevice']);
            return new mtango.DeviceCommand(attributes);
        },
        
        
        /**
         * Executes command DbExportEvent on the remote server
         *
         * @param {*} argin - argument for the command [optional]
         * @param {Object|Function} cbks: onSuccess - callback [required]; onFailure - panic callback [optional]
         */
        DbExportEvent : function(argin, cbks){
            if(argin.onSuccess || argin.onFailure || argin.onComplete){
                cbks = argin;
                argin = null;
            }
            if(!(cbks.onSuccess || cbks.onComplete)) cbks.onSuccess =
                function(response){
                    console.debug("Command[sys/database/2/DbExportEvent] has succeed with argout[" + response.argout + "] on " + new Date(response.timestamp))
                };
            this.deviceProxy.executeCommand("DbExportEvent",{argin:argin},cbks);
        },
        /**
         * @returns {mtango.DeviceCommand} a new DeviceCommand instance
         */
        create_new_DeviceCommand_DbExportEvent : function(){
            var attributes = {
                name: 'DbExportEvent',
                proxy: this.deviceProxy
            }
            MVC.Object.extend(attributes, this.Class.commands['DbExportEvent']);
            return new mtango.DeviceCommand(attributes);
        },
        
        
        /**
         * Executes command DbGetAliasAttribute on the remote server
         *
         * @param {*} argin - argument for the command [optional]
         * @param {Object|Function} cbks: onSuccess - callback [required]; onFailure - panic callback [optional]
         */
        DbGetAliasAttribute : function(argin, cbks){
            if(argin.onSuccess || argin.onFailure || argin.onComplete){
                cbks = argin;
                argin = null;
            }
            if(!(cbks.onSuccess || cbks.onComplete)) cbks.onSuccess =
                function(response){
                    console.debug("Command[sys/database/2/DbGetAliasAttribute] has succeed with argout[" + response.argout + "] on " + new Date(response.timestamp))
                };
            this.deviceProxy.executeCommand("DbGetAliasAttribute",{argin:argin},cbks);
        },
        /**
         * @returns {mtango.DeviceCommand} a new DeviceCommand instance
         */
        create_new_DeviceCommand_DbGetAliasAttribute : function(){
            var attributes = {
                name: 'DbGetAliasAttribute',
                proxy: this.deviceProxy
            }
            MVC.Object.extend(attributes, this.Class.commands['DbGetAliasAttribute']);
            return new mtango.DeviceCommand(attributes);
        },
        
        
        /**
         * Executes command DbGetAliasDevice on the remote server
         *
         * @param {*} argin - argument for the command [optional]
         * @param {Object|Function} cbks: onSuccess - callback [required]; onFailure - panic callback [optional]
         */
        DbGetAliasDevice : function(argin, cbks){
            if(argin.onSuccess || argin.onFailure || argin.onComplete){
                cbks = argin;
                argin = null;
            }
            if(!(cbks.onSuccess || cbks.onComplete)) cbks.onSuccess =
                function(response){
                    console.debug("Command[sys/database/2/DbGetAliasDevice] has succeed with argout[" + response.argout + "] on " + new Date(response.timestamp))
                };
            this.deviceProxy.executeCommand("DbGetAliasDevice",{argin:argin},cbks);
        },
        /**
         * @returns {mtango.DeviceCommand} a new DeviceCommand instance
         */
        create_new_DeviceCommand_DbGetAliasDevice : function(){
            var attributes = {
                name: 'DbGetAliasDevice',
                proxy: this.deviceProxy
            }
            MVC.Object.extend(attributes, this.Class.commands['DbGetAliasDevice']);
            return new mtango.DeviceCommand(attributes);
        },
        
        
        /**
         * Executes command DbGetAttributeAlias on the remote server
         *
         * @param {*} argin - argument for the command [optional]
         * @param {Object|Function} cbks: onSuccess - callback [required]; onFailure - panic callback [optional]
         */
        DbGetAttributeAlias : function(argin, cbks){
            if(argin.onSuccess || argin.onFailure || argin.onComplete){
                cbks = argin;
                argin = null;
            }
            if(!(cbks.onSuccess || cbks.onComplete)) cbks.onSuccess =
                function(response){
                    console.debug("Command[sys/database/2/DbGetAttributeAlias] has succeed with argout[" + response.argout + "] on " + new Date(response.timestamp))
                };
            this.deviceProxy.executeCommand("DbGetAttributeAlias",{argin:argin},cbks);
        },
        /**
         * @returns {mtango.DeviceCommand} a new DeviceCommand instance
         */
        create_new_DeviceCommand_DbGetAttributeAlias : function(){
            var attributes = {
                name: 'DbGetAttributeAlias',
                proxy: this.deviceProxy
            }
            MVC.Object.extend(attributes, this.Class.commands['DbGetAttributeAlias']);
            return new mtango.DeviceCommand(attributes);
        },
        
        
        /**
         * Executes command DbGetAttributeAlias2 on the remote server
         *
         * @param {*} argin - argument for the command [optional]
         * @param {Object|Function} cbks: onSuccess - callback [required]; onFailure - panic callback [optional]
         */
        DbGetAttributeAlias2 : function(argin, cbks){
            if(argin.onSuccess || argin.onFailure || argin.onComplete){
                cbks = argin;
                argin = null;
            }
            if(!(cbks.onSuccess || cbks.onComplete)) cbks.onSuccess =
                function(response){
                    console.debug("Command[sys/database/2/DbGetAttributeAlias2] has succeed with argout[" + response.argout + "] on " + new Date(response.timestamp))
                };
            this.deviceProxy.executeCommand("DbGetAttributeAlias2",{argin:argin},cbks);
        },
        /**
         * @returns {mtango.DeviceCommand} a new DeviceCommand instance
         */
        create_new_DeviceCommand_DbGetAttributeAlias2 : function(){
            var attributes = {
                name: 'DbGetAttributeAlias2',
                proxy: this.deviceProxy
            }
            MVC.Object.extend(attributes, this.Class.commands['DbGetAttributeAlias2']);
            return new mtango.DeviceCommand(attributes);
        },
        
        
        /**
         * Executes command DbGetAttributeAliasList on the remote server
         *
         * @param {*} argin - argument for the command [optional]
         * @param {Object|Function} cbks: onSuccess - callback [required]; onFailure - panic callback [optional]
         */
        DbGetAttributeAliasList : function(argin, cbks){
            if(argin.onSuccess || argin.onFailure || argin.onComplete){
                cbks = argin;
                argin = null;
            }
            if(!(cbks.onSuccess || cbks.onComplete)) cbks.onSuccess =
                function(response){
                    console.debug("Command[sys/database/2/DbGetAttributeAliasList] has succeed with argout[" + response.argout + "] on " + new Date(response.timestamp))
                };
            this.deviceProxy.executeCommand("DbGetAttributeAliasList",{argin:argin},cbks);
        },
        /**
         * @returns {mtango.DeviceCommand} a new DeviceCommand instance
         */
        create_new_DeviceCommand_DbGetAttributeAliasList : function(){
            var attributes = {
                name: 'DbGetAttributeAliasList',
                proxy: this.deviceProxy
            }
            MVC.Object.extend(attributes, this.Class.commands['DbGetAttributeAliasList']);
            return new mtango.DeviceCommand(attributes);
        },
        
        
        /**
         * Executes command DbGetCSDbServerList on the remote server
         *
         * @param {*} argin - argument for the command [optional]
         * @param {Object|Function} cbks: onSuccess - callback [required]; onFailure - panic callback [optional]
         */
        DbGetCSDbServerList : function(argin, cbks){
            if(argin.onSuccess || argin.onFailure || argin.onComplete){
                cbks = argin;
                argin = null;
            }
            if(!(cbks.onSuccess || cbks.onComplete)) cbks.onSuccess =
                function(response){
                    console.debug("Command[sys/database/2/DbGetCSDbServerList] has succeed with argout[" + response.argout + "] on " + new Date(response.timestamp))
                };
            this.deviceProxy.executeCommand("DbGetCSDbServerList",{argin:argin},cbks);
        },
        /**
         * @returns {mtango.DeviceCommand} a new DeviceCommand instance
         */
        create_new_DeviceCommand_DbGetCSDbServerList : function(){
            var attributes = {
                name: 'DbGetCSDbServerList',
                proxy: this.deviceProxy
            }
            MVC.Object.extend(attributes, this.Class.commands['DbGetCSDbServerList']);
            return new mtango.DeviceCommand(attributes);
        },
        
        
        /**
         * Executes command DbGetClassAttributeList on the remote server
         *
         * @param {*} argin - argument for the command [optional]
         * @param {Object|Function} cbks: onSuccess - callback [required]; onFailure - panic callback [optional]
         */
        DbGetClassAttributeList : function(argin, cbks){
            if(argin.onSuccess || argin.onFailure || argin.onComplete){
                cbks = argin;
                argin = null;
            }
            if(!(cbks.onSuccess || cbks.onComplete)) cbks.onSuccess =
                function(response){
                    console.debug("Command[sys/database/2/DbGetClassAttributeList] has succeed with argout[" + response.argout + "] on " + new Date(response.timestamp))
                };
            this.deviceProxy.executeCommand("DbGetClassAttributeList",{argin:argin},cbks);
        },
        /**
         * @returns {mtango.DeviceCommand} a new DeviceCommand instance
         */
        create_new_DeviceCommand_DbGetClassAttributeList : function(){
            var attributes = {
                name: 'DbGetClassAttributeList',
                proxy: this.deviceProxy
            }
            MVC.Object.extend(attributes, this.Class.commands['DbGetClassAttributeList']);
            return new mtango.DeviceCommand(attributes);
        },
        
        
        /**
         * Executes command DbGetClassAttributeProperty on the remote server
         *
         * @param {*} argin - argument for the command [optional]
         * @param {Object|Function} cbks: onSuccess - callback [required]; onFailure - panic callback [optional]
         */
        DbGetClassAttributeProperty : function(argin, cbks){
            if(argin.onSuccess || argin.onFailure || argin.onComplete){
                cbks = argin;
                argin = null;
            }
            if(!(cbks.onSuccess || cbks.onComplete)) cbks.onSuccess =
                function(response){
                    console.debug("Command[sys/database/2/DbGetClassAttributeProperty] has succeed with argout[" + response.argout + "] on " + new Date(response.timestamp))
                };
            this.deviceProxy.executeCommand("DbGetClassAttributeProperty",{argin:argin},cbks);
        },
        /**
         * @returns {mtango.DeviceCommand} a new DeviceCommand instance
         */
        create_new_DeviceCommand_DbGetClassAttributeProperty : function(){
            var attributes = {
                name: 'DbGetClassAttributeProperty',
                proxy: this.deviceProxy
            }
            MVC.Object.extend(attributes, this.Class.commands['DbGetClassAttributeProperty']);
            return new mtango.DeviceCommand(attributes);
        },
        
        
        /**
         * Executes command DbGetClassAttributeProperty2 on the remote server
         *
         * @param {*} argin - argument for the command [optional]
         * @param {Object|Function} cbks: onSuccess - callback [required]; onFailure - panic callback [optional]
         */
        DbGetClassAttributeProperty2 : function(argin, cbks){
            if(argin.onSuccess || argin.onFailure || argin.onComplete){
                cbks = argin;
                argin = null;
            }
            if(!(cbks.onSuccess || cbks.onComplete)) cbks.onSuccess =
                function(response){
                    console.debug("Command[sys/database/2/DbGetClassAttributeProperty2] has succeed with argout[" + response.argout + "] on " + new Date(response.timestamp))
                };
            this.deviceProxy.executeCommand("DbGetClassAttributeProperty2",{argin:argin},cbks);
        },
        /**
         * @returns {mtango.DeviceCommand} a new DeviceCommand instance
         */
        create_new_DeviceCommand_DbGetClassAttributeProperty2 : function(){
            var attributes = {
                name: 'DbGetClassAttributeProperty2',
                proxy: this.deviceProxy
            }
            MVC.Object.extend(attributes, this.Class.commands['DbGetClassAttributeProperty2']);
            return new mtango.DeviceCommand(attributes);
        },
        
        
        /**
         * Executes command DbGetClassAttributePropertyHist on the remote server
         *
         * @param {*} argin - argument for the command [optional]
         * @param {Object|Function} cbks: onSuccess - callback [required]; onFailure - panic callback [optional]
         */
        DbGetClassAttributePropertyHist : function(argin, cbks){
            if(argin.onSuccess || argin.onFailure || argin.onComplete){
                cbks = argin;
                argin = null;
            }
            if(!(cbks.onSuccess || cbks.onComplete)) cbks.onSuccess =
                function(response){
                    console.debug("Command[sys/database/2/DbGetClassAttributePropertyHist] has succeed with argout[" + response.argout + "] on " + new Date(response.timestamp))
                };
            this.deviceProxy.executeCommand("DbGetClassAttributePropertyHist",{argin:argin},cbks);
        },
        /**
         * @returns {mtango.DeviceCommand} a new DeviceCommand instance
         */
        create_new_DeviceCommand_DbGetClassAttributePropertyHist : function(){
            var attributes = {
                name: 'DbGetClassAttributePropertyHist',
                proxy: this.deviceProxy
            }
            MVC.Object.extend(attributes, this.Class.commands['DbGetClassAttributePropertyHist']);
            return new mtango.DeviceCommand(attributes);
        },
        
        
        /**
         * Executes command DbGetClassForDevice on the remote server
         *
         * @param {*} argin - argument for the command [optional]
         * @param {Object|Function} cbks: onSuccess - callback [required]; onFailure - panic callback [optional]
         */
        DbGetClassForDevice : function(argin, cbks){
            if(argin.onSuccess || argin.onFailure || argin.onComplete){
                cbks = argin;
                argin = null;
            }
            if(!(cbks.onSuccess || cbks.onComplete)) cbks.onSuccess =
                function(response){
                    console.debug("Command[sys/database/2/DbGetClassForDevice] has succeed with argout[" + response.argout + "] on " + new Date(response.timestamp))
                };
            this.deviceProxy.executeCommand("DbGetClassForDevice",{argin:argin},cbks);
        },
        /**
         * @returns {mtango.DeviceCommand} a new DeviceCommand instance
         */
        create_new_DeviceCommand_DbGetClassForDevice : function(){
            var attributes = {
                name: 'DbGetClassForDevice',
                proxy: this.deviceProxy
            }
            MVC.Object.extend(attributes, this.Class.commands['DbGetClassForDevice']);
            return new mtango.DeviceCommand(attributes);
        },
        
        
        /**
         * Executes command DbGetClassInheritanceForDevice on the remote server
         *
         * @param {*} argin - argument for the command [optional]
         * @param {Object|Function} cbks: onSuccess - callback [required]; onFailure - panic callback [optional]
         */
        DbGetClassInheritanceForDevice : function(argin, cbks){
            if(argin.onSuccess || argin.onFailure || argin.onComplete){
                cbks = argin;
                argin = null;
            }
            if(!(cbks.onSuccess || cbks.onComplete)) cbks.onSuccess =
                function(response){
                    console.debug("Command[sys/database/2/DbGetClassInheritanceForDevice] has succeed with argout[" + response.argout + "] on " + new Date(response.timestamp))
                };
            this.deviceProxy.executeCommand("DbGetClassInheritanceForDevice",{argin:argin},cbks);
        },
        /**
         * @returns {mtango.DeviceCommand} a new DeviceCommand instance
         */
        create_new_DeviceCommand_DbGetClassInheritanceForDevice : function(){
            var attributes = {
                name: 'DbGetClassInheritanceForDevice',
                proxy: this.deviceProxy
            }
            MVC.Object.extend(attributes, this.Class.commands['DbGetClassInheritanceForDevice']);
            return new mtango.DeviceCommand(attributes);
        },
        
        
        /**
         * Executes command DbGetClassList on the remote server
         *
         * @param {*} argin - argument for the command [optional]
         * @param {Object|Function} cbks: onSuccess - callback [required]; onFailure - panic callback [optional]
         */
        DbGetClassList : function(argin, cbks){
            if(argin.onSuccess || argin.onFailure || argin.onComplete){
                cbks = argin;
                argin = null;
            }
            if(!(cbks.onSuccess || cbks.onComplete)) cbks.onSuccess =
                function(response){
                    console.debug("Command[sys/database/2/DbGetClassList] has succeed with argout[" + response.argout + "] on " + new Date(response.timestamp))
                };
            this.deviceProxy.executeCommand("DbGetClassList",{argin:argin},cbks);
        },
        /**
         * @returns {mtango.DeviceCommand} a new DeviceCommand instance
         */
        create_new_DeviceCommand_DbGetClassList : function(){
            var attributes = {
                name: 'DbGetClassList',
                proxy: this.deviceProxy
            }
            MVC.Object.extend(attributes, this.Class.commands['DbGetClassList']);
            return new mtango.DeviceCommand(attributes);
        },
        
        
        /**
         * Executes command DbGetClassProperty on the remote server
         *
         * @param {*} argin - argument for the command [optional]
         * @param {Object|Function} cbks: onSuccess - callback [required]; onFailure - panic callback [optional]
         */
        DbGetClassProperty : function(argin, cbks){
            if(argin.onSuccess || argin.onFailure || argin.onComplete){
                cbks = argin;
                argin = null;
            }
            if(!(cbks.onSuccess || cbks.onComplete)) cbks.onSuccess =
                function(response){
                    console.debug("Command[sys/database/2/DbGetClassProperty] has succeed with argout[" + response.argout + "] on " + new Date(response.timestamp))
                };
            this.deviceProxy.executeCommand("DbGetClassProperty",{argin:argin},cbks);
        },
        /**
         * @returns {mtango.DeviceCommand} a new DeviceCommand instance
         */
        create_new_DeviceCommand_DbGetClassProperty : function(){
            var attributes = {
                name: 'DbGetClassProperty',
                proxy: this.deviceProxy
            }
            MVC.Object.extend(attributes, this.Class.commands['DbGetClassProperty']);
            return new mtango.DeviceCommand(attributes);
        },
        
        
        /**
         * Executes command DbGetClassPropertyHist on the remote server
         *
         * @param {*} argin - argument for the command [optional]
         * @param {Object|Function} cbks: onSuccess - callback [required]; onFailure - panic callback [optional]
         */
        DbGetClassPropertyHist : function(argin, cbks){
            if(argin.onSuccess || argin.onFailure || argin.onComplete){
                cbks = argin;
                argin = null;
            }
            if(!(cbks.onSuccess || cbks.onComplete)) cbks.onSuccess =
                function(response){
                    console.debug("Command[sys/database/2/DbGetClassPropertyHist] has succeed with argout[" + response.argout + "] on " + new Date(response.timestamp))
                };
            this.deviceProxy.executeCommand("DbGetClassPropertyHist",{argin:argin},cbks);
        },
        /**
         * @returns {mtango.DeviceCommand} a new DeviceCommand instance
         */
        create_new_DeviceCommand_DbGetClassPropertyHist : function(){
            var attributes = {
                name: 'DbGetClassPropertyHist',
                proxy: this.deviceProxy
            }
            MVC.Object.extend(attributes, this.Class.commands['DbGetClassPropertyHist']);
            return new mtango.DeviceCommand(attributes);
        },
        
        
        /**
         * Executes command DbGetClassPropertyList on the remote server
         *
         * @param {*} argin - argument for the command [optional]
         * @param {Object|Function} cbks: onSuccess - callback [required]; onFailure - panic callback [optional]
         */
        DbGetClassPropertyList : function(argin, cbks){
            if(argin.onSuccess || argin.onFailure || argin.onComplete){
                cbks = argin;
                argin = null;
            }
            if(!(cbks.onSuccess || cbks.onComplete)) cbks.onSuccess =
                function(response){
                    console.debug("Command[sys/database/2/DbGetClassPropertyList] has succeed with argout[" + response.argout + "] on " + new Date(response.timestamp))
                };
            this.deviceProxy.executeCommand("DbGetClassPropertyList",{argin:argin},cbks);
        },
        /**
         * @returns {mtango.DeviceCommand} a new DeviceCommand instance
         */
        create_new_DeviceCommand_DbGetClassPropertyList : function(){
            var attributes = {
                name: 'DbGetClassPropertyList',
                proxy: this.deviceProxy
            }
            MVC.Object.extend(attributes, this.Class.commands['DbGetClassPropertyList']);
            return new mtango.DeviceCommand(attributes);
        },
        
        
        /**
         * Executes command DbGetDataForServerCache on the remote server
         *
         * @param {*} argin - argument for the command [optional]
         * @param {Object|Function} cbks: onSuccess - callback [required]; onFailure - panic callback [optional]
         */
        DbGetDataForServerCache : function(argin, cbks){
            if(argin.onSuccess || argin.onFailure || argin.onComplete){
                cbks = argin;
                argin = null;
            }
            if(!(cbks.onSuccess || cbks.onComplete)) cbks.onSuccess =
                function(response){
                    console.debug("Command[sys/database/2/DbGetDataForServerCache] has succeed with argout[" + response.argout + "] on " + new Date(response.timestamp))
                };
            this.deviceProxy.executeCommand("DbGetDataForServerCache",{argin:argin},cbks);
        },
        /**
         * @returns {mtango.DeviceCommand} a new DeviceCommand instance
         */
        create_new_DeviceCommand_DbGetDataForServerCache : function(){
            var attributes = {
                name: 'DbGetDataForServerCache',
                proxy: this.deviceProxy
            }
            MVC.Object.extend(attributes, this.Class.commands['DbGetDataForServerCache']);
            return new mtango.DeviceCommand(attributes);
        },
        
        
        /**
         * Executes command DbGetDeviceAlias on the remote server
         *
         * @param {*} argin - argument for the command [optional]
         * @param {Object|Function} cbks: onSuccess - callback [required]; onFailure - panic callback [optional]
         */
        DbGetDeviceAlias : function(argin, cbks){
            if(argin.onSuccess || argin.onFailure || argin.onComplete){
                cbks = argin;
                argin = null;
            }
            if(!(cbks.onSuccess || cbks.onComplete)) cbks.onSuccess =
                function(response){
                    console.debug("Command[sys/database/2/DbGetDeviceAlias] has succeed with argout[" + response.argout + "] on " + new Date(response.timestamp))
                };
            this.deviceProxy.executeCommand("DbGetDeviceAlias",{argin:argin},cbks);
        },
        /**
         * @returns {mtango.DeviceCommand} a new DeviceCommand instance
         */
        create_new_DeviceCommand_DbGetDeviceAlias : function(){
            var attributes = {
                name: 'DbGetDeviceAlias',
                proxy: this.deviceProxy
            }
            MVC.Object.extend(attributes, this.Class.commands['DbGetDeviceAlias']);
            return new mtango.DeviceCommand(attributes);
        },
        
        
        /**
         * Executes command DbGetDeviceAliasList on the remote server
         *
         * @param {*} argin - argument for the command [optional]
         * @param {Object|Function} cbks: onSuccess - callback [required]; onFailure - panic callback [optional]
         */
        DbGetDeviceAliasList : function(argin, cbks){
            if(argin.onSuccess || argin.onFailure || argin.onComplete){
                cbks = argin;
                argin = null;
            }
            if(!(cbks.onSuccess || cbks.onComplete)) cbks.onSuccess =
                function(response){
                    console.debug("Command[sys/database/2/DbGetDeviceAliasList] has succeed with argout[" + response.argout + "] on " + new Date(response.timestamp))
                };
            this.deviceProxy.executeCommand("DbGetDeviceAliasList",{argin:argin},cbks);
        },
        /**
         * @returns {mtango.DeviceCommand} a new DeviceCommand instance
         */
        create_new_DeviceCommand_DbGetDeviceAliasList : function(){
            var attributes = {
                name: 'DbGetDeviceAliasList',
                proxy: this.deviceProxy
            }
            MVC.Object.extend(attributes, this.Class.commands['DbGetDeviceAliasList']);
            return new mtango.DeviceCommand(attributes);
        },
        
        
        /**
         * Executes command DbGetDeviceAttributeList on the remote server
         *
         * @param {*} argin - argument for the command [optional]
         * @param {Object|Function} cbks: onSuccess - callback [required]; onFailure - panic callback [optional]
         */
        DbGetDeviceAttributeList : function(argin, cbks){
            if(argin.onSuccess || argin.onFailure || argin.onComplete){
                cbks = argin;
                argin = null;
            }
            if(!(cbks.onSuccess || cbks.onComplete)) cbks.onSuccess =
                function(response){
                    console.debug("Command[sys/database/2/DbGetDeviceAttributeList] has succeed with argout[" + response.argout + "] on " + new Date(response.timestamp))
                };
            this.deviceProxy.executeCommand("DbGetDeviceAttributeList",{argin:argin},cbks);
        },
        /**
         * @returns {mtango.DeviceCommand} a new DeviceCommand instance
         */
        create_new_DeviceCommand_DbGetDeviceAttributeList : function(){
            var attributes = {
                name: 'DbGetDeviceAttributeList',
                proxy: this.deviceProxy
            }
            MVC.Object.extend(attributes, this.Class.commands['DbGetDeviceAttributeList']);
            return new mtango.DeviceCommand(attributes);
        },
        
        
        /**
         * Executes command DbGetDeviceAttributeProperty on the remote server
         *
         * @param {*} argin - argument for the command [optional]
         * @param {Object|Function} cbks: onSuccess - callback [required]; onFailure - panic callback [optional]
         */
        DbGetDeviceAttributeProperty : function(argin, cbks){
            if(argin.onSuccess || argin.onFailure || argin.onComplete){
                cbks = argin;
                argin = null;
            }
            if(!(cbks.onSuccess || cbks.onComplete)) cbks.onSuccess =
                function(response){
                    console.debug("Command[sys/database/2/DbGetDeviceAttributeProperty] has succeed with argout[" + response.argout + "] on " + new Date(response.timestamp))
                };
            this.deviceProxy.executeCommand("DbGetDeviceAttributeProperty",{argin:argin},cbks);
        },
        /**
         * @returns {mtango.DeviceCommand} a new DeviceCommand instance
         */
        create_new_DeviceCommand_DbGetDeviceAttributeProperty : function(){
            var attributes = {
                name: 'DbGetDeviceAttributeProperty',
                proxy: this.deviceProxy
            }
            MVC.Object.extend(attributes, this.Class.commands['DbGetDeviceAttributeProperty']);
            return new mtango.DeviceCommand(attributes);
        },
        
        
        /**
         * Executes command DbGetDeviceAttributeProperty2 on the remote server
         *
         * @param {*} argin - argument for the command [optional]
         * @param {Object|Function} cbks: onSuccess - callback [required]; onFailure - panic callback [optional]
         */
        DbGetDeviceAttributeProperty2 : function(argin, cbks){
            if(argin.onSuccess || argin.onFailure || argin.onComplete){
                cbks = argin;
                argin = null;
            }
            if(!(cbks.onSuccess || cbks.onComplete)) cbks.onSuccess =
                function(response){
                    console.debug("Command[sys/database/2/DbGetDeviceAttributeProperty2] has succeed with argout[" + response.argout + "] on " + new Date(response.timestamp))
                };
            this.deviceProxy.executeCommand("DbGetDeviceAttributeProperty2",{argin:argin},cbks);
        },
        /**
         * @returns {mtango.DeviceCommand} a new DeviceCommand instance
         */
        create_new_DeviceCommand_DbGetDeviceAttributeProperty2 : function(){
            var attributes = {
                name: 'DbGetDeviceAttributeProperty2',
                proxy: this.deviceProxy
            }
            MVC.Object.extend(attributes, this.Class.commands['DbGetDeviceAttributeProperty2']);
            return new mtango.DeviceCommand(attributes);
        },
        
        
        /**
         * Executes command DbGetDeviceAttributePropertyHist on the remote server
         *
         * @param {*} argin - argument for the command [optional]
         * @param {Object|Function} cbks: onSuccess - callback [required]; onFailure - panic callback [optional]
         */
        DbGetDeviceAttributePropertyHist : function(argin, cbks){
            if(argin.onSuccess || argin.onFailure || argin.onComplete){
                cbks = argin;
                argin = null;
            }
            if(!(cbks.onSuccess || cbks.onComplete)) cbks.onSuccess =
                function(response){
                    console.debug("Command[sys/database/2/DbGetDeviceAttributePropertyHist] has succeed with argout[" + response.argout + "] on " + new Date(response.timestamp))
                };
            this.deviceProxy.executeCommand("DbGetDeviceAttributePropertyHist",{argin:argin},cbks);
        },
        /**
         * @returns {mtango.DeviceCommand} a new DeviceCommand instance
         */
        create_new_DeviceCommand_DbGetDeviceAttributePropertyHist : function(){
            var attributes = {
                name: 'DbGetDeviceAttributePropertyHist',
                proxy: this.deviceProxy
            }
            MVC.Object.extend(attributes, this.Class.commands['DbGetDeviceAttributePropertyHist']);
            return new mtango.DeviceCommand(attributes);
        },
        
        
        /**
         * Executes command DbGetDeviceClassList on the remote server
         *
         * @param {*} argin - argument for the command [optional]
         * @param {Object|Function} cbks: onSuccess - callback [required]; onFailure - panic callback [optional]
         */
        DbGetDeviceClassList : function(argin, cbks){
            if(argin.onSuccess || argin.onFailure || argin.onComplete){
                cbks = argin;
                argin = null;
            }
            if(!(cbks.onSuccess || cbks.onComplete)) cbks.onSuccess =
                function(response){
                    console.debug("Command[sys/database/2/DbGetDeviceClassList] has succeed with argout[" + response.argout + "] on " + new Date(response.timestamp))
                };
            this.deviceProxy.executeCommand("DbGetDeviceClassList",{argin:argin},cbks);
        },
        /**
         * @returns {mtango.DeviceCommand} a new DeviceCommand instance
         */
        create_new_DeviceCommand_DbGetDeviceClassList : function(){
            var attributes = {
                name: 'DbGetDeviceClassList',
                proxy: this.deviceProxy
            }
            MVC.Object.extend(attributes, this.Class.commands['DbGetDeviceClassList']);
            return new mtango.DeviceCommand(attributes);
        },
        
        
        /**
         * Executes command DbGetDeviceDomainList on the remote server
         *
         * @param {*} argin - argument for the command [optional]
         * @param {Object|Function} cbks: onSuccess - callback [required]; onFailure - panic callback [optional]
         */
        DbGetDeviceDomainList : function(argin, cbks){
            if(argin.onSuccess || argin.onFailure || argin.onComplete){
                cbks = argin;
                argin = null;
            }
            if(!(cbks.onSuccess || cbks.onComplete)) cbks.onSuccess =
                function(response){
                    console.debug("Command[sys/database/2/DbGetDeviceDomainList] has succeed with argout[" + response.argout + "] on " + new Date(response.timestamp))
                };
            this.deviceProxy.executeCommand("DbGetDeviceDomainList",{argin:argin},cbks);
        },
        /**
         * @returns {mtango.DeviceCommand} a new DeviceCommand instance
         */
        create_new_DeviceCommand_DbGetDeviceDomainList : function(){
            var attributes = {
                name: 'DbGetDeviceDomainList',
                proxy: this.deviceProxy
            }
            MVC.Object.extend(attributes, this.Class.commands['DbGetDeviceDomainList']);
            return new mtango.DeviceCommand(attributes);
        },
        
        
        /**
         * Executes command DbGetDeviceExportedList on the remote server
         *
         * @param {*} argin - argument for the command [optional]
         * @param {Object|Function} cbks: onSuccess - callback [required]; onFailure - panic callback [optional]
         */
        DbGetDeviceExportedList : function(argin, cbks){
            if(argin.onSuccess || argin.onFailure || argin.onComplete){
                cbks = argin;
                argin = null;
            }
            if(!(cbks.onSuccess || cbks.onComplete)) cbks.onSuccess =
                function(response){
                    console.debug("Command[sys/database/2/DbGetDeviceExportedList] has succeed with argout[" + response.argout + "] on " + new Date(response.timestamp))
                };
            this.deviceProxy.executeCommand("DbGetDeviceExportedList",{argin:argin},cbks);
        },
        /**
         * @returns {mtango.DeviceCommand} a new DeviceCommand instance
         */
        create_new_DeviceCommand_DbGetDeviceExportedList : function(){
            var attributes = {
                name: 'DbGetDeviceExportedList',
                proxy: this.deviceProxy
            }
            MVC.Object.extend(attributes, this.Class.commands['DbGetDeviceExportedList']);
            return new mtango.DeviceCommand(attributes);
        },
        
        
        /**
         * Executes command DbGetDeviceFamilyList on the remote server
         *
         * @param {*} argin - argument for the command [optional]
         * @param {Object|Function} cbks: onSuccess - callback [required]; onFailure - panic callback [optional]
         */
        DbGetDeviceFamilyList : function(argin, cbks){
            if(argin.onSuccess || argin.onFailure || argin.onComplete){
                cbks = argin;
                argin = null;
            }
            if(!(cbks.onSuccess || cbks.onComplete)) cbks.onSuccess =
                function(response){
                    console.debug("Command[sys/database/2/DbGetDeviceFamilyList] has succeed with argout[" + response.argout + "] on " + new Date(response.timestamp))
                };
            this.deviceProxy.executeCommand("DbGetDeviceFamilyList",{argin:argin},cbks);
        },
        /**
         * @returns {mtango.DeviceCommand} a new DeviceCommand instance
         */
        create_new_DeviceCommand_DbGetDeviceFamilyList : function(){
            var attributes = {
                name: 'DbGetDeviceFamilyList',
                proxy: this.deviceProxy
            }
            MVC.Object.extend(attributes, this.Class.commands['DbGetDeviceFamilyList']);
            return new mtango.DeviceCommand(attributes);
        },
        
        
        /**
         * Executes command DbGetDeviceInfo on the remote server
         *
         * @param {*} argin - argument for the command [optional]
         * @param {Object|Function} cbks: onSuccess - callback [required]; onFailure - panic callback [optional]
         */
        DbGetDeviceInfo : function(argin, cbks){
            if(argin.onSuccess || argin.onFailure || argin.onComplete){
                cbks = argin;
                argin = null;
            }
            if(!(cbks.onSuccess || cbks.onComplete)) cbks.onSuccess =
                function(response){
                    console.debug("Command[sys/database/2/DbGetDeviceInfo] has succeed with argout[" + response.argout + "] on " + new Date(response.timestamp))
                };
            this.deviceProxy.executeCommand("DbGetDeviceInfo",{argin:argin},cbks);
        },
        /**
         * @returns {mtango.DeviceCommand} a new DeviceCommand instance
         */
        create_new_DeviceCommand_DbGetDeviceInfo : function(){
            var attributes = {
                name: 'DbGetDeviceInfo',
                proxy: this.deviceProxy
            }
            MVC.Object.extend(attributes, this.Class.commands['DbGetDeviceInfo']);
            return new mtango.DeviceCommand(attributes);
        },
        
        
        /**
         * Executes command DbGetDeviceList on the remote server
         *
         * @param {*} argin - argument for the command [optional]
         * @param {Object|Function} cbks: onSuccess - callback [required]; onFailure - panic callback [optional]
         */
        DbGetDeviceList : function(argin, cbks){
            if(argin.onSuccess || argin.onFailure || argin.onComplete){
                cbks = argin;
                argin = null;
            }
            if(!(cbks.onSuccess || cbks.onComplete)) cbks.onSuccess =
                function(response){
                    console.debug("Command[sys/database/2/DbGetDeviceList] has succeed with argout[" + response.argout + "] on " + new Date(response.timestamp))
                };
            this.deviceProxy.executeCommand("DbGetDeviceList",{argin:argin},cbks);
        },
        /**
         * @returns {mtango.DeviceCommand} a new DeviceCommand instance
         */
        create_new_DeviceCommand_DbGetDeviceList : function(){
            var attributes = {
                name: 'DbGetDeviceList',
                proxy: this.deviceProxy
            }
            MVC.Object.extend(attributes, this.Class.commands['DbGetDeviceList']);
            return new mtango.DeviceCommand(attributes);
        },
        
        
        /**
         * Executes command DbGetDeviceMemberList on the remote server
         *
         * @param {*} argin - argument for the command [optional]
         * @param {Object|Function} cbks: onSuccess - callback [required]; onFailure - panic callback [optional]
         */
        DbGetDeviceMemberList : function(argin, cbks){
            if(argin.onSuccess || argin.onFailure || argin.onComplete){
                cbks = argin;
                argin = null;
            }
            if(!(cbks.onSuccess || cbks.onComplete)) cbks.onSuccess =
                function(response){
                    console.debug("Command[sys/database/2/DbGetDeviceMemberList] has succeed with argout[" + response.argout + "] on " + new Date(response.timestamp))
                };
            this.deviceProxy.executeCommand("DbGetDeviceMemberList",{argin:argin},cbks);
        },
        /**
         * @returns {mtango.DeviceCommand} a new DeviceCommand instance
         */
        create_new_DeviceCommand_DbGetDeviceMemberList : function(){
            var attributes = {
                name: 'DbGetDeviceMemberList',
                proxy: this.deviceProxy
            }
            MVC.Object.extend(attributes, this.Class.commands['DbGetDeviceMemberList']);
            return new mtango.DeviceCommand(attributes);
        },
        
        
        /**
         * Executes command DbGetDeviceProperty on the remote server
         *
         * @param {*} argin - argument for the command [optional]
         * @param {Object|Function} cbks: onSuccess - callback [required]; onFailure - panic callback [optional]
         */
        DbGetDeviceProperty : function(argin, cbks){
            if(argin.onSuccess || argin.onFailure || argin.onComplete){
                cbks = argin;
                argin = null;
            }
            if(!(cbks.onSuccess || cbks.onComplete)) cbks.onSuccess =
                function(response){
                    console.debug("Command[sys/database/2/DbGetDeviceProperty] has succeed with argout[" + response.argout + "] on " + new Date(response.timestamp))
                };
            this.deviceProxy.executeCommand("DbGetDeviceProperty",{argin:argin},cbks);
        },
        /**
         * @returns {mtango.DeviceCommand} a new DeviceCommand instance
         */
        create_new_DeviceCommand_DbGetDeviceProperty : function(){
            var attributes = {
                name: 'DbGetDeviceProperty',
                proxy: this.deviceProxy
            }
            MVC.Object.extend(attributes, this.Class.commands['DbGetDeviceProperty']);
            return new mtango.DeviceCommand(attributes);
        },
        
        
        /**
         * Executes command DbGetDevicePropertyHist on the remote server
         *
         * @param {*} argin - argument for the command [optional]
         * @param {Object|Function} cbks: onSuccess - callback [required]; onFailure - panic callback [optional]
         */
        DbGetDevicePropertyHist : function(argin, cbks){
            if(argin.onSuccess || argin.onFailure || argin.onComplete){
                cbks = argin;
                argin = null;
            }
            if(!(cbks.onSuccess || cbks.onComplete)) cbks.onSuccess =
                function(response){
                    console.debug("Command[sys/database/2/DbGetDevicePropertyHist] has succeed with argout[" + response.argout + "] on " + new Date(response.timestamp))
                };
            this.deviceProxy.executeCommand("DbGetDevicePropertyHist",{argin:argin},cbks);
        },
        /**
         * @returns {mtango.DeviceCommand} a new DeviceCommand instance
         */
        create_new_DeviceCommand_DbGetDevicePropertyHist : function(){
            var attributes = {
                name: 'DbGetDevicePropertyHist',
                proxy: this.deviceProxy
            }
            MVC.Object.extend(attributes, this.Class.commands['DbGetDevicePropertyHist']);
            return new mtango.DeviceCommand(attributes);
        },
        
        
        /**
         * Executes command DbGetDevicePropertyList on the remote server
         *
         * @param {*} argin - argument for the command [optional]
         * @param {Object|Function} cbks: onSuccess - callback [required]; onFailure - panic callback [optional]
         */
        DbGetDevicePropertyList : function(argin, cbks){
            if(argin.onSuccess || argin.onFailure || argin.onComplete){
                cbks = argin;
                argin = null;
            }
            if(!(cbks.onSuccess || cbks.onComplete)) cbks.onSuccess =
                function(response){
                    console.debug("Command[sys/database/2/DbGetDevicePropertyList] has succeed with argout[" + response.argout + "] on " + new Date(response.timestamp))
                };
            this.deviceProxy.executeCommand("DbGetDevicePropertyList",{argin:argin},cbks);
        },
        /**
         * @returns {mtango.DeviceCommand} a new DeviceCommand instance
         */
        create_new_DeviceCommand_DbGetDevicePropertyList : function(){
            var attributes = {
                name: 'DbGetDevicePropertyList',
                proxy: this.deviceProxy
            }
            MVC.Object.extend(attributes, this.Class.commands['DbGetDevicePropertyList']);
            return new mtango.DeviceCommand(attributes);
        },
        
        
        /**
         * Executes command DbGetDeviceServerClassList on the remote server
         *
         * @param {*} argin - argument for the command [optional]
         * @param {Object|Function} cbks: onSuccess - callback [required]; onFailure - panic callback [optional]
         */
        DbGetDeviceServerClassList : function(argin, cbks){
            if(argin.onSuccess || argin.onFailure || argin.onComplete){
                cbks = argin;
                argin = null;
            }
            if(!(cbks.onSuccess || cbks.onComplete)) cbks.onSuccess =
                function(response){
                    console.debug("Command[sys/database/2/DbGetDeviceServerClassList] has succeed with argout[" + response.argout + "] on " + new Date(response.timestamp))
                };
            this.deviceProxy.executeCommand("DbGetDeviceServerClassList",{argin:argin},cbks);
        },
        /**
         * @returns {mtango.DeviceCommand} a new DeviceCommand instance
         */
        create_new_DeviceCommand_DbGetDeviceServerClassList : function(){
            var attributes = {
                name: 'DbGetDeviceServerClassList',
                proxy: this.deviceProxy
            }
            MVC.Object.extend(attributes, this.Class.commands['DbGetDeviceServerClassList']);
            return new mtango.DeviceCommand(attributes);
        },
        
        
        /**
         * Executes command DbGetDeviceWideList on the remote server
         *
         * @param {*} argin - argument for the command [optional]
         * @param {Object|Function} cbks: onSuccess - callback [required]; onFailure - panic callback [optional]
         */
        DbGetDeviceWideList : function(argin, cbks){
            if(argin.onSuccess || argin.onFailure || argin.onComplete){
                cbks = argin;
                argin = null;
            }
            if(!(cbks.onSuccess || cbks.onComplete)) cbks.onSuccess =
                function(response){
                    console.debug("Command[sys/database/2/DbGetDeviceWideList] has succeed with argout[" + response.argout + "] on " + new Date(response.timestamp))
                };
            this.deviceProxy.executeCommand("DbGetDeviceWideList",{argin:argin},cbks);
        },
        /**
         * @returns {mtango.DeviceCommand} a new DeviceCommand instance
         */
        create_new_DeviceCommand_DbGetDeviceWideList : function(){
            var attributes = {
                name: 'DbGetDeviceWideList',
                proxy: this.deviceProxy
            }
            MVC.Object.extend(attributes, this.Class.commands['DbGetDeviceWideList']);
            return new mtango.DeviceCommand(attributes);
        },
        
        
        /**
         * Executes command DbGetExportdDeviceListForClass on the remote server
         *
         * @param {*} argin - argument for the command [optional]
         * @param {Object|Function} cbks: onSuccess - callback [required]; onFailure - panic callback [optional]
         */
        DbGetExportdDeviceListForClass : function(argin, cbks){
            if(argin.onSuccess || argin.onFailure || argin.onComplete){
                cbks = argin;
                argin = null;
            }
            if(!(cbks.onSuccess || cbks.onComplete)) cbks.onSuccess =
                function(response){
                    console.debug("Command[sys/database/2/DbGetExportdDeviceListForClass] has succeed with argout[" + response.argout + "] on " + new Date(response.timestamp))
                };
            this.deviceProxy.executeCommand("DbGetExportdDeviceListForClass",{argin:argin},cbks);
        },
        /**
         * @returns {mtango.DeviceCommand} a new DeviceCommand instance
         */
        create_new_DeviceCommand_DbGetExportdDeviceListForClass : function(){
            var attributes = {
                name: 'DbGetExportdDeviceListForClass',
                proxy: this.deviceProxy
            }
            MVC.Object.extend(attributes, this.Class.commands['DbGetExportdDeviceListForClass']);
            return new mtango.DeviceCommand(attributes);
        },
        
        
        /**
         * Executes command DbGetHostList on the remote server
         *
         * @param {*} argin - argument for the command [optional]
         * @param {Object|Function} cbks: onSuccess - callback [required]; onFailure - panic callback [optional]
         */
        DbGetHostList : function(argin, cbks){
            if(argin.onSuccess || argin.onFailure || argin.onComplete){
                cbks = argin;
                argin = null;
            }
            if(!(cbks.onSuccess || cbks.onComplete)) cbks.onSuccess =
                function(response){
                    console.debug("Command[sys/database/2/DbGetHostList] has succeed with argout[" + response.argout + "] on " + new Date(response.timestamp))
                };
            this.deviceProxy.executeCommand("DbGetHostList",{argin:argin},cbks);
        },
        /**
         * @returns {mtango.DeviceCommand} a new DeviceCommand instance
         */
        create_new_DeviceCommand_DbGetHostList : function(){
            var attributes = {
                name: 'DbGetHostList',
                proxy: this.deviceProxy
            }
            MVC.Object.extend(attributes, this.Class.commands['DbGetHostList']);
            return new mtango.DeviceCommand(attributes);
        },
        
        
        /**
         * Executes command DbGetHostServerList on the remote server
         *
         * @param {*} argin - argument for the command [optional]
         * @param {Object|Function} cbks: onSuccess - callback [required]; onFailure - panic callback [optional]
         */
        DbGetHostServerList : function(argin, cbks){
            if(argin.onSuccess || argin.onFailure || argin.onComplete){
                cbks = argin;
                argin = null;
            }
            if(!(cbks.onSuccess || cbks.onComplete)) cbks.onSuccess =
                function(response){
                    console.debug("Command[sys/database/2/DbGetHostServerList] has succeed with argout[" + response.argout + "] on " + new Date(response.timestamp))
                };
            this.deviceProxy.executeCommand("DbGetHostServerList",{argin:argin},cbks);
        },
        /**
         * @returns {mtango.DeviceCommand} a new DeviceCommand instance
         */
        create_new_DeviceCommand_DbGetHostServerList : function(){
            var attributes = {
                name: 'DbGetHostServerList',
                proxy: this.deviceProxy
            }
            MVC.Object.extend(attributes, this.Class.commands['DbGetHostServerList']);
            return new mtango.DeviceCommand(attributes);
        },
        
        
        /**
         * Executes command DbGetHostServersInfo on the remote server
         *
         * @param {*} argin - argument for the command [optional]
         * @param {Object|Function} cbks: onSuccess - callback [required]; onFailure - panic callback [optional]
         */
        DbGetHostServersInfo : function(argin, cbks){
            if(argin.onSuccess || argin.onFailure || argin.onComplete){
                cbks = argin;
                argin = null;
            }
            if(!(cbks.onSuccess || cbks.onComplete)) cbks.onSuccess =
                function(response){
                    console.debug("Command[sys/database/2/DbGetHostServersInfo] has succeed with argout[" + response.argout + "] on " + new Date(response.timestamp))
                };
            this.deviceProxy.executeCommand("DbGetHostServersInfo",{argin:argin},cbks);
        },
        /**
         * @returns {mtango.DeviceCommand} a new DeviceCommand instance
         */
        create_new_DeviceCommand_DbGetHostServersInfo : function(){
            var attributes = {
                name: 'DbGetHostServersInfo',
                proxy: this.deviceProxy
            }
            MVC.Object.extend(attributes, this.Class.commands['DbGetHostServersInfo']);
            return new mtango.DeviceCommand(attributes);
        },
        
        
        /**
         * Executes command DbGetInstanceNameList on the remote server
         *
         * @param {*} argin - argument for the command [optional]
         * @param {Object|Function} cbks: onSuccess - callback [required]; onFailure - panic callback [optional]
         */
        DbGetInstanceNameList : function(argin, cbks){
            if(argin.onSuccess || argin.onFailure || argin.onComplete){
                cbks = argin;
                argin = null;
            }
            if(!(cbks.onSuccess || cbks.onComplete)) cbks.onSuccess =
                function(response){
                    console.debug("Command[sys/database/2/DbGetInstanceNameList] has succeed with argout[" + response.argout + "] on " + new Date(response.timestamp))
                };
            this.deviceProxy.executeCommand("DbGetInstanceNameList",{argin:argin},cbks);
        },
        /**
         * @returns {mtango.DeviceCommand} a new DeviceCommand instance
         */
        create_new_DeviceCommand_DbGetInstanceNameList : function(){
            var attributes = {
                name: 'DbGetInstanceNameList',
                proxy: this.deviceProxy
            }
            MVC.Object.extend(attributes, this.Class.commands['DbGetInstanceNameList']);
            return new mtango.DeviceCommand(attributes);
        },
        
        
        /**
         * Executes command DbGetObjectList on the remote server
         *
         * @param {*} argin - argument for the command [optional]
         * @param {Object|Function} cbks: onSuccess - callback [required]; onFailure - panic callback [optional]
         */
        DbGetObjectList : function(argin, cbks){
            if(argin.onSuccess || argin.onFailure || argin.onComplete){
                cbks = argin;
                argin = null;
            }
            if(!(cbks.onSuccess || cbks.onComplete)) cbks.onSuccess =
                function(response){
                    console.debug("Command[sys/database/2/DbGetObjectList] has succeed with argout[" + response.argout + "] on " + new Date(response.timestamp))
                };
            this.deviceProxy.executeCommand("DbGetObjectList",{argin:argin},cbks);
        },
        /**
         * @returns {mtango.DeviceCommand} a new DeviceCommand instance
         */
        create_new_DeviceCommand_DbGetObjectList : function(){
            var attributes = {
                name: 'DbGetObjectList',
                proxy: this.deviceProxy
            }
            MVC.Object.extend(attributes, this.Class.commands['DbGetObjectList']);
            return new mtango.DeviceCommand(attributes);
        },
        
        
        /**
         * Executes command DbGetProperty on the remote server
         *
         * @param {*} argin - argument for the command [optional]
         * @param {Object|Function} cbks: onSuccess - callback [required]; onFailure - panic callback [optional]
         */
        DbGetProperty : function(argin, cbks){
            if(argin.onSuccess || argin.onFailure || argin.onComplete){
                cbks = argin;
                argin = null;
            }
            if(!(cbks.onSuccess || cbks.onComplete)) cbks.onSuccess =
                function(response){
                    console.debug("Command[sys/database/2/DbGetProperty] has succeed with argout[" + response.argout + "] on " + new Date(response.timestamp))
                };
            this.deviceProxy.executeCommand("DbGetProperty",{argin:argin},cbks);
        },
        /**
         * @returns {mtango.DeviceCommand} a new DeviceCommand instance
         */
        create_new_DeviceCommand_DbGetProperty : function(){
            var attributes = {
                name: 'DbGetProperty',
                proxy: this.deviceProxy
            }
            MVC.Object.extend(attributes, this.Class.commands['DbGetProperty']);
            return new mtango.DeviceCommand(attributes);
        },
        
        
        /**
         * Executes command DbGetPropertyHist on the remote server
         *
         * @param {*} argin - argument for the command [optional]
         * @param {Object|Function} cbks: onSuccess - callback [required]; onFailure - panic callback [optional]
         */
        DbGetPropertyHist : function(argin, cbks){
            if(argin.onSuccess || argin.onFailure || argin.onComplete){
                cbks = argin;
                argin = null;
            }
            if(!(cbks.onSuccess || cbks.onComplete)) cbks.onSuccess =
                function(response){
                    console.debug("Command[sys/database/2/DbGetPropertyHist] has succeed with argout[" + response.argout + "] on " + new Date(response.timestamp))
                };
            this.deviceProxy.executeCommand("DbGetPropertyHist",{argin:argin},cbks);
        },
        /**
         * @returns {mtango.DeviceCommand} a new DeviceCommand instance
         */
        create_new_DeviceCommand_DbGetPropertyHist : function(){
            var attributes = {
                name: 'DbGetPropertyHist',
                proxy: this.deviceProxy
            }
            MVC.Object.extend(attributes, this.Class.commands['DbGetPropertyHist']);
            return new mtango.DeviceCommand(attributes);
        },
        
        
        /**
         * Executes command DbGetPropertyList on the remote server
         *
         * @param {*} argin - argument for the command [optional]
         * @param {Object|Function} cbks: onSuccess - callback [required]; onFailure - panic callback [optional]
         */
        DbGetPropertyList : function(argin, cbks){
            if(argin.onSuccess || argin.onFailure || argin.onComplete){
                cbks = argin;
                argin = null;
            }
            if(!(cbks.onSuccess || cbks.onComplete)) cbks.onSuccess =
                function(response){
                    console.debug("Command[sys/database/2/DbGetPropertyList] has succeed with argout[" + response.argout + "] on " + new Date(response.timestamp))
                };
            this.deviceProxy.executeCommand("DbGetPropertyList",{argin:argin},cbks);
        },
        /**
         * @returns {mtango.DeviceCommand} a new DeviceCommand instance
         */
        create_new_DeviceCommand_DbGetPropertyList : function(){
            var attributes = {
                name: 'DbGetPropertyList',
                proxy: this.deviceProxy
            }
            MVC.Object.extend(attributes, this.Class.commands['DbGetPropertyList']);
            return new mtango.DeviceCommand(attributes);
        },
        
        
        /**
         * Executes command DbGetServerInfo on the remote server
         *
         * @param {*} argin - argument for the command [optional]
         * @param {Object|Function} cbks: onSuccess - callback [required]; onFailure - panic callback [optional]
         */
        DbGetServerInfo : function(argin, cbks){
            if(argin.onSuccess || argin.onFailure || argin.onComplete){
                cbks = argin;
                argin = null;
            }
            if(!(cbks.onSuccess || cbks.onComplete)) cbks.onSuccess =
                function(response){
                    console.debug("Command[sys/database/2/DbGetServerInfo] has succeed with argout[" + response.argout + "] on " + new Date(response.timestamp))
                };
            this.deviceProxy.executeCommand("DbGetServerInfo",{argin:argin},cbks);
        },
        /**
         * @returns {mtango.DeviceCommand} a new DeviceCommand instance
         */
        create_new_DeviceCommand_DbGetServerInfo : function(){
            var attributes = {
                name: 'DbGetServerInfo',
                proxy: this.deviceProxy
            }
            MVC.Object.extend(attributes, this.Class.commands['DbGetServerInfo']);
            return new mtango.DeviceCommand(attributes);
        },
        
        
        /**
         * Executes command DbGetServerList on the remote server
         *
         * @param {*} argin - argument for the command [optional]
         * @param {Object|Function} cbks: onSuccess - callback [required]; onFailure - panic callback [optional]
         */
        DbGetServerList : function(argin, cbks){
            if(argin.onSuccess || argin.onFailure || argin.onComplete){
                cbks = argin;
                argin = null;
            }
            if(!(cbks.onSuccess || cbks.onComplete)) cbks.onSuccess =
                function(response){
                    console.debug("Command[sys/database/2/DbGetServerList] has succeed with argout[" + response.argout + "] on " + new Date(response.timestamp))
                };
            this.deviceProxy.executeCommand("DbGetServerList",{argin:argin},cbks);
        },
        /**
         * @returns {mtango.DeviceCommand} a new DeviceCommand instance
         */
        create_new_DeviceCommand_DbGetServerList : function(){
            var attributes = {
                name: 'DbGetServerList',
                proxy: this.deviceProxy
            }
            MVC.Object.extend(attributes, this.Class.commands['DbGetServerList']);
            return new mtango.DeviceCommand(attributes);
        },
        
        
        /**
         * Executes command DbGetServerNameList on the remote server
         *
         * @param {*} argin - argument for the command [optional]
         * @param {Object|Function} cbks: onSuccess - callback [required]; onFailure - panic callback [optional]
         */
        DbGetServerNameList : function(argin, cbks){
            if(argin.onSuccess || argin.onFailure || argin.onComplete){
                cbks = argin;
                argin = null;
            }
            if(!(cbks.onSuccess || cbks.onComplete)) cbks.onSuccess =
                function(response){
                    console.debug("Command[sys/database/2/DbGetServerNameList] has succeed with argout[" + response.argout + "] on " + new Date(response.timestamp))
                };
            this.deviceProxy.executeCommand("DbGetServerNameList",{argin:argin},cbks);
        },
        /**
         * @returns {mtango.DeviceCommand} a new DeviceCommand instance
         */
        create_new_DeviceCommand_DbGetServerNameList : function(){
            var attributes = {
                name: 'DbGetServerNameList',
                proxy: this.deviceProxy
            }
            MVC.Object.extend(attributes, this.Class.commands['DbGetServerNameList']);
            return new mtango.DeviceCommand(attributes);
        },
        
        
        /**
         * Executes command DbImportDevice on the remote server
         *
         * @param {*} argin - argument for the command [optional]
         * @param {Object|Function} cbks: onSuccess - callback [required]; onFailure - panic callback [optional]
         */
        DbImportDevice : function(argin, cbks){
            if(argin.onSuccess || argin.onFailure || argin.onComplete){
                cbks = argin;
                argin = null;
            }
            if(!(cbks.onSuccess || cbks.onComplete)) cbks.onSuccess =
                function(response){
                    console.debug("Command[sys/database/2/DbImportDevice] has succeed with argout[" + response.argout + "] on " + new Date(response.timestamp))
                };
            this.deviceProxy.executeCommand("DbImportDevice",{argin:argin},cbks);
        },
        /**
         * @returns {mtango.DeviceCommand} a new DeviceCommand instance
         */
        create_new_DeviceCommand_DbImportDevice : function(){
            var attributes = {
                name: 'DbImportDevice',
                proxy: this.deviceProxy
            }
            MVC.Object.extend(attributes, this.Class.commands['DbImportDevice']);
            return new mtango.DeviceCommand(attributes);
        },
        
        
        /**
         * Executes command DbImportEvent on the remote server
         *
         * @param {*} argin - argument for the command [optional]
         * @param {Object|Function} cbks: onSuccess - callback [required]; onFailure - panic callback [optional]
         */
        DbImportEvent : function(argin, cbks){
            if(argin.onSuccess || argin.onFailure || argin.onComplete){
                cbks = argin;
                argin = null;
            }
            if(!(cbks.onSuccess || cbks.onComplete)) cbks.onSuccess =
                function(response){
                    console.debug("Command[sys/database/2/DbImportEvent] has succeed with argout[" + response.argout + "] on " + new Date(response.timestamp))
                };
            this.deviceProxy.executeCommand("DbImportEvent",{argin:argin},cbks);
        },
        /**
         * @returns {mtango.DeviceCommand} a new DeviceCommand instance
         */
        create_new_DeviceCommand_DbImportEvent : function(){
            var attributes = {
                name: 'DbImportEvent',
                proxy: this.deviceProxy
            }
            MVC.Object.extend(attributes, this.Class.commands['DbImportEvent']);
            return new mtango.DeviceCommand(attributes);
        },
        
        
        /**
         * Executes command DbInfo on the remote server
         *
         * @param {*} argin - argument for the command [optional]
         * @param {Object|Function} cbks: onSuccess - callback [required]; onFailure - panic callback [optional]
         */
        DbInfo : function(argin, cbks){
            if(argin.onSuccess || argin.onFailure || argin.onComplete){
                cbks = argin;
                argin = null;
            }
            if(!(cbks.onSuccess || cbks.onComplete)) cbks.onSuccess =
                function(response){
                    console.debug("Command[sys/database/2/DbInfo] has succeed with argout[" + response.argout + "] on " + new Date(response.timestamp))
                };
            this.deviceProxy.executeCommand("DbInfo",{argin:argin},cbks);
        },
        /**
         * @returns {mtango.DeviceCommand} a new DeviceCommand instance
         */
        create_new_DeviceCommand_DbInfo : function(){
            var attributes = {
                name: 'DbInfo',
                proxy: this.deviceProxy
            }
            MVC.Object.extend(attributes, this.Class.commands['DbInfo']);
            return new mtango.DeviceCommand(attributes);
        },
        
        
        /**
         * Executes command DbMySqlSelect on the remote server
         *
         * @param {*} argin - argument for the command [optional]
         * @param {Object|Function} cbks: onSuccess - callback [required]; onFailure - panic callback [optional]
         */
        DbMySqlSelect : function(argin, cbks){
            if(argin.onSuccess || argin.onFailure || argin.onComplete){
                cbks = argin;
                argin = null;
            }
            if(!(cbks.onSuccess || cbks.onComplete)) cbks.onSuccess =
                function(response){
                    console.debug("Command[sys/database/2/DbMySqlSelect] has succeed with argout[" + response.argout + "] on " + new Date(response.timestamp))
                };
            this.deviceProxy.executeCommand("DbMySqlSelect",{argin:argin},cbks);
        },
        /**
         * @returns {mtango.DeviceCommand} a new DeviceCommand instance
         */
        create_new_DeviceCommand_DbMySqlSelect : function(){
            var attributes = {
                name: 'DbMySqlSelect',
                proxy: this.deviceProxy
            }
            MVC.Object.extend(attributes, this.Class.commands['DbMySqlSelect']);
            return new mtango.DeviceCommand(attributes);
        },
        
        
        /**
         * Executes command DbPutAttributeAlias on the remote server
         *
         * @param {*} argin - argument for the command [optional]
         * @param {Object|Function} cbks: onSuccess - callback [required]; onFailure - panic callback [optional]
         */
        DbPutAttributeAlias : function(argin, cbks){
            if(argin.onSuccess || argin.onFailure || argin.onComplete){
                cbks = argin;
                argin = null;
            }
            if(!(cbks.onSuccess || cbks.onComplete)) cbks.onSuccess =
                function(response){
                    console.debug("Command[sys/database/2/DbPutAttributeAlias] has succeed with argout[" + response.argout + "] on " + new Date(response.timestamp))
                };
            this.deviceProxy.executeCommand("DbPutAttributeAlias",{argin:argin},cbks);
        },
        /**
         * @returns {mtango.DeviceCommand} a new DeviceCommand instance
         */
        create_new_DeviceCommand_DbPutAttributeAlias : function(){
            var attributes = {
                name: 'DbPutAttributeAlias',
                proxy: this.deviceProxy
            }
            MVC.Object.extend(attributes, this.Class.commands['DbPutAttributeAlias']);
            return new mtango.DeviceCommand(attributes);
        },
        
        
        /**
         * Executes command DbPutClassAttributeProperty on the remote server
         *
         * @param {*} argin - argument for the command [optional]
         * @param {Object|Function} cbks: onSuccess - callback [required]; onFailure - panic callback [optional]
         */
        DbPutClassAttributeProperty : function(argin, cbks){
            if(argin.onSuccess || argin.onFailure || argin.onComplete){
                cbks = argin;
                argin = null;
            }
            if(!(cbks.onSuccess || cbks.onComplete)) cbks.onSuccess =
                function(response){
                    console.debug("Command[sys/database/2/DbPutClassAttributeProperty] has succeed with argout[" + response.argout + "] on " + new Date(response.timestamp))
                };
            this.deviceProxy.executeCommand("DbPutClassAttributeProperty",{argin:argin},cbks);
        },
        /**
         * @returns {mtango.DeviceCommand} a new DeviceCommand instance
         */
        create_new_DeviceCommand_DbPutClassAttributeProperty : function(){
            var attributes = {
                name: 'DbPutClassAttributeProperty',
                proxy: this.deviceProxy
            }
            MVC.Object.extend(attributes, this.Class.commands['DbPutClassAttributeProperty']);
            return new mtango.DeviceCommand(attributes);
        },
        
        
        /**
         * Executes command DbPutClassAttributeProperty2 on the remote server
         *
         * @param {*} argin - argument for the command [optional]
         * @param {Object|Function} cbks: onSuccess - callback [required]; onFailure - panic callback [optional]
         */
        DbPutClassAttributeProperty2 : function(argin, cbks){
            if(argin.onSuccess || argin.onFailure || argin.onComplete){
                cbks = argin;
                argin = null;
            }
            if(!(cbks.onSuccess || cbks.onComplete)) cbks.onSuccess =
                function(response){
                    console.debug("Command[sys/database/2/DbPutClassAttributeProperty2] has succeed with argout[" + response.argout + "] on " + new Date(response.timestamp))
                };
            this.deviceProxy.executeCommand("DbPutClassAttributeProperty2",{argin:argin},cbks);
        },
        /**
         * @returns {mtango.DeviceCommand} a new DeviceCommand instance
         */
        create_new_DeviceCommand_DbPutClassAttributeProperty2 : function(){
            var attributes = {
                name: 'DbPutClassAttributeProperty2',
                proxy: this.deviceProxy
            }
            MVC.Object.extend(attributes, this.Class.commands['DbPutClassAttributeProperty2']);
            return new mtango.DeviceCommand(attributes);
        },
        
        
        /**
         * Executes command DbPutClassProperty on the remote server
         *
         * @param {*} argin - argument for the command [optional]
         * @param {Object|Function} cbks: onSuccess - callback [required]; onFailure - panic callback [optional]
         */
        DbPutClassProperty : function(argin, cbks){
            if(argin.onSuccess || argin.onFailure || argin.onComplete){
                cbks = argin;
                argin = null;
            }
            if(!(cbks.onSuccess || cbks.onComplete)) cbks.onSuccess =
                function(response){
                    console.debug("Command[sys/database/2/DbPutClassProperty] has succeed with argout[" + response.argout + "] on " + new Date(response.timestamp))
                };
            this.deviceProxy.executeCommand("DbPutClassProperty",{argin:argin},cbks);
        },
        /**
         * @returns {mtango.DeviceCommand} a new DeviceCommand instance
         */
        create_new_DeviceCommand_DbPutClassProperty : function(){
            var attributes = {
                name: 'DbPutClassProperty',
                proxy: this.deviceProxy
            }
            MVC.Object.extend(attributes, this.Class.commands['DbPutClassProperty']);
            return new mtango.DeviceCommand(attributes);
        },
        
        
        /**
         * Executes command DbPutDeviceAlias on the remote server
         *
         * @param {*} argin - argument for the command [optional]
         * @param {Object|Function} cbks: onSuccess - callback [required]; onFailure - panic callback [optional]
         */
        DbPutDeviceAlias : function(argin, cbks){
            if(argin.onSuccess || argin.onFailure || argin.onComplete){
                cbks = argin;
                argin = null;
            }
            if(!(cbks.onSuccess || cbks.onComplete)) cbks.onSuccess =
                function(response){
                    console.debug("Command[sys/database/2/DbPutDeviceAlias] has succeed with argout[" + response.argout + "] on " + new Date(response.timestamp))
                };
            this.deviceProxy.executeCommand("DbPutDeviceAlias",{argin:argin},cbks);
        },
        /**
         * @returns {mtango.DeviceCommand} a new DeviceCommand instance
         */
        create_new_DeviceCommand_DbPutDeviceAlias : function(){
            var attributes = {
                name: 'DbPutDeviceAlias',
                proxy: this.deviceProxy
            }
            MVC.Object.extend(attributes, this.Class.commands['DbPutDeviceAlias']);
            return new mtango.DeviceCommand(attributes);
        },
        
        
        /**
         * Executes command DbPutDeviceAttributeProperty on the remote server
         *
         * @param {*} argin - argument for the command [optional]
         * @param {Object|Function} cbks: onSuccess - callback [required]; onFailure - panic callback [optional]
         */
        DbPutDeviceAttributeProperty : function(argin, cbks){
            if(argin.onSuccess || argin.onFailure || argin.onComplete){
                cbks = argin;
                argin = null;
            }
            if(!(cbks.onSuccess || cbks.onComplete)) cbks.onSuccess =
                function(response){
                    console.debug("Command[sys/database/2/DbPutDeviceAttributeProperty] has succeed with argout[" + response.argout + "] on " + new Date(response.timestamp))
                };
            this.deviceProxy.executeCommand("DbPutDeviceAttributeProperty",{argin:argin},cbks);
        },
        /**
         * @returns {mtango.DeviceCommand} a new DeviceCommand instance
         */
        create_new_DeviceCommand_DbPutDeviceAttributeProperty : function(){
            var attributes = {
                name: 'DbPutDeviceAttributeProperty',
                proxy: this.deviceProxy
            }
            MVC.Object.extend(attributes, this.Class.commands['DbPutDeviceAttributeProperty']);
            return new mtango.DeviceCommand(attributes);
        },
        
        
        /**
         * Executes command DbPutDeviceAttributeProperty2 on the remote server
         *
         * @param {*} argin - argument for the command [optional]
         * @param {Object|Function} cbks: onSuccess - callback [required]; onFailure - panic callback [optional]
         */
        DbPutDeviceAttributeProperty2 : function(argin, cbks){
            if(argin.onSuccess || argin.onFailure || argin.onComplete){
                cbks = argin;
                argin = null;
            }
            if(!(cbks.onSuccess || cbks.onComplete)) cbks.onSuccess =
                function(response){
                    console.debug("Command[sys/database/2/DbPutDeviceAttributeProperty2] has succeed with argout[" + response.argout + "] on " + new Date(response.timestamp))
                };
            this.deviceProxy.executeCommand("DbPutDeviceAttributeProperty2",{argin:argin},cbks);
        },
        /**
         * @returns {mtango.DeviceCommand} a new DeviceCommand instance
         */
        create_new_DeviceCommand_DbPutDeviceAttributeProperty2 : function(){
            var attributes = {
                name: 'DbPutDeviceAttributeProperty2',
                proxy: this.deviceProxy
            }
            MVC.Object.extend(attributes, this.Class.commands['DbPutDeviceAttributeProperty2']);
            return new mtango.DeviceCommand(attributes);
        },
        
        
        /**
         * Executes command DbPutDeviceProperty on the remote server
         *
         * @param {*} argin - argument for the command [optional]
         * @param {Object|Function} cbks: onSuccess - callback [required]; onFailure - panic callback [optional]
         */
        DbPutDeviceProperty : function(argin, cbks){
            if(argin.onSuccess || argin.onFailure || argin.onComplete){
                cbks = argin;
                argin = null;
            }
            if(!(cbks.onSuccess || cbks.onComplete)) cbks.onSuccess =
                function(response){
                    console.debug("Command[sys/database/2/DbPutDeviceProperty] has succeed with argout[" + response.argout + "] on " + new Date(response.timestamp))
                };
            this.deviceProxy.executeCommand("DbPutDeviceProperty",{argin:argin},cbks);
        },
        /**
         * @returns {mtango.DeviceCommand} a new DeviceCommand instance
         */
        create_new_DeviceCommand_DbPutDeviceProperty : function(){
            var attributes = {
                name: 'DbPutDeviceProperty',
                proxy: this.deviceProxy
            }
            MVC.Object.extend(attributes, this.Class.commands['DbPutDeviceProperty']);
            return new mtango.DeviceCommand(attributes);
        },
        
        
        /**
         * Executes command DbPutProperty on the remote server
         *
         * @param {*} argin - argument for the command [optional]
         * @param {Object|Function} cbks: onSuccess - callback [required]; onFailure - panic callback [optional]
         */
        DbPutProperty : function(argin, cbks){
            if(argin.onSuccess || argin.onFailure || argin.onComplete){
                cbks = argin;
                argin = null;
            }
            if(!(cbks.onSuccess || cbks.onComplete)) cbks.onSuccess =
                function(response){
                    console.debug("Command[sys/database/2/DbPutProperty] has succeed with argout[" + response.argout + "] on " + new Date(response.timestamp))
                };
            this.deviceProxy.executeCommand("DbPutProperty",{argin:argin},cbks);
        },
        /**
         * @returns {mtango.DeviceCommand} a new DeviceCommand instance
         */
        create_new_DeviceCommand_DbPutProperty : function(){
            var attributes = {
                name: 'DbPutProperty',
                proxy: this.deviceProxy
            }
            MVC.Object.extend(attributes, this.Class.commands['DbPutProperty']);
            return new mtango.DeviceCommand(attributes);
        },
        
        
        /**
         * Executes command DbPutServerInfo on the remote server
         *
         * @param {*} argin - argument for the command [optional]
         * @param {Object|Function} cbks: onSuccess - callback [required]; onFailure - panic callback [optional]
         */
        DbPutServerInfo : function(argin, cbks){
            if(argin.onSuccess || argin.onFailure || argin.onComplete){
                cbks = argin;
                argin = null;
            }
            if(!(cbks.onSuccess || cbks.onComplete)) cbks.onSuccess =
                function(response){
                    console.debug("Command[sys/database/2/DbPutServerInfo] has succeed with argout[" + response.argout + "] on " + new Date(response.timestamp))
                };
            this.deviceProxy.executeCommand("DbPutServerInfo",{argin:argin},cbks);
        },
        /**
         * @returns {mtango.DeviceCommand} a new DeviceCommand instance
         */
        create_new_DeviceCommand_DbPutServerInfo : function(){
            var attributes = {
                name: 'DbPutServerInfo',
                proxy: this.deviceProxy
            }
            MVC.Object.extend(attributes, this.Class.commands['DbPutServerInfo']);
            return new mtango.DeviceCommand(attributes);
        },
        
        
        /**
         * Executes command DbRenameServer on the remote server
         *
         * @param {*} argin - argument for the command [optional]
         * @param {Object|Function} cbks: onSuccess - callback [required]; onFailure - panic callback [optional]
         */
        DbRenameServer : function(argin, cbks){
            if(argin.onSuccess || argin.onFailure || argin.onComplete){
                cbks = argin;
                argin = null;
            }
            if(!(cbks.onSuccess || cbks.onComplete)) cbks.onSuccess =
                function(response){
                    console.debug("Command[sys/database/2/DbRenameServer] has succeed with argout[" + response.argout + "] on " + new Date(response.timestamp))
                };
            this.deviceProxy.executeCommand("DbRenameServer",{argin:argin},cbks);
        },
        /**
         * @returns {mtango.DeviceCommand} a new DeviceCommand instance
         */
        create_new_DeviceCommand_DbRenameServer : function(){
            var attributes = {
                name: 'DbRenameServer',
                proxy: this.deviceProxy
            }
            MVC.Object.extend(attributes, this.Class.commands['DbRenameServer']);
            return new mtango.DeviceCommand(attributes);
        },
        
        
        /**
         * Executes command DbUnExportDevice on the remote server
         *
         * @param {*} argin - argument for the command [optional]
         * @param {Object|Function} cbks: onSuccess - callback [required]; onFailure - panic callback [optional]
         */
        DbUnExportDevice : function(argin, cbks){
            if(argin.onSuccess || argin.onFailure || argin.onComplete){
                cbks = argin;
                argin = null;
            }
            if(!(cbks.onSuccess || cbks.onComplete)) cbks.onSuccess =
                function(response){
                    console.debug("Command[sys/database/2/DbUnExportDevice] has succeed with argout[" + response.argout + "] on " + new Date(response.timestamp))
                };
            this.deviceProxy.executeCommand("DbUnExportDevice",{argin:argin},cbks);
        },
        /**
         * @returns {mtango.DeviceCommand} a new DeviceCommand instance
         */
        create_new_DeviceCommand_DbUnExportDevice : function(){
            var attributes = {
                name: 'DbUnExportDevice',
                proxy: this.deviceProxy
            }
            MVC.Object.extend(attributes, this.Class.commands['DbUnExportDevice']);
            return new mtango.DeviceCommand(attributes);
        },
        
        
        /**
         * Executes command DbUnExportEvent on the remote server
         *
         * @param {*} argin - argument for the command [optional]
         * @param {Object|Function} cbks: onSuccess - callback [required]; onFailure - panic callback [optional]
         */
        DbUnExportEvent : function(argin, cbks){
            if(argin.onSuccess || argin.onFailure || argin.onComplete){
                cbks = argin;
                argin = null;
            }
            if(!(cbks.onSuccess || cbks.onComplete)) cbks.onSuccess =
                function(response){
                    console.debug("Command[sys/database/2/DbUnExportEvent] has succeed with argout[" + response.argout + "] on " + new Date(response.timestamp))
                };
            this.deviceProxy.executeCommand("DbUnExportEvent",{argin:argin},cbks);
        },
        /**
         * @returns {mtango.DeviceCommand} a new DeviceCommand instance
         */
        create_new_DeviceCommand_DbUnExportEvent : function(){
            var attributes = {
                name: 'DbUnExportEvent',
                proxy: this.deviceProxy
            }
            MVC.Object.extend(attributes, this.Class.commands['DbUnExportEvent']);
            return new mtango.DeviceCommand(attributes);
        },
        
        
        /**
         * Executes command DbUnExportServer on the remote server
         *
         * @param {*} argin - argument for the command [optional]
         * @param {Object|Function} cbks: onSuccess - callback [required]; onFailure - panic callback [optional]
         */
        DbUnExportServer : function(argin, cbks){
            if(argin.onSuccess || argin.onFailure || argin.onComplete){
                cbks = argin;
                argin = null;
            }
            if(!(cbks.onSuccess || cbks.onComplete)) cbks.onSuccess =
                function(response){
                    console.debug("Command[sys/database/2/DbUnExportServer] has succeed with argout[" + response.argout + "] on " + new Date(response.timestamp))
                };
            this.deviceProxy.executeCommand("DbUnExportServer",{argin:argin},cbks);
        },
        /**
         * @returns {mtango.DeviceCommand} a new DeviceCommand instance
         */
        create_new_DeviceCommand_DbUnExportServer : function(){
            var attributes = {
                name: 'DbUnExportServer',
                proxy: this.deviceProxy
            }
            MVC.Object.extend(attributes, this.Class.commands['DbUnExportServer']);
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
                    console.debug("Command[sys/database/2/Init] has succeed with argout[" + response.argout + "] on " + new Date(response.timestamp))
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
         * Executes command ResetTimingValues on the remote server
         *
         * @param {*} argin - argument for the command [optional]
         * @param {Object|Function} cbks: onSuccess - callback [required]; onFailure - panic callback [optional]
         */
        ResetTimingValues : function(argin, cbks){
            if(argin.onSuccess || argin.onFailure || argin.onComplete){
                cbks = argin;
                argin = null;
            }
            if(!(cbks.onSuccess || cbks.onComplete)) cbks.onSuccess =
                function(response){
                    console.debug("Command[sys/database/2/ResetTimingValues] has succeed with argout[" + response.argout + "] on " + new Date(response.timestamp))
                };
            this.deviceProxy.executeCommand("ResetTimingValues",{argin:argin},cbks);
        },
        /**
         * @returns {mtango.DeviceCommand} a new DeviceCommand instance
         */
        create_new_DeviceCommand_ResetTimingValues : function(){
            var attributes = {
                name: 'ResetTimingValues',
                proxy: this.deviceProxy
            }
            MVC.Object.extend(attributes, this.Class.commands['ResetTimingValues']);
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
                    console.debug("Command[sys/database/2/State] has succeed with argout[" + response.argout + "] on " + new Date(response.timestamp))
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
                    console.debug("Command[sys/database/2/Status] has succeed with argout[" + response.argout + "] on " + new Date(response.timestamp))
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