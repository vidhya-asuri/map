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


function getDetailsAndCreateMarker(place, map, label) {
    console.log(place.place_id);
    var marker = new google.maps.Marker({
        map: map,
        label: label,
        title: place.name,
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

    google.maps.event.addListener(marker, 'click', function() {
        var photoLocation;
        var content = "";
        content = content + "</br>";
        content = content + "<p> " + place.name + "</p>";
        infowindow.setContent(content);
        infowindow.open(map, this);
    });
}

function initialize() {
    // Create a map to show the results, and an info window to
    // pop up if the user clicks on the place marker.

    // Request for latitide and longitude of Fisherman's wharf, SanFrancisco, CA.
    geocoder = new google.maps.Geocoder();
    var address = 'fisherman\'s wharf, sanfrancisco, CA, USA';

    geocoder.geocode({
        'address': address
    }, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            map.setCenter(results[0].geometry.location);
            getPointsOfInterest(results[0]);
        }
    });
}

function getPointsOfInterest(geocoderSearchResult) {
    map.setCenter(geocoderSearchResult.geometry.location);
    service = new google.maps.places.PlacesService(map);

    var nearbyBakery = {
        location: geocoderSearchResult.geometry.location,
        radius: '1000',
        type: ['bakery']
    };
    service.nearbySearch(nearbyBakery, markBakeries);

    var nearbyBookstore = {
        location: geocoderSearchResult.geometry.location,
        radius: '1000',
        type: ['book_store']
    };
    service.nearbySearch(nearbyBookstore, markBookstores);

    var nearbyParking = {
        location: geocoderSearchResult.geometry.location,
        radius: '1000',
        type: ['parking']
    };

    service.nearbySearch(nearbyParking, markParking);

    // Create a list and display all the results.
    ko.applyBindings(nearbyResults.allResults);

    function markBakeries(results, status) {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
            nearbyResults.allResults.bakeries(results);
            for (var i = 0; i < results.length; i++) {
                getDetailsAndCreateMarker(results[i], map, 'F');
            }
        }
    }

    function markBookstores(results, status) {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
            nearbyResults.allResults.bookstores(results);
            for (var i = 0; i < results.length; i++) {
                getDetailsAndCreateMarker(results[i], map, 'B');
            }
        }
    }

    function markParking(results, status) {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
            nearbyResults.allResults.parkingLots(results);
            for (var i = 0; i < results.length; i++) {
                getDetailsAndCreateMarker(results[i], map, 'P');
            }
        }
    }

}

var nearbyResults = {
    allResults: {
        bakeries: ko.observableArray([]),
        bookstores: ko.observableArray([]),
        parkingLots: ko.observableArray([])
    }
}

$('#checkboxParkingLots').on('change', function() {
    if (($(this).is(':checked'))) {
        $('#parkingLotsList').hide();
        // display markers for parking lots.
        for (var m = 0; m < parkingLotsMarkers.length; m++) {
            parkingLotsMarkers[m].setMap(null);
        }
    } else {
        $('#parkingLotsList').show();
        for (var m = 0; m < parkingLotsMarkers.length; m++) {
            parkingLotsMarkers[m].setMap(map);
        }
    }
});
$('#checkboxBakeries').on('change', function() {
    if (($(this).is(':checked'))) {
        $('#bakeriesList').hide();
        // display markers for parking lots.
        for (var m = 0; m < bakeriesMarkers.length; m++) {
            bakeriesMarkers[m].setMap(null);
        }
    } else {
        $('#bakeriesList').show();
        for (var m = 0; m < bakeriesMarkers.length; m++) {
            bakeriesMarkers[m].setMap(map);
        }
    }
});
$('#checkboxBookstores').on('change', function() {
    if (($(this).is(':checked'))) {
        // display markers for parking lots.
        $('#bookstoresList').hide();
        for (var m = 0; m < bookstoresMarkers.length; m++) {
            bookstoresMarkers[m].setMap(null);
        }
    } else {
        $('#bookstoresList').show();
        for (var m = 0; m < bookstoresMarkers.length; m++) {
            bookstoresMarkers[m].setMap(map);
        }
    }
});


// Run the initialize function when the window has finished loading.
google.maps.event.addDomListener(window, 'load', initialize);
