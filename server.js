var express = require('express');
var https = require('https');
var fs = require('fs');
var app = express();

var port = process.env.PORT || 8080;


app.use(express.static('./client'));

var options = {
    key: fs.readFileSync('ssl/hashtrack.io.key'),
    cert: fs.readFileSync('ssl/hashtrack.io.chained.crt'),
    ca: fs.readFileSync('ssl/gd_bundle-g2-g1.crt')

};

https.createServer(options, app).listen(port, function () {
    console.log('HTTPS Server http://localhost:8000');
});