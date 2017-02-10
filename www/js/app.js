angular.module('whatsup', [
  'ionic',
  'ngMap',
  // 'ngCordova',
  // 'ionic.service.core',
  // 'ionic.service.push',
  // 'ionic.service.deploy',
  'whatsup.controllers',
  'whatsup.directives'
])


.run(function($ionicPlatform) {
	$ionicPlatform.ready(function() {
		if(window.StatusBar) {
			StatusBar.styleDefault();
		}
	});
})

.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
	$ionicConfigProvider.tabs.position('bottom');
	$ionicConfigProvider.navBar.alignTitle('center')
})


.config(function($stateProvider, $urlRouterProvider) {
	$stateProvider

	// setup an abstract state for the tabs directive
	.state('tab', {
		url: "/tab",
		abstract: true,
		templateUrl: "templates/tabs.html"
	})

	// Each tab has its own nav history stack:

	// Map tab
	.state('tab.map', {
		url: '/map',
		views: {
			'tab-map': {
				templateUrl: 'templates/tab-map.html',				
				controller: 'TestCtrl'
			}
		}
	})

	// Main tab
	.state('tab.main', {
		url: '/main',
		views: {
			'tab-main': {
				templateUrl: 'templates/tab-main.html',
				controller: 'MapCtrl'          
			}
		}
	})

	// List tab
	.state('tab.list', {
		url: '/list',
		views: {
			'tab-list': {
				templateUrl: 'templates/tab-list.html',
				//controller: 'HomeCtrl'
			}
		}
	})

	// if none of the above states are matched, use this as the fallback
	$urlRouterProvider.otherwise('/tab/map');
});