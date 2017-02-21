var app = require('../appModule');
app.service('CustomerService', CustomerService);
CustomerService.$inject = ['$http', '$localStorage', 'urlConfig'];

function CustomerService($http, $localStorage, urlConfig) {
    var URL = urlConfig.URL;

    var Customer = function(customer){
        
    }
}