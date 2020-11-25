//Current Weather API

$("#cityBtn").on("click", function(){
    // console.log("clicked");
    var cityInput = $("#citySearch").val();
    var apiKey = "cf1d3bdb8eaf2d5b92c64666b49fa2ca";
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityInput + "&appid=" + apiKey;

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function(response) {
        // console.log(queryURL);
        console.log(response)
    })
})

