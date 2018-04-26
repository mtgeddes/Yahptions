$(window).on("load", function(){  // Waits until HTML is loaded before proceeding with the rest

    // Initialize variables for Zomato restaurants api call
    var apiKey = "aabf39b370ad7219908488f6fbaa652c";
    var location = "303"  // 303 is the location code for Charlotte, NC
    var locationType = "city";
    var queryURL1 =  "https://developers.zomato.com/api/v2.1/search?"
                    + "user-key=" + apiKey 
                    + "&entity_id=" + location
                    + "&entity_type=" + locationType;
                    

    $.ajax({  // Fire the api call to get the restaurants
        url: queryURL1,
        dataType: 'json',
        async: true,
        beforeSend: function(xhr){xhr.setRequestHeader('user-key', 'aabf39b370ad7219908488f6fbaa652c');},  // This inserts the api key into the HTTP header
        success: function(data) {  // Then do the following...
            var response = data.restaurants;  // Variable that stores the results
            console.log(response);
            $('body').html('<div class="container">')
            $('.container').append('<div class="row">')
            $('.row').append('<div class="col-md-6 zomato">').append('<div class="col-md-6 detailedview">');
            $('.zomato').html('<div id="zomato"><h1>Zomato Results:</h1></div>')
            $.each(response, function(key, value) {  // For each key in the object, do the following...
                $('#zomato').append('<p><button class="btn btn-primary" data-key=' + key + '>' + response[key].restaurant.name + '</button></p>');
            });
        
            $('button').on('click', function() {
                var key = $(this).attr('data-key');
                $('.detailedview').html('<p><h2>' + response[key].restaurant.name + '</h2></p>')
                .append('<p><img src="' + response[key].restaurant.featured_image + '" style="max-width: 100%; height: 250px"></p>')  // ToDo: If this value is blank, assign a placeholder image
                .append('<p><h3>' + response[key].restaurant.location.address + '</h3></p>');
                console.log(response[key]);
            });
        
        }

        



    });



});