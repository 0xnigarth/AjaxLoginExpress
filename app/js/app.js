'use strict';


// Declare app level module which depends on filters, and services
angular.module('myApp', ['myApp.filters', 'myApp.services', 'myApp.directives', 'myApp.controllers']).
config(['$routeProvider',
	function($routeProvider) {
		$routeProvider.when('/logIn', {
			templateUrl: 'partials/logIn.html',
			controller: 'loginCtrl'
		});
		$routeProvider.when('/signUp', {
			templateUrl: 'partials/signUp.html',
			controller: 'signUpCtrl'
		});
		$routeProvider.otherwise({
			redirectTo: '/logIn'
		});
	}
]);