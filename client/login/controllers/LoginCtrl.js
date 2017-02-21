var app = require('../../common/appModule');
app.controller('LoginCtrl', LoginCtrl);
LoginCtrl.$inject = ['LoginService', '$localStorage', 'UserService', '$http', '$location', 'urlConfig', '$mdToast']

function LoginCtrl(LoginService, $localStorage, UserService, $http, $location, urlConfig, $mdToast) {
    var vm = this;
    var URL = urlConfig.URL;
    vm.user = {};
    vm.loadIcon = false;

    vm.login = function () {
        vm.loadIcon = true;
        vm.user.login = document.getElementById("email").value;
        vm.user.password = document.getElementById("pass").value;
        LoginService.login(vm.user.login, vm.user.password)
            .then(function (result) {
                $localStorage.token = result.data.access_token;
                UserService.setUser(vm.user.login);
                $http.get(URL + 'extension-last/').then(function (res) {
                    $localStorage.last = res.data;
                    $localStorage.apId = res.data._id;
                }).catch(function (err) {
                    console.error(err);
                });
                mixpanel.track("Realizou Login");
                $location.path('/welcome');
                vm.loadIcon = false;
            }).catch(function (err) {
                vm.loadIcon = false;
                if (err.status == 503) {
                    vm.showNotification("Email e/ou senha estão incorretos!")
                }
            });

    }

    vm.showNotification = function (text) {
        $mdToast.hide();
        $mdToast.show(
            $mdToast.simple()
            .theme("error-toast")
            .textContent(text)
            .position('bottom')
            .hideDelay(3000)
        );
    }
};