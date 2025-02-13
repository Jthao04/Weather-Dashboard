import dotenv from "dotenv";
dotenv.config();
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc.js";
dayjs.extend(utc);
// TODO: Define a class for the Weather object
class Weather {
    constructor(city, date, icon, iconDescription, tempF, windSpeed, humidity) {
        this.city = city;
        this.date = date;
        this.icon = icon;
        this.iconDescription = iconDescription;
        this.tempF = tempF;
        this.windSpeed = windSpeed;
        this.humidity = humidity;
    }
}
// TODO: Complete the WeatherService class
class WeatherService {
    constructor() {
        this.city = "";
        this.baseURL = process.env.API_BASE_URL || "";
        this.apiKey = process.env.API_KEY || "";
    }
    // TODO: Create fetchLocationData method
    async fetchLocationData(query) {
        try {
            return await fetch(query);
        }
        catch (error) {
            console.log("Error fetching location data");
            console.error(error);
            return null;
        }
    }
    // TODO: Create destructureLocationData method
    destructureLocationData(locationData) {
        if (!locationData ||
            typeof locationData.lat !== "number" ||
            typeof locationData.lon !== "number") {
            console.log("Error destructuring location data");
            throw new Error("Location data not found");
        }
        return {
            lat: locationData.lat,
            lon: locationData.lon,
        };
    }
    // TODO: Create buildGeocodeQuery method
    buildGeocodeQuery() {
        const geocodeQuery = `${this.baseURL}/geo/1.0/direct?q=${this.city}&limit=1&appid=${this.apiKey}`;
        return geocodeQuery;
    }
    // TODO: Create buildWeatherQuery method
    buildWeatherQuery(coordinates) {
        const weatherQuery = `${this.baseURL}/data/2.5/forecast?lat=${coordinates.lat}&lon=${coordinates.lon}&units=imperial&appid=${this.apiKey}`;
        return weatherQuery;
    }
    // TODO: Create fetchAndDestructureLocationData method
    async fetchAndDestructureLocationData() {
        const geocodeQuery = this.buildGeocodeQuery();
        const locationData = await this.fetchLocationData(geocodeQuery);
        if (!locationData) {
            throw new Error("Failed to fetch location data");
        }
        const parsedLocation = await locationData.json();
        console.log("Parsed location data:", parsedLocation[0].name);
        if (parsedLocation[0].name.length === 0) {
            throw new Error("Location data not found");
        }
        return this.destructureLocationData(parsedLocation[0]);
    }
    // TODO: Create fetchWeatherData method
    async fetchWeatherData(coordinates) {
        const WxQuery = this.buildWeatherQuery(coordinates);
        try {
            const weather = await fetch(WxQuery);
            console.log(`fetchWeatherData: ${weather.status} code ${weather.statusText}`);
            return await weather.json();
        }
        catch (error) {
            console.log("Error fetching weather data", error);
        }
    }
    // TODO: Build parseCurrentWeather method
    parseCurrentWeather(response) {
        const parsedDate = dayjs.utc(response.dt_txt).format();
        return new Weather(this.city, parsedDate || "Today", response.weather[0].icon || "01d", response.weather[0].description || "Clear sky", Math.round(response.main.temp) || 0, Math.round(response.wind.speed) || 0, Math.round(response.main.humidity) || 0);
    }
    // TODO: Complete buildForecastArray method
    buildForecastArray(currentWeather, weatherData) {
        if (!Array.isArray(weatherData)) {
            console.error("Invalid weather data array:", weatherData);
            return [currentWeather];
        }
        const fiveDayForecast = weatherData.filter((data) => data?.dt_txt && data.dt_txt.includes("12:00:00"));
        const forecastArray = [];
        fiveDayForecast.forEach((data) => {
            try {
                forecastArray.push(this.parseCurrentWeather(data));
            }
            catch (error) {
                console.error("Error parsing forecast data:", data, error);
            }
        });
        return [currentWeather, ...forecastArray];
    }
    // TODO: Complete getWeatherForCity method
    async getWeatherForCity(city) {
        try {
            this.city = city;
            const coordinates = await this.fetchAndDestructureLocationData();
            const weatherData = await this.fetchWeatherData(coordinates);
            if (!weatherData?.list || weatherData.list.length === 0) {
                console.error("No weather data available:", weatherData);
                throw new Error("Weather data unavailable");
            }
            const currentWeather = this.parseCurrentWeather(weatherData.list[0]);
            const forecastArray = this.buildForecastArray(currentWeather, weatherData.list);
            console.log("Final Forecast Array:", forecastArray);
            return forecastArray;
        }
        catch (error) {
            console.error("Error getting weather for city:", error);
            return [];
        }
    }
}
export default new WeatherService();
