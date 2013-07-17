'use strict';

/* Controllers */
var host = "localhost";
angular.module('myApp.controllers', []).
controller('signUpCtrl', [
	function() {


		$("#btnSignUp").click(function() {

			var request = $.ajax({
				url: "http://" + host + "/signup",
				type: "POST",
				data: {
					username: $("#username").val(),
					password: $("#password").val()

				},

				contentType: "application/x-www-form-urlencoded",
				dataType: "html"
			});

			request.fail(function(jqXHR, textStatus) {
				alert("Request failed: " + textStatus);

			});


			request.success(function(msg) {

				alert(msg);
			});


		});


	}
]).controller('loginCtrl', [
	function() {


		$("#submit").click(function() {

			var request = $.ajax({
				url: "http://" + host + "/login",
				type: "POST",
				data: {
					username: $("#username").val(),
					password: $("#password").val()

				},

				contentType: "application/x-www-form-urlencoded",
				dataType: "html"
			});

			request.fail(function(jqXHR, textStatus) {
				alert("Request failed: " + textStatus);

			});


			request.success(function(msg) {

				alert(msg);
			});


		});


		$("#btnTestRestricted").click(function() {

			var request = $.ajax({
				url: "http://" + host + "/restricted",
				type: "GET",

				xhrFields: {
					withCredentials: true
				},
				dataType: "html"
			});

			request.fail(function(jqXHR, textStatus) {
				alert("Request failed: " + textStatus);

			});


			request.success(function(msg) {

				alert(msg);
			});


		});



		$("#btnLogOut").click(function() {

			var request = $.ajax({
				url: "http://" + host + "/logout",
				type: "GET",
				data: {
					username: $("#username").val(),
					password: $("#password").val()

				},

				contentType: "application/x-www-form-urlencoded",
				dataType: "html"
			});

			request.fail(function(jqXHR, textStatus) {
				alert("Request failed: " + textStatus);

			});


			request.success(function(msg) {

				alert(msg);
			});


		});



	}
]);