$(window).on("load", function(){  // Waits until HTML is loaded before proceeding with the rest
    $('#mainPage').css('opacity', '.3');
    var latitude;
    var longitude;
    var restaurantsArray = [];
    var radius;
    var zipCode;

function getLatLongbyZipcode() {
    $('#mainPage').css('opacity', 'unset');
    console.log("getLatLongbyZipcode has been fired!");
    // Fire the api call to convert zipcode to latitude + longitude
    zipCode = $('#zipCodeText').val();  // Placeholder; later update this to $("#zipCode").val().trim();
    var geocoder = new google.maps.Geocoder();
    geocoder.geocode( { "address": zipCode }, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK && results.length > 0) {
            latitude  = results[0].geometry.location.lat(), longitude = results[0].geometry.location.lng();
            console.log("Latitude: " + latitude);
            console.log("Longitude: " + longitude);
            console.log("Zip Code:" + zipCode);
            getRestaurants();
        }
    });
}

function getLatLongbyNearme() {
    $('#mainPage').css('opacity', 'unset');
     // Begin Ipdata api call; display current zip code
     var geocodeURL = "https://api.ipdata.co";
     $.ajax({  // Fire the api call to get the restaurants
        url: geocodeURL,
        dataType: 'json',
        async: true,
        success: function(data) {
            latitude = data.latitude, longitude = data.longitude;
            console.log("Latitude: " + latitude);
            console.log("Longitude: " + longitude);
            getRestaurants();
        }
    });
}

function getRestaurants() {
    console.log("getRestaurants has been fired!");
    console.log("Latitude: " + latitude);
    console.log("Longitude: " + longitude);
    // Begin Zomato restaurants api call; display restaurants nearby current longitude + latitude
    radius = $('#radiusBtn').val();
    var apiKey = "aabf39b370ad7219908488f6fbaa652c";
    var locationType = "city";
    var page1 = 0;
    var page2 = 20;
    var searchURL =  "https://developers.zomato.com/api/v2.1/search?"
                    //+ "user-key=" + apiKey 
                    + "&lat=" + latitude
                    + "&lon=" + longitude
                    + "&radius=" + parseInt(radius / 0.00062137) * 1.24  // convert miles to meters with a min of 2,000 M
    var zomatoURL1 = searchURL + "&start=" + page1;
    var zomatoURL2 = searchURL + "&start=" + page2;

    $.ajax({  // Fire the api call to get the restaurants; page 1
        url: zomatoURL1,
        dataType: 'json',
        async: true,
        beforeSend: function(xhr){xhr.setRequestHeader('user-key', 'aabf39b370ad7219908488f6fbaa652c');},  // This inserts the api key into the HTTP header
        success: function(data1) {  // Then do the following...
            console.log(zomatoURL1);
            for (i = 0; i < data1.restaurants.length; i++) {
                restaurantsArray.push(data1.restaurants[i]);
            }

            $.ajax({  // Fire the api call to get the restaurants; page 2
                url: zomatoURL2,
                dataType: 'json',
                async: true,
                beforeSend: function(xhr){xhr.setRequestHeader('user-key', 'aabf39b370ad7219908488f6fbaa652c');},  // This inserts the api key into the HTTP header
                success: function(data2) {  // Then do the following...
                    console.log(zomatoURL2);
                    for (i = 0; i < data2.restaurants.length; i++) {
                        restaurantsArray.push(data2.restaurants[i]);
                    }
                    console.log(restaurantsArray);
                    displayRestaurants();
                }
            });
        }
    });
}

function displayRestaurants() {
    console.log("displayRestaurants has been fired!");
    var counter = 0;
    for (i=0; i<=4; i++) {
        $('.option-' + i).attr('search-result', i);
        $('.option-' + i + ' h3').text(restaurantsArray[i].restaurant.name);
        $('.option-' + i + ' img').attr('src', restaurantsArray[i].restaurant.featured_image)
        $('.option-' + i).append('<h4>' + restaurantsArray[i].restaurant.cuisines + '</h4>').append('<h4>Rating: ' + restaurantsArray[i].restaurant.user_rating.aggregate_rating + '&nbsp;&nbsp;<span class="glyphicon glyphicon-star-empty"></span></h4>');

    }
}

// Closes the search Modal
$(".close").on("click", function() {
    $("#searchModal").hide();
});

// Opens the search Modal
$(".open").on("click", function() {
    $("#searchModal").show();
});

// Submits the results of the search Modal and hides it
$("#readyBtn").on("click", function() {
    $("#searchModal").removeClass().addClass("modal show zoomOut animated");

    restaurantsArray = [];
    radius = $("#radiusBtn").attr("value") * 8050;
    
    if ($("#nearMeBtn").is(':checked')) {
        getLatLongbyNearme();
    } else {
        getLatLongbyZipcode();
    }
})

$("#showModal").on("click", function() {
    $("#searchModal").removeClass().addClass("modal show zoomInDown animated");
    $('#mainPage').css('opacity', '.3');
});

$("#hideModal").on("click", function() {
    $("#searchModal").removeClass().addClass("modal show zoomOut animated");
    $('#mainPage').css('opacity', 'unset');
});

// Variables to keep track of chosen and eliminated phases
var chosen = [];
var eliminated = [];

function searchrestaurants () {

}

// Choose and eliminate function...
$(".cardclass").on("click", function() {

    var state = $(this).attr("data-state");
    
    if (state ==="chooseRestaurant") {
        chosen.push("x");
        $(this).attr("data-state", "lockedin");
        $(this).addClass("borderchosen");
        console.log(chosen)
    }

    else if (state ==="lockedin" && chosen.length == 5) {
        eliminated.push("x");
        $(this).css("opacity", "0.2");
        $(this).removeClass("borderchosen");
        $(this).addClass("bordereliminated");
        if (eliminated.length == 4) {
            chosen = []; 
            eliminated = [];
            $("#userSelection").removeClass().addClass("modal show zoomInDown animated");
            $('#mainPage').css('opacity', '.3');
            // need to add a clear roll options (maybe)
        }
    }
})

// Closes final chosen restaurant modal
$(".closeUserSelection").on("click", function() {
    $("#userSelection").removeClass().addClass("modal show zoomOut animated");
    $('#mainPage').css('opacity', 'unset');
});


        ////////////////////////////////////////////////////
        //////////// Local storage of favorites ////////////
        //////////////////////////////////////////////////// 

// Creates variable for existing array in storage
var favoriteList = JSON.parse(localStorage.getItem("favoriteRestaurants"));

// creates local empty favorite list if one doesn't already exist
if (!Array.isArray(favoriteList)) {
    favoriteList = [];
  }

// Puts favorites on page
function putFavoritesOnPage() {
    $("#favorites").empty(); // empties out the html
    var insidefavoriteList = JSON.parse(localStorage.getItem("favoriteRestaurants"));

    if (!Array.isArray(insidefavoriteList)) {
        insidefavoriteList = [];
    }
    for (var i = 0; i < insidefavoriteList.length; i++) {
        var p = $("<p>").text(insidefavoriteList[i]);
        // [Create Later] will need an element created for each piece of data we want from restaurant
        // I think it will look like this: 
        // "insidefavoriteList[i].[i]"
        // "insidefavoriteList[i].[i+1]"
        // "insidefavoriteList[i].[i+2]"
        var b = $("<button class='delete'>").text("x").attr("data-index", i);
        p.prepend(b);
        $("#favorites").append(p);
    }
}

putFavoritesOnPage();

// Deletes past favorites
$(document).on("click", "button.delete", function() {
    var restaurantList = JSON.parse(localStorage.getItem("favoriteRestaurants"));
    var currentIndex = $(this).attr("data-index");

    // Deletes the item marked for deletion
    restaurantList.splice(currentIndex, 1);
    favoriteList = restaurantList;

    localStorage.setItem("favoriteRestaurants", JSON.stringify(restaurantList));

    putFavoritesOnPage();
});


// Makes a restaurant a favorite
$(".heart").on("click", function(event) {
    event.preventDefault();
    // [Create Later] Need to create an array that will store multiple restaurant data attributes (i.e. name, website, phone, etc). 
    var fav = $(this).text(); // [Create Later] Will need to change this to where restaurant name is located on HTML
    // [Create Later] 
    favoriteList.push(fav); // Will want it to push array of array
    localStorage.setItem("favoriteRestaurants", JSON.stringify(favoriteList));

    putFavoritesOnPage();
});



}); // <--end of on page load. 


