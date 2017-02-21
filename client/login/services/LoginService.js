var app = require('../../common/appModule');
app.service('LoginService', LoginService);
LoginService.$inject = ['$http', '$localStorage', '$httpParamSerializer', '$location', 'urlConfig', 'UserService', 'OptionsService'];

function LoginService($http, $localStorage, $httpParamSerializer, $location, urlConfig, UserService, OptionsService) {
    this.login = function (user, password) {
        var URL = urlConfig.URL;
        $localStorage.$reset();

        var data = $httpParamSerializer({
            grant_type: 'password',
            client_id: 'timesheet',
            client_secret: 'timesheet@password',
            username: user,
            password: password
        });
        return $http.post(URL + 'token', data, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });
    }
};