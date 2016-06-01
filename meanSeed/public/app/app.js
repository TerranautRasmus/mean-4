'use strict';

angular.module('App', [
        'ngSanitize',
        'ngRoute'
    ])
    .config(function ($httpProvider) {
        $httpProvider.interceptors.push('authInterceptor');
    })
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: "views/login.html",
                controller: "loginCtrl"
            })
            .when("/home", {
                templateUrl: "views/home.html",
                controller: "homeCtrl"
            })
            .when("/signup", {
                templateUrl: "views/signup.html",
                controller: "signupCtrl"
            })
            .when("/hellos", {
                templateUrl: "views/hellos.html",
                controller: "homeCtrl"
            })
            .otherwise({
                redirectTo: "/"
            });
    }]);