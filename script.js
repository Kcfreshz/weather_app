'use strict';
const Input = document.querySelector('.city_input');
const BtnSearch = document.querySelector('.btn_search');
const Userlocation = document.querySelector('.user_location');
const currentweather = document.querySelector('.weatherinfo_main');
const daysforecast = document.querySelector('.weather_container-card');
const API_KEY = '6e3dcc88e41d586e16b28d864f7bbe0c';

const createweatherdetails = (cityName, weatherinfo, index) => {
  if (index === 0) {
    return `
      <div class="w-container">
            <h2>${cityName} <span class="date">(${
      weatherinfo.dt_txt.split(' ')[0]
    })</span></h2>
             <div class="weather_data">Temperature: ${(
               weatherinfo.main.temp - 273.15
             ).toFixed(2)}°C</div>
            <div class="weather_data">Wind: ${weatherinfo.wind.speed}M/S</div>
            <div class="weather_data">Humidity: ${
              weatherinfo.main.humidity
            }%</div>
          </div>
          <div class="weather_description">
           <img src="https://openweathermap.org/img/wn/${
             weatherinfo.weather[0].icon
           }@2x.png" alt="weather-icon" class="weather_img">
            <p>${weatherinfo.weather[0].description}</p>
          </div>

        
           
    `;
  } else {
    return `
        <ul class="weather_card">
            <li class="card_date">(${weatherinfo.dt_txt.split(' ')[0]})</li>
            <li class="weather_description">
              <img src="https://openweathermap.org/img/wn/${
                weatherinfo.weather[0].icon
              }@2x.png" alt="weather-icon" class="weather_img">
            </li>
            <li>Temp: ${(weatherinfo.main.temp - 273.15).toFixed(2)}°C</li>
            <li>Wind: ${weatherinfo.wind.speed}M/S</li>
            <li>Humidity: ${weatherinfo.main.humidity}%</li>
          </ul>
  `;
  }
};

const weatherDetails = (lat, lon, cityName) => {
  const api_url = `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}`;
  console.log(api_url);
  fetch(api_url)
    .then(res => res.json())
    .then(data => {
      const uniquedays = [];
      const fivedays = data.list.filter(forecast => {
        const forecastDate = new Date(forecast.dt_txt).getDate();
        if (!uniquedays.includes(forecastDate)) {
          return uniquedays.push(forecastDate);
        }
      });
      currentweather.innerHTML = '';
      daysforecast.innerHTML = '';

      fivedays.forEach((weatherinfo, index) => {
        const html = createweatherdetails(cityName, weatherinfo, index);
        if (index === 0) {
          currentweather.insertAdjacentHTML('beforeend', html);
        } else {
          daysforecast.insertAdjacentHTML('beforeend', html);
        }
      });
    })
    .catch(() => {
      alert('An error occurred while fetching the weather forecast!');
    });
};

const cityCoordinates = () => {
  const cityName = Input.value.trim();
  console.log(cityName);
  const geoCode = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&appid=${API_KEY}`;
  fetch(geoCode)
    .then(res => res.json())
    .then(data => {
      console.log(data);
      const { lat, lon, name } = data[0];
      console.log(lat, lon, name);
      weatherDetails(lat, lon, name);
    })
    .catch(() => {
      alert(
        `An error occurred while fetching the city (${Input.value}) coordinates!`
      );
    });
};

const userCoordinates = () => {
  navigator.geolocation.getCurrentPosition(
    position => {
      const { latitude, longitude } = position.coords;
      console.log(latitude, longitude);

      fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}`
      )
        .then(res => res.json())
        .then(data => {
          console.log(data);
          const { lon, lat } = data.coord;
          const cityName = data.name;
          console.log(lon, lat, cityName);
          weatherDetails(lat, lon, cityName);
        })
        .catch(() => {
          alert('An error occurred while fetching the city name!');
        });
    },
    error => {
      console.error(error.code);
      if (error.code === error.PERMISSION_DENIED) {
        alert(
          'Geolocation request denied. Please reset location permission to grant access again.'
        );
      } else {
        alert('Geolocation request error. Please reset location permission.');
      }
    }
  );
};

BtnSearch.addEventListener('click', cityCoordinates);
Userlocation.addEventListener('click', userCoordinates);
Input.addEventListener('keyup', e => e.key === 'Enter' && cityCoordinates());
