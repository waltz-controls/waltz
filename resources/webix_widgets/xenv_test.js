export const bad_status = "ERROR 2019-03-06 12:14:18,946 [RequestProcessor-5 - o.t.u.DevFailedUtils] \t - origin: java.lang.UnsatisfiedLinkError: /storage/Projects/hzg.wpn.projects/JDataFormatServer/lib/native/x86_64-linux-gnu/libpniio_jni.so: libpniio.so.1.1.0: cannot open shared object file: No such file or directory\n" +
    "\tat java.lang.ClassLoader$NativeLibrary.load(Native Method)\n" +
    "\tat java.lang.ClassLoader.loadLibrary0(ClassLoader.java:1941)\n" +
    "\tat java.lang.ClassLoader.loadLibrary(ClassLoader.java:1857)\n" +
    "\tat java.lang.Runtime.loadLibrary0(Runtime.java:870)\n" +
    "\tat java.lang.System.loadLibrary(System.java:1122)\n" +
    "\tat hzg.wpn.nexus.libpniio.jni.LibpniioJni.<clinit>(LibpniioJni.java:37)\n" +
    "\tat hzg.wpn.nexus.libpniio.jni.NxFile.create(NxFile.java:25)\n" +
    "\tat hzg.wpn.tango.DataFormatServer.createFile(DataFormatServer.java:214)\n" +
    "\tat sun.reflect.NativeMethodAccessorImpl.invoke0(Native Method)\n" +
    "\tat sun.reflect.NativeMethodAccessorImpl.invoke(NativeMethodAccessorImpl.java:62)\n" +
    "\tat sun.reflect.DelegatingMethodAccessorImpl.invoke(DelegatingMethodAccessorImpl.java:43)\n" +
    "\tat java.lang.reflect.Method.invoke(Method.java:498)\n" +
    "\tat org.tango.server.command.ReflectCommandBehavior.execute(ReflectCommandBehavior.java:66)\n" +
    "\tat org.tango.server.command.CommandImpl.execute(CommandImpl.java:87)\n" +
    "\tat org.tango.server.servant.DeviceImpl.commandHandler(DeviceImpl.java:1730)\n" +
    "\tat org.tango.server.servant.DeviceImpl.command_inout_4(DeviceImpl.java:1607)\n" +
    "\tat fr.esrf.Tango.Device_5POA._invoke(Device_5POA.java:229)\n" +
    "\tat org.jacorb.poa.RequestProcessor.invokeOperation(RequestProcessor.java:402)\n" +
    "\tat org.jacorb.poa.RequestProcessor.process(RequestProcessor.java:726)\n" +
    "\tat org.jacorb.poa.RequestProcessor.run(RequestProcessor.java:884)\n";