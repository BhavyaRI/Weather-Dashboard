const cityInput = document.querySelector(".search");
const searchBtn = document.querySelector("#searchbtn");

function wicon(conditionText) {
  const condition = conditionText.toLowerCase();

  if (condition.includes("rain") || condition.includes("drizzle")) {
    return "./src/rain.svg";
  } else if (
    condition.includes("snow") ||
    condition.includes("sleet") ||
    condition.includes("blizzard") ||
    condition.includes("ice pellets")
  ) {
    return "./src/snow.svg";
  } else if (condition.includes("thunder")) {
    return "./src/thunder.svg";
  } else if (condition.includes("fog") || condition.includes("mist")) {
    return "./src/mist.svg";
  } else if (condition.includes("partly cloudy")) {
    return "./src/partlyclouds.svg";
  } else if (condition.includes("cloudy") || condition.includes("overcast")) {
    return "./src/clouds.svg";
  } else if (condition === "sunny" || condition === "clear") {
    return "./src/sun.svg";
  } else {
    return "./src/partlyclouds.svg";
  }
}

// --- DATA FETCHING AND DISPLAY ---

function getdata(city) {
  const url = `/api/getWeather?city=${city}&type=current`;
  fetch(url)
    .then((resp) => {
      if (!resp.ok) {
        alert("City not found. Please try again.");
        throw Error("City not found");
      }
      return resp.json();
    })
    .then((data) => {
      displayData(data);
    })
    .catch((err) => {
      console.error(err);
    });
}

function displayData(data) {
  const weather = document.querySelector(".card");
  const location = document.querySelector(".city");
  const icon = document.querySelector(".icon");

  location.innerHTML = `
        <h2>${data.location.name}, ${data.location.region}</h2>
        <h3>${data.location.country}</h3>
        <h1>${data.current.temp_c}°C</h1>
        <h2>${data.current.condition.text}</h2>
        <h3>Feels like ${data.current.feelslike_c}°C</h3>
    `;

  const conditionText = data.current.condition.text;
  const iconPath = wicon(conditionText);
  icon.innerHTML = `<img src="${iconPath}" alt="${conditionText}">`;

  weather.innerHTML = `
        <h2>Weather Details</h2>
        <div class="row">
            <div class="label">
                <img src="src/icons8-humidity-48.png">
                <span>Humidity</span>
            </div>
            <div class="value">${data.current.humidity}%</div>
        </div>
        <div class="row">
            <div class="label">
                <img src="src/icons8-wind-48.png">
                <span>Wind</span>
            </div>
            <div class="value">${data.current.wind_kph} kph</div>
        </div>
        <div class="row">
            <div class="label">
                <img src="src/icons8-pressure-48.png">
                <span>Pressure</span>
            </div>
            <div class="value">${data.current.pressure_mb} hPa</div>
        </div>
        <div class="row">
            <div class="label">
                <img src="src/icons8-sunlight-48.png">
                <span>UV Index</span>
            </div>
            <div class="value">${data.current.uv}</div>
        </div>
    `;
}

async function gethourlyupdates(city) {
  try {
    // Call your own serverless function now
    const res = await fetch(`/api/getWeather?city=${city}&type=forecast`);
    const data = await res.json();
    const parent = document.getElementById("hourlyForecast");

    parent.innerHTML = "";

    const localTimeString = data.location.localtime;
    const cityCurrentHour = parseInt(
      localTimeString.split(" ")[1].split(":")[0]
    );

    const hourly = data.forecast.forecastday[0].hour;

    const upcomingHours = hourly.filter((hourData) => {
      const hourTime = new Date(hourData.time);
      return hourTime.getHours() >= cityCurrentHour;
    });

    upcomingHours.forEach((hr) => {
      const nd = document.createElement("div");
      nd.classList.add("hourly-card");

      const conditionText = hr.condition.text;
      const iconPath = wicon(conditionText);

      nd.innerHTML = `
                <p>${hr.time.split(" ")[1]}</p>
                <img src="${iconPath}" alt="${conditionText}">
                <p>${hr.temp_c}°C</p>
            `;
      parent.append(nd);
    });
  } catch (error) {
    console.error("Failed to fetch hourly forecast:", error);
  }
}

function updateDate() {
  const date = new Date();
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  document.getElementById("time").innerHTML = date.toLocaleDateString(
    "en-US",
    options
  );
}

searchBtn.addEventListener("click", () => {
  if (cityInput.value) {
    getdata(cityInput.value);
  } else {
    alert("Please enter a city name.");
  }
});

cityInput.addEventListener("keyup", (event) => {
  if (event.key === "Enter") {
    searchBtn.click();
  }
});

// --- INITIAL LOAD ---
updateDate();
getdata("Delhi,india");
