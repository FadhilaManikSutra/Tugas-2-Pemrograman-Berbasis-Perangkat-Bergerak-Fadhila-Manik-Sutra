const apiUrl =
    "https://api.open-meteo.com/v1/forecast?latitude=-6.2&longitude=106.8&hourly=temperature_2m";

const weatherDataElement =
    document.getElementById("weather-data") as HTMLElement;

const loading =
    document.getElementById("loading") as HTMLElement;

const errorMessage =
    document.getElementById("error-message") as HTMLElement;

const searchInput =
    document.getElementById("search-input") as HTMLInputElement;

const maxTemp =
    document.getElementById("max-temp") as HTMLElement;

const minTemp =
    document.getElementById("min-temp") as HTMLElement;

const avgTemp =
    document.getElementById("avg-temp") as HTMLElement;

const themeToggle =
    document.getElementById("theme-toggle") as HTMLButtonElement;

let weatherData: any[] = [];

/* STATUS SUHU */

function getStatus(temp: number): string {

    if (temp >= 30) {
        return "Panas ☀️";
    } else if (temp >= 24) {
        return "Sejuk ⛅";
    } else {
        return "Dingin ❄️";
    }

}

function getStatusClass(temp: number): string {

    if (temp >= 30) {
        return "panas";
    } else if (temp >= 24) {
        return "sejuk";
    } else {
        return "dingin";
    }

}

/* FORMAT WAKTU */

function formatDate(dateString: string): string {

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

function displayWeather(data: any[]): void {

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

        const statusClass =
            getStatusClass(item.temp);

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

function calculateSummary(data: any[]): void {

    const temps =
        data.map(item => item.temp);

    const max =
        Math.max(...temps);

    const min =
        Math.min(...temps);

    const avg =
        temps.reduce((a, b) => a + b, 0) / temps.length;

    maxTemp.textContent = `${max}°C`;

    minTemp.textContent = `${min}°C`;

    avgTemp.textContent =
        `${avg.toFixed(1)}°C`;

}

/* FETCH API */

async function getWeather(): Promise<void> {

    try {

        loading.classList.remove("hidden");

        const response =
            await fetch(apiUrl);

        const data =
            await response.json();

        const times =
            data.hourly.time;

        const temperatures =
            data.hourly.temperature_2m;

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

    } catch (error) {

        loading.classList.add("hidden");

        errorMessage.classList.remove("hidden");

        console.log(error);

    }

}

/* SEARCH */

searchInput.addEventListener("input", () => {

    const keyword =
        searchInput.value.toLowerCase();

    const filtered =
        weatherData.filter(item => {

            const formattedTime =
                formatDate(item.time).toLowerCase();

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

    } else {

        themeToggle.textContent =
            "🌙 Dark Mode";

    }

});

/* RUN */

getWeather();