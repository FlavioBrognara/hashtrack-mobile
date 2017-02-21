var app = require('../../common/appModule');
app.component('navbar', {
    templateUrl: './components/nav/nav.component.html',

    controller: function ($location, $localStorage, $scope) {
        var vm = this;
        vm.showLogout = true;

        if($location.url() == '/login') vm.showLogout = false;

        $scope.$on('$locationChangeStart', function (event, next, current) {
            vm.showLogout = true;
            if (next.split('#').pop() == '/login') vm.showLogout = false;  
        });

        vm.logout = function () {
            $location.path("login");
            $localStorage.$reset();
        }
    },
    controllerAs: 'nav'

});