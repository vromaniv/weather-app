$(document).ready(getLocation);

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(getCurrentWeather);
    } else {
        x.innerHTML = "Geolocation is not supported by this browser.";
    }
}

function getCurrentWeather(position) {
    let lat = position.coords.latitude;
    let lon = position.coords.longitude;

    $.getJSON("https://fcc-weather-api.glitch.me/api/current?lat=" + lat + "&lon=" + lon, function (json) {
        let temperature = Math.round(json.main.temp);
        let weather = json.weather[0].main;
        let weather_id = json.weather[0].id;
        weather = weather == 'Atmosphere' ? 'Fog' : weather;
        weather = weather_id == 801 ? 'Partly Cloudy' : weather;
        weather = weather_id == 803 ? 'Partly Cloudy' : weather;
        let city = json.name;
        let sunrise = json.sys.sunrise;
        let sunset = json.sys.sunset;

        $('#temperature').fadeOut(10, function () {
            $(this).html("<span id='number'>" + temperature + "</span><span id='degrees'> °C</span>")
                .fadeIn(100);
        });

        $('#weather').fadeOut(10, function () {
            $(this).html(weather).fadeIn(100);
        });

        $('#location').fadeOut(10, function () {
            $(this).html("in <span>" + city + "</span>").fadeIn(100);
        });

        let time = new Date();
        time = Math.round(time.getTime() / 1000);
        let isNight = sunrise > time || sunset < time ? true : false;
        setIcon(weather, isNight);
    });
}

function setIcon(weather, isNight) {
    switch (weather) {
        case 'Clear':
            if (isNight) {
                $('#icon').fadeOut(10, function () {
                    $(this).attr('src', 'icons/moon.png').fadeIn(100);
                });
            } else {
                $('#icon').fadeOut(10, function () {
                    $(this).attr('src', 'icons/sun.png').fadeIn(100);
                });
            }
            break;
        case 'Rain':
            $('#icon').fadeOut(10, function () {
                $(this).attr('src', 'icons/rain.png').fadeIn(100);
            });
            break;
        case 'Drizzle':
            $('#icon').fadeOut(10, function () {
                $(this).attr('src', 'icons/drizzle.png').fadeIn(100);
            });
            break;
        case 'Clouds':
            $('#icon').fadeOut(10, function () {
                $(this).attr('src', 'icons/cloudy.png').fadeIn(100);
            });
            break;
        case 'Partly Cloudy':
            if (isNight) {
                $('#icon').fadeOut(10, function () {
                    $(this).attr('src', 'icons/cloudy-night.png').fadeIn(100);
                });
            } else {
                $('#icon').fadeOut(10, function () {
                    $(this).attr('src', 'icons/cloudy-day.png').fadeIn(100);
                });
            }
            break;
        case 'Snow':
            $('#icon').fadeOut(10, function () {
                $(this).attr('src', 'icons/snowing.png').fadeIn(100);
            });
            break;
        case 'Thunderstorm':
            $('#icon').fadeOut(10, function () {
                $(this).attr('src', 'icons/storm.png').fadeIn(100);
            });
            break;
        case 'Atmosphere':
            $('#icon').fadeOut(10, function () {
                $(this).attr('src', 'icons/fog.png').fadeIn(100);
            });
            break;
    }
};

let isCelsius = true;

$(document).on('click', '#degrees', function () {
    let temperature = $('#number').text();

    if (isCelsius) {
        temperature = temperature * 9 / 5 + 32;
    } else {
        temperature = Math.round((temperature - 32) * 5 / 9);
    }

    $('#temperature #number').html(temperature);
    isCelsius = !isCelsius;
});