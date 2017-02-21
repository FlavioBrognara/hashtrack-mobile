var express = require('express');
var app = express();

//provides client static files
app.use(express.static('./client'));

module.exports = app;
