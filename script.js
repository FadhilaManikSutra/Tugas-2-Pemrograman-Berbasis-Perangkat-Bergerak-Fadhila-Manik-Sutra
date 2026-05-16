"use strict";
const apiUrl = "https://api.open-meteo.com/v1/forecast?latitude=-6.2&longitude=106.8&hourly=temperature_2m";
const weatherDataElement = document.getElementById("weather-data");
const loading = document.getElementById("loading");
const errorMessage = document.getElementById("error-message");
const searchInput = document.getElementById("search-input");
const maxTemp = document.getElementById("max-temp");
const minTemp = document.getElementById("min-temp");
const avgTemp = document.getElementById("avg-temp");
const themeToggle = document.getElementById("theme-toggle");
let weatherData = [];
/* STATUS SUHU */
function getStatus(temp) {
    if (temp >= 30) {
        return "Panas ☀️";
    }
    else if (temp >= 24) {
        return "Sejuk ⛅";
    }
    else {
        return "Dingin ❄️";
    }
}
function getStatusClass(temp) {
    if (temp >= 30) {
        return "panas";
    }
    else if (temp >= 24) {
        return "sejuk";
    }
    else {
        return "dingin";
    }
}
/* FORMAT WAKTU */
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    }) + " WIB";
}
/* DISPLAY DATA */
function displayWeather(data) {
    weatherDataElement.innerHTML = "";
    if (data.length === 0) {
        weatherDataElement.innerHTML = `
            <tr>
                <td colspan="3">
                    Data tidak ditemukan.
                </td>
            </tr>
        `;
        return;
    }
    data.forEach(item => {
        const status = getStatus(item.temp);
        const statusClass = getStatusClass(item.temp);
        const row = `
            <tr>

                <td>
                    ${formatDate(item.time)}
                </td>

                <td>
                    ${item.temp}°C
                </td>

                <td>
                    <span class="status ${statusClass}">
                        ${status}
                    </span>
                </td>

            </tr>
        `;
        weatherDataElement.innerHTML += row;
    });
}
/* SUMMARY */
function calculateSummary(data) {
    const temps = data.map(item => item.temp);
    const max = Math.max(...temps);
    const min = Math.min(...temps);
    const avg = temps.reduce((a, b) => a + b, 0) / temps.length;
    maxTemp.textContent = `${max}°C`;
    minTemp.textContent = `${min}°C`;
    avgTemp.textContent =
        `${avg.toFixed(1)}°C`;
}
/* FETCH API */
async function getWeather() {
    try {
        loading.classList.remove("hidden");
        const response = await fetch(apiUrl);
        const data = await response.json();
        const times = data.hourly.time;
        const temperatures = data.hourly.temperature_2m;
        weatherData = [];
        for (let i = 0; i < 24; i++) {
            weatherData.push({
                time: times[i],
                temp: temperatures[i]
            });
        }
        displayWeather(weatherData);
        calculateSummary(weatherData);
        loading.classList.add("hidden");
    }
    catch (error) {
        loading.classList.add("hidden");
        errorMessage.classList.remove("hidden");
        console.log(error);
    }
}
/* SEARCH */
searchInput.addEventListener("input", () => {
    const keyword = searchInput.value.toLowerCase();
    const filtered = weatherData.filter(item => {
        const formattedTime = formatDate(item.time).toLowerCase();
        return formattedTime.includes(keyword);
    });
    displayWeather(filtered);
});
/* DARK MODE */
themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    if (document.body.classList.contains("dark-mode")) {
        themeToggle.textContent =
            "☀️ Light Mode";
    }
    else {
        themeToggle.textContent =
            "🌙 Dark Mode";
    }
});
/* RUN */
getWeather();
