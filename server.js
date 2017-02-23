var express = require('express');
var app = express();

app.set('port', process.env.PORT || 8000);

app.set('trust proxy', 'loopback');
app.use(express.static('./client'));

app.listen(app.get('port'), function () {});