var app = require('../../common/appModule');
app.controller('TimerCtrl', TimerCtrl);
TimerCtrl.$inject = ['$http', '$localStorage', '$httpParamSerializer', '$location', 'chronoService', '$scope', 'urlConfig'];

function TimerCtrl($http, $localStorage, $httpParamSerializer, $location, chronoService, $scope, urlConfig) {
    var URL = urlConfig.URL;
    vm = this;
    vm.icon = false;
    vm.logout = function () {
        $localStorage.$reset();
        $location.path("/login");
    }

    if (!$localStorage.token) {
        $location.path("/login");
    }

    $http.get(URL + 'extension-last/').then(function (response) {
        if (!response.data) {
            $location.path("/day");
        }
    }).catch(function (err) {
        console.error(err)
    });
    
    vm.dayPath = function () {
        $location.path("/day");
    }


    $localStorage.previous = true;

    $localStorage.hasTimer = true;

    var URL = urlConfig.URL;
    $scope.$storage = $localStorage;
    $scope.activities = [];
    $scope.spin = "fa fa-circle-o-notch fa-lg fa-spin fa-fw";
    if ($localStorage.previous == true) {
        $scope.time = Date.parse($localStorage.appointment.start);
    } else {
        $scope.time = Date.now();
    }
    $scope.load = false;
    chronoService.addTimer('myTimer', {
        interval: 1000
    });
    chronoService.start();

    $http.get(URL + 'projects/' + $localStorage.appointment.project).then(function (response) {
        $scope.project = response.data.name;
    }).catch(function (err) {
        console.error(err)
    });

    $scope.stopAppointment = function () {
        vm.icon = true;
        chronoService.stop();
        $scope.spin = "fa fa-fw fa-circle-o-notch fa-lg vertical-center"
        var appointment = $localStorage.appointment;
        var stop = new Date();
        var dataObj = {
            company: appointment.company,
            created_by: appointment.created_by,
            user: appointment.user,
            project: appointment.project._id,
            task_description: appointment.activitie,
            source: 'timer',
            start: appointment.start,
            customer: appointment.project.customer,
            day: appointment.dt,
            __v: 0,
            stop: stop,
            timer_is_running: false,
            manual_updated: false,
            last_started: null
        }
        $http.put(URL + 'appointments-extension/' + $localStorage.apId, dataObj).then(function (response) {
            mixpanel.track("Parou um Timer");
            $localStorage.hasTimer = false;
            $location.path('/day');
            vm.icon = false;
        }).catch(function (err) {
            console.error(err)
        });
    }
}