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
var bakeryNames = [];
var ids = [];
var photos = [];
var venues;
var contentPhotoUrl = null; 

function frsqrBookPhotos() {
    if (bookPhotosRequest.readyState === XMLHttpRequest.DONE) {
        if (bookPhotosRequest.status === 200) {
            var response = (bookPhotosRequest.responseText);
            var jsonResponse = JSON.parse(bookPhotosRequest.responseText);
            var count = photos.length;
            if(count > 1){
              photos = jsonResponse.response.photos.items;
              contentPhotoUrl = photos[0].prefix + "100x100" + photos[0].suffix;
            }
        } else {
            alert('There was a problem with the request.');
        }
    }
}

function frsqrBakeryPhotos() {
    if (bakeryPhotosRequest.readyState === XMLHttpRequest.DONE) {
        if (bakeryPhotosRequest.status === 200) {
            var jsonResponse = JSON.parse(bakeryPhotosRequest.responseText);
            var count = jsonResponse.response.photos.length;
            if(count > 1){
              photos = jsonResponse.response.photos.items;
              contentPhotoUrl = photos[0].prefix + "100x100" + photos[0].suffix;
            }
        } else {
            alert('There was a problem with the request.');
        }
    }
}

function processFrsqrBooks() {
    if (getBooksRequest.readyState === XMLHttpRequest.DONE) {
        if (getBooksRequest.status === 200) {
            var response = (getBooksRequest.responseText);
            var jsonResponse = JSON.parse(getBooksRequest.responseText);
            venues = jsonResponse.response.venues;
            getDetailsAndCreateMarker(map,'B');
            var bkstr = [];
            for (var i = 0; i < venues.length; i++) {
                //bookstoreViewModel.bookstores().push({name: venues[i].name});
                bkstr[i]= {name: venues[i].name};
                //nearbyResults.allResults.bookstores.push(venues[i].name);
                var foursquareQuery = "https://api.foursquare.com/v2/venues/" + venues[i].id + "/photos/?client_id=F0XYIB113FEQQVQFFK5DGZ4V5PJBZA2DRNAXHFUW1G3UBE3N&client_secret=ZYY5PZ15D02DLZ0D3RGBADODPBC1KMKX4ZIQ4XNDNLUKBKEB&v=20140701";
                bookPhotosRequest = new XMLHttpRequest();
                if (!bookPhotosRequest) {
                alert('Giving up processFrsqrBooks:( Cannot create an XMLHTTP instance');
                return false;
                }
                bookPhotosRequest.onreadystatechange = frsqrBookPhotos;
                bookPhotosRequest.open('GET', foursquareQuery);
                bookPhotosRequest.send(); 
            }
            bookstoreViewModel.bookstores(bkstr); 
        } else {
            alert('There was a problem with the request.');
        }
    }
}


function processFrsqrBakeries() {
    if (getBakeriesRequest.readyState === XMLHttpRequest.DONE) {
        if (getBakeriesRequest.status === 200) {
            var response = (getBakeriesRequest.responseText);
            var jsonResponse = JSON.parse(getBakeriesRequest.responseText);
            venues = jsonResponse.response.venues;
            getDetailsAndCreateMarker(map,'F');
            var bak = [];
            for (var i = 0; i < venues.length; i++) {
                bak[i]= {name: venues[i].name};
                // bakeries().push({name: venues[i].name});
                var foursquareQuery = "https://api.foursquare.com/v2/venues/" + venues[i].id + "/photos/?client_id=F0XYIB113FEQQVQFFK5DGZ4V5PJBZA2DRNAXHFUW1G3UBE3N&client_secret=ZYY5PZ15D02DLZ0D3RGBADODPBC1KMKX4ZIQ4XNDNLUKBKEB&v=20140701";
                bakeryPhotosRequest = new XMLHttpRequest();
                if (!bakeryPhotosRequest) {
                alert('Giving up processFrsqrBakeries :( Cannot create an XMLHTTP instance');
                return false;
                }
                bakeryPhotosRequest.onreadystatechange = frsqrBakeryPhotos;
                bakeryPhotosRequest.open('GET', foursquareQuery);
                bakeryPhotosRequest.send();
            }
            bakeryViewModel.bakeries(bak); 
        } else {
            alert('There was a problem with the request.');
        }
    }
}

function matchPlaceName(element, index, array) {
    var match = element.toLowerCase().includes(this.name.toLowerCase());
    if (match) {
        return true;
    } else {
        return false;
    }
}

function getDetailsAndCreateMarker(map, label) {
    var content = "";
    var marker; 
    for (var i = 0; i < venues.length; i++) {
       //bakeryNames.push(venues[i].name);
       var lat = venues[i].location.lat;
       var lng = venues[i].location.lng;
       var latLng = {lat: lat, lng: lng}; 
       marker = new google.maps.Marker({
         map: map,
         label: label,
         title: venues[i].name,
         position: latLng 
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

    /*google.maps.event.addListener(marker, 'click', function() {
        var self = this;
        var names = bakeryNames;
        var index = bakeryNames.findIndex(matchPlaceName, place);
        if (index != -1) {
            content = content + "</br>";
            content = content + "<p> " + place.name + "</p>";
            if(contentPhotoUrl != null){
              content = content + "<img src=\"" + contentPhotoUrl + "\"/>";
            }
        }
        infowindow.setContent(content);
        infowindow.open(map, this);
        contentPhotoUrl = null;
        content = "";
    }); */
  }
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
	    getBakeries(results[0]);
            getBookstores(results[0]);
        }
    });
}

function getBookstores(geocoderSearchResult) {
    map.setCenter(geocoderSearchResult.geometry.location);
    // Create a list and display all the results.
    var cll = geocoderSearchResult.geometry.location.lat() + "," + geocoderSearchResult.geometry.location.lng();
    var foursquareQuery = "https://api.foursquare.com/v2/venues/search?client_id=F0XYIB113FEQQVQFFK5DGZ4V5PJBZA2DRNAXHFUW1G3UBE3N&client_secret=ZYY5PZ15D02DLZ0D3RGBADODPBC1KMKX4ZIQ4XNDNLUKBKEB&v=20140701&ll=" + cll + "&radius=2000&query=books&intent=browse&limit=50";
    getBooksRequest = new XMLHttpRequest();
    if (!getBooksRequest) {
        alert('Giving up getBookstores:( Cannot create an XMLHTTP instance');
        return false;
    }
    getBooksRequest.onreadystatechange = processFrsqrBooks;
    getBooksRequest.open('GET', foursquareQuery);
    getBooksRequest.send();
}

function getBakeries(geocoderSearchResult) {
    map.setCenter(geocoderSearchResult.geometry.location);
    // Create a list and display all the results.
    var cll = geocoderSearchResult.geometry.location.lat() + "," + geocoderSearchResult.geometry.location.lng();
    // write location and phone number info to file.
    var foursquareQuery = "https://api.foursquare.com/v2/venues/search?client_id=F0XYIB113FEQQVQFFK5DGZ4V5PJBZA2DRNAXHFUW1G3UBE3N&client_secret=ZYY5PZ15D02DLZ0D3RGBADODPBC1KMKX4ZIQ4XNDNLUKBKEB&v=20140701&ll=" + cll + "&radius=2000&query=bakery&intent=browse&limit=50";
    getBakeriesRequest = new XMLHttpRequest();
    if (!getBakeriesRequest) {
        alert('Giving up getBakeries:( Cannot create an XMLHTTP instance');
        return false;
    }
    getBakeriesRequest.onreadystatechange = processFrsqrBakeries;
    getBakeriesRequest.open('GET', foursquareQuery);
    getBakeriesRequest.send();
}

var viewModel = {
   bookstores: ko.observableArray([]),
   bakeries: ko.observableArray([])
};

function BakeryViewModel() {
    var self = this;
    self.bakeries = ko.observableArray([]);
}

// View Model for bookstore.  
function BookstoreViewModel() {
    var self = this;
    self.bookstores = ko.observableArray([]);
};

var bookstoreViewModel = new BookstoreViewModel();

ko.applyBindings(bookstoreViewModel,document.getElementById('bookstoresList'));

var bakeryViewModel = new BakeryViewModel();

ko.applyBindings(bakeryViewModel,document.getElementById('bakeriesList'));

//var bookstores = ko.observableArray([]);
//ko.applyBindings(bookstores,document.getElementById('bookstoresList'));

/* var bakeries = ko.observableArray([]);
ko.applyBindings(bakeries,document.getElementById('bakeriesList')); */


$('#checkboxParkingLots').on('change', function() {
    var b = bookstoreViewModel.bookstores();
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

var getBooksRequest;
var getBakeriesRequest;
var bookPhotosRequest;
var bakeryPhotosRequest;

// Run the initialize function when the window has finished loading.
google.maps.event.addDomListener(window, 'load', initialize);
