var app = require('../appModule');
app.service('UserService', UserService);
UserService.$inject = ['$http', '$localStorage', 'urlConfig', 'OptionsService'];

function UserService($http, $localStorage, urlConfig, OptionsService) {
    var URL = urlConfig.URL;

    this.setUser = function (user) {
        $http.get(URL + 'users-extension/' + user)
            .then(function (result) {
                
                mixpanel.identify(result.data.username);
                OptionsService.setOptions(result.data.company);
                $localStorage.user = result.data;
            }).catch(function (err) {
                console.error(err);
            });
    }
}