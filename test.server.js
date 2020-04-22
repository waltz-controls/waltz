const express = require("express");
const btoa = require("btoa");
const atob = require("atob");


const app = express();
app.use(express.urlencoded());


app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, PUT, PATCH, POST, DELETE");
    res.header("Access-Control-Allow-Headers", "Content-Type");
    next();
});

const port = 3000;

const userContext = {
    user: 'tango-cs',
    rest_url: 'http://localhost:10001/tango',
    tango_hosts:{'localhost:10000':null},
    device_filters: ['*/*/*'],
    ext:{}
};

app.get("/user-context/cache", (req, res) => {
    if(req.query.id && req.query.id === "tango-cs"){
        res.send(btoa(JSON.stringify(userContext)));
    }
    else res.sendStatus(400);
});

app.post("/user-context/cache", (req, res) => {
    if(req.body.id && req.body.id === "tango-cs"){
        Object.assign(userContext,JSON.parse(atob(req.body.data)));
        res.sendStatus(200);
    }
    else res.sendStatus(400);
});

app.listen(port, () => {
    console.log("Server was started on 3000 port...");
});