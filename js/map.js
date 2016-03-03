//https://developers.google.com/places/javascript/
//https://developers.google.com/maps/documentation/javascript/places#placeid

// Link to google api-key for the MapP5 project 
// https://console.developers.google.com/apis/credentials?project=mapp5-1232

// https://maps.googleapis.com/maps/api/place/radarsearch/json?location=48.859294,2.347589&radius=5000&type=cafe&keyword=vegetarian&key=YOUR_API_KEY
var bakeriesMarkers = [];
var bookstoresMarkers = [];
var parkingLotsMarkers = [];
    var nyc = new google.maps.LatLng(40.7127, 74.0059);
    var pyrmont = {
        lat: -33.867,
        lng: 151.195
    };
    var sfo = {
        lat: -37.7833,
        lng: 122.4167
    };

    var map = new google.maps.Map(document.getElementById('map'), {
        center: sfo,
        zoom: 15,
        scrollwheel: false
    });

    var infowindow = new google.maps.InfoWindow();
    var service = new google.maps.places.PlacesService(map);

function initialize() {

    // Create a map to show the results, and an info window to
    // pop up if the user clicks on the place marker.

    var placeRequest = {
        location: sfo,
        radius: '500',
        query: 'fisherman\'s wharf sanfrancisco'
    };

    service.textSearch(placeRequest, getPlaceID);


    /* function createMarker(place, label) {
        var placeLoc = place.geometry.location;
        var marker = new google.maps.Marker({
            map: map,
            label: label,
            position: place.geometry.location
        });
        allMarkers.push(marker);
        google.maps.event.addListener(marker, 'click', function() {
            infowindow.setContent(place.name);
            infowindow.open(map, this);
        });
    } */
    function createMarker(place, label) {
        var placeLoc = place.geometry.location;
        var marker = new google.maps.Marker({
            map: map,
            label: label,
            position: place.geometry.location
        });
       switch (label) {
  case "F":
        bakeriesMarkers.push(marker);
    break;
  case "B":
        bookstoresMarkers.push(marker);
    break;
  case "P":
        parkingLotsMarkers.push(marker);
    break;
  default:
    console.log("Invalid marker label: " + label);
} 

        //allMarkers.push(marker);
        google.maps.event.addListener(marker, 'click', function() {
            infowindow.setContent(place.name);
            infowindow.open(map, this);
        });
    }



    function getPlaceID(results, status) {

        var detailsRequest = {
            placeId: results[0].place_id
        };

        var fwLat = results[0].geometry.location.lat();
        var fwLng = results[0].geometry.location.lng();
        var latLng = {
            lat: fwLat,
            lng: fwLng
        };

        var nearbyBakery = {
            location: latLng,
            radius: '1000',
            type: ['bakery']
        };
        service.nearbySearch(nearbyBakery, markBakeries);

        var nearbyBookstore = {
            location: latLng,
            radius: '1000',
            type: ['book_store']
        };
        service.nearbySearch(nearbyBookstore, markBookstores);

        var nearbyParking = {
            location: latLng,
            radius: '1000',
            type: ['parking']
        };

        service.nearbySearch(nearbyParking, markParking);


        // Create a list and display all the results.
        ko.applyBindings(nearbyResults.allResults);

        function markBakeries(results, status) {
            if (status === google.maps.places.PlacesServiceStatus.OK) {
                //resultsObj.saveBakeries(results);
                //resultsObj.displayResults(results);
                nearbyResults.allResults.bakeries(results);
                for (var i = 0; i < results.length; i++) {
                    createMarker(results[i],'F');
                }
            }
        }

        function markBookstores(results, status) {
            if (status === google.maps.places.PlacesServiceStatus.OK) {
                //resultsObj.saveBookstores(results);
                nearbyResults.allResults.bookstores(results);
                for (var i = 0; i < results.length; i++) {
                    createMarker(results[i], 'B');
                }
            }
        }

        function markParking(results, status) {
            if (status === google.maps.places.PlacesServiceStatus.OK) {
                //resultsObj.saveParking(results);
                //resultsObj.displayResults(results);
                nearbyResults.allResults.parkingLots(results);
                for (var i = 0; i < results.length; i++) {
                    createMarker(results[i],'P');
                }
            }
        }


        service.getDetails(detailsRequest, function(place, status) {
            if (status == google.maps.places.PlacesServiceStatus.OK) {
                // If the request succeeds, draw the place location on the map
                // as a marker, and register an event to handle a click on the marker.
                var detailsMarker = new google.maps.Marker({
                    map: map,
                    position: place.geometry.location
                });

                google.maps.event.addListener(detailsMarker, 'click', function() {
                    infowindow.setContent('<div><strong>' + place.name + '</strong><br>' +
                        'Place ID: ' + place.place_id + '<br>' +
                        place.formatted_address + '</div>');
                    infowindow.open(map, this);
                });
                map.panTo(place.geometry.location);
            }
        });
    }
}

var nearbyResults = {
     allResults : {
         bakeries: ko.observableArray([]),
         bookstores: ko.observableArray([]),
         parkingLots: ko.observableArray([])
     }
}

$('#checkboxParkingLots').on('change', function() {
  if(($(this).is(':checked'))){
    $('#parkingLotsList').hide();
    // display markers for parking lots.
    for(var m=0; m < parkingLotsMarkers.length; m++){
        parkingLotsMarkers[m].setMap(null);
    }  
  }
  else{
    $('#parkingLotsList').show();
    for(var m=0; m < parkingLotsMarkers.length; m++){
        parkingLotsMarkers[m].setMap(map);
    }  
  }
});
$('#checkboxBakeries').on('change', function() {
  if(($(this).is(':checked'))){
    $('#bakeriesList').hide();
    // display markers for parking lots.
    for(var m=0; m < bakeriesMarkers.length; m++){
        bakeriesMarkers[m].setMap(null);
    }
  }
  else{
    $('#bakeriesList').show();
    for(var m=0; m < bakeriesMarkers.length; m++){
        bakeriesMarkers[m].setMap(map);
    }
  }
});
$('#checkboxBookstores').on('change', function() {
  if(($(this).is(':checked'))){
    // display markers for parking lots.
    $('#bookstoresList').hide();
    for(var m=0; m < bookstoresMarkers.length; m++){
        bookstoresMarkers[m].setMap(null);
    }
  }
  else{
    $('#bookstoresList').show();
    for(var m=0; m < bookstoresMarkers.length; m++){
        bookstoresMarkers[m].setMap(map);
    }
  }
});


// Run the initialize function when the window has finished loading.
google.maps.event.addDomListener(window, 'load', initialize);
