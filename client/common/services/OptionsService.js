var app = require('../appModule');
app.service('OptionsService', OptionsService);
OptionsService.$inject = ['$http', '$localStorage', 'urlConfig'];

function OptionsService($http, $localStorage, urlConfig) {
    var URL = urlConfig.URL;

    this.setOptions = function (companyId) {
        $http.get(URL + 'companies/' + companyId).then(function (response) {
            $localStorage.trackOption = response.data.track_option;
            $localStorage.required_fields = response.data.required_fields;
        }).catch(function (err) {
            console.error(err)
        });
    }
}