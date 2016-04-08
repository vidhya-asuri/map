# Foundation libsass template

This is a template to start your own project that uses Grunt and libsass!

## Requirements

You'll need to have the following items installed before continuing.

  * [Node.js](http://nodejs.org): Use the installer provided on the NodeJS website.
  * [Grunt](http://gruntjs.com/): Run `[sudo] npm install -g grunt-cli`
  * [Bower](http://bower.io): Run `[sudo] npm install -g bower`

## Quickstart

```bash
git clone git@github.com:zurb/foundation-libsass-template.git
npm install && bower install
```

While you're working on your project, run:

`grunt`

And you're set!

## Directory Structure

  * `scss/_settings.scss`: Foundation configuration settings go in here
  * `scss/app.scss`: Application styles go here



# Neighborhood map project

This is a one page application that displays points of interest (bookstores/related to books) located in a specific neighborhood.

> I plan to be add locations related to bakeries/food and others soon.

### Version
0.0.1


### How to use
When the page loads the application displays a full page map with markers showing hard-coded points of interest.
Clicking on the hamburger icon opens an off-canvas menu with two components:

> a text box to enter search text to filter location.

> a list view that displays names of locations that are displayed on the map.

Type some text into the box and the locations and markers should be filtered based on the search text.

For now, the starting characters in the search text is used as the filtering criterion 





### UI components.

This project uses Foundation with Grunt. 

The single page for this application consists of a title bar and a full page map with an off canvas menu to the left.
Clicking on the 'hamburger' icon pulls up a side-bar. The side-bar has a search text box and a list of points of interest. 

The list of points of interest and the markers on the map are updated based on the search text entered in the search text box. 

The marker icons are from Templatic - https://templatic.com/news/100-free-templatic-map-icons/


### APIs used

This application uses Google Maps and Foursquare APIs. 

### Code related stuff


> list.js 

* This file contains all the javascript needed to run the application.

The starting point is the ``` initialize ``` function.

The ``` initialize ``` function calls Google's Geocoder API to get location detaisl for 'Fisherman's wharf, SanFrancisco'

The location details from the Geocoder's results are passed to the ``` getBookstores ``` function which submits a request to Foursquare to search for bookstores. 

When the response from Foursquare succeeds, ``` processFrsqrBooks ``` is called with the response.

 ``` processFrsqrBooks ```  populates the ViewModel used by Knockout.
 
 
 ``` bookstoresDetailsMarkers ``` 
 * creates markers for points of interest.
 * sets up click handler for markers; click handler displays an infowindow when marker is clicked.
 
 
 
  ``` getSearchText ```  is called when the oninput event is triggered on the search text box.
  * This function updates 
    *  the list of locations displayed in the listivew (off-canvas menu)
    *  markers, so only markers for locations in the list view are displayed.
  

 
 ##### ViewModel.
 
 The View model consists of observable arrays for
 * names of locations 
 * list of lcoations that match the search text in the search textbox, containing a subset of the names of locations
 * list of markers.
 * the search text in the text box in the off canvas menu.
 








``` sh

//https://developers.google.com/places/javascript/
//https://developers.google.com/maps/documentation/javascript/places#placeid

// Link to google api-key for the MapP5 project 
// https://console.developers.google.com/apis/credentials?project=mapp5-1232

// https://maps.googleapis.com/maps/api/place/radarsearch/json?location=48.859294,2.347589&radius=5000&type=cafe&keyword=vegetarian&key=YOUR_API_KEY

var bakeriesMarkers = [];
//var bookstoresMarkers = [];
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
                        },
                        index: ''
                    }
                    frsqrItem.tips = items[i].tips;
                    frsqrItem.venue.name = items[i].venue.name;
                    frsqrItem.venue.venueUrl = items[i].venue.url;
                    frsqrItem.venue.lat = items[i].venue.location.lat;
                    frsqrItem.venue.lng = items[i].venue.location.lng;
                    frsqrItem.venue.index = i;
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
            icon: './templatic/books-media.png',
            position: latLng
        });

        bookstoreViewModel.markers.push(marker);
        bookstoreViewModel.filteredMarkers.push(marker);
        google.maps.event.addListener(marker, 'click', function() {
            var self = this;

            if (self.getAnimation() !== null) {
                self.setAnimation(null);
            } else {
                self.setAnimation(google.maps.Animation.BOUNCE);
            }

            content = content + "</br>";
            content = content + "<p> " + this.title + "</p>";
            content = content + "<img src=\"" + frsqrBookItems[this.id].venue.venuePhotoUrl + "\"/>";
            infowindow.setContent(content);
            infowindow.open(map, this);
            contentPhotoUrl = null;
            content = "";
        });
    }
}

function initialize() {
    // Create a map to show the results, and an info window to
    // pop up if the user clicks on the place marker.

    // Request for latitide and longitude of Fisherman's wharf, SanFrancisco, CA.
    var geocoder = new google.maps.Geocoder();
    var address = 'fisherman\'s wharf, sanfrancisco, CA, USA';
    //getBookstores(sfo);
    geocoder.geocode({
        'address': address
    }, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            geocoderSearchResult = results[0];
            map.setCenter(geocoderSearchResult.geometry.location);
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
    self.filteredMarkers = ko.observableArray([]);
    self.markers = ko.observableArray([]);

};

var bookstoreViewModel = new BookstoreViewModel();

// http://stackoverflow.com/questions/20857594/knockout-filtering-on-observable-array

//ko.applyBindings(bookstoreViewModel, document.getElementById('bookstoresList'));

var bakeryViewModel = new BakeryViewModel();

//ko.applyBindings(bakeryViewModel, document.getElementById('bakeriesList'));

ko.applyBindings(bookstoreViewModel, document.getElementById('bookstoresList'));
ko.applyBindings(bookstoreViewModel.searchText, document.getElementById('searchText'));

function indexOfVenue(element, index, array) {
    var self = this;
    if (this.toLocaleString() === array[index]) {
        return true;
    }
}
//searchText
function getSearchText(textBoxElem) {
    var text = textBoxElem.value.toLowerCase();
    bookstoreViewModel.searchText(text);
    console.log(JSON.stringify(bookstoreViewModel.filteredVenues));
    if (text !== '') {
        bookstoreViewModel.filteredVenues(bookstoreViewModel.bookstoreNames().map(function(item, index, array) {
            if (array[index].toLowerCase().startsWith(text)) {
                //bookstoreViewModel.filteredMarkers().push(bookstoreViewModel.markers()[index]);
                return array[index];
            }
            else{
                bookstoreViewModel.markers()[index].setMap(null); 
            }

        }));
    } else {
       for(var m = 0; m < bookstoreViewModel.markers().length; m++){ 
          bookstoreViewModel.markers()[m].setMap(map);
       }
          bookstoreViewModel.filteredVenues(bookstoreViewModel.bookstoreNames());
    }
    console.log(JSON.stringify(bookstoreViewModel.filteredVenues()));
};

function displaySelection() {
    // http://stackoverflow.com/questions/610336/retrieving-the-text-of-the-selected-option-in-select-element
    var self = this;
    var elem = document.getElementById('bookstoresList');
    if (elem.selectedIndex == -1)
        return null;
    var numSelected = bookstoreViewModel.selectedBookstoreNames().length;

    for (var i = 0; i < numSelected; i++) {
        var elem = bookstoreViewModel.selectedBookstoreNames()[i];
        // find the index in bookstores array corresponding to elem.
        var ind = bookstoreViewModel.bookstoreNames().findIndex(indexOfVenue, elem);
        console.log(ind);
        if ((ind >= 0) && (ind < bookstoreViewModel.markers().length)) {
            var currentMarker =  bookstoreViewModel.markers()[ind];
            currentMarker.setAnimation(google.maps.Animation.DROP);
            if (currentMarker.getAnimation() !== null) {
                currentMarker.setAnimation(null);
                currentMarker.setAnimation(google.maps.Animation.BOUNCE);
            } else {
                currentMarker.setAnimation(google.maps.Animation.BOUNCE);
            }
            /*var curLat = currentMarker.position.lat(); 
            var curLng = currentMarker.position.lng();
            newPath = [{lat: curLat+0.005, lng: curLng}, {lat: curLat, lng: curLng}];
            line.setPath(newPath);         
            animateCircle(line); */
        }
    }
    // animate this marker.
}

function animateCircle(line) {
    var count = 0;
    var intervalId = window.setInterval(function() {
        count = (count + 1) % 200;
        var icons = line.get('icons');
        icons[0].offset = (count / 2) + '%';
        line.set('icons', icons);
    }, 20);
    var timeoutId = window.setTimeout(stopAnimation, 10000, intervalId);
}

function stopAnimation(intervalId) {
    clearInterval(intervalId);
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
        for (var m = 0; m < bookstoreViewModel.markers().length; m++) {
            bookstoreViewModel.markers()[m].setMap(null);
        }
    } else {
        $('#bookstoresList').show();
        for (var m = 0; m < bookstoreViewModel.markers().length; m++) {
            bookstoreViewModel.markers()[m].setMap(map);
        }
    }
});

var getBooksRequest;
var getBakeriesRequest;
var bookPhotosRequest;
var bakeryPhotosRequest;


// Run the initialize function when the window has finished loading.
google.maps.event.addDomListener(window, 'load', initialize);

``` 
function.

Dillinger is currently extended with the following plugins

* Dropbox
* Github
* Google Drive
* OneDrive

Readmes, how to use them in your own application can be found here:

* [plugins/dropbox/README.md] [PlDb]
* [plugins/github/README.md] [PlGh]
* [plugins/googledrive/README.md] [PlGd]
* [plugins/onedrive/README.md] [PlOd]

### Development

Want to contribute? Great!

Dillinger uses Gulp + Webpack for fast developing.
Make a change in your file and instantanously see your updates!

Open your favorite Terminal and run these commands.

First Tab:
```sh
$ node app
```

Second Tab:
```sh
$ gulp watch
```

(optional) Third:
```sh
$ karma start
```

### Docker
Dillinger is very easy to install and deploy in a Docker container.

By default, the Docker will expose port 80, so change this within the Dockerfile if necessary. When ready, simply use the Dockerfile to build the image. 

```sh
cd dillinger
docker build -t <youruser>/dillinger:latest .
```
This will create the dillinger image and pull in the necessary dependencies. Once done, run the Docker and map the port to whatever you wish on your host. In this example, we simply map port 80 of the host to port 80 of the Docker (or whatever port was exposed in the Dockerfile):

```sh
docker run -d -p 80:80 --restart="always" <youruser>/dillinger:latest
```

Verify the deployment by navigating to your server address in your preferred browser.

### N|Solid and NGINX

More details coming soon.

#### docker-compose.yml

Change the path for the nginx conf mounting path to your full path, not mine!

### Todos

 - Write Tests
 - Rethink Github Save
 - Add Code Comments
 - Add Night Mode

License
----

MIT


**Free Software, Hell Yeah!**

[//]: # (These are reference links used in the body of this note and get stripped out when the markdown processor does its job. There is no need to format nicely because it shouldn't be seen. Thanks SO - http://stackoverflow.com/questions/4823468/store-comments-in-markdown-syntax)


   [dill]: <https://github.com/joemccann/dillinger>
   [git-repo-url]: <https://github.com/joemccann/dillinger.git>
   [john gruber]: <http://daringfireball.net>
   [@thomasfuchs]: <http://twitter.com/thomasfuchs>
   [df1]: <http://daringfireball.net/projects/markdown/>
   [marked]: <https://github.com/chjj/marked>
   [Ace Editor]: <http://ace.ajax.org>
   [node.js]: <http://nodejs.org>
   [Twitter Bootstrap]: <http://twitter.github.com/bootstrap/>
   [keymaster.js]: <https://github.com/madrobby/keymaster>
   [jQuery]: <http://jquery.com>
   [@tjholowaychuk]: <http://twitter.com/tjholowaychuk>
   [express]: <http://expressjs.com>
   [AngularJS]: <http://angularjs.org>
   [Gulp]: <http://gulpjs.com>

   [PlDb]: <https://github.com/joemccann/dillinger/tree/master/plugins/dropbox/README.md>
   [PlGh]:  <https://github.com/joemccann/dillinger/tree/master/plugins/github/README.md>
   [PlGd]: <https://github.com/joemccann/dillinger/tree/master/plugins/googledrive/README.md>
   [PlOd]: <https://github.com/joemccann/dillinger/tree/master/plugins/onedrive/README.md>




