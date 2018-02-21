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
    //TODO extract user name add Base64 data
    ConcurrentMap<String,String> storage = (ConcurrentMap<String,String>)request.getServletContext().getAttribute("UserContextStorage");
    System.out.println(storage.replace("ingvord", "test"));
%>