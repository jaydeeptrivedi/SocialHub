
angular.module('socialhub.controllers',['ngCordova','ngStorage'])
	.controller('facebookOauthCtrl', ['$rootScope','$scope', '$cordovaOauth', '$localStorage', '$location',facebookOauthCtrl])
	.controller('facebookCtrl', ['$rootScope','$scope','apiService','$localStorage','$cordovaOauth','$location','$http','$ionicLoading','$ionicTabsDelegate',facebookCtrl])
	.controller('instagramCtrl',  ['$rootScope','$scope','apiService','$localStorage','$cordovaOauth','$location','$http','$ionicLoading','$ionicTabsDelegate',instagramCtrl])
	.controller('twitterCtrl',  ['$rootScope','$scope','$state','$http','apiService','$cordovaOauth','$localStorage','$ionicTabsDelegate','$cordovaOauthUtility',twitterCtrl]);

