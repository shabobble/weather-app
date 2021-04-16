let latitude;
let longitude;
let inputCity;
let selectCity;
let searchCity;
let cityList = [];
let searchInput = $("#searchInput")

searchButton.addEventListener("click", checkCityEntry)

function checkCityEntry() {
    inputCity = searchInput.val().replace(/\s/g, "");

    if (inputCity == "") {
        alert('Please enter a city to check the weather!')

    } else {
        if (inputCity.includes(",")) {
            searchCity = inputCity.toUpperCase();
            getCoordinates()
                .then(() => getOneCall())
                // .then(() => console.log('I finished loading weather data'))
                .catch(() => alert('failed to load weather'))
            storeCity();

        } else {
            alert('Please include a two-letter US State code.');
        }
    }
};

function getCoordinates() {
    let weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${searchCity},USA&Appid=8444a31943683d63f7214cd990794761&units=imperial`;
    return fetch(weatherUrl)
        .then(function (response1) {
            if (response1.ok) {
                return response1.json()
            } else {
                console.log(response1);
                throw new Error('Failed to get coordinates')
            }
        })
        .then((data) => {
            latitude = data.coord.lat;
            longitude = data.coord.lon;
            console.log(latitude)
            console.log(longitude)
            return {
                latitude: data.coord.lat,
                longitude: data.coord.long
            }
        })
}

function getOneCall(input) {
    // let { latitude, longitude } = input;
    let oneCallUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + latitude + "&lon=" + longitude + "&Appid=8444a31943683d63f7214cd990794761&units=imperial";
    return fetch(oneCallUrl)
        .then(function (response) {
            if (response.ok) {
                return response.json().then(function (data) {
                    for (let i = 1; i < 6; i++) {
                        let dayTitleCard = $(`#day${i}Title`);
                        dayTitleCard.text(dayjs.unix(data.daily[i].dt).format('ddd    MM/DD'));
                        let dayIconCard = $(`#day${i}Icon`);
                        dayIconCard.attr("src", "http://openweathermap.org/img/wn/" + data.daily[i].weather[0].icon + ".png");
                        let dayDescCard = $(`#day${i}Desc`);
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
            } else {
                console.log(response);
            }
        })
};

function storeCity() {
    
    if (!cityList.includes(searchCity)) {
            cityList.push(searchCity)
            localStorage.setItem("cityList", JSON.stringify(cityList));
            loadcityList();

        }
    }


function loadcityList() {
    let listEl = $(".list-group").empty();
    cityList = JSON.parse(localStorage.getItem("cityList"));
    if (cityList) {
        for (let city of cityList) {
                let btn = $("<button>", {
                text: city
            })

            let li = $('<li>').append(btn)
            listEl.append(li);
            btn.on ('click', function() {
                searchInput.val(city)
                checkCityEntry();

            })
        }
    }
};

loadcityList()


