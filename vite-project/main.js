// Importing the CSS file
import './style.css';

// API key and URL for OpenWeatherMap API
const apiKey = '32b6ed7f951d4899b2b41de26fc8ab39';
const apiUrl = 'https://api.openweathermap.org/data/2.5/weather?units=metric&';

// DOM elements used in the application
const elements = {
  searchBox: document.querySelector('input'),
  searchBtn: document.querySelector('#search-button'),
  gpsBtn: document.querySelector('#gps-button'),
  weather: document.querySelector('#weather'),
  weatherIcon: document.querySelector('#weather-icon'),
  error: document.querySelector('#error'),
  city: document.querySelector('#city'),
  temp: document.querySelector('#temp'),
  humidity: document.querySelector('#humidity'),
  windSpeed: document.querySelector('#windSpeed'),
};

// Cache for storing previously fetched data
const cache = {};
const cacheExpiryTime = 600000; // 10 minutes in milliseconds

// Function to check if cache data is still valid
const isCacheValid = (cacheKey) => {
  const currentTime = Date.now();
  return cache[cacheKey] && currentTime - cache[cacheKey].timestamp < cacheExpiryTime;
};

// Function to display error message
const showError = () => {
  elements.error.style.display = 'block';
  elements.weather.style.display = 'none';
};

// Function to display weather data on the UI
const showWeatherData = (data) => {
  elements.city.innerHTML = data.name;
  elements.temp.innerHTML = `${Math.round(data.main.temp)}°c`;
  elements.humidity.innerHTML = `${data.main.humidity}%`;
  elements.windSpeed.innerHTML = `${data.wind.speed} km/h`;
  elements.weatherIcon.src = `/weather-app-img/images/${data.weather[0].main.toLowerCase()}.png`;
  elements.weather.style.display = 'block';
  elements.error.style.display = 'none';
};

// Function to check weather data for a city
const checkWeather = async (cityName) => {
  if (isCacheValid(cityName)) {
    showWeatherData(cache[cityName].data);
    return;
  }

  // Stalling js until fetch is complete
  const response = await fetch(`${apiUrl}q=${cityName}&appid=${apiKey}`);
  if (!response.ok) {
    showError();
  } else {
    const data = await response.json();
    cache[cityName] = { data, timestamp: Date.now() };
    showWeatherData(data);
  }
};

// Function to fetch weather data by coordinates (latitude and longitude)
const fetchWeatherDataByCoordinates = async (latitude, longitude) => {
  const cacheKey = `${latitude}-${longitude}`;
  if (isCacheValid(cacheKey)) {
    showWeatherData(cache[cacheKey].data);
    return;
  }
  const response = await fetch(`${apiUrl}lat=${latitude}&lon=${longitude}&appid=${apiKey}`);
  const data = await response.json();
  cache[cacheKey] = { data, timestamp: Date.now() };
  showWeatherData(data);
};

// Event listener for the search button
elements.searchBtn.addEventListener('click', () => {
  checkWeather(elements.searchBox.value);
  console.log(cache); // Logging cache for debugging
});

// Checking if geolocation is supported in the browser
if ('geolocation' in navigator) {
  navigator.geolocation.getCurrentPosition(
    (position) => {
      const { latitude, longitude } = position.coords;
      // Use latitude and longitude to fetch weather data
      elements.gpsBtn.addEventListener('click', () => {
        fetchWeatherDataByCoordinates(latitude, longitude);
      });
    },
    (error) => {
      console.error(`Error getting location: ${error.message}`);
      // Handle error (e.g., display a message to the user)
    },
  );
} else {
  console.error('Geolocation is not supported');
}
