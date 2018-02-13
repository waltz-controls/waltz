<%@ page import = "java.io.*,java.util.*" %>

<html>
<head>
    <title>Page Redirection</title>
</head>

<body>

<%
    if(request.getParameter("logged") != null && Boolean.parseBoolean(request.getParameter("logged"))){
        response.setStatus(response.SC_MOVED_TEMPORARILY);
        response.setHeader("Location", "apps/tango_webapp/index.html");
    } else {
        response.setStatus(response.SC_MOVED_TEMPORARILY);
        response.setHeader("Location", "apps/login/index.jsp");
    }
%>
</body>
</html>