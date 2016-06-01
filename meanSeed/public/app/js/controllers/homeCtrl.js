'use strict';

angular.module('App')

    .controller('homeCtrl', ["$scope", "$http", "$window", "$location", function ($scope, $http, $window, $location) {

        $scope.message = "hello from home controller";

        $scope.logout = function(){
            delete $window.sessionStorage.token;
            $location.path( "/" );
        };

        $http.get("api/names/")
            .success(function (response) {
                $scope.names = response;
            }).error(function (response) {
            $scope.info = response.msg;
        });

        $http.get("api/hellos/")
            .success(function (response) {
                $scope.hellos = response;
            }).error(function (response) {
            $scope.info = response.msg;
        });


    }]);