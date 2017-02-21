var app = require('../../common/appModule');
app.controller('LauncherCtrl', LauncherCtrl);
LauncherCtrl.$inject = ['$localStorage', '$location', 'urlConfig', 'OptionsService', '$http']

function LauncherCtrl($localStorage, $location, urlConfig, OptionsService, $http) {
    var URL = urlConfig.URL;

    mixpanel.track("Abriu");

    if (!$localStorage.token) {
        $location.path("/login");
    } else {
        if (!$localStorage.user){
            $http.get(URL + 'users-extension/' + vm.user).then(function (result) {
                $localStorage.user = result.data;
                $http.get(URL + 'extension-last/').then(function (res) {
                    $localStorage.last = res.data;
                    $localStorage.apId = res.data._id;
                }).catch(function (err) {
                    console.error(err);
                });
            });
        }
        OptionsService.setOptions($localStorage.user.company);
        $location.path("/welcome");
    }
};