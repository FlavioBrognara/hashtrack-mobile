var app = require('../appModule');
app.service('UtilService', UtilService);

function UtilService() {
    this.objectToQueryString = function (obj) {
        var qs = [];
        for (var prop in obj) {
            if (obj.hasOwnProperty(prop)) {
                qs.push(encodeURIComponent(prop) + "=" + encodeURIComponent(obj[prop]));
            }
        }
        return "?" + qs.join('&');
    }
}