onmessage = function(results) {
    var Yelp = require('yelp');

    var yelp = new Yelp({
        consumer_key: 'cLugER9EE9TPSmeZBmyDOg',
        consumer_secret: 'ugcK8TG7Sy-5rg79sZu0F8v4w1k',
        token: 's2DvGjNFHvYvoMZx51thMTkMBgUTFuHA',
        token_secret: 'CtMBd1oYFsU3QlXLctsi69rbOaA',
    });

    // See http://www.yelp.com/developers/documentation/v2/search_api

    for (var i = 0; i < results.length; i++)
}
yelp.search({
        term: 'bakeries',
        location: 'Montreal',
        cll:
    })
    .then(function(data) {
        console.log(data);
    })
    .catch(function(err) {
        console.error(err);
    });

}


console.log('Message received from main script');
var workerResult = 'Result: ' + (e.data[0] * e.data[1]);
console.log('Posting message back to main script');
postMessage(workerResult);

}
