// generate page functiom
function generatePage() {
  const cityInput = document.getElementById("city-input");
  const searchInput = document.getElementById("search-button");
  const clearButton = document.getElementById("clear-history");
  const nameInput = document.getElementById("city-name");
  const currentPicture = document.getElementById("current-pic");
  const currentTemperature = document.getElementById("temperature");
  const currentHumidity = document.getElementById("humidity");

  const currentWind = document.getElementById("wind-speed");
  const currentUVEl = document.getElementById("UV-index");
  const historyEl = document.getElementById("history");
  let searchHistory = JSON.parse(localStorage.getItem("search")) || [];

  // api key
  const APIKey = "921e41fee3e611abb7fef6123648f8f6";

  function getWeather(cityName) {
    let queryURL =
      "https://api.openweathermap.org/data/2.5/weather?q=" +
      cityName +
      "&appid=" +
      APIKey;
    axios.get(queryURL).then(function (response) {
      const currentDate = new Date(response.data.dt * 1000);
      const day = currentDate.getDate();
      const month = currentDate.getMonth() + 1;
      const year = currentDate.getFullYear();
      nameInput.innerHTML =
        response.data.name + " (" + month + "/" + day + "/" + year + ") ";
      let weatherPic = response.data.weather[0].icon;
      currentPicture.setAttribute(
        "src",
        "https://openweathermap.org/img/wn/" + weatherPic + "@2x.png"
      );
      currentPicture.setAttribute("alt", response.data.weather[0].description);
      currentTemperature.innerHTML =
        "Temperature: " + k2f(response.data.main.temp) + " &#176F";
      currentHumidity.innerHTML =
        "Humidity: " + response.data.main.humidity + "%";
      currentWind.innerHTML =
        "Wind Speed: " + response.data.wind.speed + " MPH";
      let lat = response.data.coord.lat;
      let lon = response.data.coord.lon;
      let UVQueryURL =
        "https://api.openweathermap.org/data/2.5/uvi/forecast?lat=" +
        lat +
        "&lon=" +
        lon +
        "&appid=" +
        APIKey +
        "&cnt=1";
      axios.get(UVQueryURL).then(function (response) {
        let UVIndex = document.createElement("span");
        UVIndex.setAttribute("class", "badge badge-danger");
        UVIndex.innerHTML = response.data[0].value;
        currentUVEl.innerHTML = "UV Index: ";
        currentUVEl.append(UVIndex);
      });
      let cityID = response.data.id;
      let forecastQueryURL =
        "https://api.openweathermap.org/data/2.5/forecast?id=" +
        cityID +
        "&appid=" +
        APIKey;
      axios.get(forecastQueryURL).then(function (response) {
        console.log(response);
        const forecastEls = document.querySelectorAll(".forecast");
        for (i = 0; i < forecastEls.length; i++) {
          forecastEls[i].innerHTML = "";
          const forecastIndex = i * 8 + 4;
          const forecastDate = new Date(
            response.data.list[forecastIndex].dt * 1000
          );
          const forecastDay = forecastDate.getDate();
          const forecastMonth = forecastDate.getMonth() + 1;
          const forecastYear = forecastDate.getFullYear();
          const forecastDateEl = document.createElement("p");
          forecastDateEl.setAttribute("class", "mt-3 mb-0 forecast-date");
          forecastDateEl.innerHTML =
            forecastMonth + "/" + forecastDay + "/" + forecastYear;
          forecastEls[i].append(forecastDateEl);
          const forecastWeatherEl = document.createElement("img");
          forecastWeatherEl.setAttribute(
            "src",
            "https://openweathermap.org/img/wn/" +
              response.data.list[forecastIndex].weather[0].icon +
              "@2x.png"
          );
          forecastWeatherEl.setAttribute(
            "alt",
            response.data.list[forecastIndex].weather[0].description
          );
          forecastEls[i].append(forecastWeatherEl);
          const forecastTempEl = document.createElement("p");
          forecastTempEl.innerHTML =
            "Temp: " +
            k2f(response.data.list[forecastIndex].main.temp) +
            " &#176F";
          forecastEls[i].append(forecastTempEl);
          const forecastHumidityEl = document.createElement("p");
          forecastHumidityEl.innerHTML =
            "Humidity: " +
            response.data.list[forecastIndex].main.humidity +
            "%";
          forecastEls[i].append(forecastHumidityEl);
        }
      });
    });
  }

  searchInput.addEventListener("click", function () {
    const searchTerm = cityInput.value;
    getWeather(searchTerm);
    searchHistory.push(searchTerm);
    localStorage.setItem("search", JSON.stringify(searchHistory));
    renderSearchHistory();
  });

  clearButton.addEventListener("click", function () {
    searchHistory = [];
    renderSearchHistory();
  });

  function k2f(K) {
    return Math.floor((K - 273.15) * 1.8 + 32);
  }

  function renderSearchHistory() {
    historyEl.innerHTML = "";
    for (let i = 0; i < searchHistory.length; i++) {
      const historyItem = document.createElement("input");
      historyItem.setAttribute("type", "text");
      historyItem.setAttribute("readonly", true);
      historyItem.setAttribute("class", "form-control d-block bg-white");
      historyItem.setAttribute("value", searchHistory[i]);
      historyItem.addEventListener("click", function () {
        getWeather(historyItem.value);
      });
      historyEl.append(historyItem);
    }
  }

  renderSearchHistory();
  if (searchHistory.length > 0) {
    getWeather(searchHistory[searchHistory.length - 1]);
  }
}
generatePage();
