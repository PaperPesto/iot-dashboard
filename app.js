var myApp = angular.module('myApp', ['ngRoute']);

myApp.config(function ($routeProvider) {
    $routeProvider

        .when('/', {
            templateUrl: 'pages/main.html',
            controller: 'mainController'
        })

        .when('/second', {
            templateUrl: 'pages/second.html',
            controller: 'secondController'
        })

        .when('/second/:num', {
            templateUrl: 'pages/second.html',
            controller: 'secondController'
        })
});


myApp.controller('mainController', ['$scope', '$log', function ($scope, $log) {

    console.log('hello');

    // Model
    $scope.people = [
        {
            name: 'John Doe',
            address: '555 main St.',
            city: 'New York',
            state: 'NY',
            zip: '11111'
        },
        {
            name: 'Jane Doe',
            address: '333 second St.',
            city: 'Buffalo',
            state: 'NY',
            zip: '22222'
        },
        {
            name: 'George Doe',
            address: '111 third St.',
            city: 'Miami',
            state: 'FL',
            zip: '33333'
        }]

    $scope.formattedAddress = function (person) {
        return person.address + ', ' + person.city + ', ' + person.state + ' ' + person.zip;
    }

    // var mqtt = require('mqtt')
    var client = mqtt.connect('mqtt://test.mosquitto.org:8080');

    client.on('connect', function () {
        console.log('connect');
        
        client.publish('testtopico', 'Hello mqtt diahane');

        client.subscribe('testtopico', function (err) {
            if (!err) {
                console.log('subscribed!');
            }
        })
    })

    client.on('message', function (topic, message) {
        // message is Buffer
        console.log('message arriato ' + message.toString());
        // client.end();
    })
}]);

myApp.controller('secondController', ['$scope', '$log', '$routeParams', function ($scope, $log, $routeParams) {


}]);

myApp.directive("searchResult", function () {
    return {
        restrict: 'EACM',
        templateUrl: 'directives/searchresult.html',    // View
        replace: true,
        // Model (isolated scope)
        scope: {
            personObject: "=",
            formattedAddressFunction: "&"
        },
        transclude: true
    }
});
