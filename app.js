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


    // Model
    $scope.messagesIn = [];

    var client = null;

    // broker.mqttdashboard.com:8000
    // test.mosquitto.org:8080

    $scope.broker = {
        host: "test.mosquitto.org",
        port: 8080
    }

    $scope.client = {
        name: 'dash-rendar'
    }

    $scope.connectionStatus = 'offline';


    $scope.connect = function () {
        // Create a client instance
        client = new Paho.MQTT.Client($scope.broker.host, $scope.broker.port, $scope.client.name);

        // set callback handlers
        client.onConnectionLost = onConnectionLost;
        client.onMessageArrived = onMessageArrived;

        // connect the client
        client.connect({ onSuccess: onConnect });
    }

    $scope.disconnect = function () {
        client.disconnect();
        $scope.connectionStatus = 'offline';
    }


    // called when the client connects
    function onConnect() {
        $scope.$apply(function () {
            // Once a connection has been made, make a subscription and send a message.
            console.log("onConnect");
            $scope.connectionStatus = 'online';
            client.subscribe("World");
            message = new Paho.MQTT.Message("Hello");
            message.destinationName = "World";
            client.send(message);
        });
    }

    // called when the client loses its connection
    function onConnectionLost(responseObject) {
        if (responseObject.errorCode !== 0) {
            console.log("onConnectionLost:" + responseObject.errorMessage);
        }
    }

    // called when a message arrives
    function onMessageArrived(message) {
        $scope.$apply(function () {

            console.log("onMessageArrived:" + message.payloadString);

            $scope.messagesIn.push({
                topic: message.destinationName,
                payload: message.payloadString,
                qos: message.qos,
                retained: message.retained
            });
        });
    }

}]);

myApp.controller('secondController', ['$scope', '$log', '$routeParams', function ($scope, $log, $routeParams) {


}]);

myApp.directive("msgPopup", function () {
    return {
        restrict: 'EACM',
        templateUrl: 'directives/msgpopup.html',    // View
        replace: true,
        // Model (isolated scope)
        scope: {
            mqttMessage: "="
        },
        transclude: true
    }
});
