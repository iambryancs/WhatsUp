var app = angular.module('whatsup.controllers', []);

app.controller('TestCtrl', function($scope, $rootScope, $ionicLoading, $compile, uiGmapGoogleMapApi) {
    $scope.myLocation = {
        lng : '',
        lat: ''
    }
         
    $scope.drawMap = function(position) {
 
        //$scope.$apply is needed to trigger the digest cycle when the geolocation arrives and to update all the watchers
        $scope.$apply(function() {
            $scope.myLocation.lng = position.coords.longitude;
            $scope.myLocation.lat = position.coords.latitude;
 
            $scope.map = {
                center: {
                    latitude: $scope.myLocation.lat,
                    longitude: $scope.myLocation.lng
                },
                zoom: 14            
            };
 
            $scope.marker = {
                id: 0,
                coords: {
                    latitude: $scope.myLocation.lat,
                    longitude: $scope.myLocation.lng
                }
            }; 
             
            $scope.marker.options = {
                draggable: false,
                labelContent: "lat: " + $scope.marker.coords.latitude + '<br/> ' + 'lon: ' + $scope.marker.coords.longitude,
                labelAnchor: "70 100",
                labelClass: "marker-labels"
            };  
        });
    };
     
    navigator.geolocation.getCurrentPosition($scope.drawMap);

    $scope.test = function(){
        alert("hola");
    };

});



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