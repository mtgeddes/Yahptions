$(window).on("load", function(){  // Waits until HTML is loaded before proceeding with the rest
    var latitude;
    var longitude;
    var restaurantsArray = [];
    var radius;
    console.log("Latitude: " + latitude);
    console.log("Longitude: " + longitude);

function getLatLongbyZipcode() {
    // Fire the api call to convert zipcode to latitude + longitude
    var zipCode = "28078"  // Placeholder; later update this to $("#zipCode").val().trim();
    var geocoder = new google.maps.Geocoder();
    geocoder.geocode( { "address": zipCode }, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK && results.length > 0) {
            var location = results[0].geometry.location, latitude  = location.lat(), longitude = location.lng();
            console.log("Latitude: " + latitude);
            console.log("Longitude: " + longitude);
            getRestaurants();
        }
    });
}
getLatLongbyZipcode();
    
function getLatLongbyNearme() {
     // Begin Ipdata api call; display current zip code
     var geocodeURL = "https://api.ipdata.co";
     $.ajax({  // Fire the api call to get the restaurants
        url: geocodeURL,
        dataType: 'json',
        async: true,
        success: function(data) {
            var latitude = data.latitude, longitude = data.longitude;
            console.log("Latitude: " + latitude);
            console.log("Longitude: " + longitude);
            getRestaurants();
        }
    });
}

getLatLongbyNearme();

function getRestaurants() {
    // Begin Zomato restaurants api call; display restaurants nearby current longitude + latitude
    var apiKey = "aabf39b370ad7219908488f6fbaa652c";
    var locationType = "city";
    var page1 = 0;
    var page2 = 20;
    var searchURL =  "https://developers.zomato.com/api/v2.1/search?"
                    + "user-key=" + apiKey 
                    + "&lat=" + latitude
                    + "&lon=" + longitude
                    + "&radius=" + radius
    var zomatoURL1 = searchURL + "&start=" + page1;
    var zomatoURL2 = searchURL + "&start=" + page2;

    $.ajax({  // Fire the api call to get the restaurants; page 1
        url: zomatoURL1,
        dataType: 'json',
        async: true,
        beforeSend: function(xhr){xhr.setRequestHeader('user-key', 'aabf39b370ad7219908488f6fbaa652c');},  // This inserts the api key into the HTTP header
        success: function(data1) {  // Then do the following...
            for (i = 0; i < data1.restaurants.length; i++) {
                restaurantsArray.push(data1.restaurants[i]);
            }

            $.ajax({  // Fire the api call to get the restaurants; page 2
                url: zomatoURL2,
                dataType: 'json',
                async: true,
                beforeSend: function(xhr){xhr.setRequestHeader('user-key', 'aabf39b370ad7219908488f6fbaa652c');},  // This inserts the api key into the HTTP header
                success: function(data2) {  // Then do the following...
                    for (i = 0; i < data2.restaurants.length; i++) {
                        restaurantsArray.push(data2.restaurants[i]);
                    }
                }
            });
        }
    });
}

// Closes the search Modal
$(".close").on("click", function () {
    $("#searchModal").hide();
});

// Opens the search Modal
$(".open").on("click", function () {
    $("#searchModal").show();
});

// Submits the results of the search Modal and hides it
$("#readyBtn").on("click", function () {
    $("#searchModal").hide();

    restaurantsArray = [];
    radius = $("#radiusBtn").attr("value") * 8050;
    

    if ($("#nearMeBtn").val() == "checked") {
        getLatLongbyNearme();
    } else {
        getLatLongbyZipcode();
    }
})

console.log(restaurantsArray);

});


