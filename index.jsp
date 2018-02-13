<%@ page import = "java.io.*,java.util.*" %>

<html>
<head>
    <title>Page Redirection</title>
</head>

<body>

<%
    response.setStatus(response.SC_MOVED_TEMPORARILY);
    response.setHeader("Location", "apps/login/index.jsp");
%>

</body>
</html>