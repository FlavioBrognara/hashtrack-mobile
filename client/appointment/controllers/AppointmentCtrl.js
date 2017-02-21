var app = require('../../common/appModule');
app.controller('AppointmentCtrl', AppointmentCtrl);
AppointmentCtrl.$inject = ['urlConfig']

function AppointmentCtrl(urlConfig) {
    var URL = urlConfig.URL;

};