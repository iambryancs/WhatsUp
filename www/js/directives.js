var app = angular.module('whatsup.directives', []);

app.directive('map', function($compile) {
    return {
        restrict: 'E',
        scope: {
            onCreate: '&'
        },
        link: function ($scope, $element, $attr) {

            var map;
            
            function initialize2() {
                var mapOptions = {
                    center: new google.maps.LatLng(43.07493, -89.381388),
                    zoom: 16,
                    mapTypeId: google.maps.MapTypeId.ROADMAP
                };
                map = new google.maps.Map($element[0], mapOptions);        
    
                // $scope.onCreate({map: map});

                // Stop the side bar from dragging when mousedown/tapdown on the map
                /*google.maps.event.addDomListener($element[0], 'mousedown', function (e) {          
                    e.preventDefault();
                    return false;
                });*/
            }


            function initialize(){

                if (localStorage.getItem("eventss") !== null) {
                    eventss = localStorage.getItem("eventss");
                    eventss = JSON.parse(eventss);          
                }else{
                    eventss = {"events": []};
                }       

                var mapOptions = {
                    zoom: 17
                };
                map = new google.maps.Map($element[0], mapOptions);

                // Try HTML5 geolocation
                if(navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(function (position) {
                        
                        var pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                        
                        map.setCenter(pos);

                        var marker = new google.maps.Marker({
                            position: pos,
                            map: map,                       
                            title: "My Location",
                            icon: "img/pin_green.png"
                        });

                        var contentString = '<div class="marker-info-win">'+
                        '<div class="marker-inner-win"><span class="info-content">'+
                        '<h3 class="marker-heading">'+marker.title+'<\/h3>' +
                        '<\/span><\/div><\/div>';

                        var compiled = $compile(contentString)($scope);

                        var infowindow = new google.maps.InfoWindow();

                        google.maps.event.addListener(marker, 'click', function() {
                            console.log("message");
                            infowindow.setContent(compiled[0]);
                            infowindow.open(map, marker);
                        });                 
                    }, function() {
                        handleNoGeolocation(true);
                    });
                } else {
                    // Browser doesn't support Geolocation
                    handleNoGeolocation(false);
                }
            

                angular.forEach(eventss.events, function (key, data) {

                    var latLng = new google.maps.LatLng(data.lat, data.lng);

                    var marker = new google.maps.Marker({
                        position: latLng,
                        map: map,                       
                        title: data.title,
                        icon: "img/pin_blue.png"
                    });

                    var infowindow = new google.maps.InfoWindow();

                    var contentString = '<div class="marker-info-win">'+
                    '<div class="marker-inner-win"><span class="info-content">'+
                    '<h3 class="marker-heading">'+data.title+'<\/h3>' +
                    '<\/span><button name="remove-marker" class="remove-marker" title="Remove Marker">Remove Marker<\/button>'+
                    '<\/div><\/div>';

                    var compiled = $compile(contentString)($scope);

                    bindInfoWindow(marker, map, infowindow, compiled[0]);                   

                });

                                
                //drop a new marker on right click
                google.maps.event.addListener(map, 'rightclick', function(event) {
                    //Edit form to be displayed with new marker
                    var form = '<p><div class="marker-edit">'+
                    '<form action="ajax-save.php" method="POST" name="SaveMarker" id="SaveMarker">'+
                    '<label for="pName"><span>Place Name :<\/span><input type="text" name="pName" class="save-name" placeholder="Enter Title" maxlength="40" /><\/label>'+
                    '<label for="pDesc"><span>Description :<\/span><textarea name="pDesc" class="save-desc" placeholder="Enter Address" maxlength="150"><\/textarea><\/label>'+
                    '<label for="pType"><span>Type :<\/span> <select name="pType" class="save-type"><option value="restaurant">Rastaurant<\/option><option value="bar">Bar<\/option>'+
                    '<option value="house">House<\/option><\/select><\/label>'+
                    '<\/form>'+
                    '<\/div><\/p><button name="save-marker" class="save-marker">Save Marker Details<\/button>';

                    //call createMarker() function
                    $scope.createMarker(event.latLng, 'New Event', form, true, true, true, "img/pin_green.png");
                });

                // $scope.onCreate({map: map});
            }

            $scope.createMarker = function(pos, title, details,  InfoOpenDefault, draggable, Removable, iconPath) {                 
                //new marker
                $scope.marker = new google.maps.Marker({
                    position: pos,
                    map: map,
                    draggable:draggable,
                    animation: google.maps.Animation.DROP,
                    title:title,
                    icon: iconPath
                });
                            
                //Content structure of info Window for the Markers
                var contentString = '<div class="marker-info-win">'+
                '<div class="marker-inner-win"><span class="info-content">'+
                '<h1 class="marker-heading">'+title+'<\/h1>'+ details +
                '<\/span><button ng-click="removeMarkers({{marker}})" name="remove-marker" class="remove-marker" title="Remove Marker">Remove Marker<\/button>'+
                '<\/div><\/div>';

                var compiled = $compile(contentString)($scope);

                
                //Create an infoWindow
                var infowindow = new google.maps.InfoWindow();
                //set the content of infoWindow
                infowindow.setContent(compiled[0]);                

                //Find remove button in infoWindow
                // var removeBtn   = contentString.find('button.remove-marker')[0];

               //Find save button in infoWindow
                // var saveBtn     = contentString.find('button.save-marker')[0];

                //add click listner to remove marker button
                /*google.maps.event.addDomListener(removeBtn, "click", function(event) {
                    //call remove_marker function to remove the marker from the map
                    remove_marker(marker);
                });*/
                
                /*if(typeof saveBtn !== 'undefined') {//continue only when save button is present
                    //add click listner to save marker button
                    google.maps.event.addDomListener(saveBtn, "click", function(event) {                    
                        var replace = contentString.find('span.info-content'); //html to be replaced after success
                        var title = contentString.find('input.save-name')[0].value; //name input field value
                        var desc  = contentString.find('textarea.save-desc')[0].value; //description input field value
                        var type = contentString.find('select.save-type')[0].value; //type of marker
                        
                        if(title =='' || desc =='')
                        {
                            alert("Please enter Name and Description!");
                        }else{
                            //call save_marker function and save the marker details
                            save_marker(marker, title, desc, type, replace);
                        }
                    });
                }*/
                
                //add click listner to save marker button        
                google.maps.event.addListener($scope.marker, 'click', function() {
                        infowindow.open(map,$scope.marker); // click on $scope.marker opens info window 
                });
                  
                if(InfoOpenDefault) { //whether info window should be open by default                           
                    infowindow.open(map,$scope.marker);
                }
            }

            $scope.removeMarkers = function($event) {
                console.log($event);
            }

            $scope.removeMarker = function(Marker) {
                /* determine whether marker is draggable 
                new markers are draggable and saved markers are fixed */
                if(Marker.getDraggable()) 
                {
                    Marker.setMap(null); //just remove new marker
                }
                else
                {
                    var lat = Marker.getPosition().lat().toFixed(6);
                    var lng = Marker.getPosition().lng().toFixed(6);
                    var tempLocalStorage = localStorage.getItem("eventss");
                    tempLocalStorage = JSON.parse(tempLocalStorage);

                    tempLocalStorage.events.forEach(function(entry){                        
                        if(entry.lat === lat && entry.lng === lng){
                            Marker.setMap(null);
                            var index = arrayObjectIndexOf(tempLocalStorage.events, lat, "lat");
                            if (index > -1) {
                                tempLocalStorage.events.splice(index, 1);
                                localStorage.setItem("eventss", JSON.stringify(tempLocalStorage));
                            }                           
                        }
                    });

                    function arrayObjectIndexOf(myArray, searchTerm, property) {
                        for(var i = 0, len = myArray.length; i < len; i++) {
                            if (myArray[i][property] === searchTerm) return i;
                        }
                        return -1;
                    }
                    


                    //Remove saved marker from DB and map using jQuery Ajax
                    /* var mLatLang = Marker.getPosition().toUrlValue(); //get marker position
                    var myData = {del : 'true', latlang : mLatLang}; //post variables
                    $.ajax({
                      type: "POST",
                      url: "map_process.php",
                      data: myData,
                      success:function(data){
                            Marker.setMap(null); 
                            alert(data);
                        },
                        error:function (xhr, ajaxOptions, thrownError){
                            alert(thrownError); //throw any errors
                        }
                    }); */
                }
            }

            if (document.readyState === "complete") {
                initialize();
            } else {
                google.maps.event.addDomListener(window, 'load', initialize);
            }
        }
    }
});