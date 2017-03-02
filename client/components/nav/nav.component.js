var app = require('../../common/appModule');
app.component('navbar', {
    templateUrl: './components/nav/nav.component.html',

    controller: function ($location, $localStorage, $scope, $mdDialog, $rootScope) {
        var vm = this;
        vm.showLogout = true;

    
        $scope.$on('$locationChangeStart', function (event, next, current) {
            vm.showNav = true;
            if (next.split('#!').pop() == '/login') vm.showNav = false;  
        });


        vm.logout = function () {

        var confirm = $mdDialog.confirm()
           .title('Deseja sair?')
           .ok('Sair')
           .cancel('Cancelar');

            $mdDialog.show(confirm).then(function() {
             $location.path("login");
             $localStorage.$reset();
            }, function() {
            console.log("logout cancelado");
            });
        }
    },
    controllerAs: 'nav'

});