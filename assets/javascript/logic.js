$(window).on("load", function(){  // Waits until HTML is loaded before proceeding with the rest

$('#option-cards').hide();
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

//////////////////////////////////////////////////
//// Begin API Calls and organize gather info ////
//////////////////////////////////////////////////

// Get lattitude by zipcode
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

// Get logitude by zipcode
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

// Get restaurants from API
function getRestaurants() {
    $('#option-cards').hide();
    console.log("getRestaurants has been fired!");
    console.log("Latitude: " + latitude);
    console.log("Longitude: " + longitude);
    // Begin Zomato restaurants api call; display restaurants nearby current longitude + latitude
    radius = $('#radiusBtn').val();
    var apiKey = "aabf39b370ad7219908488f6fbaa652c";
    var locationType = "city";
    var page1 = 0;
    var page2 = 20;
    var page3 = 40;
    var page4 = 60;
    var page5 = 80;
    var searchURL =  "https://developers.zomato.com/api/v2.1/search?"
                    //+ "user-key=" + apiKey 
                    + "&lat=" + latitude
                    + "&lon=" + longitude
                    + "&radius=" + parseInt(radius / 0.00062137) * 1.24  // convert miles to meters with a min of 2,000 M
    var zomatoURL1 = searchURL + "&start=" + page1;
    var zomatoURL2 = searchURL + "&start=" + page2;
    var zomatoURL3 = searchURL + "&start=" + page3;
    var zomatoURL4 = searchURL + "&start=" + page4;
    var zomatoURL5 = searchURL + "&start=" + page5;
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
                }
            });
            $.ajax({  // Fire the api call to get the restaurants; page 3
                url: zomatoURL3,
                dataType: 'json',
                async: true,
                beforeSend: function(xhr){xhr.setRequestHeader('user-key', 'aabf39b370ad7219908488f6fbaa652c');},  // This inserts the api key into the HTTP header
                success: function(data3) {  // Then do the following...
                    console.log(zomatoURL3);
                    for (i = 0; i < data3.restaurants.length; i++) {
                        restaurantsArray.push(data3.restaurants[i]);
                    }
                    console.log(restaurantsArray);
                }
            });
            $.ajax({  // Fire the api call to get the restaurants; page 4
                url: zomatoURL4,
                dataType: 'json',
                async: true,
                beforeSend: function(xhr){xhr.setRequestHeader('user-key', 'aabf39b370ad7219908488f6fbaa652c');},  // This inserts the api key into the HTTP header
                success: function(data4) {  // Then do the following...
                    console.log(zomatoURL4);
                    for (i = 0; i < data4.restaurants.length; i++) {
                        restaurantsArray.push(data4.restaurants[i]);
                    }
                    console.log(restaurantsArray);
                }
            });
            $.ajax({  // Fire the api call to get the restaurants; page 5
                url: zomatoURL5,
                dataType: 'json',
                async: true,
                beforeSend: function(xhr){xhr.setRequestHeader('user-key', 'aabf39b370ad7219908488f6fbaa652c');},  // This inserts the api key into the HTTP header
                success: function(data5) {  // Then do the following...
                    console.log(zomatoURL5);
                    for (i = 0; i < data5.restaurants.length; i++) {
                        restaurantsArray.push(data5.restaurants[i]);
                    }
                    console.log(restaurantsArray);
                }
            });
            displayRestaurants();
        }
    });
}

// Load restaurants information onto page
function displayRestaurants() {
    console.log("displayRestaurants has been fired!");
    for (let i = restaurantsArray.length - 1; i > 0; i--) {   // Shuffles the restaurant array
        let j = Math.floor(Math.random() * (i + 1));
        [restaurantsArray[i], restaurantsArray[j]] = [restaurantsArray[j], restaurantsArray[i]];
    }
    chosen = [];
    eliminated = [];
    counter = 0;
    $("#reroll").show();
    $('#reroll-message').hide();
    for (var i=0; i<=4; i++) {
        console.log("Counter:" + i);
        $('.option-' + i).attr('search-result', i);
        $('.option-' + i).removeClass('borderchosen').removeClass('bordereliminated').addClass('handpointer').css('opacity','unset');
        $('.option-' + i).attr('data-state', 'chooseRestaurant');
        $('.option-' + i + ' .cardclass h3.restaurantName').text(restaurantsArray[i].restaurant.name);
        if (restaurantsArray[i].restaurant.featured_image == "") {
            $('.option-' + i + ' img').attr('src', './assets/images/featured_image.jpg');
        } else {
            $('.option-' + i + ' img').attr('src', restaurantsArray[i].restaurant.featured_image);
        }
        $('.option-' + i + ' h4#cuisines').text(restaurantsArray[i].restaurant.cuisines);
        $('.option-' + i + ' h4#rating').html('Rating: ' + restaurantsArray[i].restaurant.user_rating.aggregate_rating + '&nbsp;&nbsp;<span class="glyphicon glyphicon-star-empty"></span>');
        $('.heartBtn-' + i).attr("data-name", restaurantsArray[i].restaurant.name).attr("data-url", restaurantsArray[i].restaurant.url);

        $('#infoModal-' + i + ' h3#infoName').text(restaurantsArray[i].restaurant.name);
        if (restaurantsArray[i].restaurant.featured_image == "") {
            $('#infoModal-' + i + ' img#infoImg').attr('src', './assets/images/featured_image.jpg');
        } else {
            $('#infoModal-' + i + ' img#infoImg').attr('src', restaurantsArray[i].restaurant.featured_image);
        }
        $('#infoModal-' + i + ' h4#infoRating').html('Rating: ' + restaurantsArray[i].restaurant.user_rating.aggregate_rating + '&nbsp;&nbsp;<span class="glyphicon glyphicon-star-empty"></span>');
        if (restaurantsArray[i].restaurant.user_rating.aggregate_rating < 2.9) {
            $('#infoModal-' + i + ' h4#infoRating').css('color', 'red');
        } else if (restaurantsArray[i].restaurant.user_rating.aggregate_rating < 3.9) {
            $('#infoModal-' + i + ' h4#infoRating').css('color', 'orange');
        } else if (restaurantsArray[i].restaurant.user_rating.aggregate_rating <= 5) {
            $('#infoModal-' + i + ' h4#infoRating').css('color', 'darkgreen');
        }
        $('#infoModal-' + i + ' h4#infoRating').html('Rating: ' + restaurantsArray[i].restaurant.user_rating.aggregate_rating + '&nbsp;&nbsp;<span class="glyphicon glyphicon-star-empty"></span>');
        $('#infoModal-' + i + ' h4#infoCuisines').text(restaurantsArray[i].restaurant.cuisines);
        $('#infoModal-' + i + ' h4#infoAddress').text(restaurantsArray[i].restaurant.location.address);
        if (restaurantsArray[i].restaurant.average_cost_for_two == 0) {
            $('#infoModal-' + i + ' h4#infoAverageCost').html('Average Cost: Cheap!' + '&nbsp;&nbsp;<span class="glyphicon glyphicon-piggy-bank"></span>');
        } else {
            $('#infoModal-' + i + ' h4#infoAverageCost').text('Average Cost: ' + restaurantsArray[i].restaurant.currency + restaurantsArray[i].restaurant.average_cost_for_two);
        }
        $('#infoModal-' + i + ' h4#infoURL').html('<a href="'+restaurantsArray[i].restaurant.url+'" target="_blank">Website</a>');

        counter++
    }
    $('#option-cards').show();
}

// Pull from restaurant array to display new restaurants
function reRoll() {
    console.log("reRoll has been fired!")
    console.log("Counter: " + counter);
    if (counter == 25) {
        $('#reroll-message').html('Still looking??');
        $('#reroll-message').show();
        setTimeout(() => {
            $('#reroll-message').hide();
        }, 3000);
    }
    if (counter == 50) {
        $('#reroll-message').html('You\'re hopeless...just eat ramen!!');
        $('#reroll-message').show();
        setTimeout(() => {
            $('#reroll-message').hide();
        }, 3000);
    }
    if (counter == 80) {
        $('#reroll-message').html('Almost out of restaurants!');
        $('#reroll-message').show();
        setTimeout(() => {
            $('#reroll-message').hide();
        }, 3000);
    }
    if (counter >= 99) {
        $('#reroll-message').html('Make a decision already!');
        $('#reroll-message').show();
        setTimeout(() => {
            $('#reroll-message').hide();
        }, 3000);
        counter = 0;
    }
    z=0;
    j=0;
    for (z=0; z<=4; z++) {
        if ($('.option-' + z).attr('data-state') == "chooseRestaurant" ) {     
            $('.option-' + z).attr('search-result', counter);
        }
        for (j=0; j<=4; j++) {
            if ($('.option-' + z).attr('search-result') == counter ) { 
                $('.option-' + z + ' h3').text(restaurantsArray[counter].restaurant.name);
                if (restaurantsArray[counter].restaurant.featured_image == "") {
                    $('.option-' + z + ' img').attr('src', './assets/images/featured_image.jpg');
                } else {
                    $('.option-' + z + ' img').attr('src', restaurantsArray[counter].restaurant.featured_image);
                }
                $('.option-' + z + ' #cuisines').text(restaurantsArray[counter].restaurant.cuisines)
                $('.option-' + z + ' #rating').html('Rating: ' + restaurantsArray[counter].restaurant.user_rating.aggregate_rating + '&nbsp;&nbsp;<span class="glyphicon glyphicon-star-empty">');

                $('.heartBtn-' + z).attr("data-name", restaurantsArray[counter].restaurant.name).attr("data-url", restaurantsArray[counter].restaurant.url).attr("data-clicked", "unclicked");


                $('#infoModal-' + z + ' h3#infoName').text(restaurantsArray[counter].restaurant.name);
                if (restaurantsArray[counter].restaurant.featured_image == "") {
                    $('#infoModal-' + z + ' img#infoImg').attr('src', './assets/images/featured_image.jpg');
                } else {
                    $('#infoModal-' + z + ' img#infoImg').attr('src', restaurantsArray[counter].restaurant.featured_image);
                }
                $('#infoModal-' + z + ' h4#infoRating').html('Rating: ' + restaurantsArray[counter].restaurant.user_rating.aggregate_rating + '&nbsp;&nbsp;<span class="glyphicon glyphicon-star-empty"></span>');
                if (restaurantsArray[counter].restaurant.user_rating.aggregate_rating < 2.9) {
                    $('#infoModal-' + z + ' h4#infoRating').css('color', 'red');
                } else if (restaurantsArray[counter].restaurant.user_rating.aggregate_rating < 3.9) {
                    $('#infoModal-' + z + ' h4#infoRating').css('color', 'orange');
                } else if (restaurantsArray[counter].restaurant.user_rating.aggregate_rating <= 5) {
                    $('#infoModal-' + z + ' h4#infoRating').css('color', 'darkgreen');
                }
                $('#infoModal-' + z + ' h4#infoRating').html('Rating: ' + restaurantsArray[counter].restaurant.user_rating.aggregate_rating + '&nbsp;&nbsp;<span class="glyphicon glyphicon-star-empty"></span>');
                $('#infoModal-' + z + ' h4#infoCuisines').text(restaurantsArray[counter].restaurant.cuisines);
                $('#infoModal-' + z + ' h4#infoAddress').text(restaurantsArray[counter].restaurant.location.address);
                if (restaurantsArray[counter].restaurant.average_cost_for_two == 0) {
                    $('#infoModal-' + z + ' h4#infoAverageCost').html('Average Cost: Cheap!' + '&nbsp;&nbsp;<span class="glyphicon glyphicon-piggy-bank"></span>');
                } else {
                    $('#infoModal-' + z + ' h4#infoAverageCost').text('Average Cost: ' + restaurantsArray[counter].restaurant.currency + restaurantsArray[counter].restaurant.average_cost_for_two);
                }
                $('#infoModal-' + z + ' h4#infoURL').html('<a href="'+restaurantsArray[counter].restaurant.url+'" target="_blank">Website</a>');
            }
        }
        counter++;
    }
}

////////////////////////////////////////////////
//// End API Calls and organize gather info ////
////////////////////////////////////////////////

////////////////////////////////////////////////
////// Start of "Open and Close" functions//////
////////////////////////////////////////////////

// Opens the SEARCH modal >>>
$("#showSearchModal").on("click", function() {
    $("#searchModal").show();
    $("#searchModal").removeClass().addClass("modal show zoomInDown animated");
    $('#mainPage').css('opacity', '.3');
});
  
// Closes the SEARCH modal <<<
$("#hideSearchModal").on("click", function() {
    $("#searchModal").hide();
    $("#searchModal").removeClass().addClass("modal show zoomOut animated");
    $('#mainPage').css('opacity', 'unset');
});

// Opens the FAVORITES modal >>>
$("#showFavoriteModal").on("click", function () {
    $("#favModal").show()
    $("#favModal").removeClass().addClass("modal show zoomInDown animated");
    $('#mainPage').css('opacity', '.3');
})

// Closes the FAVORITES modal <<<
$(".hideFavoriteModal").on("click", function() {
    $("#favModal").hide();
    $("#favModal").removeClass().addClass("modal show zoomOut animated");
    $('#mainPage').css('opacity', 'unset');
});

// Opens the HISTORY modal >>>
$("#showHistoryModal").on("click", function () {
    $("#historyModal").show()
    $("#historyModal").removeClass().addClass("modal show zoomInDown animated");
    $('#mainPage').css('opacity', '.3');
})
 
// Closes the HISTORY modal <<<
$(".hideHistoryModal").on("click", function() {
    $("#historyModal").hide();
    $("#historyModal").removeClass().addClass("modal show zoomOut animated");
    $('#mainPage').css('opacity', 'unset');
});

// Opens the INFO modal of the corresponding location card >>>
$(".infoBtn").on("click", function() {
    console.log('infoBtn-' + $(this).attr('data-index') + ' has been clicked!');
    $('#infoModal-' + $(this).attr('data-index')).removeClass().addClass("modal show zoomInDown animated infoModal");
});

// Closes the INFO modal that is currently displaying <<<
$(".closeInfoModal").on("click", function() {
    var dataIndex = $(this).attr("data-index");
    $("#infoModal-" + dataIndex).removeClass().addClass("modal show zoomOut animated");
    $('#mainPage').css('opacity', 'unset');
    console.log("works")
});
  
//////////////////////////////////////////////
////// End of "Open and Close" functions//////
//////////////////////////////////////////////

////////////////////////////////
////// Begin Search Modal //////
////////////////////////////////

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

// Runs the ready button search if enter is pressed
$('.enter').keypress(function(e){
    if (e.which == 13){//Enter key pressed
        $('#readyBtn').click();//Trigger search button click event
    }
});

// Submits the results of the search Modal and hides it
$("#readyBtn").on("click", function() {
    restaurantsArray = [];
    radius = $("#radiusBtn").attr("value") * 8050;
    var zipCode = $("#zipCodeText").val();
    var chosenRadius = $("#radiusBtn").val()
    var selectedRadius = parseInt(chosenRadius)

    if (($('#nearMeBtn').is(':checked') || ($('#zipCodeBtn').is(':checked') && zipCode.length == 5)) && selectedRadius > 0 ) {
        $("#searchModal").removeClass().addClass("modal show zoomOut animated");
        $(".searchModalTitle").html("Find Yahptions");
        $(".float-bubble").hide();
        $("#reroll").text("Re-Roll");
        if ($("#nearMeBtn").is(':checked')) {
            getLatLongbyNearme();
        } else {
            getLatLongbyZipcode();
        }
    }
    else if ($("#nearMeBtn").is(':checked') || $('#zipCodeBtn').is(':checked') && zipCode.length == 5) {
        $(".searchModalTitle").html("Find Yahptions --- Choose a <strong>Radius</strong>");
    }

    else if ($('#zipCodeBtn').is(':checked') && selectedRadius >= 1) {
        $(".searchModalTitle").html("Find Yahptions --- <strong>Zip Code</strong> must have 5 digits");
    }

    else if (selectedRadius >= 1) {
        $(".searchModalTitle").html("Find Yahptions --- Choose <strong>Near Me</strong> or <strong>Zip Code</strong>");
    }

    else if ($('#zipCodeBtn').is(':checked')) {
        $(".searchModalTitle").html("Find Yahptions --- <strong>Zip Code</strong> must have 5 digits and a <strong>Radius</strong> must be selected");
    }

    else {
        $(".searchModalTitle").html("Find Yahptions --- Choose <strong>Near Me</strong> or <strong>Zip Code</strong> and a <strong>Radius</strong>");
    }
})

////////////////////////////////
////// End Search Modal ////////
////////////////////////////////


//////////////////////////////////
////// Start game functions //////
//////////////////////////////////

// Reroll options function
$("#reroll").on("click", reRoll);

// Variables to keep track of chosen and eliminated phases
var chosen = [];
var eliminated = [];
  
// Choose and eliminate function...
$(".locationCard").on("click", function() {
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
        $("#infoModal-" + $(this).attr("search-result")).removeClass().addClass("modal show zoomInDown animated infoModal");
        $('#mainPage').css('opacity', '.3');
    }
    else if (state ==="lockedin" && chosen.length == 5 && eliminated.length < 5) { // Eliminates option...
        eliminated.push("x");
        $(this).css("opacity", "0.2");
        $(this).removeClass("borderchosen");
        $(this).removeClass("handpointer");
        $(this).addClass("bordereliminated");
        $(this).attr("data-state", "eliminated");
        if (eliminated.length == 4) {   // Game is over, show the userSelection modal
            for (var i = 0; i <= 4; i++) {
                var infoPanel = $("#infoModal-" + i);
                var card = $(".option-" + i)
                var cardState = $(".option-" + i).attr("data-state");
                var name = $(".heartBtn-" + i).attr("data-name");  
                var url = $(".heartBtn-" + i).attr("data-url");
                if (cardState !== "eliminated") {
                    infoPanel.removeClass().addClass("modal show zoomInDown animated infoModal");
                    if (historyNameList.length < 6){
                        historyNameList.push(name); 
                        historyUrlList.push(url);   
                        localStorage.setItem("historyRestaurantName", JSON.stringify(historyNameList));
                        localStorage.setItem("historyRestaurantURL", JSON.stringify(historyUrlList));
                        fillHistoryModal()
                    }
                }
            }
            $('#mainPage').css('opacity', '.3');
            $("#reroll").show();
            $("#reroll").text("Restart");
        }
    }
})

// Shows user on hover what they're about to lock in
$(".locationCard").hover(function(){
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
$(".locationCard").hover(function(){
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

////////////////////////////////
////// End game functions //////
////////////////////////////////

/////////////////////////////////////////////////
/////// Start Local storage of favorites ////////
/////////////////////////////////////////////////
        
// Creates variable for existing array in storage
var favRestNameList = JSON.parse(localStorage.getItem("restaurantName"));
var favRestUrlList = JSON.parse(localStorage.getItem("restaurantURL"));

// creates local empty favorite list if one doesn't already exist
if (!Array.isArray(favRestNameList)) {
    favRestNameList = [];
    favRestUrlList = [];
  }


// Puts favorites on page
function putFavoritesOnPage() {
    $("#favorites").empty(); // empties out the html
    var favRestName = JSON.parse(localStorage.getItem("restaurantName"));
    var favRestURL = JSON.parse(localStorage.getItem("restaurantURL"));
    if (!Array.isArray(favRestName)) {
        favRestName = [];
    }
    for (var i = 0; i < favRestName.length; i++) {
        var a = $('<p><button class="delete" data-index="' + i + '"><span class="glyphicon glyphicon-trash" aria-hidden="true"></span></button><a href="' + favRestURL[i] + '" target="_blank">' + favRestName[i] + '</a></p>');
        $("#favorites").append(a);
    }
}

putFavoritesOnPage();

// Deletes past favorites
$(document).on("click", "button.delete", function() {
    var restName = JSON.parse(localStorage.getItem("restaurantName"));
    var restURL = JSON.parse(localStorage.getItem("restaurantURL"));
    var currentIndex = $(this).attr("data-index");

    restName.splice(currentIndex, 1);   // Deletes the item marked for deletion
    restURL.splice(currentIndex, 1);    // Deletes the item marked for deletion
    favRestNameList = restName;
    favRestUrlList = restURL
    localStorage.setItem("restaurantName", JSON.stringify(restName));
    localStorage.setItem("restaurantURL", JSON.stringify(restURL));
    putFavoritesOnPage();
});

// Makes a restaurant a favorite
$(".favoriteThis").on("click", function(event) {
    event.preventDefault();
    var name = $(this).attr("data-name"); 
    var url = $(this).attr("data-url");
    var saved = $(this).attr("data-clicked");

    if (saved == "saved") {
        console.log("already clicked");
    }

    else if (favRestNameList.length < 6){
        $(this).attr("data-clicked", "saved");
        favRestNameList.push(name); // Will want it to push array of array
        favRestUrlList.push(url);   // Will want it to push array of array
        localStorage.setItem("restaurantName", JSON.stringify(favRestNameList));
        localStorage.setItem("restaurantURL", JSON.stringify(favRestUrlList));
        putFavoritesOnPage();
    }   
});

//////////////////////////////////////////////
////// End Local storage of favorites ////////
//////////////////////////////////////////////

//////////////////////////////////////////////
////// Start History Modal local storage /////
//////////////////////////////////////////////

var historyNameList = JSON.parse(localStorage.getItem("historyRestaurantName"));
var historyUrlList = JSON.parse(localStorage.getItem("historyRestaurantURL"));

if (!Array.isArray(historyNameList)) {
    historyNameList = [];
    historyUrlList = [];
  }   
  
// Fills history modal with past results
function fillHistoryModal() {
    $("#history").empty(); // empties out the html
    var historyRestName = JSON.parse(localStorage.getItem("historyRestaurantName"));
    var historyRestURL = JSON.parse(localStorage.getItem("historyRestaurantURL"));
    if (!Array.isArray(historyRestName)) {
        historyRestName = [];
    }

    if (historyNameList.length > 4) {
        var historyNameMax = JSON.parse(localStorage.getItem("historyRestaurantName"));
        var historyURLMax = JSON.parse(localStorage.getItem("historyRestaurantURL"));

        historyNameMax.splice(0, 1);  
        historyURLMax.splice(0, 1);
        localStorage.setItem("historyRestaurantName", JSON.stringify(historyNameMax));
        localStorage.setItem("historyRestaurantURL", JSON.stringify(historyURLMax));  
    }

    for (var i = 0; i < historyRestName.length; i++) {
        var a = $('<p><button class="deleteHistory" data-index="' + i + '"><span class="glyphicon glyphicon-floppy-remove" aria-hidden="true"></span></button><a href=" + historyRestURL[i] + " target="_blank">' + historyRestName[i] + '</a></p>');
        $("#history").prepend(a);
    }
}

fillHistoryModal() // Fills history modal with past results

// Deletes past history
$(document).on("click", "button.deleteHistory", function() {
    var historyName = JSON.parse(localStorage.getItem("historyRestaurantName"));
    var historyURL = JSON.parse(localStorage.getItem("historyRestaurantURL"));
    var currentIndex = $(this).attr("data-index");

    historyName.splice(currentIndex, 1);  
    historyURL.splice(currentIndex, 1);    
    historyNameList = historyName;
    historyUrlList = historyURL;
    localStorage.setItem("historyRestaurantName", JSON.stringify(historyName));
    localStorage.setItem("historyRestaurantURL", JSON.stringify(historyURL));
    fillHistoryModal()
});

//////////////////////////////////////////////
////// End History Modal local storage ///////
//////////////////////////////////////////////

}); // <--end of on page load. 