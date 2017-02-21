var app = require('../../common/appModule');
app.controller('WelcomeCtrl', WelcomeCtrl);
WelcomeCtrl.$inject = ['$localStorage', 'RunningAppointment', '$http', '$location', 'urlConfig']

function WelcomeCtrl($localStorage, RunningAppointment, $http, $location, urlConfig) {
    var vm = this;
    vm.$storage = $localStorage;
     var URL = urlConfig.URL;

     if(!$localStorage.token){
        $location.path("/login");
    }

    $http.get(URL + 'extension-last/').then(function (response) {

        if (response.data) {
            $localStorage.appointment = response.data;
            $localStorage.activitie = response.data.task_description;
            $localStorage.previous = true;
            $localStorage.hasTimer = true;
            $location.path("/day");
        } else {
            $localStorage.hasTimer = false;
            $location.path("/day");
        }
    }).catch(function (err) {
        console.error(err)
    });
}