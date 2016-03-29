//https://developers.google.com/places/javascript/
//https://developers.google.com/maps/documentation/javascript/places#placeid

// Link to google api-key for the MapP5 project 
// https://console.developers.google.com/apis/credentials?project=mapp5-1232

// https://maps.googleapis.com/maps/api/place/radarsearch/json?location=48.859294,2.347589&radius=5000&type=cafe&keyword=vegetarian&key=YOUR_API_KEY

var bakeriesMarkers = [];
var bookstoresMarkers = [];
var parkingLotsMarkers = [];
var geocoderSearchResult;
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
var bookVenues;
var bakVenues;
var contentPhotoUrl = null;
var bookstorePhotos = [];
var bakeryPhotos = [];

function processFrsqrBooks(response) {
    if (getBooksRequest.readyState === XMLHttpRequest.DONE) {
        if (getBooksRequest.status === 200) {
            var jsonResponse = JSON.parse(getBooksRequest.responseText);
            var bkstr = [];
            var bkstrNames = [];
            var frsqrBookItems = [];
            if (jsonResponse.response.groups.length > 0) {
                bookVenues = jsonResponse.response.groups[0];
                items = bookVenues.items;
                for (var i = 0; i < items.length; i++) {
                    var frsqrItem = {
                        tips: '',
                        venue: {
                            'name': '',
                            'venueUrl': '',
                            'venuePhotoUrl': '',
                            'rating': 0.0,
                            'lat': 0,
                            'lng': 0
                        }
                    }
                    frsqrItem.tips = items[i].tips;
                    frsqrItem.venue.name = items[i].venue.name;
                    frsqrItem.venue.venueUrl = items[i].venue.url;
                    frsqrItem.venue.lat = items[i].venue.location.lat;
                    frsqrItem.venue.lng = items[i].venue.location.lng;
                    if (items[i].venue.photos.count > 0) {
                        // there is at least one photo - so construct photo url. 
                        var groups = items[i].venue.photos.groups;
                        if (groups.length > 0) {
                            var photoItems = groups[0].items;
                            if (photoItems.length > 0) {
                                frsqrItem.venue.venuePhotoUrl = photoItems[0].prefix + '50x50' + photoItems[0].suffix;
                            }
                        }
                    }
                    frsqrItem.venue.rating = items[i].venue.rating;
                    frsqrBookItems.push(frsqrItem);
                    bkstr[i] = {
                        name: frsqrItem.venue.name,
                        item: frsqrItem
                    };
                    bkstrNames[i] = frsqrItem.venue.name; 
                }
                bookstoreViewModel.bookstores(bkstr);
                bookstoreViewModel.bookstoreNames(bkstrNames);
                bookstoreViewModel.filteredVenues(bkstrNames);
            }
            bookstoresDetailsMarkers(map, 'B', frsqrBookItems);
        } else {
            alert('There was a problem with the request.');
        }
    }
}

/*function processFrsqrBakeries() {
    if (getBakeriesRequest.readyState === XMLHttpRequest.DONE) {
        if (getBakeriesRequest.status === 200) {
            var jsonResponse = JSON.parse(getBakeriesRequest.responseText);
            var bak = [];
            var frsqrBakeryItems = [];
            if(jsonResponse.response.groups.length > 0){
              bakVenues = jsonResponse.response.groups[0];
              items = bakVenues.items;
              for(var i=0; i < items.length; i++){
                frsqrItem.tips = items[i].tips;
                frsqrItem.venue.name = items[i].venue.name;
                frsqrItem.venue.venueUrl = items[i].venue.url;
                frsqrItem.venue.lat = items[i].venue.location.lat;
                frsqrItem.venue.lng = items[i].venue.location.lng;

                if(items[i].venue.photos.count > 0){
                  // there is at least one photo - so construct photo url.
                  var groups = items[i].venue.photos.groups;
                  if(groups.length > 0){
                    var photoItems = groups[0].items;
                    if(photoItems.length > 0){
                       frsqrItem.venue.venuePhotoUrl = photoItems[0].prefix + '50x50' + photoItems[0].suffix;
                    }
                  }
                }

                frsqrItem.venue.rating = items[i].venue.rating;
                frsqrBakeryItems.push(frsqrItem);
                bak[i]= {name: frsqrItem.venue.name, item: frsqrItem };
              }
              bakeryViewModel.bakeries(bak); 
            }
            bakeriesDetailsMarkers(map,'F',frsqrBakeryItems);
        } else {
            alert('There was a problem with the request.');
        }
    }
}
*/

function bookstoresDetailsMarkers(map, label, frsqrBookItems) {
    var content = "";
    var marker;
    for (var i = 0; i < frsqrBookItems.length; i++) {
        var lat = frsqrBookItems[i].venue.lat;
        var lng = frsqrBookItems[i].venue.lng;
        var latLng = {
            lat: lat,
            lng: lng
        };
        marker = new google.maps.Marker({
            map: map,
            label: label,
            animation: google.maps.Animation.DROP,
            title: frsqrBookItems[i].venue.name,
            id: i,
            position: latLng
        });

        bookstoresMarkers.push(marker);
        google.maps.event.addListener(marker, 'click', function() {
            var self = this;

            if (self.getAnimation() !== null) {
    self.setAnimation(null);
  } else {
    self.setAnimation(google.maps.Animation.BOUNCE);
  }


            content = content + "</br>";
            content = content + "<p> " + this.title + "</p>";
            content = content + "<img src=\"" + frsqrBookItems[this.id].venue.venuePhotoUrl +  "\"/>";
            infowindow.setContent(content);
            infowindow.open(map, this);
            contentPhotoUrl = null;
            content = "";
        });
    }
}

/*
function bakeriesDetailsMarkers(map,label,frsqrBakeryItems) {
    var content = "";
    var marker;
    for (var i = 0; i < frsqrBakeryItems.length; i++) {
       var lat = frsqrBakeryItems[i].venue.lat;
       var lng = frsqrBakeryItems[i].venue.lng;
       var latLng = {lat: lat, lng: lng};
       marker = new google.maps.Marker({
         map: map,
         label: label,
         title: frsqrBakeryItems[i].venue.name,
         id: i,
         position: latLng
       });
       bakeriesMarkers.push(marker);
    google.maps.event.addListener(marker, 'click', function() {
        var self = this;
            content = content + "</br>";
            content = content + "<p> " + this.title + "</p>";
            content = content + "<img src=\"" + bakeryPhotos[this.id][0].prefix + "100x100" + bakeryPhotos[this.id][0].suffix + "\"/>";
            if(contentPhotoUrl != null){
              content = content + "<img src=\"" + bakeryPhotos[i][0] + "\"/>";
            }
        infowindow.setContent(content);
        infowindow.open(map, this);
        contentPhotoUrl = null;
        content = "";
    });
  }

}
*/
function initialize() {
    // Create a map to show the results, and an info window to
    // pop up if the user clicks on the place marker.

    // Request for latitide and longitude of Fisherman's wharf, SanFrancisco, CA.
    geocoder = new google.maps.Geocoder();
    var address = 'fisherman\'s wharf, sanfrancisco, CA, USA';
    //getBookstores(sfo);
    geocoder.geocode({
        'address': address
    }, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            geocoderSearchResult = results[0];
            map.setCenter(geocoderSearchResult.geometry.location);
            //map.setCenter(results[0].geometry.location);
            //getBakeries(results[0]);
            //getBookstores(geocoderSearchResult);
            getBookstores(geocoderSearchResult).then(function(response) {
                processFrsqrBooks(response);
            }, function(error) {
                console.log(error);
            });
        }
    });
}

// code attribution: https://github.com/mdn/promises-test/blob/gh-pages/index.html 
function getBookstores(geocoderSearchResult) {

    return new Promise(function(resolve, reject) {

        //map.setCenter(sfo);
        if (geocoderSearchResult.geometry.location) {
            map.setCenter(geocoderSearchResult.geometry.location);
            // Create a list and display all the results.
            //var cll = sfo.lat + "," + sfo.lng;
            var cll = geocoderSearchResult.geometry.location.lat() + "," + geocoderSearchResult.geometry.location.lng();
            var foursquareQuery = "https://api.foursquare.com/v2/venues/explore?client_id=F0XYIB113FEQQVQFFK5DGZ4V5PJBZA2DRNAXHFUW1G3UBE3N&client_secret=ZYY5PZ15D02DLZ0D3RGBADODPBC1KMKX4ZIQ4XNDNLUKBKEB&v=20140701&ll=" + cll + "&radius=1000&query=books&venuePhotos=1&limit=50";
            getBooksRequest = new XMLHttpRequest();
            if (!getBooksRequest) {
                alert('Giving up getBookstores:( Cannot create an XMLHTTP instance');
                return false;
            }
            getBooksRequest.open('GET', foursquareQuery);
            getBooksRequest.responseType = 'text';
            getBooksRequest.onload = function() {
                if (getBooksRequest.status === 200) {
                    resolve(getBooksRequest.response);
                } else {
                    reject(Error('Request did not load successfully' + getBooksRequest.statusText));
                }

            };

            getBooksRequest.onerror = function() {
                reject(Error('There was a network error'));
            };

            getBooksRequest.send();
        } // if ends
    });
}


/*
function getBookstores(geocoderSearchResult) {
    map.setCenter(geocoderSearchResult.geometry.location);
    // Create a list and display all the results.
    var cll = geocoderSearchResult.geometry.location.lat() + "," + geocoderSearchResult.geometry.location.lng();
    var foursquareQuery = "https://api.foursquare.com/v2/venues/explore?client_id=F0XYIB113FEQQVQFFK5DGZ4V5PJBZA2DRNAXHFUW1G3UBE3N&client_secret=ZYY5PZ15D02DLZ0D3RGBADODPBC1KMKX4ZIQ4XNDNLUKBKEB&v=20140701&ll=" + cll + "&radius=1000&query=books&venuePhotos=1&limit=50";
    //var foursquareQuery = "https://api.foursquare.com/v2/venues/search?client_id=F0XYIB113FEQQVQFFK5DGZ4V5PJBZA2DRNAXHFUW1G3UBE3N&client_secret=ZYY5PZ15D02DLZ0D3RGBADODPBC1KMKX4ZIQ4XNDNLUKBKEB&v=20140701&ll=" + cll + "&radius=2000&query=books&intent=browse&limit=50";
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
    //var foursquareQuery = "https://api.foursquare.com/v2/venues/search?client_id=F0XYIB113FEQQVQFFK5DGZ4V5PJBZA2DRNAXHFUW1G3UBE3N&client_secret=ZYY5PZ15D02DLZ0D3RGBADODPBC1KMKX4ZIQ4XNDNLUKBKEB&v=20140701&ll=" + cll + "&radius=2000&query=bakery&intent=browse&limit=50";
    var foursquareQuery = "https://api.foursquare.com/v2/venues/explore?client_id=F0XYIB113FEQQVQFFK5DGZ4V5PJBZA2DRNAXHFUW1G3UBE3N&client_secret=ZYY5PZ15D02DLZ0D3RGBADODPBC1KMKX4ZIQ4XNDNLUKBKEB&v=20140701&ll=" + cll + "&radius=1000&query=books&venuePhotos=1&limit=50";
    getBakeriesRequest = new XMLHttpRequest();
    if (!getBakeriesRequest) {
        alert('Giving up getBakeries:( Cannot create an XMLHTTP instance');
        return false;
    }
    getBakeriesRequest.onreadystatechange = processFrsqrBakeries;
    getBakeriesRequest.open('GET', foursquareQuery);
    getBakeriesRequest.send();
}
*/
function BakeryViewModel() {
    var self = this;
    self.bakeries = ko.observableArray([]);
}

// View Model for bookstore.  
function BookstoreViewModel() {
    var self = this;
    self.bookstores = ko.observableArray([]);
    self.bookstoreNames = ko.observableArray([]);
    self.selectedBookstoreNames = ko.observableArray([]); 
    self.searchText = ko.observable(); 
    self.filteredVenues = ko.observableArray([]); 

};

var bookstoreViewModel = new BookstoreViewModel();

// http://stackoverflow.com/questions/20857594/knockout-filtering-on-observable-array

//ko.applyBindings(bookstoreViewModel, document.getElementById('bookstoresList'));

var bakeryViewModel = new BakeryViewModel();

//ko.applyBindings(bakeryViewModel, document.getElementById('bakeriesList'));

ko.applyBindings(bookstoreViewModel, document.getElementById('bookstoresList'));
ko.applyBindings(bookstoreViewModel.searchText, document.getElementById('searchText'));

function indexOfVenue(element,index,array){
   var self = this;
   if (this.toLocaleString() === array[index]) {
     return true;
   } 
}
//searchText
function getSearchText(textBoxElem){

 var text = textBoxElem.value.toLowerCase();
  bookstoreViewModel.searchText(text);
  console.log(JSON.stringify(bookstoreViewModel.filteredVenues));
  //ko.applyBindings(bookstoreViewModel.filteredVenues(), document.getElementById('bookstoresList'));
  if(text !== ''){
  //bookstoreViewModel.bookstoreNames( bookstoreViewModel.bookstoreNames().map(function(item,index,array){
  bookstoreViewModel.filteredVenues( bookstoreViewModel.bookstoreNames().map(function(item,index,array){
       if(array[index].toLowerCase().startsWith(text)){
          return array[index];
       }
    })); 
  }
  else{

     bookstoreViewModel.filteredVenues(bookstoreViewModel.bookstoreNames());

  }

  console.log(JSON.stringify( bookstoreViewModel.filteredVenues())); 


/*  console.log(JSON.stringify( bookstoreViewModel.bookstoreNames().map(function(item,index,array){
       if(array[index].toLowerCase().startsWith(text)){
          return array[index];
       }
    }) )); */

};

function displaySelection(){
// http://stackoverflow.com/questions/610336/retrieving-the-text-of-the-selected-option-in-select-element
  var self = this;
  var elem = document.getElementById('bookstoresList');
    if (elem.selectedIndex == -1)
        return null;
  var numSelected = bookstoreViewModel.selectedBookstoreNames().length;
  for (var i=0; i < numSelected; i++){
    var elem = bookstoreViewModel.selectedBookstoreNames()[i];
    // find the index in bookstores array corresponding to elem.
    var ind = bookstoreViewModel.bookstoreNames().findIndex(indexOfVenue,elem);
    console.log(ind);
  }
   // animate this marker.
}


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
