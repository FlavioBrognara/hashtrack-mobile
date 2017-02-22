module.exports = angular.module('hashtrackApp', ['ngRoute', 'ngStorage', 'ngSanitize', 'ngMaterial', 'RunningAppointmentService', 'ui.utils.masks', 'angular-chrono', 'angularMoment', 'ui.bootstrap'])

    .config(function ($routeProvider, $httpProvider) {
        $httpProvider.defaults.useXDomain = true;
        delete $httpProvider.defaults.headers.common['X-Requested-With'];

        $httpProvider.interceptors.push('tokenInterceptor');

        $routeProvider.when('/', {
            templateUrl: './launcher/views/launcher.html',
            controller: 'LauncherCtrl as launcher'
        }).when('/login', {
            templateUrl: './login/views/login.html',
            controller: 'LoginCtrl as login'
        }).when('/welcome', {
            templateUrl: './welcome/views/welcome.html',
            controller: 'WelcomeCtrl as welcome'
        }).when('/day', {
            templateUrl: './day/views/day.html',
            controller: 'DayCtrl as day'
        }).when('/timer', {
            templateUrl: './timer/views/timer.html',
            controller: 'TimerCtrl as timer'
        }).when('/appointment', {
            templateUrl: './new-appointment/views/new-appointment.html',
            controller: 'NewAppointmentCtrl as app'
        });

        $routeProvider.otherwise({
            redirectTo: '/'
        });

        // $locationProvider.html5Mode(true);
    })
    .constant('urlConfig', {
        'URL': 'https://app.hashtrack.io/api/'
    });