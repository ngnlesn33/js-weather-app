import './style.css'


const apiKey = "32b6ed7f951d4899b2b41de26fc8ab39";
const apiUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";
const searchBox = document.querySelector("input")
const searchBtn = document.querySelector("button");
const weather = document.querySelector("#weather")
const weatherIcon = document.querySelector("#weather-icon");
const error = document.querySelector("#error");
const checkWeather = async (cityName) => {

    // Stalling js until fetch is complete
    const response = await fetch(apiUrl + cityName + `&appid=${apiKey}`);
    const data = await response.json();

    if (response.status === 404) {
        error.style.display = "block";
        weather.style.display = "none"
    } else {
        document.querySelector("#city").innerHTML = data.name;
        document.querySelector("#temp").innerHTML = Math.round(data.main.temp) + "°c";
        document.querySelector("#humidity").innerHTML = data.main.humidity + "%";
        document.querySelector("#windSpeed").innerHTML = data.wind.speed + " km/h";
        weatherIcon.src = `/weather-app-img/images/${data.weather[0].main.toLowerCase()}.png`;
        weather.style.display = "block";
        error.style.display = "none";
    }

};
searchBtn.addEventListener("click", () => {
    checkWeather(searchBox.value);
})




