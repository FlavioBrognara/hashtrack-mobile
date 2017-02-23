var app = require('../../common/appModule');
app.controller('NewAppointmentCtrl', NewAppointmentCtrl);
NewAppointmentCtrl.$inject = ['$http', '$localStorage', '$httpParamSerializer', '$location', '$mdToast', "$mdDialog"];

function NewAppointmentCtrl($http, $localStorage, $httpParamSerializer, $location, $mdToast, $mdDialog) {
    var vm = this;
    vm.searchTerm;
    vm.$storage = $localStorage;
    vm.duration = "";
    vm.customer = "";
    vm.time = "";
    vm.showSelect = true;
    vm.showInput = false;
    vm.enableSelect = false;
    vm.projects = [];
    vm.activities = [];
    vm.appointment = {};
    vm.$storage = $localStorage;
    vm.appointment.dt = new Date();
    vm.iconTimer = false;
    vm.iconSave = false;
    var URL = 'https://app.hashtrack.io/api/';

    if (!$localStorage.token) {
        $location.path("/login");
    }

    vm.dayPath = function () {
        $location.path("/day");
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
        }
    }).catch(function (err) {
        console.error(err)
    });

    function objectToQueryString(obj) {
        var qs = [];
        for (var prop in obj) {
            if (obj.hasOwnProperty(prop)) {
                qs.push(encodeURIComponent(prop) + "=" + encodeURIComponent(obj[prop]));
            }
        }
        return "?" + qs.join('&');
    }
    var dataCustomer = {
        "company": $localStorage.user.company,
        "active": true
    }
    vm.loadCustomers = function () {
        return $http.get(URL + 'customers/' + objectToQueryString(dataCustomer)).then(function (response) {
            delete vm.projects;
            delete vm.activities;
            vm.customers = response.data;
        }).catch(function (err) {
            console.error(err)
        });
    }
    vm.loadProjects = function (data) {
        vm.appointment.project = '';
        vm.appointment.activitie = '';
        var selectedCustomer = {
            customer: data,
            active: true
        };
        return $http.get(URL + 'projects/' + objectToQueryString(selectedCustomer)).then(function (response) {
            vm.enableSelect = true;
            delete vm.activities;
            vm.projects = response.data;
        }).catch(function (err) {
            console.error(err)
        });
    }
    vm.loadActivities = function (data) {
        delete vm.appointment.activitie;
        vm.appointment.project = data._id;
        if (data.predefined_tasks == true) {
            vm.activities = data.tasks;
            vm.showSelect = true;
            vm.showInput = false;
        } else {
            vm.activities = '';
            vm.showSelect = false;
            vm.showInput = true;
        }
    }
    vm.loadButtons = function (date) {
        vm.today = new Date();
        vm.today.setMilliseconds(0);
        vm.today.setMinutes(0);
        vm.today.setSeconds(0);
        vm.appointment.dt.setMilliseconds(0);
        vm.appointment.dt.setMinutes(0);
        vm.appointment.dt.setSeconds(0);
        if (vm.appointment.dt.getTime() == vm.today.getTime()) {
            return true;
        }
        return false;
    }
    vm.startAppointment = function (appointment) {
        vm.iconTimer = true;
        var count = 0;
        if (!vm.customer) count++;
        if (!vm.appointment.project) count++;
        if (!vm.appointment.activitie) count++;
        if (count != 0) {
            vm.iconTimer = false;
            vm.showErrorNotification('Preencha todos os campos para iniciar');
            return;
        }

        var startDate = new Date();
        $localStorage.startDate = startDate;
        var dataObj = {
            project: appointment.project,
            task_description: appointment.activitie.name || appointment.activitie,
            source: 'timer',
            note: appointment.note,
            start: startDate,
            timer_is_running: true,
            customer: appointment.project.customer,
            day: appointment.dt
        }
        $localStorage.appointment = dataObj;
        $localStorage.activitie = dataObj.task_description;
        $http.post(URL + 'appointments-extension', dataObj).then(function (response) {
            $localStorage.apId = response.data.appointment._id;
            mixpanel.track("Iniciou um Timer");
            $location.path("/timer");
            vm.iconTimer = false;
        }).catch(function (err) {
            console.error(err)
        });
    }
    vm.saveAppointment = function (appointment) {
        vm.iconSave = true;
        var count = 0;
        if (!vm.customer) count++;
        if (!vm.appointment.project) count++;
        if (!vm.appointment.activitie) count++;
        if (count != 0) {
            vm.iconSave = false;
            vm.showErrorNotification('Preencha todos os campos para salvar');
            return;
        }
        if ($localStorage.trackOption.duration === true) {
            if (vm.appointment.hours == undefined || vm.appointment.minutes == undefined) {
                vm.iconSave = false;
                vm.showErrorNotification('Preencha todos os campos para salvar');
                return;
            }
            var milliseconds = (appointment.hours * 3600000) + (appointment.minutes * 60000);
            var dataObj = {
                user: $localStorage.user._id,
                project: appointment.project,
                task_description: appointment.activitie,
                note: appointment.note,
                source: 'manual',
                total: milliseconds,
                customer: appointment.project.customer,
                day: appointment.dt
            }
            $http.post(URL + 'appointments-extension', dataObj).then(function (response) {
                vm.iconSave = false;
                mixpanel.track("Salvou um Apontamento");
                vm.showModal('Apontamento Salvo');
            }, function (err) {
                console.error(err);
            });
        }
        if ($localStorage.trackOption.time === true) {
            if (!vm.appointment.start || !vm.appointment.stop) {
                vm.iconSave = false;
                vm.showErrorNotification('Preencha todos os campos para salvar');
                return;
            }
            var start = new Date();
            var stop = null;
            var hourStart = appointment.start.slice(0, 2);
            var minuteStart = appointment.start.slice(3);
            var hourStop = appointment.stop.slice(0, 2);
            var minuteStop = appointment.stop.slice(3);

            start = new Date(moment(appointment.dt.toJSON().slice(0, 10)).hours(hourStart).minutes(minuteStart));
            stop = new Date(moment(appointment.dt.toJSON().slice(0, 10)).hours(hourStop).minutes(minuteStop));
            var dataObj = {
                user: $localStorage.user._id,
                project: appointment.project,
                task_description: appointment.activitie,
                note: appointment.note,
                source: 'manual',
                start: start,
                stop: stop,
                customer: appointment.project.customer,
                day: appointment.dt
            }
            $http.post(URL + 'appointments-extension/', dataObj)
                .then(function (response) {
                    vm.iconSave = false;
                    mixpanel.track("Salvou um Apontamento");
                    vm.showModal('Seu apontamento foi salvo.');
                }, function (err) {
                    console.error(err);
                });
        }
    }

    vm.showErrorNotification = function (text) {
        $mdDialog.show(
            $mdDialog.alert()
            .parent(angular.element(document.querySelector('#popupContainer')))
            .clickOutsideToClose(true)
            .title('')
            .textContent(text)
            .ariaLabel('Alert Dialog Demo')
            .ok('OK!')
        );
    }

    vm.showModal = function (text) {
        $mdDialog.show(
            $mdDialog.alert()
            .parent(angular.element(document.querySelector('#popupContainer')))
            .clickOutsideToClose(true)
            .title('')
            .textContent(text)
            .ariaLabel('Alert Dialog Demo')
            .ok('OK!')
        );
    }

    vm.clearSearchTerm = function (search) {
        vm.search = '';
    };

    vm.filterQuery = '';
    vm.items = [];
    vm.onSearchChange = function (event) {
        event.stopPropagation();
    }
}