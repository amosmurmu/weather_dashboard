const apiKey = "75d00ff8332cf4caf8b41a3132ad9d7b";

async function getWeather() {
  const city = document.getElementById("cityInput").value;
  if (!city) {
    alert("Please enter a valid city name");
    return;
  }

  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
    );
    const data = await response.json();

    if (data.cod === 200) {
      displayWeather(data);
      saveToRecentSearches(city);
      loadRecentSearches();
    } else {
      alert("City not found");
    }
  } catch (error) {
    console.error("Error fetching weather data:", error);
  }
}

function displayWeather(data) {
  const weatherDisplay = document.getElementById("weatherDisplay");
  weatherDisplay.innerHTML = `
    <div><strong>City : </strong> ${data.name} </div>
    <div><strong> Temperature : </strong> ${data.main.temp} *C </div> 
    <div><strong> Humidity : </strong> ${data.main.humidity}% </div>
    <div><strong> Wind Speed : </strong> ${data.wind.speed} m/s </div>
    <div><strong> Condition : </strong> ${data.weather[0].description} </div>
  `;
}

function saveToRecentSearches(city) {
  let searches = JSON.parse(localStorage.getItem("recentSearches")) || [];
  if (!searches.includes(city)) {
    searches.push(city);
    localStorage.setItem("recentSearches", JSON.stringify(searches));
  }
}

document.getElementById("cityInput").addEventListener("focus", () => {
  const searchList = document.getElementById("searchList");
  if (searchList.children.length > 0) {
    searchList.style.display = "inline-block";
  }
});

document.addEventListener("click", (event) => {
  const searchList = document.getElementById("searchList");
  const cityInput = document.getElementById("cityInput");
  if (!cityInput.contains(event.target) && !searchList.contains(event.target)) {
    searchList.style.display = "none";
  }
});

function loadRecentSearches() {
  const searchList = document.getElementById("searchList");

  searchList.innerHTML = "";

  const searches = JSON.parse(localStorage.getItem("recentSearches")) || [];

  searches.forEach((city) => {
    const li = document.createElement("li");
    li.textContent = city;
    li.addEventListener("click", () => {
      document.getElementById("cityInput").value = city;

      searchList.style.display = "none";
      getWeather();
    });

    searchList.appendChild(li);
  });
}

document.addEventListener("DOMContentLoaded", loadRecentSearches);
