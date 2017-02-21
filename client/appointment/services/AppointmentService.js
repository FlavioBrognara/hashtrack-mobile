var app = require('../../common/appModule');
app.service('AppointmentService', AppointmentService);
AppointmentService.$inject = ['$http', 'urlConfig', 'UtilService', 'moment'];

function AppointmentService($http, urlConfig, UtilService, moment) {
    var URL = urlConfig.URL;

    this.getTodayAppointments = function (filter) {

    return $http.get(URL + 'appointments/' + UtilService.objectToQueryString(filter));

    }

}