const status = {
    ONLINE: 'online',
    OFFLINE: 'offline'
}

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
    $scope.subscription = {
        topic: undefined,
        messages: []
    };

    $scope.publication = {};

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

    $scope.connectionStatus = status.offline;


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
        $scope.connectionStatus = status.OFFLINE;
    }

    $scope.subscribe = function () {
        client.subscribe($scope.subscription.topic);
        console.log('subscribed to topic', $scope.subscription.topic);
    }

    $scope.publish = function () {
        console.log(`publishing message ${$scope.publication.message} on topic ${$scope.publication.topic}`);

        message = new Paho.MQTT.Message($scope.publication.message);
        message.destinationName = $scope.publication.topic;
        client.send(message);
    }


    // called when the client connects
    function onConnect() {
        $scope.$apply(function () {
            // Once a connection has been made, make a subscription and send a message.
            console.log("onConnect");
            $scope.connectionStatus = status.ONLINE;
            // client.subscribe($scope.subscription.topic);
            // message = new Paho.MQTT.Message("Hello");
            // message.destinationName = "World";
            // client.send(message);
        });
    }

    // called when the client loses its connection
    function onConnectionLost(responseObject) {
        if (responseObject.errorCode !== 0) {
            console.log("onConnectionLost:" + responseObject.errorMessage);
            $scope.connectionStatus = status.OFFLINE;
        }
    }

    // called when a message arrives
    function onMessageArrived(message) {
        $scope.$apply(function () {

            console.log("onMessageArrived:" + message.payloadString);

            $scope.subscription.messages.push({
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
