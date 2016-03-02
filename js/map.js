//https://developers.google.com/places/javascript/
//https://developers.google.com/maps/documentation/javascript/places#placeid

// Link to google api-key for the MapP5 project 
// https://console.developers.google.com/apis/credentials?project=mapp5-1232

// https://maps.googleapis.com/maps/api/place/radarsearch/json?location=48.859294,2.347589&radius=5000&type=cafe&keyword=vegetarian&key=YOUR_API_KEY

function initialize() {

    // Create a map to show the results, and an info window to
    // pop up if the user clicks on the place marker.
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

    var placeRequest = {
        location: sfo,
        radius: '500',
        query: 'fisherman\'s wharf sanfrancisco'
    };

    service.textSearch(placeRequest, getPlaceID);


    function createMarker(place) {
        var placeLoc = place.geometry.location;
        var marker = new google.maps.Marker({
            map: map,
            position: place.geometry.location
        });

        google.maps.event.addListener(marker, 'click', function() {
            infowindow.setContent(place.name);
            infowindow.open(map, this);
        });
    }

    var nearbyResults = {
        allResults : {
            bakeries: ko.observableArray([]),
            bookstores: ko.observableArray([]),
            parkingLots: ko.observableArray([])
        }
        /*self.saveBakeries = function(results) {
            self.allResults.bakeries = results;
        };
        self.saveBookstores = function(results) {
            self.allResults.bookstores = results;
        };
        self.saveParking = function(results) {
            self.allResults.parkingLots = results;
        }; */
        /* self.displayResults = function() {
            // create div with class row for each set of results,
            // then a div with class column with
            var rowDiv = document.createElement("div");
            rowDiv.className = "row";
            var columnDiv = document.createElement("div");
            columnDiv.className = "small 12-columns large 6-columns";
            rowDiv.appendChild(columnDiv); // append the columnDiv as a child of the rowDiv.
            var ulElement = document.createElement("ul");
            ulElement.className = "inline-list";
            columnDiv.appendChild(ulElement); // append the columnDiv as a child of the rowDiv. 
            for (var i = 0; i < self.allResults.bakeries.length; i++) {
                // create an li element for each result 
                // inside each li element create a p tag with the name of the location 
                var resultListItem = document.createElement("li");
                ulElement.appendChild(resultListItem);
                var listItem_P_Element = document.createElement("p");
                listItem_P_Element.innerText = self.allResults.bakeries[i].name;
                resultListItem.appendChild(listItem_P_Element);
            }
            // add the newly created element and its content into the DOM 
            var resultsDiv = document.getElementById("results");
            document.body.insertBefore(rowDiv, resultsDiv); 
        }; */

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
        //var resultsObj = new nearbyResults();
        ko.applyBindings(nearbyResults.allResults);

        function markBakeries(results, status) {
            if (status === google.maps.places.PlacesServiceStatus.OK) {
                //resultsObj.saveBakeries(results);
                //resultsObj.displayResults(results);
                nearbyResults.allResults.bakeries(results);
                for (var i = 0; i < results.length; i++) {
                    createMarker(results[i]);
                }
            }
        }

        function markBookstores(results, status) {
            if (status === google.maps.places.PlacesServiceStatus.OK) {
                //resultsObj.saveBookstores(results);
                nearbyResults.allResults.bookstores(results);
                for (var i = 0; i < results.length; i++) {
                    createMarker(results[i]);
                }
            }
        }

        function markParking(results, status) {
            if (status === google.maps.places.PlacesServiceStatus.OK) {
                //resultsObj.saveParking(results);
                //resultsObj.displayResults(results);
                nearbyResults.allResults.parkingLots(results);
                for (var i = 0; i < results.length; i++) {
                    createMarker(results[i]);
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

    function nearbyResults() {
        var self = this;
        self.allResults = {
            bakeries: ko.observableArray([]),
            bookstores: ko.observableArray([]),
            parkingLots: ko.observableArray([])
        };
        self.bakeries = ko.observableArray([]);
        self.saveBakeries = function(results) {
            self.allResults.bakeries = results;
        };
        self.saveBookstores = function(results) {
            self.allResults.bookstores = results;
        };
        self.saveParking = function(results) {
            self.allResults.parkingLots = results;
        };
        self.displayResults = function() {
            // create div with class row for each set of results,
            // then a div with class column with
            /*var rowDiv = document.createElement("div");
            rowDiv.className = "row";
            var columnDiv = document.createElement("div");
            columnDiv.className = "small 12-columns large 6-columns";
            rowDiv.appendChild(columnDiv); // append the columnDiv as a child of the rowDiv.
            var ulElement = document.createElement("ul");
            ulElement.className = "inline-list";
            columnDiv.appendChild(ulElement); // append the columnDiv as a child of the rowDiv.
            for (var i = 0; i < self.allResults.bakeries.length; i++) {
                // create an li element for each result
                // inside each li element create a p tag with the name of the location
                var resultListItem = document.createElement("li");
                ulElement.appendChild(resultListItem);
                var listItem_P_Element = document.createElement("p");
                listItem_P_Element.innerText = self.allResults.bakeries[i].name;
                resultListItem.appendChild(listItem_P_Element);
            }
            // add the newly created element and its content into the DOM
            var resultsDiv = document.getElementById("results");
            document.body.insertBefore(rowDiv, resultsDiv); */
        };

    }



// Run the initialize function when the window has finished loading.
google.maps.event.addDomListener(window, 'load', initialize);
