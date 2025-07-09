const API_KEY = "bd14a934f2fffe99e95a9a446e7b7419"; //
const DEFAULT_CITY = "Buenos Aires";
const UNITS = "metric";
const LANG = "es";

// Función principal para cargar datos
async function fetchWeather(city = DEFAULT_CITY) {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
        city
    )}&appid=${API_KEY}&units=${UNITS}&lang=${LANG}`;

    // Mostrar estado de carga
    document.getElementById("loadingState").classList.remove("hidden");
    document.getElementById("weatherDashboard").classList.add("hidden");
    document.getElementById("errorState").classList.add("hidden");

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("Error al obtener los datos");

        const data = await response.json();

        // Actualizar los elementos del DOM con los datos obtenidos
        document.getElementById(
            "locationName"
        ).textContent = `${data.name}, ${data.sys.country}`;
        document.getElementById("weatherDescription").textContent =
            data.weather[0].description;
        document.getElementById("currentTemp").textContent = `${Math.round(
            data.main.temp
        )}°C`;
        document.getElementById("feelsLike").textContent = `${Math.round(
            data.main.feels_like
        )}°C`;
        document.getElementById(
            "humidity"
        ).textContent = `${data.main.humidity}%`;
        document.getElementById("windSpeed").textContent = `${Math.round(
            data.wind.speed * 3.6
        )} km/h`; // m/s a km/h
        document.getElementById(
            "pressure"
        ).textContent = `${data.main.pressure} hPa`;

        // Icono dinámico (opcional si usás íconos personalizados)
        const icon = data.weather[0].icon;
        document.getElementById(
            "weatherIcon"
        ).className = `weather-card__icon icon-${mapWeatherIcon(icon)}`;

        // Última actualización
        const now = new Date();
        document.getElementById(
            "lastUpdate"
        ).textContent = `Actualizado: ${now.toLocaleTimeString("es-AR", {
            hour: "2-digit",
            minute: "2-digit",
        })}`;

        // Mostrar dashboard
        document.getElementById("loadingState").classList.add("hidden");
        document.getElementById("weatherDashboard").classList.remove("hidden");
    } catch (err) {
        console.error(err);
        document.getElementById("loadingState").classList.add("hidden");
        document.getElementById("errorState").classList.remove("hidden");
    }
}

// Función para convertir íconos de OpenWeather a clases propias (si usás íconos personalizados)
function mapWeatherIcon(owmIcon) {
    if (owmIcon.startsWith("01")) return "sunny";
    if (
        owmIcon.startsWith("02") ||
        owmIcon.startsWith("03") ||
        owmIcon.startsWith("04")
    )
        return "cloudy";
    if (owmIcon.startsWith("09") || owmIcon.startsWith("10")) return "rainy";
    if (owmIcon.startsWith("11")) return "storm";
    if (owmIcon.startsWith("13")) return "snow";
    if (owmIcon.startsWith("50")) return "fog";
    return "default";
}

// Listener para botón "Actualizar"
document
    .getElementById("refreshButton")
    .addEventListener("click", () => fetchWeather());

// Cargar datos al iniciar
fetchWeather();

function agruparPorDia(lista) {
    const dias = {};

    lista.forEach((item) => {
        const fecha = new Date(item.dt_txt);
        const nombreDia = fecha.toLocaleDateString("es-ES", {
            weekday: "long",
        });

        if (!dias[nombreDia]) {
            dias[nombreDia] = {
                tempsMax: [],
                tempsMin: [],
                iconos: [],
                dia: nombreDia.charAt(0).toUpperCase() + nombreDia.slice(1),
            };
        }

        dias[nombreDia].tempsMax.push(item.main.temp_max);
        dias[nombreDia].tempsMin.push(item.main.temp_min);
        dias[nombreDia].iconos.push(item.weather[0].icon);
    });

    return Object.values(dias).map((d) => ({
        dia: d.dia,
        max: Math.round(Math.max(...d.tempsMax)),
        min: Math.round(Math.min(...d.tempsMin)),
        icon: d.iconos[0],
    }));
}

function mapWeatherIcon(owmIcon) {
    if (owmIcon.startsWith("01")) return "sunny";
    if (
        owmIcon.startsWith("02") ||
        owmIcon.startsWith("03") ||
        owmIcon.startsWith("04")
    )
        return "cloudy";
    if (owmIcon.startsWith("09") || owmIcon.startsWith("10")) return "rainy";
    if (owmIcon.startsWith("11")) return "storm";
    if (owmIcon.startsWith("13")) return "snow";
    if (owmIcon.startsWith("50")) return "fog";
    return "default";
}

// funcion para obtener datos y poblar la forecast section
async function fetchForecast(city = DEFAULT_CITY) {
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(
        city
    )}&appid=${API_KEY}&units=${UNITS}&lang=${LANG}`;

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("Error al obtener el pronóstico");

        const data = await response.json();
        const container = document.getElementById("forecastContainer");
        container.innerHTML = ""; // Limpiar contenido anterior

        const dailyData = agruparPorDia(data.list).slice(0, 5); // Solo 5 días

        dailyData.forEach((dia) => {
            const card = document.createElement("div");
            card.className = "forecast-card";

            const iconClass = mapWeatherIcon(dia.icon);

            card.innerHTML = `
                <div class="forecast-card__day">${dia.dia}</div>
                <div class="forecast-card__icon icon-${iconClass}"></div>
                <div class="forecast-card__temp">
                    <span class="forecast-card__temp-max">${dia.max}°</span>
                    <span class="forecast-card__temp-min">${dia.min}°</span>
                </div>
            `;

            container.appendChild(card);
        });
    } catch (error) {
        console.error("Error cargando el pronóstico", error);
    }
}

fetchForecast();
