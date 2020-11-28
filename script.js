//Current Weather API
const apiKey = "cf1d3bdb8eaf2d5b92c64666b49fa2ca";

    //setting default location weather on page load
$(document).ready(function() {
    var defaultCity = "Los Angeles";
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + defaultCity + "&units=imperial" +"&appid=" + apiKey;

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function(response) {
        // console.log(queryURL);
        // console.log(response)

        //converting unix timestamp to display date
        var unixDate = new Date(response.dt*1000);
        var month = unixDate.getMonth() + 1;
        var day = unixDate.getDate();
        var year = unixDate.getFullYear();
        // console.log(unixDate)

        //weather icons
        var iconcode = response.weather[0].icon;
        $("#weather-icon").attr({
            src: "http://openweathermap.org/img/w/" + iconcode + ".png",
            alt: response.weather[0].description
        });

        $("#city-name").text(response.name + " (" + month + "/" + day + "/" + year + ") ");
        $(".temp").text(response.main.temp);
        $(".humidity").text(response.main.humidity);
        $(".wind").text(response.wind.speed);
        //uv index api query
        const uvQuery = "http://api.openweathermap.org/data/2.5/uvi?lat=" + response.coord.lat + "&lon=" + response.coord.lon + "&appid=" + apiKey;

        $.ajax( {
            url: uvQuery,
            method: "GET"
        }).then(function(response) {
            // console.log(response)
            $(".uv-index").text(response.value)
        });

        //5 day weather forecast API
        const fiveQuery = "https://api.openweathermap.org/data/2.5/forecast?q=" + defaultCity + "&units=imperial" + "&appid=" + apiKey;

        $.ajax( {
            url: fiveQuery,
            method: "GET"
        }).then(function(response) {
            // console.log(response);
            const forecastArray = response.list;
            const firstFive = forecastArray.slice(0, 5);
            // console.log(firstFive);

            for (let i = 0; i < firstFive.length ; i++) {
                const fIndex = i * 8 + 4;

                //converting unix timestamp to display date
                var fiveDay = new Date(forecastArray[fIndex].dt*1000);
                var forecastMonth = fiveDay.getMonth() + 1;
                var forecastDay = fiveDay.getDate();
                var forecastYear = fiveDay.getFullYear();
                // console.log(fiveDay)

                const forecastDate = $("<h3>")
                const forecastIcon = $("<img>");
                const forecastTemp = $("<p>");
                const forecastHumid = $("<p>");

                forecastDate.text(forecastMonth + "/" + forecastDay + "/" + forecastYear);
                forecastIcon.attr({
                    src: "http://openweathermap.org/img/w/" + response.list[fIndex].weather[0].icon + ".png",
                    alt: response.list[fIndex].weather[0].description
                });
                forecastTemp.text("Temp: " + response.list[fIndex].main.temp + "° F");
                forecastHumid.text("Humidity: " + response.list[fIndex].main.humidity + "%");

                $("#day" + i).append(forecastDate, forecastIcon, forecastTemp, forecastHumid)
                
            }
        });
    });
    renderHistory();
});

$("#cityBtn").on("click", function(){
    // console.log("clicked");
    var cityInput = $("#citySearch").val();
    let cityHistoryArray = JSON.parse(localStorage.getItem("city")) || [];
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityInput + "&units=imperial" + "&appid=" + apiKey;

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function(response) {
        // console.log(queryURL);
        // console.log(response)
        getWeather();

        function getWeather() {
            //converting unix timestamp to display date
            var unixDate = new Date(response.dt*1000);
            var month = unixDate.getMonth() + 1;
            var day = unixDate.getDate();
            var year = unixDate.getFullYear();
            // console.log(unixDate)

            $("#city-name").text(response.name + " (" + month + "/" + day + "/" + year + ") ");
            $(".temp").text(response.main.temp);
            $(".humidity").text(response.main.humidity);
            $(".wind").text(response.wind.speed);
            //uv index api query
            const uvQuery = "http://api.openweathermap.org/data/2.5/uvi?lat=" + response.coord.lat + "&lon=" + response.coord.lon + "&appid=" + apiKey;

            $.ajax( {
                url: uvQuery,
                method: "GET"
            }).then(function(response) {
                // console.log(response)
                $(".uv-index").text(response.value)
            });

            get5forecast();
        };

        //5 day weather forecast API
        function get5forecast() {
            const fiveQuery = "https://api.openweathermap.org/data/2.5/forecast?q=" + cityInput + "&units=imperial" + "&appid=" + apiKey;

        $.ajax( {
            url: fiveQuery,
            method: "GET"
        }).then(function(response) {
            // console.log(response);
            const forecastArray = response.list;
            const firstFive = forecastArray.slice(0, 5);
            // console.log(firstFive);

            for (let i = 0; i < firstFive.length ; i++) {
                const fIndex = i * 8 + 4;

                //converting unix timestamp to display date
                var fiveDay = new Date(forecastArray[fIndex].dt*1000);
                var forecastMonth = fiveDay.getMonth() + 1;
                var forecastDay = fiveDay.getDate();
                var forecastYear = fiveDay.getFullYear();
                // console.log(fiveDay)

                const forecastDate = $("<h3>")
                const forecastIcon = $("<img>");
                const forecastTemp = $("<p>");
                const forecastHumid = $("<p>");

                forecastDate.text(forecastMonth + "/" + forecastDay + "/" + forecastYear);
                forecastIcon.attr({
                    src: "http://openweathermap.org/img/w/" + response.list[fIndex].weather[0].icon + ".png",
                    alt: response.list[fIndex].weather[0].description
                });
                forecastTemp.text("Temp: " + response.list[fIndex].main.temp + "° F");
                forecastHumid.text("Humidity: " + response.list[fIndex].main.humidity + "%");

                $("#day" + i).empty();
                $("#day" + i).append(forecastDate, forecastIcon, forecastTemp, forecastHumid);
                
            }
        });
        };

        cityHistoryArray.push(cityInput);
        setCityHistory();
        renderHistory();

    });
})

//pushes user's city input into an array for setting local storage
var cityArray = [];
function setCityHistory() {
    let cityInput = $("#citySearch").val();
    cityArray.push(cityInput);
    localStorage.setItem("city", JSON.stringify(cityArray));
    // console.log(cityArray);
};

function renderHistory() {
    let cityHistoryArray = JSON.parse(localStorage.getItem("city"));
    $("#cities").empty();
    for (var i = 0; i < cityHistoryArray.length; i++) {
        let cityBtn = $("<button>");
        cityBtn.attr({
            type: "button",
            class: "btn btn-outline-info mb-1 history",
            value: cityHistoryArray[i]
        });
        cityBtn.text(cityHistoryArray[i]);
        $("#cities").prepend(cityBtn);

        
    };
}

