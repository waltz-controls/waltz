<%@ page import="javax.servlet.jsp.*,
                 java.io.*,
                 java.util.zip.*"
%>
<%@ page import="java.util.concurrent.ConcurrentMap" %>
<%@ page import="java.util.concurrent.ConcurrentHashMap" %>
<%@ page language="java" contentType="application/json; charset=UTF-8"
    pageEncoding="UTF-8" %>

<%!
    public void jspInit(){
        ServletContext ctx = getServletConfig().getServletContext();
        ConcurrentMap<String,String> storage = (ConcurrentMap<String,String>)ctx.getAttribute("UserContextStorage");
        if(storage == null){
            ctx.setAttribute("UserContextStorage", new ConcurrentHashMap<>());
        }
    }
%>


<%
    ConcurrentMap<String,String> storage = (ConcurrentMap<String,String>)request.getServletContext().getAttribute("UserContextStorage");

    String method = request.getMethod();
    String userId = request.getParameter("id");
    switch(method){
        case "GET":
            //enable gzip
            response.setHeader("Content-Encoding", "gzip");
            OutputStream outA = response.getOutputStream();
            PrintWriter outWriter = new PrintWriter(new GZIPOutputStream(outA), false);

            response.setHeader("Content-transfer-encoding","base64");
            outWriter.print(storage.get(userId));
            outWriter.close();
            break;
        case "POST":
            String data = request.getParameter("data");
            storage.put(userId, data);
            storage.remove(userId, null);
            break;
    }
%>