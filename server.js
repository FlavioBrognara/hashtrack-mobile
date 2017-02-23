var express = require('express');
var app = express();

app.set('port', process.env.PORT || 8000);

app.use(express.static('./client'));

var fs = require('fs');
var https = require('https');
var express = require('express');


var options = {
  key: fs.readFileSync('ssl/hashtrack.io.key'),
  cert: fs.readFileSync('ssl/hashtrack.io.chained.crt'),
  ca: fs.readFileSync('ssl/gd_bundle-g2-g1.crt')
  
};

https.createServer(options, app).listen(process.env.PORT || 8000, function () {
});