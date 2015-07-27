var app = angular.module('whatsup.controllers', []);

app.controller('MapCtrl', function($scope, $rootScope, $ionicLoading, $compile, uiGmapGoogleMapApi) {

 	$scope.title = "WhatsUp";

 	if (localStorage.getItem("eventss") !== null) {
 	    eventss = localStorage.getItem("eventss");
 	    eventss = JSON.parse(eventss);          
 	}else{
 	    eventss = {"events": []};
 	}       

 	var mapOptions = {
 	    zoom: 17
 	};

 	$scope.map = { center: { latitude: 45, longitude: -73 }, zoom: 17 };

 	uiGmapGoogleMapApi.then(function(maps) {
 		console.log(maps);
    });

  	/*$scope.mapCreated = function(map) {  		
    	$scope.map = map;
    	// $scope.centerOnMe();
  	};*/

	$scope.centerOnMe = function () {
		console.log("Centering");
		if (!$scope.map) {
			return;
		}

		$scope.loading = $ionicLoading.show({
			content: 'Getting current location...',
			showBackdrop: false
		});

		//Marker + infowindow + angularjs compiled ng-click
        var contentString = "<div><a ng-click='clickTest()'>Click me!</a></div>";
        var compiled = $compile(contentString)($scope);

        var infowindow = new google.maps.InfoWindow({
            content: compiled[0]
        });

		navigator.geolocation.getCurrentPosition(function (pos) {
			// console.log('Got pos', pos);
			$scope.map.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));

			var marker = new google.maps.Marker({
		        position: new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude),
		        map: $scope.map,
		        title: "My Location"
			});

	        google.maps.event.addListener(marker, 'mousedown', function() {	          
	          infowindow.open($scope.map, marker);
	        });
			$ionicLoading.hide();
		}, function (error) {
			alert('Unable to get location: ' + error.message);
		});
	};

	$scope.clickTest = function() {
        alert('Example of infowindow with ng-click')
    };


});