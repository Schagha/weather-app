import { DateTime } from "luxon";

const API_KEY = "f4e244eaeb681822561c9af9726f6c99";
const BASE_URL = "https://api.openweathermap.org/data/2.5";

const getWeatherData = (infoType, searchParams) => {
  const url = new URL(BASE_URL + "/" + infoType);
  url.search = new URLSearchParams({ ...searchParams, appid: API_KEY });

  return fetch(url).then((res) => res.json());
};

const formatCurrentWeather = (data) => {
  const {
    coord: { lat, lon },
    main: { temp, feels_like, temp_min, temp_max, humidity },
    wind: { speed },
    name,
    dt,
    sys: { country, sunrise, sunset },
    weather,
  } = data;
  const { main: details, icon } = weather[0];
  return {
    lat,
    lon,
    temp,
    feels_like,
    temp_min,
    temp_max,
    humidity,
    speed,
    name,
    dt,
    country,
    sunrise,
    sunset,
    details,
    icon,
  };
};

const formatForcastWeather = (data) => {
  let { timezone, daily, hourly } = data;
  daily = daily.slice(1, 6).map((d) => {
    return {
      title: formatToLocalTime(d.dt, timezone, 'ccc'),
      temp: d.temp.day,
      icon: d.weather[0].icon
    }
  });

  hourly = hourly.slice(1, 6).map((d) => {
    return {
      title: formatToLocalTime(d.dt, timezone, 'hh:mm a'),
      temp: d.temp,
      icon: d.weather[0].icon
    }
  });
  return { timezone, daily, hourly };
};

const getFormattedWeatherData = async (searchParams) => {
  const formattedCurrentWeather = await getWeatherData(
    "weather",
    searchParams
  ).then(formatCurrentWeather);

  const { lat, lon } = formattedCurrentWeather;
  
  const formattedForcastWeather = await getWeatherData("onecall", {
    lat,
    lon,
    exclude: "current, minutely, alerts",
    units: searchParams.units,
  }).then(formatForcastWeather);
  
  return {...formattedCurrentWeather, ...formattedForcastWeather};
};

const formatToLocalTime = (
  secs,
  zone,
  format = "ccc, dd LLL yyyy' | Local time: 'hh:mm a"
) => DateTime.fromSeconds(secs).setZone(zone).toFormat(format);

const iconUrlFromCode = (code) => `http://openweathermap.org/img/wn/${code}.png`;

export default getFormattedWeatherData;

export { formatToLocalTime, iconUrlFromCode }; 