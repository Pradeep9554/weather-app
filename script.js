const apiKey = "YOUR_API_KEY"; // Replace with your OpenWeather API Key

// Fetch current weather by city name
async function getWeather() {
  const city = document.getElementById("cityInput").value;
  if (!city) {
    alert("Please enter a city name");
    return;
  }
  fetchWeatherData(city);
}

// Fetch weather using current location
function getLocationWeather() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
        const res = await fetch(url);
        const data = await res.json();
        displayWeather(data);
        getForecastByCoords(lat, lon);
      },
      () => alert("Location access denied")
    );
  } else {
    alert("Geolocation not supported by your browser.");
  }
}

// Fetch weather and forecast by city name
async function fetchWeatherData(city) {
  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    const response = await fetch(url);
    if (!response.ok) throw new Error("City not found");
    const data = await response.json();
    displayWeather(data);
    getForecast(city);
  } catch (error) {
    alert(error.message);
  }
}

// Display current weather
function displayWeather(data) {
  document.getElementById("cityName").innerText = `${data.name}, ${data.sys.country}`;
  document.getElementById("temperature").innerText = `🌡 ${data.main.temp}°C`;
  document.getElementById("description").innerText = `☁️ ${data.weather[0].description}`;
  document.getElementById("humidity").innerText = `💧 Humidity: ${data.main.humidity}%`;
  document.getElementById("wind").innerText = `🌬 Wind: ${data.wind.speed} m/s`;
  document.getElementById("weatherIcon").src =
    `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;

  document.getElementById("weatherCard").style.display = "block";

  // Change background dynamically
  changeBackground(data.weather[0].main);
}

// Fetch 5-Day Forecast (every 3 hours → filter daily noon)
async function getForecast(city) {
  const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;
  const res = await fetch(url);
  const data = await res.json();

  displayForecast(data);
}

// Forecast by coordinates
async function getForecastByCoords(lat, lon) {
  const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
  const res = await fetch(url);
  const data = await res.json();

  displayForecast(data);
}

// Show 5-Day forecast
function displayForecast(data) {
  const forecastContainer = document.getElementById("forecast");
  forecastContainer.innerHTML = "";
  document.getElementById("forecastTitle").style.display = "block";

  // Filter data: pick one forecast per day (12:00:00)
  const daily = data.list.filter(item => item.dt_txt.includes("12:00:00"));

  daily.forEach(day => {
    const date = new Date(day.dt_txt).toLocaleDateString("en-US", { weekday: "short" });
    const temp = Math.round(day.main.temp);
    const icon = `https://openweathermap.org/img/wn/${day.weather[0].icon}.png`;

    const div = document.createElement("div");
    div.classList.add("forecast-day");
    div.innerHTML = `
      <p>${date}</p>
      <img src="${icon}" alt="">
      <p>${temp}°C</p>
    `;
    forecastContainer.appendChild(div);
  });
}

// Dynamic background based on weather condition
function changeBackground(condition) {
  let bg;
  switch (condition.toLowerCase()) {
    case "clear":
      bg = "linear-gradient(135deg, #fddb92, #d1fdff)";
      break;
    case "clouds":
      bg = "linear-gradient(135deg, #d7d2cc, #304352)";
      break;
    case "rain":
      bg = "linear-gradient(135deg, #667db6, #0082c8, #0082c8, #667db6)";
      break;
    case "snow":
      bg = "linear-gradient(135deg, #e0eafc, #cfdef3)";
      break;
    case "thunderstorm":
      bg = "linear-gradient(135deg, #373b44, #4286f4)";
      break;
    default:
      bg = "linear-gradient(135deg, #74ebd5, #9face6)";
  }
  document.body.style.background = bg;
}
