function initMap() {
    var mapDiv = document.getElementById('map');
    var map = new google.maps.Map(mapDiv, {
        center: {
            lat: 44.540,
            lng: -78.546
        },
        zoom: 8
    });
}
//https://developers.google.com/places/javascript/

var map;

function initialize() {

    // Create a map to show the results, and an info window to
    // pop up if the user clicks on the place marker.
    var pyrmont = new google.maps.LatLng(-33.8665, 151.1956);

    map = new google.maps.Map(document.getElementById('map'), {
        center: {
            lat: -33.8666,
            lng: 151.1958
        },
        zoom: 15
    });

    var request = {
        location: map.getCenter(),
        radius: '500',
        query: 'Google Sydney'
    };

    var service = new google.maps.places.PlacesService(map);
    service.textSearch(request, getPlaceID);

    function getPlaceID(results, status) {
        if (status == google.maps.places.PlacesServiceStatus.OK) {
            var places = [];

            for (let place of results) {
                places.push(place);
            };

            var marker = new google.maps.Marker({
                map: map,
                place: {
                    placeId: results[0].place_id,
                    location: results[0].geometry.location
                }
            });
        }
    }
}


// Run the initialize function when the window has finished loading.
google.maps.event.addDomListener(window, 'load', initialize);


initMap();
