$(window).on("load", function(){  // Waits until HTML is loaded before proceeding with the rest
    $('#mainPage').css('opacity', '.3');
    var latitude;
    var longitude;
    var restaurantsArray = [];
    var radius;
    var zipCode;
    var counter = 0;

// Button to reload page
$('#reroll').on("click", function() {
    if (eliminated.length == 4) {
        location.reload();
        console.log("restart")
    }
});

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
    for (var i=0; i<=4; i++) {
        console.log("Counter:" + counter);
        if ($('.option-' + counter + ' .cardclass').attr('data-state') == "chooseRestaurant" ) {
            $('.option-' + counter).attr('search-result', counter);
            $('.option-' + counter + ' h3').text(restaurantsArray[counter].restaurant.name);
            $('.option-' + counter + ' img').attr('src', restaurantsArray[counter].restaurant.featured_image)
            $('.option-' + counter).append('<h4 id="cuisines">' + restaurantsArray[counter].restaurant.cuisines + '</h4>').append('<h4 id="rating">Rating: ' + restaurantsArray[counter].restaurant.user_rating.aggregate_rating + '&nbsp;&nbsp;<span class="glyphicon glyphicon-star-empty"></span></h4>');
            counter++
        }
    }
}

function reRoll() {
    console.log("reRoll has been fired!");
    z=0;
    j=0;
    for (z=0; z<=4; z++) {
        console.log("z = " + z);
        console.log("Counter:" + counter);
        if ($('.option-' + z + ' .cardclass').attr('data-state') == "chooseRestaurant" ) {     
            $('.option-' + z).attr('search-result', counter);
        }
        for (j=0; j<=4; j++) {
            if ($('.option-' + z).attr('search-result') == counter ) { 
                console.log("New Resturant if state is true! Counter:" + counter);
                $('.option-' + z + ' h3').text(restaurantsArray[counter].restaurant.name);
                $('.option-' + z + ' img').attr('src', restaurantsArray[counter].restaurant.featured_image)
                $('.option-' + z + ' #cuisines').text(restaurantsArray[counter].restaurant.cuisines)
                $('.option-' + z + ' #rating').html('Rating: ' + restaurantsArray[counter].restaurant.user_rating.aggregate_rating + '&nbsp;&nbsp;<span class="glyphicon glyphicon-star-empty">');
                console.log('Next restaurant: ' + restaurantsArray[counter].restaurant.name);  
            }
        }
        counter++;
    }
}
  
// Reroll options function
$("#reroll").on("click", reRoll);

// Closes the search Modal
$(".close").on("click", function() {
    $("#searchModal").hide();
});

// Opens the search Modal
$(".open").on("click", function() {
    $("#searchModal").show();
});

// Prevents user input for zip code to be anything other than numbers or a length more than 5
$("#zipCodeText").keyup(function (){
    var theKeyCode = event.keyCode;
    var str = $("#zipCodeText").val();
    if (theKeyCode >= 48 && theKeyCode <= 57 && str.length < 6|| theKeyCode >= 96 && theKeyCode <= 105 && str.length < 6) {
    }   
    else {
        str = str.substring(0, str.length - 1);
        $("#zipCodeText").val(str)
    }
})
 
// Submits the results of the search Modal and hides it
$("#readyBtn").on("click", function() {
    restaurantsArray = [];
    radius = $("#radiusBtn").attr("value") * 8050;
    var zipCode = $("#zipCodeText").val();
    var chosenRadius = $("#radiusBtn").val()
    var selectedRadius = parseInt(chosenRadius)

    if (($('#nearMeBtn').is(':checked') || ($('#zipCodeBtn').is(':checked') && zipCode.length == 5)) && selectedRadius > 0 ) {
        $("#searchModal").removeClass().addClass("modal show zoomOut animated");
        $(".modal-title").html("Find Yahptions");
        $(".float-bubble").hide();
        if ($("#nearMeBtn").is(':checked')) {
            getLatLongbyNearme();
        } else {
            getLatLongbyZipcode();
        }
    }
    else if ($("#nearMeBtn").is(':checked') || $('#zipCodeBtn').is(':checked') && zipCode.length == 5) {
        $(".modal-title").html("Find Yahptions --- Choose a <strong>Radius</strong>");
    }

    else if ($('#zipCodeBtn').is(':checked') && selectedRadius >= 1) {
        $(".modal-title").html("Find Yahptions --- <strong>Zip Code</strong> must have 5 digits");
    }

    else if (selectedRadius >= 1) {
        $(".modal-title").html("Find Yahptions --- Choose <strong>Near Me</strong> or <strong>Zip Code</strong>");
    }

    else if ($('#zipCodeBtn').is(':checked')) {
        $(".modal-title").html("Find Yahptions --- <strong>Zip Code</strong> must have 5 digits and a <strong>Radius</strong> must be selected");
    }

    else {
        $(".modal-title").html("Find Yahptions --- Choose <strong>Near Me</strong> or <strong>Zip Code</strong> and a <strong>Radius</strong>");
    }
})
  
// Opens search modal
$("#showModal").on("click", function() {
    $("#searchModal").removeClass().addClass("modal show zoomInDown animated");
    $('#mainPage').css('opacity', '.3');
});
  
// Hides search modal
$("#hideModal").on("click", function() {
    $("#searchModal").removeClass().addClass("modal show zoomOut animated");
    $('#mainPage').css('opacity', 'unset');
});
  
// Closes the chosen restaurant Modal
$(".closeUserSelection").on("click", function() {
    $("#userSelection").removeClass().addClass("modal show zoomOut animated");
    $('#mainPage').css('opacity', 'unset');
});
  
// Variables to keep track of chosen and eliminated phases
var chosen = [];
var eliminated = [];
  
// Choose and eliminate function...
$(".cardclass").on("click", function() {
    var state = $(this).attr("data-state");
    var eliminationRules = "Great! You've overcome the hardest part. Now, save that friendship and start by eliminating one at a time. Start with what you least desire...<small><small><small>or if you want to start a war, eliminate the one you know your friend really really wants.</small></small></small>"
    
    if (state ==="chooseRestaurant") { // Locks in option
        chosen.push("x");
        $(this).attr("data-state", "lockedin");
        $(this).addClass("borderchosen");
        console.log(chosen)
        if (chosen.length == 5) {
            $(".rules").html(eliminationRules)
            $("#reroll").hide()
        }
    }
    else if (eliminated.length == 4 && state === "lockedin") { // Shows the information on click of last restaurant
        $("#userSelection").removeClass().addClass("modal show zoomInDown animated");
        $('#mainPage').css('opacity', '.3');
    }
    else if (state ==="lockedin" && chosen.length == 5 && eliminated.length < 5) { // Eliminates option...
        eliminated.push("x");
        $(this).css("opacity", "0.2");
        $(this).removeClass("borderchosen");
        $(this).removeClass("handpointer");
        $(this).addClass("bordereliminated");
        $(this).attr("data-state", "eliminated");
        if (eliminated.length == 4) {
            $("#userSelection").removeClass().addClass("modal show zoomInDown animated");
            $('#mainPage').css('opacity', '.3');
            $("#reroll").show();
            $("#reroll").text("Restart");
        }
    }
})
  
// Shows user on hover what they're about to lockin
$(".cardclass").hover(function(){
    var state = $(this).attr("data-state");
        if (state ==="chooseRestaurant") {
            $(this).addClass("borderchosen");
        }
    },
    function () {
        var state = $(this).attr("data-state");
        if (state ==="chooseRestaurant") {
            $(this).removeClass("borderchosen");
        }
    }
);
  
// Shows user on hover what they're about to eliminate
$(".cardclass").hover(function(){
    var state = $(this).attr("data-state");
        if (state ==="lockedin" && eliminated.length < 4 && chosen.length == 5) {
            $(this).addClass("bordereliminated");
        }
    },
    function () {
        var state = $(this).attr("data-state");
        if (state ==="lockedin" && eliminated.length < 4 && chosen.length == 5) {
            $(this).removeClass("bordereliminated");
        }
    }
);
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