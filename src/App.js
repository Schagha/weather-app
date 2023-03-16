import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Inputs from "./Components/Inputs";
import TimeAndLocation from "./Components/TimeAndLocation";
import TopButtons from "./Components/TopButtons";
import Forecast from "./Forecast";
import getFormattedWeatherData from "./services/weatherService";
import TemperatureAndDetails from "./TemperatureAndDetails";

function App() {
  const [query, setQuery] = useState({ q: "berlin" });
  const [units, setUnits] = useState("metric");
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    const fetchWeather = async () => {
      const message = query.q ? query.q : "current location.";
      toast.info("Fetching weather for " + message);
      await getFormattedWeatherData({ ...query, units }).then(
        (data) => {
          toast.success(
            `Successfully fetched weather for ${data.name}, ${data.country}`
          );
          setWeather(data);
        }
      );
    };
    fetchWeather();
  }, [query, units]);

  const formatBackground = () => {
    if (!weather) return "bg-gradient-to-br from-cyan-500 to-sky-800";
    const threshold = units === "metric" ? 20 : 60;
    if ((weather.temp = threshold))
      return "bg-gradient-to-br from-cyan-500 to-sky-800";

    return "bg-gradient-to-br from-yellow-500 to-orange-800";
  };

  return (
    <div
      className={`mx-auto max-w-screen-md mt-4 py-5 px-32 h-fit shadow-xl shadow-gray-400 
      ${formatBackground()}`}
    >
      <TopButtons setQuery={setQuery} />
      <Inputs setQuery={setQuery} units={units} setUnits={setUnits} />
      {weather && (
        <div>
          <TimeAndLocation weather={weather} />
          <TemperatureAndDetails weather={weather} />
          <Forecast title="hourly forcast" items={weather.hourly} />
          <Forecast title="hourly forcast" items={weather.daily} />
        </div>
      )}
      <ToastContainer autoClose={5000} theme="colored" newestOnTop={true} />
    </div>
  );
}

export default App;
