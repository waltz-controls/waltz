<!DOCTYPE html>
<html>
<head lang="en">
    <meta charset="UTF-8">
    <title>Tango Webapp</title>
    <link rel="shortcut icon" href="../../images/platform/favicon.png">
    <link rel="stylesheet" href="http://cdn.webix.com/5.1/skins/aircompact.css" type="text/css">
</head>
<body oncontextmenu="return false;">
<img id="ajax-loader" style="position: absolute; top: 50%; left: 50%;" src="../../images/platform/ajax-loader.gif">

<script type="text/javascript">
    window.sessionStorage.setItem("Authorization", '<%= request.getHeader("Authorization") %>')
</script>

<script type="text/javascript" src="http://cdn.webix.com/5.1/webix_debug.js"></script>
<script type="text/javascript" src="../../jmvc/include.js?login,development"></script>
</body>
</html>