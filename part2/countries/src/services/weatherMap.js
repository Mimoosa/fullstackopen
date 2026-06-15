import axios from "axios";
const baseUrl = "https://api.openweathermap.org";
const apiKey = import.meta.env.VITE_WEATHER_MAP_API_KEY;

const getWeather = (latitude, longitude) => {
  const request = axios.get("https://api.openweathermap.org/data/2.5/weather", {
    params: {
      lat: latitude,
      lon: longitude,
      appid: apiKey,
      units: "metric",
    },
  });
  return request.then((response) => response.data);
};

export default {
  getWeather,
};
