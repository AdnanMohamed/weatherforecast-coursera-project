const europeanCities = {
  London: { lat: 51.5074, lon: -0.1278 },
  Paris: { lat: 48.8566, lon: 2.3522 },
  Berlin: { lat: 52.52, lon: 13.405 },
  Rome: { lat: 41.9028, lon: 12.4964 },
  Madrid: { lat: 40.4168, lon: -3.7038 },
  Vienna: { lat: 48.2082, lon: 16.3738 },
  Amsterdam: { lat: 52.3676, lon: 4.9041 },
  Brussels: { lat: 50.8503, lon: 4.3517 },
  Warsaw: { lat: 52.2297, lon: 21.0122 },
  Prague: { lat: 50.0755, lon: 14.4378 },
  Barcelona: { lat: 41.3851, lon: 2.1734 },
  Istanbul: { lat: 41.0082, lon: 28.9784 },
  Lisbon: { lat: 38.7223, lon: -9.1393 },
  Budapest: { lat: 47.4979, lon: 19.0402 },
  Copenhagen: { lat: 55.6761, lon: 12.5683 },
  Dublin: { lat: 53.3498, lon: -6.2603 },
  Oslo: { lat: 59.9139, lon: 10.7522 },
  Edinburgh: { lat: 55.9533, lon: -3.1883 },
  Athens: { lat: 37.9838, lon: 23.7275 },
  Zurich: { lat: 47.3769, lon: 8.5417 },
};

// Populates the city selector with the major
// european cities.
const createCitySelector = (() => {
  const cities = Object.keys(europeanCities).sort();
  return () => {
    const select = document.getElementById("city");
    cities.forEach((city) => {
      const option = document.createElement("option");
      option.value = city;
      option.innerText = city;
      select.append(option);
    });
  };
})();

// Fetch and display the weather information for the city
// with the given latitude and longitude.
function fetchWeatherData({ lat, lon }) {
  const cardsContainer = document.getElementById("weatherCardsContainer");
  cardsContainer.innerHTML = "";
  const url = `http://www.7timer.info/bin/api.pl?lon=${lon}&lat=${lat}&product=civillight&output=json`;
  fetch(url)
    .then((result) => result.json())
    .then((data) => data.dataseries)
    .then((data) => {
      return data.map((obj) => {
        return {
          date: obj.date.toString(),
          imageUrl: `./images/${obj.weather}.png`,
          minTemp: obj.temp2m.min,
          maxTemp: obj.temp2m.max,
        };
      });
    })
    .then((data) => {
      data.forEach((element) => {
        const card = createWeatherCard(element);
        cardsContainer.appendChild(card);
      });
    });
}

// Converts the date in the format YYYYMMDD to YYYY-MM-DD
function getDate(date) {
  const dateString = [
    date.substr(0, 4),
    date.substr(4, 2),
    date.substr(6, 2),
  ].join("-");
  return new Date(dateString);
}

// Return the name of the day where 0==sunday, 1==monday, ...
function getDayName(day) {
  switch (day) {
    case 0:
      return "sunday";
    case 1:
      return "monday";
    case 2:
      return "tuesday";
    case 3:
      return "wednesday";
    case 4:
      return "thursday";
    case 5:
      return "friday";
    case 6:
      return "saturday";
  }
}

// Returns a card-view displaying the given information about the day
// weather forcast.
function createWeatherCard({ date, imageUrl, maxTemp, minTemp }) {
  let card = document.createElement("div");
  card.className = "weather-card";

  let dateEl = document.createElement("div");
  dateEl.className = "weather-date";
  const dateObj = getDate(date);
  dateEl.textContent = getDayName(dateObj.getDay());
  card.appendChild(dateEl);

  let imgEl = document.createElement("img");
  imgEl.src = imageUrl;
  card.appendChild(imgEl);

  let tempEl = document.createElement("div");
  tempEl.className = "weather-temperature";
  tempEl.textContent = `Max: ${maxTemp}°C, Min: ${minTemp}°C`;
  card.appendChild(tempEl);

  return card;
}

/* Function Calls Here */

document.addEventListener("DOMContentLoaded", () => {
  createCitySelector();
});

// Handles the form submission.
// When the user selects a city and submits the form,
// this code takes care of displaying the weather forcast
// for the next 7 days.
document.getElementById("cityForm").addEventListener("submit", function (e) {
  e.preventDefault();
  let selectedCity = document.getElementById("city").value;
  let cityCoords = europeanCities[selectedCity];
  fetchWeatherData(cityCoords);
});
