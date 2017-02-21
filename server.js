var express = require('express');
var app = express();

app.set('port', process.env.PORT || 8000);

app.use(express.compress());
app.use(express.static('./client'));

app.listen(app.get('port'), function () {});