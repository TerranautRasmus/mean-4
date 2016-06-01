'use strict';

angular.module('App')

    .controller('signupCtrl', ["$scope", "$http", "$sanitize", function ($scope, $http, $sanitize) {

        $scope.message = "hello from signup controller";

        $scope.signUp = function(){

            var data = {
                userName: $sanitize($scope.username),
                password: $sanitize($scope.password)
            };

            $http({
                method: 'POST',
                url: 'http://localhost:3000/api/user/signup',
                headers: {'Content-Type': 'application/json'},
                data: angular.toJson(data)
            }).success(function (data) {
                $scope.info = data.msg;
            }).error(function (data) {
                $scope.info = data.msg;
            })};


    }]);