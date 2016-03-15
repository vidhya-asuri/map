var oauthSignature = require('oauth-signature');
var https = require('https');
var consumerSecret = 'ugcK8TG7Sy-5rg79sZu0F8v4w1k',
    tokenSecret = 'CtMBd1oYFsU3QlXLctsi69rbOaA',
    url = 'https://api.yelp.com/v2/search/';
var xmlHttpRequest;

//onmessage = function(results) {
var results = [1];

function myFunc(results) {

    for (var i = 0; i < results.length; i++) {
        var httpMethod = 'GET',
            parameters = {
                oauth_consumer_key: 'cLugER9EE9TPSmeZBmyDOg',
                oauth_token: 's2DvGjNFHvYvoMZx51thMTkMBgUTFuHA',
                oauth_nonce: Math.random().toString(36),
                oauth_timestamp: Date.now(),
                oauth_signature_method: 'HMAC-SHA1',
                oauth_version: '1.0',
            };
        // generates a RFC 3986 encoded, BASE64 encoded HMAC-SHA1 hash
        encodedSignature = oauthSignature.generate(httpMethod, url, parameters, consumerSecret, tokenSecret),
            // generates a BASE64 encode HMAC-SHA1 hash
            signature = oauthSignature.generate(httpMethod, url, parameters, consumerSecret, tokenSecret, {
                encodeSignature: false
            });

        console.log(encodedSignature);
        console.log(parameters.oauth_nonce);

        var path = url + "?term=food&location=San+Francisco&oauth_consumer_key=" + parameters.oauth_consumer_key +
            "&oauth_nonce=" + parameters.oauth_nonce +
            "&oauth_signature=" + encodedSignature  + "&oauth_signature_method=HMAC-SHA1" +
            "&oauth_timestamp=" + parameters.oauth_timestamp +
            "&oauth_token=" + parameters.oauth_token +
            "&oauth_version=1.0" ; 


        https.get(path , (res) => {
            console.log('statusCode: ', res.statusCode);
            console.log('headers: ', res.headers);

            res.on('data', (d) => {
                process.stdout.write(d);
            });
        }).on('error', (e) => {
            console.error(e);
        });

        /* var request = url + "?" + "&oauth_consumer_key=" + parameters.oauth_consumer_key + 
                                  "&oauth_token=" + parameters.oauth_token + 
                                  "&oauth_signature_method=HMAC-SHA1&oauth_signature=" + encodedSignature +  
                                  "&oauth_timestamp=" + parameters.oauth_timestamp + 
                                  "&oauth_nonce=" + parameters.oauth_nonce + 
                                  "&oauth_version=1.0";
         xmlHttpRequest = new XMLHttpRequest(); 
         xmlHttpRequest.onreadystatechange = processYelp; 
         xmlHttpRequest.open('GET', request, true);
         xmlHttpRequest.send(null); */
    }

};

function processYelp() {
    console.log("in processYelp");
    if (xhr.readyState == XMLHttpRequest.DONE) {
        console.log(xhr.responseText);
    }

}

myFunc(results);

/*
http://photos.example.net/photos?file=vacation.jpg&size=original&oauth_consumer_key=dpf43f3p2l4k3l03&oauth_token=nnch734d00sl2jdk&oauth_signature_method=HMAC-SHA1&oauth_signature=tR3%2BTy81lMeYAr%2FFid0kMTYa%2FWM%3D&oauth_timestamp=1191242096&oauth_nonce=kllo9940pd9333jh&oauth_version=1.0
*/
