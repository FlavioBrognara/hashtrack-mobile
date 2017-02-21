var app = require('../appModule');
app.factory('tokenInterceptor', tokenInterceptor);
tokenInterceptor.$inject = ['$q', '$localStorage', '$location']

function tokenInterceptor($q, $localStorage, $location) {

        var interceptor = {};

        interceptor.request = function(config) {
            // enviar o token na requisição
            config.headers = config.headers || {};
            if ($localStorage.token) {
                console.info('Enviando token já obtido em cada requisição');
                config.headers['Authorization'] = 'Bearer ' + $localStorage.token;
            }
            return config;
        },

        interceptor.response = function (response) {
            var token = response.headers('Authorization');
            if (token != null) {
                $localStorage.token = token;
                console.info('Token no Local Storage: ', token);
            } 
            return response;
        },

        interceptor.responseError = function(rejection) {

            if (rejection != null && rejection.status === 401) {
                console.info('Removendo token do Local Storage')
                delete $localStorage.token;
                $location.path("/login");
            } 
            return $q.reject(rejection);
        }

    return interceptor;

}