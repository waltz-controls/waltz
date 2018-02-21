<%@ page import="java.util.Map" %>
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
    System.out.println(request.getMethod());
    //TODO extract user name add Base64 data
    ConcurrentMap<String,String> storage = (ConcurrentMap<String,String>)request.getServletContext().getAttribute("UserContextStorage");
    out.print(storage.replace("ingvord", "{'name':'ingvord','foo':'bar'}"));
    out.flush();

%>