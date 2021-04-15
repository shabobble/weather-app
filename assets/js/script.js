let latitude;
let longitude;
let inputCity;
let selectCity;
let searchCity;
let okToProceed;
let cityWeatherList = [];
let searchInput = $("#searchInput").val();

searchButton.addEventListener("click", checkCityEntry)
//     okToProceed = checkCityEntry()
//     if (okToProceed) {
//         okToProceed = getLongLat()
//     }

//     if (okToProceed) {
//         okToProceed = getWeather();
//     }

//     $("#selectCity").val('');
//     saveTheCity();
//     $("#selectCity").empty();
//     $("#selectCity").append($('<option value="" disabled selected > Enter a location or select one from the list</option>'))
//     loadCityWeatherList();
// )

function checkCityEntry() {
    inputCity = $("#searchInput").val().replace(/\s/g, "");

    if (inputCity == "") {
        alert('Please enter a city to check the weather!')
        okToProceed = false;

    } else {
        if (inputCity.includes(",")) {
            searchCity = inputCity.toUpperCase();
            okToProceed = true;
            getLongLat();
            getWeather();

        } else {
            alert('If you are including a state in your search, please separate from city with a comma. Please try again.');
            okToProceed = false;
        }
    }

    return okToProceed
};

function getLongLat() {
    
    let weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${searchCity},USA&Appid=8444a31943683d63f7214cd990794761&units=imperial`;
    fetch(weatherUrl)
        .then(function (response1) {
            if (response1.ok) {
                response1.json().then(function (data) {
                    latitude = data.coord.lat;
                    longitude = data.coord.lon;
                    console.log(latitude)
                    console.log(longitude)
                    okToProceed = true
                })
            } else {
                console.log(response1);
                okToProceed = false
            }
        })

        return okToProceed;
        
}

function getWeather() {
    let oneCallUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + latitude + "&lon=" + longitude + "&Appid=8444a31943683d63f7214cd990794761&units=imperial";
    fetch(oneCallUrl)
        .then(function (response) {
            if (response.ok) {
                response.json().then(function (data) {
                    for (let i = 1; i < 6; i++) {
                        let dayTitleCard = $("#day[i]Title");
                        dayTitleCard.text(dayjs.unix(data.daily[i].dt).format('ddd    MM/DD'));
                        let dayIconCard = $("#day[i]Icon");
                        dayIconCard.attr("src", "http://openweathermap.org/img/wn/" + data.daily[i].weather[0].icon + ".png");
                        let dayDescCard = $("#day[i]Desc");
                        dayDescCard.html(`Lo: ${parseInt(data.daily[i].temp.min)}\xB0 F</br>Hi: ${parseInt(data.daily[i].temp.max)}\xB0 F</br>Humid: ${data.daily[i].humidity} %</br>Wind: ${data.daily[i].wind_speed} MPH `);
                    }

                    let weatherTitle = $("#weatherTitle");
                    weatherTitle.text(`5-Day Forecast: ${searchCity}`);
                    let curDateCard = $("#currentTitle");
                    curDateCard.text(dayjs.unix(data.current.dt).format('ddd, MMM DD, YYYY'));
                    let curIconCard = $("#currentIcon");
                    curIconCard.attr("src", "http://openweathermap.org/img/wn/" + data.current.weather[0].icon + "@2x.png");
                    let curTempCard = $("#currentTemp");
                    curTempCard.text(`Temp: ${data.current.temp}`);
                    let curCondCard = $("#currentDesc");
                    curCondCard.text(`Conditions: ${data.current.weather[0].main}`);
                    let curUviCard = $("#currentUvi");
                    curUviCard.text(`UV Index: ${data.current.uvi}`);

                    if (parseInt(data.current.uvi) < 3) {
                        $("#currentUvi").addClass("uviGood")
                    } else if (parseInt(data.current.uvi) < 6) {
                        $("#currentUvi").addClass("uviModerate")
                    } else if (parseInt(data.current.uvi) < 8) {
                        $("#currentUvi").addClass("uviBad")

                    } else {
                        $("#currentUvi").addClass("uviExtreme")
                    }
                })
                okToProceed = true;
            } else {
                console.log(response);
                okToProceed = false;
            }
        })
        return okToProceed
};

function saveTheCity() {
    let matchFound = false
    cityWeatherList = JSON.parse(localStorage.getItem("cityWeatherList"));
    if (!cityWeatherList) {
        localStorage.setItem("cityWeatherList", JSON.stringify(""));
        cityWeatherList = []
    }

    if (cityWeatherList) {
        for (let i = 0; i <= cityWeatherList.length; i++) {
            if (cityWeatherList[i] == searchCity) {
                matchFound = true;
                break;
            }
        }
        if (!matchFound) {
            cityWeatherList.push(searchCity)
            localStorage.setItem("cityWeatherList", JSON.stringify(cityWeatherList));

        }
    }
}

function loadCityWeatherList() {
    cityWeatherList = JSON.parse(localStorage.getItem("cityWeatherList"));
    if (cityWeatherList) {
        for (let i = 0; i <= cityWeatherList.length; i++) {
            $("#selectCity").append($('<option>', {
                value: cityWeatherList[i],
                text: cityWeatherList[i]
            }));
        }
    }
};

loadCityWeatherList()


