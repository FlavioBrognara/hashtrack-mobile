var app = require('../../common/appModule');
app.controller('DayCtrl', DayCtrl);
DayCtrl.$inject = ['urlConfig', '$http', 'moment', '$localStorage', 'chronoService', '$location', 'AppointmentService', '$mdDialog']

function DayCtrl(urlConfig, $http, moment, $localStorage, chronoService, $location, AppointmentService, $mdDialog) {
    var vm = this;
    var URL = urlConfig.URL;
    vm.user = $localStorage.user;
    vm.showMessage = false;
    vm.$storage = $localStorage;

    if (!$localStorage.token) {
        $location.path("/login");
    }

    $http.get(URL + 'extension-last/').then(function (response) {
        if (response.data) {
            $localStorage.appointment = response.data;
            $localStorage.activitie = response.data.task_description;
            $localStorage.previous = true;
            $localStorage.hasTimer = true;
        } else {
            $localStorage.hasTimer = false;
        }
    }).catch(function (err) {
        console.error(err)
    });

    if ($localStorage.hasTimer) {
        vm.timer = true;
        vm.fabClass = "md-fab fab-timer";
        vm.icon = "ion-ios-timer-outline";
        vm.path = "appointmentPath"
        if ($localStorage.previous == true) {
            vm.time = Date.parse($localStorage.appointment.start);
        } else {
            vm.time = Date.now();
        }

        chronoService.addTimer('myTimer', {
            interval: 1000
        });
        chronoService.start();
    } else {
        vm.timer = false;
        vm.fabClass = "md-fab";
        vm.icon = "ion-plus";
        vm.path = "timerPath"
    }

    vm.path = function () {
        if ($localStorage.hasTimer) {
            $location.path('/timer');
        } else {
            $location.path('/appointment');

        }
    }

    getTodayAppointments();

    function getTodayAppointments() {

        var filter = {
            user: vm.user._id,
            computed: true,
            startDate: new Date(moment().startOf('day')),
            endDate: new Date(moment().startOf('day').add(24, 'hours')),
        }

        AppointmentService.getTodayAppointments(filter).then(function (response) {
            vm.appointments = response.data;
            if (!vm.appointments) vm.showMessage = true;
            timeToHours(vm.appointments);
        }).catch(function (err) {
            console.error(err)
        });

    }

    function timeToHours(appointments) {
        appointments.forEach(function (appointment) {
            var h = moment.duration(appointment.total)._data.hours;
            var m = moment.duration(appointment.total)._data.minutes;
            appointment.inHours = moment.utc().hours(h).minutes(m).format("HH:mm");
        }, this);
    }

    vm.openModal = function (appointment) {
        mixpanel.track("Abriu um apontamento");
        $mdDialog.show(
            $mdDialog.alert()
            .parent(angular.element(document.querySelector('#popupContainer')))
            .clickOutsideToClose(true)
            .title(appointment.task_description.name || appointment.task_description)
            .textContent("Projeto: " + appointment.project.name + "    " + "Tempo: " + appointment.inHours + "h")
            .ariaLabel("")
            .ok('Fechar')
        );
    }
};