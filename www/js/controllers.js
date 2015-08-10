var app = angular.module('whatsup.controllers', ['ngMap']);

app.controller('TestCtrl', function($scope, $rootScope){
    var locked = false;
    $scope.positions = [];
    $scope.addMarker = function(event) {
        if(!locked){
            var ll = event.latLng;
            $scope.positions.push({lat:ll.lat(), lng: ll.lng()});
            locked = true;
        }else{
            alert("locked!");
        }
    };

    $scope.saveEvent = function(e){
        console.info(this.this.position);
        //alert(e);
        locked = false;
    };

    $scope.remove_marker = function(){                
        
        for (var key in this.map.markers) {            
            var index = key - 1;
            if(this.map.markers[key].position == this.this.position){                
                if (index > -1) {
                    console.log(index);
                    this.map.markers[index].setMap(null);
                    $scope.positions.splice(index, 1);
                };
            }
        }

        locked = false;
    };



});

/*app.controller('NewCtrl', function($scope, uiGmapGoogleMapApi) {
    $scope.myLocation = {
        lng : '',
        lat: ''
    }

    var createNewMarker = function(i, lat, lng, idKey) {
        if (idKey == null) {
            idKey = "id";
        }
        var ret = {
            latitude: lat,
            longitude: lng,
            title: i,
            icon: "img/pin_green.png",
            options: { //issue here
                draggable: true
            }
        };
        ret[idKey] = i;
        console.log(ret);
        return ret;
    };    

    $scope.randomMarkers = [];
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
                zoom: 14,
                events: {
                    click: function(map, event, MouseEvent){   
                        var lat = MouseEvent[0].latLng.lat();
                        var lng = MouseEvent[0].latLng.lng();                        
                        var markers = [];
                        markers.push(createNewMarker("new", lat, lng));

                        //create new marker
                        $scope.$apply(function(){
                            $scope.randomMarkers = markers;    
                        });
                        
                        // console.log(MouseEvent[0].latLng);
                    }
                },
                bounds: {}
            };
    
            $scope.marker = {
                id: 0,
                title: 'My Location',
                coords: {
                    latitude: $scope.myLocation.lat,
                    longitude: $scope.myLocation.lng
                },
                events: {
                    click: function(){
                        console.log("click on marker");
                    }
                }
            }; 
             
            $scope.marker.options = {
                draggable: false,
                icon: "img/pin_blue.png",
                labelContent: "lat: " + $scope.marker.coords.latitude + '<br/> ' + 'lon: ' + $scope.marker.coords.longitude,
                labelAnchor: "70 100",
                labelClass: "marker-labels"
            };  
        }); //end $scope.drawMap
    };

    navigator.geolocation.getCurrentPosition($scope.drawMap);
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

        $scope.mapCreated = function(map) {       
                $scope.map = map;
                // $scope.centerOnMe();
        };

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


});*/